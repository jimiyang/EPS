import React, {Component} from 'react';
import bg from '../../../assets/bg.jpg';
import './listOfCommodities.less';

class ListOfCommodities extends Component {
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
  render() {
    const {hardware, software} = this.state;
    return (
      <div id="listOfCommodities">
        <section>
          <h3>· 硬件</h3>
          <ul>
            {hardware.map(($0, $1) => (
              <li key={$1}>
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
              <li key={$1}>
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

export default ListOfCommodities;
