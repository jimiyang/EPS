import React, {Component} from 'react';

import {
  Icon,
  Input,
  AutoComplete,
  Button,
  DatePicker,
  Modal,
  message
} from 'antd';

import 'moment/locale/zh-cn';

import moment from 'moment';

import './delivery.css';

import OrderDetaile from './orderDetaile';

import SendDelivery from './sendDelivery';

moment.locale('zh-cn');
class DeliveryList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isActive: 0,
      index: '',
      detailVisible: false,
      expressVisible: false,
      menuData: ['全部订单', '待付款订单', '待发货订单', '待收货订单', '已完成订单', '已取消订单'],
      expressName: '请选择快递',
      expressNo: '',
      ids: '',
      orderListData: [],
      orderDetailData: [],
      search: {
        status: 0,
        page_size: 5
      },
      orderNumber: '',
      agentNo: '',
      orderNo: '',
      startTime: '',
      endTime: '',
      firstOrdernum: '', //分页上一页所用的订单号
      lastOrdernum: ''//分页下一页所用的订单编号
    };
  }
  componentWillMount() {
    this.loadList(this.state.search);
    console.log(this.state.startTime);
    console.log(this.state.endTime);
  }
  loadList = (params) => {
    let firstOrdernum = '';
    let lastOrdernum = '';
    window.api('order.orderList', params).then(rs => {
      if (rs.orders.length > 0) {
        lastOrdernum = rs.orders[rs.orders.length - 1].order_no;
        firstOrdernum = rs.orders[0].order_no;
      } else {
        message.error('没有可查询数据！');
      }
      this.setState({
        orderListData: rs.orders,
        firstOrdernum,
        lastOrdernum
      });
    }).catch(error => {
      message.error(error);
    });
  }
  selTap = (index) => {
    const params = Object.assign(this.state.search, {status: index});
    this.setState({
      isActive: index,
      search: params
    });
    console.log(this.state.search);
    this.loadList(this.state.search);
  }
  orderDetailEvent = (value) => {
    this.setState({
      detailVisible: true,
      orderNumber: value
    });
  }
  sendDeliveryEvent = (number, id) => {
    this.setState({
      expressVisible: true,
      orderNumber: number,
      ids: id
    });
  }
  closeEvent = () => {
    this.setState({
      expressVisible: false,
      detailVisible: false
    });
  }
  openEvent = (idx, number) => {
    this.setState({
      index: idx
    });
    let str = '';
    window.api('goods.goodsDetail', {order_no: number}).then(rs => {
      if (rs.goods_detail.length > 0) {
        this.state.orderDetailData.map(item => {
          str += `${str}${item.goods_id},`;
        });
        this.setState({
          orderDetailData: rs.goods_detail
        });
      }
    }).catch(error => {
      message.error(error);
    });
  }
  selExpressNameEvent = (value) => {
    this.setState({
      expressName: value
    });
  }
  orderNumberEvent = (value) => {
    this.setState({
      expressNo: value
    });
  }
  sendEvent = (value) => {
    const params = {
      order_no: this.state.orderNumber,
      express_name: this.state.expressName,
      express_no: this.state.expressNo,
      ids: this.state.ids
    };
    window.api('order.send', params).then((rs) => {
      message.success(rs.service_error_message);
    }).catch(error => {
      message.error(error);
    });
  }
  agentEvent = (e) => {
    this.setState({
      agentNo: e.target.value
    });
  }
  orderNumEvent = (e) => {
    this.setState({
      orderNo: e.target.value
    });
  }
  startTimeEvent = (date, dateString) => {
    this.setState({
      startTime: dateString
    });
  }
  entTimeEvent = (date, dateString) => {
    this.setState({
      endTime: dateString
    });
  }
  searchEvent = () => {
    const params = {};
    if (this.state.agentNo !== '') {
      Object.assign(params, this.state.search, {agent_no: this.state.agentNo});
    }
    if (this.state.orderNo !== '') {
      Object.assign(params, this.state.search, {order_no: this.state.orderNo});
    }
    if (this.state.startTime !== '') {
      Object.assign(params, this.state.search, {start_time: this.state.startTime});
    }
    if (this.state.endTime !== '') {
      Object.assign(params, this.state.search, {endTime: this.state.endTime});
    }
    console.log(params);
    this.loadList(params);
  }
  //上一页
  preEvent = () => {
    const params = {
      ...this.state.search,
      previous: this.state.firstOrdernum
    };
    this.loadList(params);
  }
  //下一页
  nextEvent = () => {
    const params = {
      ...this.state.search,
      next: this.state.lastOrdernum
    };
    console.log(params);
    this.loadList(params);
  }
  render() {
    return (
      <div className="delivery-blocks">
        <Modal
          title="订单详情"
          visible={this.state.detailVisible}
          style={{width: '900px'}}
          onCancel={this.closeEvent}
          footer={
            <Button type="primary" onClick={this.closeEvent.bind(this)}>确定</Button>
          }
        >
          <OrderDetaile order_no={this.state.orderNumber} />
        </Modal>
        <Modal
          title="填写快递信息"
          okText="提交"
          cancelText="取消"
          onOk={this.sendEvent}
          onCancel={this.closeEvent}
          visible={this.state.expressVisible}
        >
          <SendDelivery
            selExpressNameEvent={this.selExpressNameEvent.bind(this)}
            orderNumberEvent={this.orderNumberEvent}
            id={this.state.id}
            order_no={this.state.orderNumber}
          />
        </Modal>
        <div className="nav-items">
          <div className="tap-items">
            {
              this.state.menuData.map((item, index) => <span key={index} onClick={this.selTap.bind(this, index)} className={this.state.isActive === index ? 'active' : ''}>{item}</span>)
            }
          </div>
        </div>
        <ul className="search-blocks">
          <li className="items"><label>代理商编号：</label>
            <Input onChange={this.agentEvent} />
          </li>
          <li className="items"><label>订单号：</label>
            <Input onChange={this.orderNumEvent} />
          </li>
          <li className="items"><label>开始日期：</label>
            <DatePicker onChange={this.startTimeEvent} />
          </li>
          <li className="items"><label>结束日期：</label>
            <DatePicker onChange={this.entTimeEvent} />
          </li>
          <li className="items"><Button type="primary" onClick={this.searchEvent.bind(this)}>搜索</Button></li>
        </ul>
        <div className="order-blocks">
          <ul>
            {
              this.state.orderListData.map((item, index) => (
                <li key={index}>
                  <div className="order-title">
                    <div className="arrow-ico" onClick={this.openEvent.bind(this, index, item.order_no)}>
                      <Icon type={this.state.index === index ? 'up' : 'down'} />
                    </div>
                    <span>{this.state.menuData[item.status]}</span>
                    <span>{item.agent_name}</span>
                    <span>订单号：{item.order_no}</span>
                    <span>{item.gmt_created}</span>
                  </div>
                  {
                    this.state.orderDetailData.map((detail, idx) => (
                      <div className={['order-detaile', this.state.index === index ? null : 'hide'].join(' ')} key={idx}>
                        <div className="items-3">
                          <div className="left">
                            <img src={detail.goods_pic} />
                            <div className="title">
                              <h1>商品名称：{detail.goods_name}</h1>
                              <p>商品售价：¥{detail.goods_sale_price}</p>
                              <p>商品类型：{detail.goods_category_name}</p>
                            </div>
                          </div>
                          <div className="button-items">
                            <Button type="primary" onClick={this.orderDetailEvent.bind(this, item.order_no)}>订单详情</Button>
                            <Button type="primary" onClick={this.sendDeliveryEvent.bind(this, item.order_no, detail.id)}>发货</Button>
                          </div>
                        </div>
                        <div className="items-1">
                          <p><label>下单账号：</label>{item.payer_account}</p>
                          <p><label>数量：</label>{detail.goods_qty}</p>
                          <p><label>合计：</label><em className="red">{detail.total_amt}</em></p>
                          <p><label>收货地址：</label>{item.province}</p>
                        </div>
                      </div>
                    ))
                  }
                </li>
              ))
            }
          </ul>
        </div>
        <div className="pagetion">
          <span onClick={this.preEvent.bind(this)}>上一页</span>
          <span onClick={this.nextEvent.bind(this)}>下一页</span>
        </div>
      </div>
    );
  }
}
export default DeliveryList;
