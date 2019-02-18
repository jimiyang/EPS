import React, {Component} from 'react';
import {Pagination} from 'antd';
import bg from '../../../assets/bg.jpg';
import './searchDetail.less';

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
  }
  componentWillMount() {
    console.log(1);
  }
  componentDidMount() {
    console.log(2);
  }
  componentWillReceiveProps() {
    console.log(this.props);
  }
  shouldComponentUpdate() {
    console.log(4);
    return true;
  }
  componentWillUpdate() {
    console.log(5);
  }
  componentDidUpdate() {
    console.log(6);
  }
  componentWillUnmount() {
    console.log(7);
  }
  changeSort = (index) => {
    if (this.state.sortIndex === 2 && index === 2) {
      this.setState({sortIndex: 3});
    } else {
      this.setState({sortIndex: index});
    }
  }
  changePage = (pageNumber) => {
    console.log(pageNumber);
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
                <li key={index}>
                  <img src={item.img} />
                  <p className="price">{item.price}</p>
                  <p className="title">{item.title}</p>
                </li>))}
          </ul>
        </section>
        <Pagination showQuickJumper defaultCurrent={2} total={500} onChange={this.changePage} />
      </div>
    );
  }
}

export default SearchDetail;
