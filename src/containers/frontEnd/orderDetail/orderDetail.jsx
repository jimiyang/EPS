import React, {Component} from 'react';
import {Steps} from 'antd';
import bg from '../../../assets/bg.jpg';
import './orderDetail.less';

const Step = Steps.Step;

function Status(props) {
  const status = props.status;
  let content;
  switch (status) {
    case 0:
      content = <p style={{color: 'red'}}>已取消</p>;
      break;
    case 1:
      content = <p style={{color: '#ddd'}}>已完成</p>;
      break;
    case 2:
      content = <p style={{color: 'orange'}}>等待付款</p>;
      break;
    case 3:
      content = <p>等待发货</p>;
      break;
    case 4:
      content = <p style={{color: 'green'}}>等待收货</p>;
      break;
    default:
      content = null;
      break;
  }
  return content;
}
class OrderDetail extends Component {
  state = {
    status: 1,
    info: {
      date: '2019-01-15 10:26:32', commoditeisCode: '2004903625979', poster: bg, name: '道路千万条，安全第一条。行车不规范，亲人两行泪。', price: '999.00', count: 1, status: 1
    },
  }
  render() {
    const {info, status} = this.state;
    return (
      <div id="orderDetail">
        <header>
          <div className="order">
            <p>订单号：<span>123456</span></p>
            <Status status={this.state.status} />
          </div>
          <div className="progress">
            {status === 0 ? (<Steps current={1}>
              <Step title="提交申请" description="2018-12-07 08:59:06" />
              <Step title="完成" description="" />
            </Steps>) : (<Steps current={1}>
              <Step title="提交订单" description="2018-12-07 08:59:06" />
              <Step title="支付成功" description="" />
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
              <span>张三</span>
            </div>
            <div style={{height: '40px'}}>
              <p>地址：</p>
              <span className="address">北京 北京市 丰台区 东铁匠营街道 方庄桥西南方庄一号院合肥联拓金融信息服务有限公司</span>
            </div>
            <div>
              <p>手机号码：</p>
              <span>15931112141</span>
            </div>
          </div>
          {status === 1 || status === 3 || status === 4 ? (<div>
            <h3>收货人信息</h3>
            <div>
              <p>交易流水号：</p>
              <span>12124124124214</span>
            </div>
            <div>
              <p>付款方式：</p>
              <span>返佣账户</span>
            </div>
            <div>
              <p>付款时间：</p>
              <span>2018-12-07  08:59:06</span>
            </div>
            <div>
              <p>商品总额：</p>
              <span>￥99.00</span>
            </div>
          </div>) : null}
          {status === 4 || status === 1 ? (<div>
            <h3>配送信息</h3>
            <div>
              <p>快递名称：</p>
              <span>顺丰快递</span>
            </div>
            <div>
              <p>快递单号：</p>
              <span>1221415152512512521512521</span>
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
              <img src={info.poster} />
              <p>{info.name}</p>
            </div>
            <p style={{width: '200px'}}>{info.commoditeisCode}</p>
            <p style={{width: '120px'}}>￥{info.price}</p>
            <p style={{width: '120px'}}>{info.count}</p>
            <div className="operation">
              {info.status === 4 ? <button className="operation">确认收货</button> : null}
              {info.status === 1 ? <button className="operation">再次购买</button> : null}
            </div>
          </div>
          <div className="content2">
            <div className="money">
              <p>商品总额：￥999.00</p>
              <p style={{color: 'red'}}>应付总额：￥999.00</p>
            </div>
          </div>
        </footer>
      </div>
    );
  }
}

export default OrderDetail;
