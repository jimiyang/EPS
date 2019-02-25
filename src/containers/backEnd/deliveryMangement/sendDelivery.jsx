import React, {Component} from 'react';

import {
  Input,
  Select
} from 'antd';

import './delivery.css';

import Data from '../../../utils/expressData.js';

const Option = Select.Option;
class sendDelivery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expressData: Data.expressData,
      defaultValue: '请选择快递'
    };
  }
  componentWillMount() {}
  selExpressNameEvent = (value) => {
    this.props.selExpressNameEvent(value);
  }
  orderNumberEvent = (e) => {
    this.props.orderNumberEvent(e.target.value);
  }
  render() {
    return (
      <div className="delivery-blocks">
        <ul className="express-items">
          <li>
            <label>快递名称：</label>
            <Select defaultValue={this.state.defaultValue} onChange={this.selExpressNameEvent}>
              {
                this.state.expressData.map((item, index) => <Option key={index} value={item.express_coding}>{item.express_name}</Option>)
              }
            </Select>
          </li>
          <li>
            <label>快递单号：</label>
            <Input onChange={this.orderNumberEvent} />
          </li>
          <li>
            <p className="red">说明：如若是软件商品，可不填写快递信息</p>
          </li>
        </ul>
      </div>
    );
  }
}
export default sendDelivery;
