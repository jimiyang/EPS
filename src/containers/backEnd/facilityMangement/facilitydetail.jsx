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
  getActivate(status) {
    switch (Number(status)) {
      case 1:
        return '未激活';
      case 2:
        return '激活中';
      case 3:
        return '已激活';
      default:
        return '未激活';
    }
  }
  initForm(id) {
    window.api('eps.getordergoodsmanager', {id}).then(rs => {
      this.setState({
        form: rs.order_goods_manager_list[0]
      });
    });
  }
  render() {
    const {form, redirect} = this.state;
    if (redirect) return (<Redirect to="/login" />);
    return (
      <div className="facility-blocks">
        <ul className="detail-items">
          <li>
            <label>商品名称：</label>
            <div>{form.goods_name}</div>
          </li>
          <li>
            <label>商品绑定状态：</label>
            <div>{form.bind_status === '1' ? '已绑定' : '未绑定'}</div>
          </li>
          <li>
            <label>所属代理商编号/名称：</label>
            <div className={form.agent_no ? 'hide' : null}>{form.agent_no}/{form.agent_name}</div>
          </li>
          <li>
            <label>商品绑定时间：</label>
            <div>{form.bind_date}</div>
          </li>
          <li>
            <label>绑定核心商户编号/名称：</label>
            <div className={!form.bind_core_merchant_code ? 'hide' : null}>{form.bind_core_merchant_code}/{form.bind_core_merchant_name}</div>
          </li>
          <li>
            <label>商品解绑时间：</label>
            <div>{form.unbind_date}</div>
          </li>
          <li>
            <label>绑定门店编号/门店名称：</label>
            <div className={!form.bind_merchant_code ? 'hide' : null}>{form.bind_merchant_code}/{form.bind_merchant_name}</div>
          </li>
          <li>
            <label>商品激活状态：</label>
            <div>{this.getActivate(form.activate_status)}</div>
          </li>
          <li>
            <label>订单编号：</label>
            <div>{form.order_no}</div>
          </li>
          <li>
            <label>商品激活时间：</label>
            <div>{form.activate_date}</div>
          </li>
          <li>
            <label>商品sn码：</label>
            <div>{form.device_sn}</div>
          </li>
          <li>
            <label>商品激活价格：</label>
            <div>{form.goods_activate_price}</div>
          </li>
          <li>
            <label>商品购买价格：</label>
            <div>{form.buy_price}</div>
          </li>
          <li>
            <label>创建时间：</label>
            <div>{form.gmt_created}</div>
          </li>
        </ul>
      </div>
    );
  }
}
export default FacilityDetail;
