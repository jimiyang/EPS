import React, {Component} from 'react';

import {
  Icon,
  Input,
  AutoComplete,
  Button,
  DatePicker,
  Checkbox,
  Pagination,
  Modal
} from 'antd';

import 'moment/locale/zh-cn';

import moment from 'moment';

import './delivery.css';

import OrderDetaile from './orderDetaile';

import SendDelivery from './sendDelivery';
import { SourceNode } from '../../../../../../Library/Caches/typescript/3.2/node_modules/source-map/source-map';

moment.locale('zh-cn');
const {Option} = AutoComplete;
class DeliveryList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isActive: 0,
      index: '',
      agentNumberData: [],
      orderNumberData: [],
      detailVisible: false,
      expressVisible: false,
      menuData: ['全部订单', '待付款订单', '待发货订单', '待收货订单', '已完成订单', '已取消订单'],
      checkedList: [],
      publicNumberChecked: [],
      defaultValue: '请选择快递',
      orderNumber: '',
      orderListData: [],
      orderDetailData: [],
      orderNo: '',
      goodsIdData: '',
      total: 0,
      search: {
        status: 0,
        page_size: 5
      }
    };
  }
  renderOption(item) {
    return (
      <Option key={item.name} text={item.name}>
        {item.name}
      </Option>
    );
  }
  componentWillMount() {
    console.log(this.state.orderNo);
    console.log(this.state.search);
    console.log(this.state.goodsIdData);
    this.loadList();
  }
  loadList = () => {
    console.log(this.state.search);
    window.api('order.orderList', this.state.search).then(rs => {
      console.log(rs.orders);
      if (rs.orders.length > 0) {
        this.setState({
          orderListData: rs.orders,
          total: rs.orders.length
        });
      }
    });
  }
  selTap = (index) => {
    this.setState({
      isActive: index
    });
  }
  orderDetailEvent = (value) => {
    this.setState({
      detailVisible: true,
      orderNo: value
    });
  }
  sendDeliveryEvent = () => {
    this.setState({
      expressVisible: true
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
          orderDetailData: rs.goods_detail,
          goodsIdData: str.substr(0, str.length - 1)
        });
      }
    });
  }
  onCheckAllChange = (e) => {
    const index = e.target.value[0];
    const publicNumberChecked = this.state.publicNumberChecked;
    const checkedList = this.state.checkedList;
    if (e.target.checked === true) {
      publicNumberChecked[index] = true;
      checkedList[index] = true;
    } else {
      publicNumberChecked[index] = false;
      checkedList[index] = false;
    }
    this.setState({
      publicNumberChecked,
      checkedList
    });
  }
  onChange = (e, id) => {
    const index = e.target.value[0];
    console.log(e.target.value[1]);
    const checkedList = this.state.checkedList;
    if (e.target.checked === true) {
      checkedList[index] = true;
    } else {
      checkedList[index] = false;
    }
    this.setState({
      checkedList
    });
  }
  selExpressNameEvent = (value) => {
    this.setState({
      defaultValue: value
    });
  }
  orderNumberEvent = (value) => {
    this.setState({
      orderNumber: value
    });
  }
  sendEvent = (value) => {
    console.log(`快递名称：${this.state.defaultValue}`);
    console.log(`快递单号：${this.state.orderNumber}`);
    const params = {
      order_no: value,
      express_name: this.state.defaultValue,
      express_no: this.state.orderNumber,
      ids: []
    };
    window.api('order.send', params).then((rs) => {
      console.log(rs);
    });
  }
  searchEvent = () => {
    const params = {
      order_no: '',
      status: ''
    };
    window.api('order.orderList', params).then(rs => {
      console.log(rs);
    });
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
          <OrderDetaile order_no={this.state.order_no} />
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
          <li className="items"><label>代理商编号/名称：</label>
            <AutoComplete
              className="certain-category-search"
              dropdownClassName="certain-category-search-dropdown"
              dropdownMatchSelectWidth={false}
              size="large"
              style={{width: '100%'}}
              dataSource={this.state.agentNumberData.map(this.renderOption)}
              onBlur={this.handleNameSearch}
              placeholder="请输入商品名称"
              optionLabelProp="value"
            >
              <Input suffix={<Icon type="search" className="certain-category-icon" />} />
            </AutoComplete>
          </li>
          <li className="items"><label>订单号：</label>
            <AutoComplete
              className="certain-category-search"
              dropdownClassName="certain-category-search-dropdown"
              dropdownMatchSelectWidth={false}
              size="large"
              style={{width: '100%'}}
              dataSource={this.state.orderNumberData.map(this.renderOption)}
              onBlur={this.handleCodeSearch}
              placeholder="请输入商品条形码"
              optionLabelProp="value"
            >
              <Input suffix={<Icon type="search" className="certain-category-icon" />} />
            </AutoComplete>
          </li>
          <li className="items"><label>开始日期：</label>
            <DatePicker />
          </li>
          <li className="items"><label>结束日期：</label>
            <DatePicker />
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
                    <Checkbox
                      onChange={this.onCheckAllChange}
                      checked={this.state.publicNumberChecked[index]}
                      value={[index]}
                    />
                    <span>{this.state.menuData[item.status]}</span>
                    <span>{item.agent_name}</span>
                    <span>订单号：{item.order_no}</span>
                    <span>{item.gmt_created}</span>
                    <Button type="primary" onClick={this.orderDetailEvent.bind(this, item.order_no)}>订单详情</Button>
                    <Button type="primary" onClick={this.sendDeliveryEvent.bind(this, item.order_no)}>发货</Button>
                  </div>
                  <div className={['order-detaile', this.state.index === index ? null : 'hide'].join(' ')} >
                    {
                      this.state.orderDetailData.map((detail, idx) => (
                        <div key={idx}>
                          <div className="items-1">
                            <span>下单账号：{item.payer_account}</span>
                            <span>数量：{detail.goods_qty}</span>
                            <span>合计：<em className="red">{detail.total_amt}</em></span>
                          </div>
                          <div className="items-2">收货地址：{item.province}</div>
                          <div className="items-3">
                            <Checkbox value={[index, detail.goods_id]} onChange={this.onChange} checked={this.state.checkedList[index]} />
                            <img src={detail.goods_pic} />
                            <div className="title">
                              <h1>商品名称：{detail.goods_name}</h1>
                              <p>商品售价：¥{detail.goods_sale_price}</p>
                              <p>商品类型：{detail.goods_category_name}</p>
                            </div>
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
        <div className="g-tc pagination">
          <Pagination showSizeChanger defaultCurrent={1} total={this.state.total} defaultPageSize={this.state.search.pageSize} />
        </div>
      </div>
    );
  }
}
export default DeliveryList;
