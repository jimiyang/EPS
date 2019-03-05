import React, {Component} from 'react';

import './delivery.css';

class OrderDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        goods_name: '',
        goods_bar_no: '',
        goods_category_name: '',
        goods_sale_price: '',
        total_amt: '',
        created_name: '',
        created_no: '',
        express_name: '',
        express_no: '',
        order_no: '',
        gmt_created: ''
      },
      orderForm: {
        address: '',
        receiver: '',
        mobile: '',
        post_code: '',
      }
    };
  }
  componentWillMount() {
    this.loadList(this.props.order_no);
  }
  componentWillReceiveProps(props) {
    this.loadList(props.order_no);
  }
  loadList = (id) => {
    window.api('goods.goodsDetail', {order_no: id}).then((rs) => {
      //Object.assign(form, rs.goods_detail[0]);
      const data = rs.goods_detail[0];
      console.log(rs);
      const form = {
        goods_name: data.goods_name,
        goods_bar_no: data.goods_bar_no,
        goods_category_name: data.goods_category_name,
        goods_sale_price: data.goods_sale_price,
        total_amt: data.real_amt,
        agent_name: data.agent_name,
        created_name: data.created_name,
        created_no: data.created_no,
        order_no: data.order_no,
        gmt_created: data.gmt_created,
        goods_qty: data.goods_qty
      };
      this.setState({
        form
      });
    });
    window.api('order.orderList', {order_no: id}).then((rs) => {
      const data = rs.orders[0];
      const params = {
        receiver: data.receiver,
        mobile: data.mobile,
        address: data.address,
        post_code: data.post_code,
        gmt_cashed: data.gmt_cashed
      };
      this.setState({
        orderForm: params
      });
    });
  }
  render() {
    return (
      <ul className="detail-items">
        <li>
          <label>商品名称：</label>
          <div>{this.state.form.goods_name}</div>
        </li>
        <li>
          <label>商品条形码：</label>
          <div>{this.state.form.goods_bar_no}</div>
        </li>
        <li>
          <label>商品类型：</label>
          <div>{this.state.form.goods_category_name}</div>
        </li>
        <li>
          <label>商品单价：</label>
          <div>{this.state.form.goods_sale_price}</div>
        </li>
        <li>
          <label>购买数量：</label>
          <div>{this.state.form.goods_qty}</div>
        </li>
        <li>
          <label>订单总价：</label>
          <div>{this.state.form.total_amt}</div>
        </li>
        <li>
          <label>代理商：</label>
          <div>{this.state.form.created_name}</div>
        </li>
        <li>
          <label>下单账号：</label>
          <div>{this.state.form.created_no}</div>
        </li>
        <li>
          <label>收货人姓名：</label>
          <div>{this.state.orderForm.receiver}</div>
        </li>
        <li>
          <label>收货人地址：</label>
          <div>{this.state.orderForm.address}</div>
        </li>
        <li>
          <label>联系人电话：</label>
          <div>{this.state.orderForm.mobile}</div>
        </li>
        <li>
          <label>邮编：</label>
          <div>{this.state.orderForm.post_code}</div>
        </li>
        <li>
          <label>订单号：</label>
          <div>{this.state.form.order_no}</div>
        </li>
        <li>
          <label>订单创建时间：</label>
          <div>{this.state.form.gmt_created}</div>
        </li>
        <li>
          <label>付款时间：</label>
          <div>{this.state.orderForm.gmt_cashed}</div>
        </li>
      </ul>
    );
  }
}
export default OrderDetail;
