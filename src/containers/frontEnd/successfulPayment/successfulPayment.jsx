import React, {Component} from 'react';
import {Steps} from 'antd';
import bg from '../../../assets/bg.jpg';
import './successfulPayment.less';

const Step = Steps.Step;

class SearchDetail extends Component {
  state = {
    detail: {}, // 订单详情
    orderNo: null, // 订单编号
  }

  componentWillMount() {
    const orderNo = this.props.location.state.order_no;
    this.setState({orderNo});
    this.getOrderDetail(orderNo);
  }

  // 跳转到订单列表
  toOrderList = () => {
    this.props.history.push('/orderList');
  }

  // 跳转到订单详情
  toOrderDetail = () => {
    this.props.history.push('/orderDetail', {order_no: this.state.orderNo});
  }

  // 获取订单详情
  getOrderDetail = (orderNo) => {
    const params = {
      order_no: orderNo,
    };
    window.api('order.orderList', params).then(res => {
      this.setState({detail: res.orders[0]});
    });
  }

  render() {
    const {detail} = this.state;
    return (
      <div id="successfulPayment">
        <section>
          <div className="info">
            <div className="success">
              <img src={bg} />
              <p>您已成功付款 <span>{detail.real_amt}</span> 元</p>
            </div>
            <div className="address">
              <p>货物寄送至：</p>
              <p>{detail.address}</p>
            </div>
            <div className="link">
              <p>您可以查看：</p>
              <div>
                <span onClick={this.toOrderList}>订单列表</span>
                <p>|</p>
                <span onClick={this.toOrderDetail}>订单详情</span>
              </div>
            </div>
          </div>
          <div className="progress">
            <Steps current={2}>
              <Step title="提交订单" description={detail.gmt_created} />
              <Step title="支付成功" description={detail.gmt_cashed} />
              <Step title="正在发货" description="" />
              <Step title="确认收货" description="" />
            </Steps>
          </div>
        </section>
      </div>
    );
  }
}

export default SearchDetail;
