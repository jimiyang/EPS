import React, {Component} from 'react';
import {message} from 'antd';
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
        gmt_created: '',
        address: '',
        receiver: '',
        mobile: '',
        post_code: '',
      }
    };
  }
  componentWillMount() {
    //验证是否需要登录
    window.common.loginOut(this, message);
    this.loadList(this.props.order_no);
  }
  componentWillReceiveProps(props) {
    this.loadList(props.order_no);
  }
  loadList = (id) => {
    /*window.api('goods.goodsDetail', {order_no: id}).then((rs) => {
      //Object.assign(form, rs.goods_detail[0]);
      const data = rs.goods_detail[0];
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
    });*/
    window.api('order.orderList', {order_no: id}).then((rs) => {
      const data = rs.orders[0];
      const goods = data.order_details[0];
      const form = {
        receiver: data.receiver,
        mobile: data.mobile,
        address: data.address,
        post_code: data.post_code,
        gmt_cashed: data.gmt_cashed, //付款时间
        goods_name: goods.goods_name,
        goods_bar_no: goods.goods_bar_no,
        goods_category_name: goods.goods_category_name,
        goods_sale_price: goods.goods_sale_price,
        total_amt: goods.real_amt,
        agent_name: goods.agent_name,
        created_name: goods.created_name,
        created_no: goods.created_no,
        order_no: goods.order_no,
        gmt_created: goods.gmt_created,
        goods_qty: goods.goods_qty
      };
      this.setState({
        form
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
          <label>代理商编号：</label>
          <div>{this.state.form.created_no}</div>
        </li>
        <li>
          <label>收货人姓名：</label>
          <div>{this.state.form.receiver}</div>
        </li>
        <li>
          <label>收货人地址：</label>
          <div>{this.state.form.address}</div>
        </li>
        <li>
          <label>联系人电话：</label>
          <div>{this.state.form.mobile}</div>
        </li>
        <li>
          <label>邮编：</label>
          <div>{this.state.form.post_code}</div>
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
          <div>{this.state.form.gmt_cashed}</div>
        </li>
      </ul>
    );
  }
}
export default OrderDetail;
