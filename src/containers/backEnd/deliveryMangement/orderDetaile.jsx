import React, {Component} from 'react';

import './delivery.css';

class OrderDetail extends Component {
  render() {
    return (
      <ul className="detail-items">
        <li>
          <label>商品名称：</label>
          <div>POS</div>
        </li>
        <li>
          <label>商品条形码：</label>
          <div>POS</div>
        </li>
        <li>
          <label>商品类型：</label>
          <div>POS</div>
        </li>
        <li>
          <label>商品单价：</label>
          <div>POS</div>
        </li>
        <li>
          <label>购买数量：</label>
          <div>POS</div>
        </li>
        <li>
          <label>订单总价：</label>
          <div>POS</div>
        </li>
        <li>
          <label>代理商：</label>
          <div>POS</div>
        </li>
        <li>
          <label>下单账号：</label>
          <div>POS</div>
        </li>
        <li>
          <label>收货人姓名：</label>
          <div>POS</div>
        </li>
        <li>
          <label>收货人地址：</label>
          <div>POS</div>
        </li>
        <li>
          <label>联系人电话：</label>
          <div>POS</div>
        </li>
        <li>
          <label>邮编：</label>
          <div>POS</div>
        </li>
        <li>
          <label>订单号：</label>
          <div>POS</div>
        </li>
        <li>
          <label>交易流水号：</label>
          <div>POS</div>
        </li>
        <li>
          <label>订单创建时间：</label>
          <div>POS</div>
        </li>
        <li>
          <label>付款时间：</label>
          <div>POS</div>
        </li>
      </ul>
    );
  }
}
export default OrderDetail;
