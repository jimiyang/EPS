import React, {Component} from 'react';
import {Tabs, Input, message} from 'antd';
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
    isChecked: null, // 被选中的Index
    detail: {}, // 当前选中的订单的详情
    status: 0, //0：全部订单，1：等待付款，2：等待发货，3：等待收货，4：已完成，5：已取消（默认0）
    loadMore: true, // 是否能加载更多
    loadText: '加载更多',
    timer: null, // 定时器
    time: null, // 倒计时
  }

  componentWillMount() {
    this.getOrderList('first', 0);
  }

  componentWillUnmount() {
    clearInterval(this.state.timer);
    this.setState({timer: null});
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
        this.setState({status, isChecked: null});
        break;
      case '1':
        status = 1;
        this.setState({status, isChecked: null});
        break;
      case '2':
        status = 3;
        this.setState({status, isChecked: null});
        break;
      default:
        this.setState({status, isChecked: null});
    }
    this.getOrderList('change', status);
  }

  // 获取订单列表啊
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
      //console.log(res);
      if (res.orders < 10) {
        this.setState({loadMore: false, loadText: '已加在全部订单'});
      }
      if (type === 'change' || type === 'search' || !type) {
        list = res.orders;
      } else {
        list = list.concat(res.orders);
      }
      this.setState({list, loadText: '加载更多'});
      if (this.state.isChecked === null) {
        this.getGoodsDetail(res.orders[0].order_no, 0);
      }
    });
  }

  // 获取商品详情
  getGoodsDetail = (orderNo, index, ctime) => {
    clearInterval(this.state.timer);
    this.setState({timer: null, time: '00时00分00秒'});
    if (index !== this.state.isChecked) {
      const params = {
        order_no: orderNo,
      };
      /*window.api('goods.goodsDetail', params).then(res => {
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
        this.setState({isChecked: index, detail, timer});
      });*/
      const create = (new Date(ctime)).getTime();
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
      this.setState({isChecked: index, timer});
    }
  }
  // 付款
  pay = () => {
    const {detail, list, isChecked} = this.state;
    const info = {
      order_no: detail.order_no,
      real_amt: detail.real_amt,
      total_amt: detail.total_amt,
      address: list[isChecked].address,
      goods_name: detail.goods_name
    };
    this.props.history.push('/cashier', {info});
  }

  // 取消订单
  cancelOrder = () => {
    const params = {
      order_no: this.state.detail.order_no
    };
    window.api('order.cancelOrder', params).then(res => {
      this.state.list[this.state.isChecked].status = 4;
      this.state.detail.status = 4;
    });
  }

  // 确认收货
  confirmReceipt = () => {
    const {detail, list, isChecked} = this.state;
    const params = {
      order_no: detail.order_no,
      ids: `${detail.id}`,
    };
    window.api('order.confirmReceived', params).then(res => {
      list[isChecked].status = 3;
      detail.status = 3;
      message.success('确认收货，已完成订单！');
    }).catch((err) => {
      message.error(err);
    });
  }

  render() {
    const {
      detail, isChecked, tabs, list, loadMore, loadText, status, time
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
                          <div className="title" onClick={this.getGoodsDetail.bind(this, item2.order_no, index2, item2.order_details[0].gmt_created)}>
                            <span className="isChecked" hidden={index2 !== isChecked} />
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
                          <div className="content" hidden={index2 !== isChecked}>
                            <div style={{width: '450px'}} className="info">
                              <img src={item2.order_details[0].goods_pic} />
                              <p>{item2.order_details[0].goods_name}</p>
                            </div>
                            <p style={{width: '120px'}}>￥{item2.order_details[0].goods_sale_price}</p>
                            <p style={{width: '120px'}}>{item2.order_details[0].goods_qty}</p>
                            <p style={{width: '120px'}}>￥{item2.order_details[0].total_amt}</p>
                            <div style={{width: '120px'}}>
                              <Status status={item2.order_details[0].status} />
                              <p style={{marginTop: '30px', cursor: 'pointer'}} onClick={this.toOrderDetail.bind(this, item2.order_details[0].order_no)}>订单详情</p>
                            </div>
                            <div className="operation">
                              {item2.order_details[0].status === 2 ? <button onClick={this.confirmReceipt}>确认收货</button> : null}
                              {item2.order_details[0].status === 0 ? <div><p style={{color: '#ddd'}}>{time}</p><button onClick={this.pay}>付款</button><p onClick={this.cancelOrder}>取消订单</p></div> : null}
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
        <section className="default" hidden={list.length > 0}>查询不到订单</section>
      </div>
    );
  }
}

export default OrderList;
