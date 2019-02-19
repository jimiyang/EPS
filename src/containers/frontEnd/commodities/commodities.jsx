import React, {Component} from 'react';
import bg from '../../../assets/bg.jpg';
import './commodities.less';

class Commodities extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hardware: [
        {img: bg, title: 'POS机', price: '￥999.00'},
        {img: bg, title: 'POS机', price: '￥999.00'},
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
        {img: bg, title: 'POS机', price: '￥999.00'},
      ],
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
    const {hardware, software} = this.state;
    return (
      <div id="commodities">
        <section>
          <h3>· 硬件</h3>
          <ul>
            {hardware.map(($0, $1) => (
              <li key={$1} onClick={this.toDetail}>
                <img src={$0.img} />
                <p>{$0.title}</p>
                <p className="price">{$0.price}</p>
              </li>))}
          </ul>
        </section>
        <section>
          <h3>· 软件</h3>
          <ul>
            {software.map(($0, $1) => (
              <li key={$1} onClick={this.toDetail}>
                <img src={$0.img} />
                <p>{$0.title}</p>
                <p className="price">{$0.price}</p>
              </li>))}
          </ul>
        </section>
      </div>
    );
  }
}

export default Commodities;
