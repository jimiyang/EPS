import React, {Component} from 'react';
import {message} from 'antd';
import {Redirect} from 'react-router';
import './style.less';

class FacilityDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        goods_name: '',
        goods_status: '',
        angent_code: 'EW3243432432423432',
        angent_name: '菲菲食品城',
        bind_time: '',
        core_code: '',
        core_name: '',
        decoding_time: '',
        shop_code: '',
        shop_name: '',
        activation_status: '',
        order_no: '',
        activation_time: '',
        sn_code: '',
        price: '',
        buy_price: '',
        creat_time: ''
      },
      redirect: false,
    };
  }
  componentWillMount() {}
  componentWillReceiveProps(props) {
    //this.loadList(props.id);
  }
  render() {
    if (this.state.redirect) {
      return (<Redirect to="/login" />);
    }
    return (
      <div className="facility-blocks">
        <ul className="detail-items">
          <li>
            <label>商品名称：</label>
            <div>{this.state.form.goods_name}</div>
          </li>
          <li>
            <label>商品绑定状态：</label>
            <div>{this.state.form.goods_status}</div>
          </li>
          <li>
            <label>所属代理商编号/名称：</label>
            <div>{this.state.form.angent_code}/{this.state.form.angent_name}</div>
          </li>
          <li>
            <label>商品绑定时间：</label>
            <div>{this.state.form.bind_time}</div>
          </li>
          <li>
            <label>所属核心商户编号/名称：</label>
            <div>{this.state.form.core_code}/{this.state.form.core_name}</div>
          </li>
          <li>
            <label>商品解绑时间：</label>
            <div>{this.state.form.decoding_time}</div>
          </li>
          <li>
            <label>绑定门店编号/门店名称：</label>
            <div>{this.state.form.shop_code}/{this.state.form.shop_name}</div>
          </li>
          <li>
            <label>商品激活状态：</label>
            <div>{this.state.form.activation_status}</div>
          </li>
          <li>
            <label>订单编号：</label>
            <div>{this.state.form.order_no}</div>
          </li>
          <li>
            <label>商品激活时间：</label>
            <div>{this.state.form.activation_time}</div>
          </li>
          <li>
            <label>商品sn码：</label>
            <div>{this.state.form.sn_code}</div>
          </li>
          <li>
            <label>商品激活价格：</label>
            <div>{this.state.form.price}</div>
          </li>
          <li>
            <label>商品购买价格：</label>
            <div>{this.state.form.buy_price}</div>
          </li>
          <li>
            <label>创建时间：</label>
            <div>{this.state.form.creat_time}</div>
          </li>
        </ul>
      </div>
    );
  }
}
export default FacilityDetail;
