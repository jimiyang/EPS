import React, {Component} from 'react';
import { Radio, Input } from 'antd';
import './cashier.less';

const RadioGroup = Radio.Group;

const residences = [{
  value: 'zhejiang',
  label: '北京',
  children: [{
    value: 'hangzhou',
    label: '北京',
    children: [{
      value: 'xihu',
      label: '丰台区',
    }],
  }],
}, {
  value: 'jiangsu',
  label: '天津',
  children: [{
    value: 'nanjing',
    label: '天津',
    children: [{
      value: 'zhonghuamen',
      label: '海州区',
    }],
  }],
}];

class Cashier extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentWillMount() {
  }
  componentDidMount() {
  }
  // 跳转到收银台
  toCashier = () => {
    this.props.history.push('/cashier');
  }
  render() {
    return (
      <div id="cashier">
        <section className="pay">
          <div>订单提交成功，请尽快付款！订单号：123456789</div>
          <div>应付金额<p>99.00</p>元</div>
        </section>
        <section className="info">
          <p>收货地址：北京市第三据交通委</p>
          <p>商品名称：道路千万条，安全第一条。行车不规范，亲人两行泪。</p>
        </section>
        <section className="way">
          <div className="title">选择支付方式</div>
          <div className="content">
            <ul>
              <li>
                <span>√</span>
              </li>
            </ul>
          </div>
        </section>
      </div>
    );
  }
}

export default Cashier;
