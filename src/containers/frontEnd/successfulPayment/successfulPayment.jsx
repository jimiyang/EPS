import React, {Component} from 'react';
import {Steps} from 'antd';
import bg from '../../../assets/bg.jpg';
import './successfulPayment.less';

const Step = Steps.Step;

class SearchDetail extends Component {
  state = {
  }

  // 跳转到订单列表
  toOrderList = () => {
    this.props.history.push('/orderList');
  }

  // 跳转到订单详情
  toOrderDetail = () => {
    this.props.history.push('/orderDetail');
  }

  render() {
    return (
      <div id="successfulPayment">
        <section>
          <div className="info">
            <div className="success">
              <img src={bg} />
              <p>您已成功付款 <span>99.00</span> 元</p>
            </div>
            <div className="address">
              <p>货物寄送至：</p>
              <p>北京 北京市 丰台区 东铁匠营街道 方庄桥西南方庄一号院合肥联拓金融信息服务有限公司</p>
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
            <Steps current={1}>
              <Step title="提交订单" description="2018-12-07 08:59:06" />
              <Step title="支付成功" description="" />
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
