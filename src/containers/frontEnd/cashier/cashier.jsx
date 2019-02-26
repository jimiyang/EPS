import React, {Component} from 'react';
import bg from '../../../assets//bg.jpg';
import './cashier.less';

class Cashier extends Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      way: [
        {
          icon: bg, name: '返佣dsadasd账户', remainder: '999999.00', price: '99.00'
        },
        {
          icon: bg, name: '充值账户', remainder: '999999.00', price: '99.00'
        },
      ]
    };
  }
  componentWillMount() {
  }
  componentDidMount() {
  }
  // 跳转到收银台
  toSuccess = () => {
    this.props.history.push('/successfulPayment');
  }
  changeWay = (index) => {
    this.setState({index});
  }
  render() {
    const {way} = this.state;
    return (
      <div id="cashier">
        <section className="pay">
          <div>订单提交成功，请尽快付款！订单号：123456789</div>
          <div className="money">应付金额<p>99.00</p>元</div>
        </section>
        <section className="info">
          <p>收货地址：北京市第三据交通委</p>
          <p>商品名称：道路千万条，安全第一条。行车不规范，亲人两行泪。</p>
        </section>
        <section className="way">
          <div className="title">选择支付方式</div>
          <div className="content">
            <ul>
              {
                way.map((item, index) => (
                  <li onClick={this.changeWay.bind(this, index)} key={index}>
                    <div>
                      <span className={this.state.index === index ? 'isChecked' : 'notChecked'} />
                      <img src={item.icon} />
                      <p className="name">{item.name}</p>
                    </div>
                    <p className="remainder">账户余额: {item.remainder}</p>
                    <p className={this.state.index === index ? null : 'notChecked'}>支付<span className="price">{item.price}</span>元</p>
                  </li>
                ))
              }
            </ul>
          </div>
        </section>
        <section className="button">
          <button onClick={this.toSuccess}>立即支付</button>
        </section>
      </div>
    );
  }
}

export default Cashier;
