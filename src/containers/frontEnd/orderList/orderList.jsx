import React, {Component} from 'react';
import {Tabs, Input, Pagination} from 'antd';
import bg from '../../../assets/bg.jpg';
import './orderList.less';

const TabPane = Tabs.TabPane;
const Search = Input.Search;

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

class OrderList extends Component {
  state = {
    tabs: ['全部订单', '等待付款', '等待收货'],
    list: [
      {
        date: '2019-01-15 10:26:32', orderCode: '123456', poster: bg, name: '道路千万条，安全第一条。行车不规范，亲人两行泪。', price: '999.00', count: 1, pay: '999.00', status: 0, remain: null,
      },
      {
        date: '2019-01-15 10:26:32', orderCode: '123456', poster: bg, name: '联拓POS机', price: '999.00', count: 1, pay: '999.00', status: 1, remain: null,
      },
      {
        date: '2019-01-15 10:26:32', orderCode: '123456', poster: bg, name: '联拓POS机', price: '999.00', count: 1, pay: '999.00', status: 2, remain: '剩余11时59分',
      },
      {
        date: '2019-01-15 10:26:32', orderCode: '123456', poster: bg, name: '联拓POS机', price: '999.00', count: 1, pay: '999.00', status: 3, remain: null,
      },
      {
        date: '2019-01-15 10:26:32', orderCode: '123456', poster: bg, name: '联拓POS机', price: '999.00', count: 1, pay: '999.00', status: 4, remain: null,
      },
    ], // 0 取消 1 完成 2 待付款 3 待发货 4 待收货
  }

  // 改变分页
  changeTab = (e) => {
    console.log(e);
  }

  //搜索列表
  changeList = (e) => {
    console.log(e);
  }

  // 跳转到订单详情
  toOrderDetail = (e) => {
    this.props.history.push('/orderDetail');
  }

  render() {
    const {tabs, list} = this.state;
    return (
      <div id="orderList">
        <section className="top">
          <Tabs defaultActiveKey="0" onChange={this.callback}>
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
                            <p>{item2.date}</p>
                            <div>
                              <span style={{color: '#b1b1b1'}}>订单号：</span>
                              <span>{item2.orderCode}</span>
                            </div>
                          </div>
                          <div className="content">
                            <div style={{width: '450px'}} className="info">
                              <img src={item2.poster} />
                              <p>{item2.name}</p>
                            </div>
                            <p style={{width: '120px'}}>￥{item2.price}</p>
                            <p style={{width: '120px'}}>{item2.count}</p>
                            <p style={{width: '120px'}}>￥{item2.pay}</p>
                            <div style={{width: '120px'}}>
                              <Status status={item2.status} />
                              <p style={{marginTop: '30px', cursor: 'pointer'}} onClick={this.toOrderDetail}>订单详情</p>
                            </div>
                            <div className="operation">
                              {item2.status === 4 ? <button>确认收货</button> : null}
                              {item2.status === 2 ? <div><p style={{color: '#ddd'}}>{item2.remain}</p><button>付款</button><p>取消订单</p></div> : null}
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
            placeholder="订单编号/商品编号"
            enterButton="搜索"
            size="default"
            onSearch={this.changeList}
          />
        </section>
        <section className="pagination">
          <Pagination showQuickJumper defaultCurrent={1} total={500} onChange={this.changePage} />
        </section>
      </div>
    );
  }
}

export default OrderList;
