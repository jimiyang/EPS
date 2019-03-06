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

  /*changePage = (value) => {
  }*/

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
                          <div className="title" onClick={this.getGoodsDetail.bind(this, item2.order_no, index2)}>
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
                              <img src={detail.goods_pic} />
                              <p>{detail.goods_name}</p>
                            </div>
                            <p style={{width: '120px'}}>￥{detail.goods_sale_price}</p>
                            <p style={{width: '120px'}}>{detail.goods_qty}</p>
                            <p style={{width: '120px'}}>￥{detail.total_amt}</p>
                            <div style={{width: '120px'}}>
                              <Status status={detail.status} />
                              <p style={{marginTop: '30px', cursor: 'pointer'}} onClick={this.toOrderDetail.bind(this, detail.order_no)}>订单详情</p>
                            </div>
                            <div className="operation">
                              {detail.status === 2 ? <button onClick={this.confirmReceipt}>确认收货</button> : null}
                              {detail.status === 0 ? <div><p style={{color: '#ddd'}}>{time}</p><button onClick={this.pay}>付款</button><p onClick={this.cancelOrder}>取消订单</p></div> : null}
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
