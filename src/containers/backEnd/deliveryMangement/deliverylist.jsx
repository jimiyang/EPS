import React, {Component} from 'react';

import {
  Icon,
  Input,
  AutoComplete,
  Button,
  DatePicker,
  Checkbox,
  Pagination,
  Table,
  Popconfirm,
  message,
  Modal
} from 'antd';

import 'moment/locale/zh-cn';

import moment from 'moment';

import './delivery.css';

import OrderDetaile from './orderDetaile';

moment.locale('zh-cn');
const {Option} = AutoComplete;
class DeliveryList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      agentNumberData: [],
      orderNumberData: [],
      detailVisible: false,
    };
  }
  renderOption(item) {
    return (
      <Option key={item.name} text={item.name}>
        {item.name}
      </Option>
    );
  }
  orderDetailEvent = () => {
    this.setState({
      detailVisible: true
    });
  }
  render() {
    return (
      <div className="delivery-blocks">
        <Modal
          visible={this.state.detailVisible}
          style={{width: '900px'}}
        >
          <OrderDetaile />
        </Modal>
        <div className="nav-items">
          <div className="tap-items">
            <span className="active">全部订单</span>|
            <span>待发货的订单</span>|
            <span>已发货的订单</span>|
            <span>已完成的订单</span>|
            <span>待付款的订单</span>|
            <span>已取消的订单</span>
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
          <li className="items"><Button type="primary">搜索</Button></li>
        </ul>
        <div className="order-blocks">
          <ul>
            <li>
              <div className="order-title">
                <Icon type="down" />
                <Checkbox />
                <span>待发货</span>
                <span>EW_N8484741367/刘玲一级代理商</span>
                <span>订单号：0928213248</span>
                <span>2018-12-21 06:12:22</span>
                <Button type="primary" onClick={this.orderDetailEvent.bind(this)}>订单详情</Button>
                <Button type="primary">发货</Button>
              </div>
              <div className="order-detaile">
                <div className="items-1">
                  <span>下单账号：dddddd</span>
                  <span>数量：11111111</span>
                  <span>合计：<em className="red">09999999</em></span>
                </div>
                <div className="items-2">收货地址：</div>
                <div className="items-3">
                  <Checkbox />
                  <img src={require('../../../assets/bg.jpg')} />
                  <div>
                    <h1>恢复好后撒繁华的身份获得撒谎发的啥范德萨会发生</h1>
                    <p>¥344324321</p>
                    <p>商品类型：哈哈哈哈哈</p>
                  </div>
                </div>
              </div>
            </li>
            <li>
              <div className="order-title">
                <Icon type="down" />
                <Checkbox />
                <span>待发货</span>
                <span>EW_N8484741367/刘玲一级代理商</span>
                <span>订单号：0928213248</span>
                <span>2018-12-21 06:12:22</span>
                <Button type="primary">订单详情</Button>
                <Button type="primary">发货</Button>
              </div>
              <div className="order-detaile">
                <div className="items-1">
                  <span>下单账号：dddddd</span>
                  <span>数量：11111111</span>
                  <span>合计：<em className="red">09999999</em></span>
                </div>
                <div className="items-2">收货地址：</div>
                <div className="items-3">
                  <Checkbox />
                  <img src={require('../../../assets/bg.jpg')} />
                  <div>
                    <h1>恢复好后撒繁华的身份获得撒谎发的啥范德萨会发生</h1>
                    <p>¥344324321</p>
                    <p>商品类型：哈哈哈哈哈</p>
                  </div>
                </div>
              </div>
            </li>
          </ul>
          <div className="g-tc pagination">
            <Pagination showSizeChanger defaultCurrent={1} total={100} />
          </div>
        </div>
      </div>
    );
  }
}
export default DeliveryList;
