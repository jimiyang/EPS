import React, {Component} from 'react';
import {Steps, message, Icon} from 'antd';
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
      content = <p style={{color: 'green'}}>已完成</p>;
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
      let step; // 0：等待付款，1：等待发货，2：等待收货，3：已完成，4：已取消（默认0）
      switch (status) {
        case 0:
          step = 1;
          break;
        case 1:
          step = 2;
          break;
        case 2:
          step = 3;
          break;
        case 3:
          step = 4;
          break;
        case 4:
          step = 1;
          break;
        default:
          step = 5;
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
      const create = (new Date(detail.gmt_created)).getTime();
      const deadline = create + 24 * 60 * 60 * 1000;
      const timer = setInterval(() => {
        const alltime = deadline - (new Date()).getTime();
        const hours = parseInt(alltime / (60 * 60 * 1000), 10);
        const time1 = alltime - hours * 60 * 60 * 1000;
        const minutes = parseInt(time1 / (1000 * 60), 10);
        const time2 = time1 - minutes * 60 * 1000;
        const seconds = parseInt(time2 / 1000, 10);
        const time = `${hours < 10 ? `0${hours}` : hours}时${minutes < 10 ? `0${minutes}` : minutes}分${seconds < 10 ? `0${seconds}` : seconds}秒`;
        this.setState({time});
      }, 1000);
      detail.total_amt = (detail.total_amt).toFixed(2);
      detail.real_amt = (detail.real_amt).toFixed(2);
      this.setState({goods: detail, timer});
    });
  }

  // 付款
  pay = () => {
    const {order, goods} = this.state;
    const info = {
      order_no: order.order_no,
      real_amt: order.real_amt,
      total_amt: order.total_amt,
      address: order.address,
      goods_name: goods.goods_name
    };
    this.props.history.push('/cashier', {info});
  }

  // 确认收货
  confirmReceipt = () => {
    const {goods, order} = this.state;
    const params = {
      order_no: goods.order_no,
      ids: `${goods.id}`,
    };
    window.api('order.confirmReceived', params).then(res => {
      goods.status = 3;
      order.status = 3;
      message.success('确认收货，已完成订单！');
    }).catch((err) => {
      message.error(err);
    });
  }

  // 再次购买
  again = () => {
    this.props.history.push('/goodsDetail', {id: this.state.goods.goods_id});
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
            <button hidden={order.status !== 0} onClick={this.pay}>付款</button>
          </div>
          <div className="progress">
            {order.status === 4 ? (<Steps current={step}>
              <Step title="提交申请" description="" />
              <Step title="完成" description="" />
            </Steps>) : (<Steps current={step}>
              <Step title="提交订单" description="" />
              <Step title="支付成功" description="" />
              <Step title="正在发货" description="" />
              <Step title="确认收货" description="" />
            </Steps>)}
          </div>
        </header>
        <section>
          <div>
            <h3><Icon type="home" />收货人信息</h3>
            <div>
              <i>收货人：</i>
              <span>{order.receiver}</span>
            </div>
            <div>
              <i>地址：</i>
              <span className="address">{order.address}</span>
            </div>
            <div>
              <i>手机号码：</i>
              <span>{order.mobile}</span>
            </div>
          </div>
          {order.status === 1 || order.status === 2 || order.status === 3 ? (<div>
            <h3><Icon type="file-text" />订单信息</h3>
            <div>
              <i>交易流水号：</i>
              <span>{order.order_no}</span>
            </div>
            <div>
              <i>付款方式：</i>
              {
                order.pay_type === 0 ? <span>返佣账户</span> : <span>充值账户</span>
              }
            </div>
            <div>
              <i>付款时间：</i>
              <span>{order.gmt_cashed}</span>
            </div>
            <div>
              <i>商品总额：</i>
              <span>￥{order.total_amt}</span>
            </div>
          </div>) : null}
          {order.status === 2 || order.status === 3 ? (<div>
            <h3>配送信息</h3>
            <div>
              <i>快递名称：</i>
              <span>{goods.express_name}</span>
            </div>
            <div>
              <i>快递单号：</i>
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
              {goods.status === 2 ? <button className="operation" onClick={this.confirmReceipt}>确认收货</button> : null}
              {goods.status === 3 ? <button className="operation" onClick={this.again}>再次购买</button> : null}
            </div>
          </div>
          <div className="content2">
            <div className="money">
              <p>商品总额：￥{goods.total_amt}</p>
              <p style={{color: 'red'}}>应付总额：<span><em>￥</em>{goods.real_amt}</span></p>
            </div>
          </div>
        </footer>
      </div>
    );
  }
}

export default OrderDetail;
