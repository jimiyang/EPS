import React, {Component} from 'react';
import {Pagination} from 'antd';
import {connect} from 'react-redux';
import bg from '../../../assets/bg.jpg';
import './searchDetail.less';
import {changeSearchContent} from '../../../store/reduces/frontEnd';

@connect(
  (state) => ({searchContent: state.frontEnd.searchContent}),
  {changeSearchContent},
)

class SearchDetail extends Component {
  state = {
    list: [
      {img: bg, title: '联拓POS机', price: '￥999.00'},
      {img: bg, title: '联拓POS机', price: '￥999.00'},
      {img: bg, title: '联拓POS机', price: '￥999.00'},
      {img: bg, title: '联拓POS机', price: '￥999.00'},
      {img: bg, title: '联拓POS机', price: '￥999.00'},
      {img: bg, title: '联拓POS机', price: '￥999.00'},
      {img: bg, title: '联拓POS机', price: '￥999.00'},
      {img: bg, title: '联拓POS机', price: '￥999.00'},
      {img: bg, title: '联拓POS机', price: '￥999.00'},
      {img: bg, title: '联拓POS机', price: '￥999.00'},
      {img: bg, title: '联拓POS机', price: '￥999.00'},
      {img: bg, title: '联拓POS机', price: '￥999.00'},
      {img: bg, title: '联拓POS机', price: '￥999.00'},
      {img: bg, title: '联拓POS机', price: '￥999.00'},
      {img: bg, title: '联拓POS机', price: '￥999.00'},
      {img: bg, title: '联拓POS机', price: '￥999.00'},
    ],
    sortIndex: 1, // 1 综合 2 价格up 3 价格
    pageNumber: 1,
  }

  componentWillReceiveProps(props) {
    this.getList(props.searchContent);
  }

  componentWillUnmount() {
    this.props.changeSearchContent('');
  }

  // 获取搜寻的商品列表
  getList = (searchContent) => {
    const index = this.state.sortIndex;
    const page = this.state.pageNumber;
  }

  // 改变排序方法
  changeSort = (index) => {
    if (this.state.sortIndex !== index) {
      this.state.sortIndex === 2 && index === 2 ? this.setState({sortIndex: 3, pageNumber: 1}) : this.setState({sortIndex: index, pageNumber: 1});
      this.getList(this.props.searchContent);
    }
  }

  // 跳转到详情页
  toDetail = () => {
    this.props.history.push('/commoditiesDetail');
  }

  // 翻页
  changePage = (pageNumber) => {
    this.setState({pageNumber});
    this.getList(this.props.searchContent);
  }

  render() {
    const {list} = this.state;
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
          <ul>
            {
              list.map((item, index) => (
                <li key={index} onClick={this.toDetail}>
                  <img src={item.img} />
                  <p className="price">{item.price}</p>
                  <p className="title">{item.title}</p>
                </li>))}
          </ul>
        </section>
        <section className="pagination">
          <Pagination
            showQuickJumper
            showSizeChange
            current={this.state.pageNumber}
            defaultCurrent={1}
            defaultPageSize={20}
            total={500}
            onChange={this.changePage}
          />
        </section>
      </div>
    );
  }
}

export default SearchDetail;
