import React, {Component} from 'react';
import {Redirect} from 'react-router';
import './style.less';

class FacilityDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        goods_name: '',
        bind_status: '',
        agent_no: '',
        agent_name: '',
        bind_date: '',
        bind_core_merchant_code: '',
        bind_core_merchant_name: '',
        unbind_date: '',
        bind_merchant_name: '',
        bind_merchant_code: '',
        activate_status: '',
        order_no: '',
        activate_date: '',
        device_sn: '',
        ctivate_price: '',
        buy_price: '',
        gmt_created: ''
      },
      redirect: false,
    };
  }
  componentWillMount() {
    this.initForm(this.props.id);
  }
  componentWillReceiveProps(props) {
    this.initForm(props.id);
  }
  getState(status) {
    switch (status) {
      case 0:
        return '未绑定';
      case 1:
        return '已绑定';
      case 2:
        return '已解绑';
      default:
        return '未绑定';
    }
  }
  getActivate(status) {
    switch (status) {
      case 0:
        return '未激活';
      case 1:
        return '激活中';
      case 2:
        return '激活失败';
      default:
        return '未激活';
    }
  }
  initForm(id) {
    window.api('eps.getordergoodsmanager', {id}).then(rs => {
      //console.log();
      this.setState({
        form: rs.order_goods_manager_list[0]
      });
    });
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
            <div>{this.getState(this.state.form.bind_status)}</div>
          </li>
          <li>
            <label>所属代理商编号/名称：</label>
            <div className={!this.state.form.agent_no ? 'hide' : null}>{this.state.form.agent_no}/{this.state.form.agent_name}</div>
          </li>
          <li>
            <label>商品绑定时间：</label>
            <div>{this.state.form.bind_date}</div>
          </li>
          <li>
            <label>所属核心商户编号/名称：</label>
            <div className={!this.state.form.core_code ? 'hide' : null}>{this.state.form.core_code}/{this.state.form.core_name}</div>
          </li>
          <li>
            <label>商品解绑时间：</label>
            <div>{this.state.form.decoding_time}</div>
          </li>
          <li>
            <label>绑定门店编号/门店名称：</label>
            <div className={!this.state.form.bind_core_merchant_code ? 'hide' : null}>{this.state.form.bind_core_merchant_code}/{this.state.form.bind_core_merchant_name}</div>
          </li>
          <li>
            <label>商品激活状态：</label>
            <div>{this.getActivate(this.state.form.activate_status)}</div>
          </li>
          <li>
            <label>订单编号：</label>
            <div>{this.state.form.order_no}</div>
          </li>
          <li>
            <label>商品激活时间：</label>
            <div>{this.state.form.activate_date}</div>
          </li>
          <li>
            <label>商品sn码：</label>
            <div>{this.state.form.device_sn}</div>
          </li>
          <li>
            <label>商品激活价格：</label>
            <div>{this.state.form.activate_price}</div>
          </li>
          <li>
            <label>商品购买价格：</label>
            <div>{this.state.form.buy_price}</div>
          </li>
          <li>
            <label>创建时间：</label>
            <div>{this.state.form.gmt_created}</div>
          </li>
        </ul>
      </div>
    );
  }
}
export default FacilityDetail;
