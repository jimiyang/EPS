import React, {Component} from 'react';
import bg from '../../../assets/bg.jpg';
import './commodities.less';

export default class Commodities extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hardware: [
        {img: bg, title: '小精灵POS机', price: '￥999.00'},
        {img: bg, title: '语音播报器', price: '￥999.00'},
        {img: bg, title: 'POS机', price: '￥999.00'},
        {img: bg, title: 'POS机', price: '￥999.00'},
        {img: bg, title: 'POS机', price: '￥999.00'},
        {img: bg, title: 'POS机', price: '￥999.00'},
        {img: bg, title: 'POS机', price: '￥999.00'},
        {img: bg, title: 'POS机', price: '￥999.00'},
      ],
      software: [
        {img: bg, title: 'POS机', price: '￥999.00'},
        {img: bg, title: 'POS机', price: '￥999.00'},
        {img: bg, title: 'POS机', price: '￥999.00'},
        {img: bg, title: 'POS机', price: '￥999.00'},
        {img: bg, title: 'POS机', price: '￥999.00'},
        {img: bg, title: 'POS机', price: '￥999.00'},
        {img: bg, title: 'POS机', price: '￥999.00'},
        {img: bg, title: 'POS机', price: '￥999.00'}
      ],
      hot: [
        {img: bg, title: 'POS机', price: '￥999.00'},
        {img: bg, title: 'POS机', price: '￥999.00'},
        {img: bg, title: 'POS机', price: '￥999.00'},
        {img: bg, title: 'POS机', price: '￥999.00'}
      ]
    };
  }
  componentWillMount() {
  }
  componentDidMount() {
  }
  // 跳转到详情页
  toDetail = () => {
    this.props.history.push('/commoditiesDetail');
  }
  render() {
    const {hardware, software, hot} = this.state;
    return (
      <div className="sku">
        <section className="sku-block">
          <h3 className="sku-cat-title">热门</h3>
          <ul className="sku-list">
            {hot.map(($0, $1) => (
              <li key={$1} onClick={this.toDetail}>
                <img src={$0.img} />
                <div className="sku-cont">
                  <h2>{$0.title}</h2>
                  <p className="price">{$0.price}</p>
                </div>
              </li>))}
          </ul>
        </section>
        <section className="sku-block">
          <h3 className="sku-cat-title">硬件</h3>
          <ul className="sku-list">
            {hardware.map(($0, $1) => (
              <li key={$1} onClick={this.toDetail}>
                <img src={$0.img} />
                <div className="sku-cont">
                  <h2>{$0.title}</h2>
                  <p className="price">{$0.price}</p>
                </div>
              </li>))}
          </ul>
        </section>
        <section className="sku-block">
          <h3 className="sku-cat-title">软件</h3>
          <ul className="sku-list">
            {software.map(($0, $1) => (
              <li key={$1} onClick={this.toDetail}>
                <img src={$0.img} />
                <div className="sku-cont">
                  <h2>{$0.title}</h2>
                  <p className="price">{$0.price}</p>
                </div>
              </li>))}
          </ul>
        </section>
      </div>
    );
  }
}
