import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Pagination, Icon, Empty, message} from 'antd';
import {Redirect} from 'react-router';
import './searchDetail.less';
import {changeSearchDetail} from '../../../store/reduces/frontEnd';

@connect(
  (state) => ({searchContent: state.frontEnd.searchContent, id: state.frontEnd.id, typeName: state.frontEnd.typeName}),
  {changeSearchDetail},
)

class SearchDetail extends Component {
  state = {
    list: [],
    sortIndex: 1, // 1 综合 2 价格up 3 价格low
    pageNumber: 1,
    searchContent: '', // 上一个搜索的内容
    total: 0, // 总页数
    id: null, // 一级商品id
    redirect: false,
  }

  componentWillMount() {
    if (window.common.loginOut(this)) {
      const info = this.props.location.state;
      this.setState({searchContent: info.searchContent, id: info.id});
      this.props.changeSearchDetail(info);
      this.getList(info.searchContent, 1, 1, info.id);
    } else {
      message.error('登录信息失效，请重新登录');
    }
  }

  componentWillReceiveProps(props) {
    const info = props.location.state;
    this.getList(info.searchContent, 1, 1, info.id);
    this.setState({
      searchContent: info.searchContent, pageNumber: 1, sortIndex: 1, id: info.id
    });
  }

  componentWillUnmount() {
    this.props.changeSearchDetail({});
  }

  // 获取搜寻的商品列表
  getList = (searchContent, index, pageNumber, id) => {
    let sortWay = null;
    switch (index) {
      case 2:
        sortWay = '00';
        break;
      case 3:
        sortWay = '01';
        break;
      default:
        sortWay = null;
        break;
    }
    const params = {
      page_size: 10,
      current_page: pageNumber,
      status: 0,
    };
    id > 0 ? params.goods_category_id = id : null;
    sortWay ? params.sort_way = sortWay : null;
    searchContent ? params.goods_name = searchContent : null;
    window.api('goods.getgoodslist', params).then(res => {
      if (res.service_error_code === 'EPS000000801') {
        message.error(res.service_error_message);
        this.setState({redirect: true});
      } else {
        res.goods_list.length > 0 ? this.setState({list: res.goods_list, total: res.total_page}) : this.setState({list: []});
      }
    });
  }

  // 改变排序方法
  changeSort = (index) => {
    if (this.state.sortIndex === 2 && index === 2) {
      this.setState({sortIndex: 3, pageNumber: 1});
      this.getList(this.state.searchContent, 3, 1, this.state.id);
    } else {
      this.setState({sortIndex: index, pageNumber: 1});
      this.getList(this.state.searchContent, index, 1, this.state.id);
    }
  }

  // 跳转到详情页
  toDetail = (id) => {
    this.props.history.push('/goodsDetail', {id});
  }

  // 翻页
  changePage = (pageNumber) => {
    this.setState({pageNumber});
    this.getList(this.props.searchContent, this.state.sortIndex, pageNumber, this.state.id);
  }

  render() {
    if (this.state.redirect) {
      return (<Redirect to="/login" />);
    }
    const {list, pageNumber, total} = this.state;
    return (
      <div id="searchDetail">
        <section className="container sort">
          <ul>
            <li onClick={this.changeSort.bind(this, 1)}>
              <p className={this.state.sortIndex === 1 ? 'isChecked' : null}>综合</p>
            </li>
            <li onClick={this.changeSort.bind(this, 2)}>
              <p className={this.state.sortIndex > 1 ? 'isChecked' : null}>价格</p>
              <div className="toggle">
                <div className={this.state.sortIndex === 2 ? 'choose1 smallToBig' : 'smallToBig'}><Icon type="caret-up" /></div>
                <div className={this.state.sortIndex === 3 ? 'choose2 bigToSmall' : 'bigToSmall'}><Icon type="caret-down" /></div>
              </div>
            </li>
          </ul>
        </section>
        <section className="list">
          { list.length > 0 ? (
            <ul className="sku-list">
              {
                list.map((item, index) => (
                  <li key={index} onClick={this.toDetail.bind(this, item.id)}>
                    <img src={item.goods_picture} />
                    <div className="sku-list-info">
                      <p className="price">￥{(item.sale_price).toFixed(2)}</p>
                      <h2>{item.goods_name}</h2>
                    </div>
                  </li>
                ))
              }
            </ul>) : <div className="default"><Empty /></div>
          }
        </section>
        <section className="pagination" hidden={list.length === 0}>
          <Pagination
            showQuickJumper
            showSizeChange
            current={pageNumber}
            defaultCurrent={1}
            defaultPageSize={10}
            total={total * 10}
            onChange={this.changePage}
          />
        </section>
      </div>
    );
  }
}

export default SearchDetail;
