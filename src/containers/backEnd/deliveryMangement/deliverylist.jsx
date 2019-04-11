import React, {Component} from 'react';
import {
  Icon,
  Input,
  Button,
  DatePicker,
  Modal,
  message,
  Spin
} from 'antd';
import {Redirect} from 'react-router';
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
      isHide: false,
      detailVisible: false,
      expressVisible: false,
      menuData: ['全部订单', '待付款订单', '待发货订单', '待收货订单', '已完成订单', '已取消订单'],
      statusData: ['待付款订单', '待发货订单', '待收货订单', '已完成订单', '已取消订单'],
      expressName: '',
      expressNo: '',
      ids: '',
      orderListData: [],
      search: {
        status: 0,
        page_size: 10
      },
      orderNumber: '',
      agentNo: '',
      orderNo: '',
      startTime: '',
      endTime: '',
      firstOrdernum: '', //分页上一页所用的订单号
      lastOrdernum: '', //分页下一页所用的订单编号
      redirect: false,
      text: '发货',
      isLoading: true
    };
  }
  componentWillMount() {
    //验证是否需要登录
    if (window.common.loginOut(this)) {
      this.loadList(this.state.search);
    } else {
      message.error('登录信息失效，请重新登录');
    }
  }
  loadList = (params) => {
    let firstOrdernum = '';
    let lastOrdernum = '';
    window.api('order.orderList', params).then(res => {
      if (res.orders.length > 0) {
        lastOrdernum = res.orders[res.orders.length - 1].order_no;
        firstOrdernum = res.orders[0].order_no;
        this.setState({
          isHide: false
        });
      } else {
        this.setState({
          isHide: true
        });
      }
      this.setState({
        orderListData: res.orders,
        firstOrdernum,
        lastOrdernum,
        isLoading: false
      });
    }).catch((error) => {
      error.service_error_code === 'EPS000000801' ? this.setState({redirect: true}) : null;
      message.error(error.service_error_message);
      this.setState({isLoading: false});
    });
  }
  selTap = (index) => {
    const params = Object.assign(this.state.search, {status: index});
    this.setState({
      isActive: index,
      search: params
    });
    this.loadList(this.state.search);
  }
  orderDetailEvent = (value) => {
    this.setState({
      detailVisible: true,
      orderNumber: value
    });
  }
  sendDeliveryEvent = (orderno) => {
    //const index = (this.state.index === idx) ? '-1' : idx;
    this.setState({
      expressVisible: true,
      orderNumber: orderno
    });
  }
  closeEvent = () => {
    this.setState({
      expressVisible: false,
      detailVisible: false
    });
  }
  openEvent = (idx, number) => {
    const index = (this.state.index === idx) ? '-1' : idx;
    this.setState({
      index
    });
    /*let str = '';
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
    });*/
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
  checkGoodsEvent = (selectedRowKeys, selectedRows) => {
    console.log(selectedRows);
    const ids = [];
    if (selectedRows.length > 0) {
      selectedRows.map(item => {
        ids.push(item.id);
      });
      this.setState({
        ids: ids.join(',')
      });
    }
  }
  sendEvent = () => {
    if (this.state.ids === '') {
      message.error('请选择发货商品');
      return false;
    }
    if (this.state.expressName === '') {
      message.error('请选择快递');
      return false;
    }
    if (this.state.expressNo === '') {
      message.error('请填写快递单号');
      return false;
    }
    const params = {
      order_no: this.state.orderNumber,
      express_name: this.state.expressName,
      express_no: this.state.expressNo,
      ids: this.state.ids
    };
    console.log(params);
    window.api('order.send', params).then((res) => {
      console.log(res);
      message.success(res.service_error_message);
      this.loadList(this.state.search);
      this.setState({
        expressVisible: false
      });
    }).catch((error) => {
      error.service_error_code === 'EPS000000801' ? this.setState({redirect: true}) : null;
      message.error(error.service_error_message);
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
    if (this.state.endTime !== '' && this.state.startTime !== '') {
      const startTime = (new Date(this.state.startTime)).getTime();
      const endTime = (new Date(this.state.endTime)).getTime();
      if (startTime > endTime) {
        message.error('开始时间必须早于结束时间');
        return;
      }
      Object.assign(params, this.state.search, {end_time: this.state.endTime});
    } else if (this.state.endTime !== '' && this.state.startTime === '') {
      message.error('请选择开始时间');
    }
    if (Object.keys(params).length === 0) {
      Object.assign(params, this.state.search);
    }
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
    this.loadList(params);
  }
  render() {
    if (this.state.redirect) {
      return (<Redirect to="/login" />);
    }
    //className={['order-detaile', this.state.index === index ? null : 'hide'].join(' ')}
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
          width="800px"
        >
          <SendDelivery
            selExpressNameEvent={this.selExpressNameEvent.bind(this)}
            orderNumberEvent={this.orderNumberEvent}
            order_no={this.state.orderNumber}
            checkGoodsEvent={this.checkGoodsEvent}
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
          <li className="items"><label style={{width: '150px'}}>代理商编号：</label>
            <Input onChange={this.agentEvent} placeholder="请输入代理商编号" />
          </li>
          <li className="items"><label>订单号：</label>
            <Input onChange={this.orderNumEvent} placeholder="请输入订单号" />
          </li>
          <li className="items"><label>开始日期：</label>
            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" onChange={this.startTimeEvent} />
          </li>
          <li className="items"><label>结束日期：</label>
            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" onChange={this.entTimeEvent} />
          </li>
          <li className="items"><Button type="primary" onClick={this.searchEvent.bind(this)}>搜索</Button></li>
        </ul>
        <Spin spinning={this.state.isLoading}>
          <div className="order-blocks">
            <div className={`no-data ${this.state.isHide === false ? 'hide' : null}`}>
              <img src={require('../../../assets/backEnd/nodata-ico.png')} />
              <p>没有数据!</p>
            </div>
            <ul className={this.state.isHide === false ? null : 'hide'}>
              <li>
                <div className="order-title items-title">
                  <span>商品</span>
                  <span>数量</span>
                  <span>下单时间</span>
                  <span>实付金额</span>
                  <span>操作</span>
                </div>
              </li>
              {
                this.state.orderListData.map((item, index) => (
                  <li key={index} >
                    <div className="order-title" onClick={this.openEvent.bind(this, index)}>
                      <div className="arrow-ico" onClick={this.openEvent.bind(this, index)}>
                        <Icon type={this.state.index === index ? 'up' : 'down'} />
                      </div>
                      <span className="agentName">{item.agent_no}/{item.agent_name}</span>
                      <span>订单号：{item.order_no}</span>
                      <span>{this.state.statusData[item.status]}</span>
                      <span className="blue cursor" onClick={this.orderDetailEvent.bind(this, item.order_no)}>订单详情</span>
                    </div>
                    <div className="order-detaile">
                      <div className="goods-con">
                        {
                          item.order_details.map((detail, idx) => (
                            <div key={idx}>
                              <div className="order-content">
                                <div className="items-3">
                                  <img src={detail.goods_pic} />
                                  <div className="items-con">商品名称：{detail.goods_name}</div>
                                  <div className="items-con">数量：{detail.goods_qty}</div>
                                  <div className="items-con">创建时间：{item.gmt_created}</div>
                                  <div className="items-con">￥{detail.goods_sale_price}</div>
                                </div>
                              </div>
                            </div>
                          ))
                        }
                      </div>
                      <div className="button-items">
                        <Button type="primary" className={item.status === 1 ? null : 'hide'} onClick={this.sendDeliveryEvent.bind(this, item.order_no)}>{this.state.text}</Button>
                      </div>
                    </div>
                  </li>
                ))
              }
            </ul>
          </div>
          <div className={`pagetion ${this.state.isHide === true ? 'hide' : null}`}>
            <span onClick={this.preEvent.bind(this)}>上一页</span>
            <span onClick={this.nextEvent.bind(this)}>下一页</span>
          </div>
        </Spin>
      </div>
    );
  }
}
export default DeliveryList;
