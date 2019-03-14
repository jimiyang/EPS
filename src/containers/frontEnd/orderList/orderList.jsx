import React, {Component} from 'react';
import {Tabs, Input, message, Modal, Empty} from 'antd';
import {Redirect} from 'react-router';
import './orderList.less';

const TabPane = Tabs.TabPane;
const Search = Input.Search;

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

class OrderList extends Component {
  state = {
    tabs: ['全部订单', '等待付款', '等待收货'],
    list: [],
    status: 0, //0：全部订单，1：等待付款，2：等待发货，3：等待收货，4：已完成，5：已取消（默认0）
    loadMore: true, // 是否能加载更多
    loadText: '加载更多',
    ModalText: '确认取消当前订单？',
    visible: false,
    confirmLoading: false,
    cancelOrderNo: null, // 将要取消的订单编号
    cancelIndex: null, // 将要取消订单的索引
    redirect: false,
  }

  componentWillMount() {
    if (window.common.loginOut(this)) {
      this.getOrderList('first', 0);
    } else {
      message.error('登录信息失效，请重新登录');
    }
  }

  // 跳转到订单详情
  toOrderDetail = (orderNo) => {
    this.props.history.push('/orderDetail', {order_no: orderNo});
  }

  // 改变筛选方式
  changePage = (value) => {
    let status;
    switch (value) {
      case '0':
        status = 0;
        this.setState({status});
        break;
      case '1':
        status = 1;
        this.setState({status});
        break;
      case '2':
        status = 3;
        this.setState({status});
        break;
      default:
        this.setState({status});
    }
    this.getOrderList('change', status);
  }

  // 获取订单列表
  getOrderList(type, status, orderNo) {
    let {list} = this.state;
    const params = {
      status,
      page_size: 10,
    };
    orderNo ? params.order_no = orderNo : null;
    if (type === 'next') {
      this.setState({loadText: '正在加载...'});
      params.next = list[list.length - 1].order_no;
    }
    window.api('order.orderList', params).then(res => {
      if (res.orders.length < 10) {
        this.setState({loadMore: false, loadText: '已加载全部订单'});
      }
      if (type === 'change' || type === 'search' || !type) {
        list = res.orders;
      } else {
        list = list.concat(res.orders);
      }
      this.setState({list});
    }).catch((error) => {
      if (error.service_error_code === 'EPS000000801') {
        this.setState({redirect: true});
      }
      message.error(error.service_error_message);
    });
  }

  // 付款
  pay = (index) => {
    const {list} = this.state;
    const detail = list[index].order_details[0];
    const info = {
      order_no: detail.order_no,
      real_amt: detail.real_amt,
      total_amt: detail.total_amt,
      address: `${list[index].province} ${list[index].city} ${list[index].area} ${list[index].address}`,
      goods_name: detail.goods_name
    };
    this.props.history.push('/cashier', {info});
  }

  // 取消订单
  cancelOrder = () => {
    this.setState({
      ModalText: '正在支付，请稍候',
      confirmLoading: true,
    });
    const {list, cancelOrderNo, cancelIndex} = this.state;
    const params = {
      order_no: cancelOrderNo
    };
    window.api('order.cancelOrder', params).then(res => {
      message.success('已取消');
      this.setState({
        visible: false,
        confirmLoading: false,
        ModalText: '确认取消当前订单？',
      });
      list[cancelIndex].order_details[0].status = 4;
      this.setState({list});
    }).catch((error) => {
      if (error.service_error_code === 'EPS000000801') {
        this.setState({redirect: true});
      }
      this.setState({
        visible: false,
        confirmLoading: false,
        ModalText: '确认取消当前订单？',
      });
      message.error(error.service_error_message);
    });
  }

  // 打开取消窗口
  showModal = (orderNo, cancelIndex) => {
    this.setState({
      visible: true,
      cancelOrderNo: orderNo,
      cancelIndex,
    });
  }

  // 关闭取消窗口
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }

  // 确认收货
  confirmReceipt = (orderNo, ids, index) => {
    const {list} = this.state;
    const params = {
      order_no: orderNo,
      ids: `${ids}`,
    };
    window.api('order.confirmReceived', params).then((res) => {
      list[index].order_details[0].status = 3;
      this.setState({list});
      message.success('确认收货，已完成订单！');
    }).catch((error) => {
      if (error.service_error_code === 'EPS000000801') {
        this.setState({redirect: true});
      }
      message.error(error.service_error_message);
    });
  }

  render() {
    if (this.state.redirect) {
      return (<Redirect to="/login" />);
    }
    const {
      tabs, list, loadMore, loadText, status, visible, confirmLoading, ModalText
    } = this.state;
    return (
      <div id="orderList">
        <section className="top">
          <Tabs defaultActiveKey="0" onChange={this.changePage}>
            {
              tabs.map((item, index) => (
                <TabPane tab={item} key={index}>
                  <ul className="status">
                    <li style={{width: '450px'}}>商品名称</li>
                    <li style={{width: '120px'}}>单价</li>
                    <li style={{width: '120px'}}>数量</li>
                    <li style={{width: '120px'}}>实付款</li>
                    <li style={{width: '120px'}}>订单状态</li>
                    <li style={{width: '120px'}}>操作</li>
                  </ul>
                  <ul className="order">
                    {
                      list.map((item2, index2) => (
                        <li key={index2}>
                          <div className="title">
                            <div style={{
                              width: '400px', whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden'
                            }}
                            >
                              <span>{`${item2.created_no}/${item2.agent_name}`}</span>
                              <span>{item2.gmt_created}</span>
                            </div>
                            <div>
                              <span style={{color: '#000'}}>创建时间：</span>
                              <span>{item2.gmt_created}</span>
                            </div>
                            <div style={{width: '280px'}}>
                              <span style={{color: '#000'}}>订单号：</span>
                              <span>{item2.order_no}</span>
                            </div>
                          </div>
                          <div className="content">
                            <div style={{width: '450px'}} className="info">
                              <img src={item2.order_details[0].goods_pic} />
                              <p>{item2.order_details[0].goods_name}</p>
                            </div>
                            <p style={{width: '120px'}}>￥{(item2.order_details[0].goods_sale_price).toFixed(2)}</p>
                            <p style={{width: '120px'}}>{item2.order_details[0].goods_qty}</p>
                            <p style={{width: '120px'}}>￥{(item2.order_details[0].total_amt).toFixed(2)}</p>
                            <div style={{width: '120px'}}>
                              <Status status={item2.order_details[0].status} />
                              <p style={{marginTop: '30px', cursor: 'pointer'}} onClick={this.toOrderDetail.bind(this, item2.order_details[0].order_no)}>订单详情</p>
                            </div>
                            <div className="operation">
                              {item2.order_details[0].status === 2 ? <button onClick={this.confirmReceipt.bind(this, item2.order_details[0].order_no, item2.order_details[0].id, index2)}>确认收货</button> : null}
                              {item2.order_details[0].status === 0 ? <div><button onClick={this.pay.bind(this, index2)}>付款</button><p onClick={this.showModal.bind(this, item2.order_details[0].order_no, index2)}>取消订单</p></div> : null}
                            </div>
                          </div>
                        </li>
                      ))
                    }
                  </ul>
                </TabPane>
              ))
            }
          </Tabs>
          <Search
            className="searchInput"
            placeholder="订单编号"
            enterButton="搜索"
            size="default"
            onSearch={this.toOrderDetail}
          />
        </section>
        <section className="pagination" hidden={list.length === 0}>
          {
            loadMore ? <button onClick={this.getOrderList.bind(this, 'next', status, null)}>{loadText}</button> : <button>{loadText}</button>
          }
        </section>
        <section className="default" hidden={list.length > 0}>
          <Empty />
        </section>
        <div>
          <Modal
            visible={visible}
            onOk={this.cancelOrder}
            confirmLoading={confirmLoading}
            onCancel={this.handleCancel}
          >
            <p>{ModalText}</p>
          </Modal>
        </div>
      </div>
    );
  }
}

export default OrderList;
