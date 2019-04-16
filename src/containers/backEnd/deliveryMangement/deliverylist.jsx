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
      menuData: ['全部订单', '未支付订单', '待发货订单', '已发货订单', '已完成订单', '已取消订单'],
      statusData: ['未支付', '待发货', '已发货', '已完成', '已取消'],
      expressName: '',
      expressNo: '',
      ids: '',
      orderListData: [],
      search: {
        status: 0,
        page_size: 10
      },
      pagetype: 'next',
      orderNumber: '',
      agentNo: '',
      orderNo: '',
      startTime: '',
      endTime: '',
      firstOrdernum: '', //分页上一页所用的订单号
      lastOrdernum: '', //分页下一页所用的订单编号
      redirect: false,
      text: '发货',
      isLoading: true,
      orderData: []
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
  getGoodsList(orderno) {
    const promise = new Promise((resolve, reject) => {
      window.api('order.orderList', {order_no: orderno}).then(rs => {
        resolve(rs);
      }).catch(error => {
        reject(error);
      });
    });
    return promise;
  }
  loadList = (params) => {
    window.api('order.orderList', params).then(res => {
      const orderList = res.orders;
      this.setState({
        isLoading: false
      });
      let firstOrdernum = res.orders[0];
      let lastOrdernum = res.orders[res.orders.length - 1];
      if (this.state.pagetype === 'prev' && firstOrdernum === undefined) {
        message.warning('已是第一页');
        return false;
      }
      if (this.state.pagetype === 'next' && lastOrdernum === undefined) {
        message.warning('最后一页');
        return false;
      }
      if (orderList.length === 0) {
        this.setState({
          isHide: true
        });
      } else {
        lastOrdernum = lastOrdernum.order_no;
        firstOrdernum = firstOrdernum.order_no;
        this.setState({
          isHide: false,
          orderListData: orderList,
          firstOrdernum,
          lastOrdernum
        });
      }
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
      search: params,
      pagetype: '',
      isLoading: true
    });
    this.loadList(this.state.search);
  }
  orderDetailEvent = (value) => {
    this.getGoodsList(value).then(rs => {
      this.setState({orderData: rs, detailVisible: true});
    });
  }
  sendDeliveryEvent = (orderno, item) => {
    const flag = (item.is_post === 1 ? Boolean(0) : Boolean(1));
    this.setState({
      orderNumber: orderno,
      expressName: '请选择快递',
      expressNo: '',
      expressVisible: false
    });
    if (flag === false) {
      const params = {
        order_no: orderno,
        ids: item.id
      };
      this.sendFun(params);
    } else {
      this.getGoodsList(orderno).then(rs => {
        this.setState({
          orderData: rs.orders[0],
          expressVisible: true
        });
      });
    }
  }
  closeEvent = () => {
    this.setState({
      expressVisible: false,
      detailVisible: false,
      expressName: '请选择快递',
      expressNo: ''
    });
  }
  openEvent = (idx, number) => {
    const index = (this.state.index === idx) ? '-1' : idx;
    this.setState({
      index
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
  checkGoodsEvent = (selectedRowKeys, selectedRows) => {
    const ids = [];
    if (selectedRows.length > 0) {
      selectedRows.map(item => {
        ids.push(item.id);
      });
    }
    this.setState({
      ids: ids.join(',')
    });
  }
  sendFun(params) {
    window.api('order.send', params).then((res) => {
      message.success(res.service_error_message);
      this.loadList(this.state.search);
      this.setState({
        expressVisible: false,
        ids: '',
        expressName: '',
        expressNo: ''
      });
    }).catch((error) => {
      error.service_error_code === 'EPS000000801' ? this.setState({redirect: true}) : null;
      message.error(error.service_error_message);
    });
  }
  sendEvent = () => {
    //console.log(this.state.ids);
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
    this.sendFun(params);
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
  preEvent = (type) => {
    this.setState({pagetype: type});
    const params = {
      ...this.state.search,
      previous: this.state.firstOrdernum
    };
    this.loadList(params);
  }
  //下一页
  nextEvent = (type) => {
    if (this.state.orderListData.length < 10) {
      message.warn('已是最后一页');
      return;
    }
    this.setState({pagetype: type});
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
          <OrderDetaile orderData={this.state.orderData} />
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
            orderData={this.state.orderData}
            checkGoodsEvent={this.checkGoodsEvent}
            expname={this.state.expressName}
            expno={this.state.expressNo}
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
                      <span style={{color: '#ccc'}}>订单号：{item.order_no}</span>
                      <span style={{color: '#ccc'}} className="agentName">{item.agent_no}/{item.agent_name}</span>
                      <span className={item.status === 1 ? 'red' : null}>{this.state.statusData[item.status]}</span>
                      <span className="blue cursor" onClick={this.orderDetailEvent.bind(this, item.order_no)}>订单详情</span>
                    </div>
                    <div className="order-detaile">
                      {
                        item.order_details.map((detail, idx) => (
                          <div className="order-content" key={idx}>
                            <div className="items-con" style={{textAlign: 'left', paddingLeft: '10px'}}>
                              <img src={detail.goods_pic} />
                              <label>{detail.goods_name}</label>
                            </div>
                            <div className="items-con">{detail.goods_qty}件</div>
                            <div className="items-con">{item.gmt_created}</div>
                            <div className="items-con">￥{detail.real_amt}</div>
                            <div className="button-items" style={{width: '20%'}}>
                              <Button type="primary" className={detail.status === 1 ? null : 'hide'} onClick={this.sendDeliveryEvent.bind(this, item.order_no, detail)}>{this.state.text}</Button>
                            </div>
                          </div>
                        ))
                      }
                    </div>
                  </li>
                ))
              }
            </ul>
          </div>
          <div className={`pagetion ${this.state.isHide === true ? 'hide' : null}`}>
            <span onClick={this.preEvent.bind(this, 'prev')}>上一页</span>
            <span onClick={this.nextEvent.bind(this, 'next')}>下一页</span>
          </div>
        </Spin>
      </div>
    );
  }
}
export default DeliveryList;
