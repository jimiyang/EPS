import React, {Component} from 'react';
import {Steps} from 'antd';
import moment from 'moment';
import './orderDetail.less';

const Step = Steps.Step;

function Status(props) {
  const status = props.status;
  let content;
  switch (status) {
    case 0:
      content = <p style={{color: 'orange'}}>等待付款</p>;
      break;
    case 1:
      content = <p>等待发货</p>;
      break;
    case 2:
      content = <p style={{color: 'green'}}>等待收货</p>;
      break;
    case 3:
      content = <p style={{color: '#ddd'}}>已完成</p>;
      break;
    case 4:
      content = <p style={{color: 'red'}}>已取消</p>;
      break;
    default:
      content = null;
      break;
  }
  return content;
}
class OrderDetail extends Component {
  state = {
    order: {}, // 订单详情
    goods: {}, // 商品详情
    step: 0, // 第几步
    time: '', // 剩余时间
    timer: null, // 定时器
  }

  componentWillMount() {
    const orderNo = this.props.location.state.order_no;
    this.getOrderDetail(orderNo);
    this.getGoodsDetail(orderNo);
  }

  componentWillUnmount() {
    clearInterval(this.state.timer);
  }

  // 获取订单详情
  getOrderDetail = (orderNo) => {
    const params = {
      order_no: orderNo,
    };
    window.api('order.orderList', params).then(res => {
      const status = res.orders[0].status;
      let step;
      switch (status) {
        case 2:
          step = 1;
          break;
        case 3:
          step = 2;
          break;
        case 4:
          step = 3;
          break;
        default:
          step = 0;
      }
      this.setState({order: res.orders[0], step});
    });
  }

  // 获取商品详情
  getGoodsDetail = (orderNo) => {
    const params = {
      order_no: orderNo,
    };
    window.api('goods.goodsDetail', params).then(res => {
      const detail = res.goods_detail[0];
      const creat = (new Date(detail.gmt_created)).getTime();
      console.log(new Date(detail.gmt_created));
      console.log(new Date().getTime());
      const timer = setInterval(() => {
        const now = (new Date()).getTime();
        console.log(moment(now - creat).format('hhmmss'));
        const time = moment((24 * 60 * 60 * 1000) - (now - creat)).format('hh时mm分ss秒');
        this.setState({time});
      }, 1000);
      detail.total_amt = (detail.total_amt).toFixed(2);
      detail.real_amt = (detail.real_amt).toFixed(2);
      this.setState({goods: detail, timer});
    });
  }

  render() {
    const {
      order, goods, step, time
    } = this.state;
    return (
      <div id="orderDetail">
        <header>
          <div className="order">
            <p>订单号：<span>{order.order_no}</span></p>
            <Status status={order.status} />
            <p hidden={order.status !== 0}>剩余：{time}</p>
            <button hidden={order.status !== 0}>付款</button>
          </div>
          <div className="progress">
            {order.status === 4 ? (<Steps current={step}>
              <Step title="提交申请" description="2018-12-07 08:59:06" />
              <Step title="完成" description="" />
            </Steps>) : (<Steps current={step}>
              <Step title="提交订单" description={order.gmt_created} />
              <Step title="支付成功" description={order.gmt_cashed} />
              <Step title="正在发货" description="" />
              <Step title="确认收货" description="" />
            </Steps>)}
          </div>
        </header>
        <section>
          <div>
            <h3>收货人信息</h3>
            <div>
              <p>收货人：</p>
              <span>{order.receiver}</span>
            </div>
            <div style={{height: '40px'}}>
              <p>地址：</p>
              <span className="address">{order.address}</span>
            </div>
            <div>
              <p>手机号码：</p>
              <span>{order.mobile}</span>
            </div>
          </div>
          {order.status === 2 || order.status === 2 || order.status === 3 ? (<div>
            <h3>收货人信息</h3>
            <div>
              <p>交易流水号：</p>
              <span>{order.order_no}</span>
            </div>
            <div>
              <p>付款方式：</p>
              {
                order.pay_type === 0 ? <span>返佣账户</span> : <span>充值账户</span>
              }
            </div>
            <div>
              <p>付款时间：</p>
              <span>{order.gmt_cashed}</span>
            </div>
            <div>
              <p>商品总额：</p>
              <span>￥{order.total_amt}</span>
            </div>
          </div>) : null}
          {order.status === 2 || order.status === 3 ? (<div>
            <h3>配送信息</h3>
            <div>
              <p>快递名称：</p>
              <span>{goods.express_name}</span>
            </div>
            <div>
              <p>快递单号：</p>
              <span>{goods.express_no}</span>
            </div>
          </div>) : null}
        </section>
        <footer>
          <ul className="status">
            <li style={{width: '450px'}}>商品名称</li>
            <li style={{width: '200px'}}>商品编号</li>
            <li style={{width: '120px'}}>单价</li>
            <li style={{width: '120px'}}>数量</li>
            <li style={{width: '120px'}}>操作</li>
          </ul>
          <div className="content">
            <div style={{width: '450px'}} className="info">
              <img src={goods.goods_pic} />
              <p>{goods.goods_name}</p>
            </div>
            <p style={{width: '200px'}}>{goods.goods_bar_no}</p>
            <p style={{width: '120px'}}>￥{goods.goods_sale_price}</p>
            <p style={{width: '120px'}}>{goods.goods_qty}</p>
            <div className="operation">
              {goods.status === 2 ? <button className="operation">确认收货</button> : null}
              {goods.status === 3 ? <button className="operation">再次购买</button> : null}
            </div>
          </div>
          <div className="content2">
            <div className="money">
              <p>商品总额：￥{goods.total_amt}</p>
              <p style={{color: 'red'}}>应付总额：￥{goods.real_amt}</p>
            </div>
          </div>
        </footer>
      </div>
    );
  }
}

export default OrderDetail;
