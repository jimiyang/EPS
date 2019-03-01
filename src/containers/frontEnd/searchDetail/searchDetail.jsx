import React, {Component} from 'react';
import {Pagination} from 'antd';
import {connect} from 'react-redux';
import './searchDetail.less';
import {changeSearchContent} from '../../../store/reduces/frontEnd';

@connect(
  (state) => ({searchContent: state.frontEnd.searchContent, id: state.frontEnd.id}),
  {changeSearchContent},
)

class SearchDetail extends Component {
  state = {
    list: [],
    sortIndex: 1, // 1 综合 2 价格up 3 价格low
    pageNumber: 1,
    searchContent: '', // 上一个搜索的内容
    total: 0, // 总页数
    id: null, // 一级商品id
  }

  componentWillMount() {
    this.setState({searchContent: this.props.searchContent, id: this.props.id});
    this.getList(this.props.searchContent, 1, 1, this.props.id);
  }

  componentWillUnmount() {
    this.props.changeSearchContent({searchContent: '', id: null});
  }

  componentWillReceiveProps(props) {
    if (this.state.searchContent !== props.searchContent || this.props.id !== this.state.id) {
      this.getList(props.searchContent, 1, 1, props.id);
      this.setState({
        searchContent: props.searchContent, pageNumber: 1, sortIndex: 1, id: this.props.id
      });
    }
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
    };
    id !== null ? params.goods_category_id = id : null;
    sortWay ? params.sort_way = sortWay : null;
    searchContent ? params.goods_name = searchContent : null;
    window.api('goods.getgoodslist', params).then(res => {
      res.goods_list.length > 0 ? this.setState({list: res.goods_list, total: res.total_page}) : this.setState({list: []});
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
    this.props.history.push('/commoditiesDetail', {id});
  }

  // 翻页
  changePage = (pageNumber) => {
    this.setState({pageNumber});
    this.getList(this.props.searchContent, this.state.sortIndex, pageNumber, this.state.id);
  }

  render() {
    const {list, pageNumber, total} = this.state;
    return (
      <div id="searchDetail">
        <section className="sort">
          <ul>
            <li onClick={this.changeSort.bind(this, 1)}>
              <p className={this.state.sortIndex === 1 ? 'isChecked' : null}>综合</p>
            </li>
            <li onClick={this.changeSort.bind(this, 2)}>
              <p className={this.state.sortIndex > 1 ? 'isChecked' : null}>价格</p>
              <span className={this.state.sortIndex === 2 ? 'choose1 smallToBig' : 'smallToBig'} />
              <span className={this.state.sortIndex === 3 ? 'choose2 bigToSmall' : 'bigToSmall'} />
            </li>
          </ul>
        </section>
        <section className="list">
          { list.length > 0 ? (
            <ul>
              {
                list.map((item, index) => (
                  <li key={index} onClick={this.toDetail.bind(this, item.id)}>
                    <img src={item.goods_picture} />
                    <p className="price">￥{(item.cost_price).toFixed(2)}</p>
                    <p className="name">{item.goods_name}</p>
                  </li>
                ))
              }
            </ul>) : <p className="default">查询不到相关产品</p>
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
