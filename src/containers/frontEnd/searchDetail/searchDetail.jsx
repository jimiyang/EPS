import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Pagination, Icon, Empty, message} from 'antd';
import {Redirect} from 'react-router';
import './searchDetail.less';
import {changeSearchDetail} from '../../../store/reduces/frontEnd';

@connect(
  (state) => ({searchInfo: state}),
  {changeSearchDetail},
)

class SearchDetail extends Component {
  state = {
    type: null, // search 内容搜索 property 属性搜索
    list: [],
    sortIndex: 1, // 1 综合 2 价格up 3 价格low
    pageNumber: 1,
    searchContent: '', // 上一个搜索的内容
    total: 0, // 总页数
    id: null, // 一级商品id；当type为property时，为软件硬件的分类
    redirect: false,
  }

  async componentWillMount() {
    if (window.common.loginOut(this)) {
      const info = this.props.location.state;
      await this.setState({searchContent: info.searchContent, id: info.id, type: info.type});
      this.props.changeSearchDetail(info);
      this.getList();
    } else {
      message.error('登录信息失效，请重新登录');
    }
  }

  async componentWillReceiveProps(props) {
    const info = props.location.state;
    await this.setState({
      searchContent: info.searchContent, pageNumber: 1, sortIndex: 1, id: info.id
    });
    this.getList();
  }

  componentWillUnmount() {
    this.props.changeSearchDetail({});
  }

  // 获取搜寻的商品列表
  getList = () => {
    const {
      id, type, sortIndex, pageNumber, searchContent
    } = this.state;
    const params = {
      page_size: 10,
      current_page: pageNumber,
      status: 0,
    };
    let sortWay = null;
    switch (sortIndex) {
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
    switch (type) {
      case 'property':
        params.goods_property = id;
        break;
      case 'category':
        params.goods_category_id = id;
        break;
      case 'search':
        params.goods_name = searchContent;
        break;
      default:
        null;
    }
    sortWay ? params.sort_way = sortWay : null;
    window.api('goods.getgoodslist', params).then(res => {
      res.goods_list.length > 0 ? this.setState({list: res.goods_list, total: res.total_page}) : this.setState({list: []});
    }).catch((error) => {
      error.service_error_code === 'EPS000000801' ? this.setState({redirect: true}) : null;
      message.error(error.service_error_message);
    });
  }

  // 改变排序方法
  changeSort = async (index) => {
    const info = this.state.sortIndex === 2 && index === 2 ? {sortIndex: 3, pageNumber: 1} : {sortIndex: index, pageNumber: 1};
    await this.setState(info);
    this.getList();
  }

  // 跳转到详情页
  toDetail = (id) => {
    this.props.history.push('/goodsDetail', {id});
  }

  // 翻页
  changePage = async (pageNumber) => {
    await this.setState({pageNumber});
    this.getList();
  }

  render() {
    const {
      list, pageNumber, total, redirect, sortIndex
    } = this.state;
    if (redirect) return (<Redirect to="/login" />);
    return (
      <div id="searchDetail">
        <section className="container sort">
          <ul>
            <li onClick={this.changeSort.bind(this, 1)}>
              <p className={sortIndex === 1 ? 'isChecked' : null}>综合</p>
            </li>
            <li onClick={this.changeSort.bind(this, 2)}>
              <p className={sortIndex > 1 ? 'isChecked' : null}>价格</p>
              <div className="toggle">
                <div className={sortIndex === 2 ? 'choose1 smallToBig' : 'smallToBig'}><Icon type="caret-up" /></div>
                <div className={sortIndex === 3 ? 'choose2 bigToSmall' : 'bigToSmall'}><Icon type="caret-down" /></div>
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
