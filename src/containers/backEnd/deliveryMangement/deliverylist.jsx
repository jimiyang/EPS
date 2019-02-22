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

moment.locale('zh-cn');
const {Option} = AutoComplete;
class DeliveryList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isActive: 0,
      index: 0,
      agentNumberData: [],
      orderNumberData: [],
      detailVisible: false,
      expressVisible: false,
      menuData: ['全部订单', '待发货的订单', '已发货的订单', '已完成的订单', '待付款的订单', '已取消的订单'],
      checkedList: [],
      publicNumberChecked: [],
      defaultValue: '请选择快递',
      orderNumber: '',
      detaileData: ['我是代理商1', '我是代理商2', '我是代理商3']
    };
  }
  componentWillMount() {}
  renderOption(item) {
    return (
      <Option key={item.name} text={item.name}>
        {item.name}
      </Option>
    );
  }
  selTap = (index) => {
    this.setState({
      isActive: index
    });
  }
  orderDetailEvent = () => {
    this.setState({
      detailVisible: true
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
  openEvent = (idx) => {
    this.setState({
      index: idx
    });
  }
  onCheckAllChange = (e) => {
    const index = e.target.value;
    const publicNumberChecked = this.state.publicNumberChecked;
    const checkedList = this.state.checkedList;
    console.log(e.target);
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
  onChange = (e) => {
    const index = e.target.value;
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
  sendEvent = () => {
    console.log(`快递名称：${this.state.defaultValue}`);
    console.log(`快递单号：${this.state.orderNumber}`);
  }
  render() {
    return (
      <div className="delivery-blocks">
        <Modal
          title="订单详情"
          visible={this.state.detailVisible}
          style={{ width: '900px' }}
          onCancel={this.closeEvent}
          footer={
            <Button type="primary" onClick={this.closeEvent.bind(this)}>确定</Button>
          }
        >
          <OrderDetaile />
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
              this.state.menuData.map((item, index) => <span onClick={this.selTap.bind(this, index)} className={this.state.isActive === index ? 'active' : ''}>{item}</span>)
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
              style={{ width: '100%' }}
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
              style={{ width: '100%' }}
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
            {
              this.state.detaileData.map((item, index) => (
                <li>
                  <div className="order-title">
                    <div className="arrow-ico" onClick={this.openEvent.bind(this, index)}>
                      <Icon type={this.state.index === index ? 'up' : 'down'} />
                    </div>
                    <Checkbox
                      onChange={this.onCheckAllChange}
                      checked={this.state.publicNumberChecked[index]}
                      value={index}
                    />
                    <span>待发货</span>
                    <span>{item}</span>
                    <span>订单号：0928213248</span>
                    <span>2018-12-21 06:12:22</span>
                    <Button type="primary" onClick={this.orderDetailEvent.bind(this)}>订单详情</Button>
                    <Button type="primary" onClick={this.sendDeliveryEvent.bind(this)}>发货</Button>
                  </div>
                  <div className={['order-detaile', this.state.index === index ? null : 'hide'].join(' ')} >
                    <div className="items-1">
                      <span>下单账号：dddddd</span>
                      <span>数量：11111111</span>
                      <span>合计：<em className="red">09999999</em></span>
                    </div>
                    <div className="items-2">收货地址：开快点快点快点快点快点快点快点快点打开的开口道</div>
                    <div className="items-3">
                      <Checkbox value={index} onChange={this.onChange} checked={this.state.checkedList[index]} />
                      <img src={require('../../../assets/bg.jpg')} />
                      <div>
                        <h1>恢复好后撒繁华的身份获得撒谎发的啥范德萨会发生</h1>
                        <p>¥344324321</p>
                        <p>商品类型：哈哈哈哈哈</p>
                      </div>
                    </div>
                  </div>
                </li>
              ))
            }
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
