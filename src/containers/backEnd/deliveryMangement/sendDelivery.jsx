import React, {Component} from 'react';
import {
  Input,
  Select,
  message,
  Table
} from 'antd';
import './delivery.css';
import Data from '../../../utils/expressData.js';

const Option = Select.Option;
class sendDelivery extends Component {
  constructor(props) {
    super(props);
    this.state = {
      expressData: Data.expressData,
      defaultValue: '',
      orderData: [],
      expno: ''
    };
  }
  componentWillMount() {
    //验证是否需要登录
    if (!window.common.loginOut(this)) {
      message.error('登录信息失效，请重新登录');
    }
    this.setState({orderData: this.props.orderData, defaultValue: this.props.expname, expno: this.props.expno});
  }
  componentWillReceiveProps(props) {
    this.setState({orderData: props.orderData, defaultValue: props.expname, expno: props.expno});
  }
  selExpressNameEvent = (value) => {
    this.setState({
      defaultValue: value
    });
    this.props.selExpressNameEvent(value);
  }
  orderNumberEvent = (e) => {
    this.setState({
      expno: e.target.value
    });
    this.props.orderNumberEvent(e.target.value);
  }
  checkGoodsEvent = (selectedRowKeys, selectedRows) => {
    this.props.checkGoodsEvent(selectedRowKeys, selectedRows);
  }
  render() {
    const columns = [
      {
        title: '商品名称',
        key: 'goods_name',
        dataIndex: '',
        render: (record) => (
          <span className="flex-blocks">
            <img src={record.goods_pic} className="img-ico" />
            {record.goods_name}
          </span>
        )
      },
      {
        title: '数量',
        key: 'total_amt',
        dataIndex: 'total_amt'
      },
      {
        title: '状态',
        key: 'status',
        dataIndex: 'status',
        render: (record) => (
          <span>待发货</span>
        )
      },
      {
        title: '运单号',
        key: 'express_no',
        dataIndex: 'express_no'
      }
    ];
    const rowSelection = {
      onChange: (selectedRowKeys, selectedRows) => {
        this.checkGoodsEvent(selectedRowKeys, selectedRows);
      },
      getCheckboxProps: record => ({
        disabled: record.express_no !== null, // Column configuration not to be checked
        name: record.express_no,
      }),
    };
    const {orderData} = this.state;
    return (
      <div className="delivery-blocks">
        <ul className="express-items">
          <li>(选择商品 待发货：1 已发货：0）</li>
          <li>
            <Table
              rowSelection={rowSelection}
              columns={columns}
              dataSource={this.state.orderData.order_details}
              className="table-box"
              rowKey={record => record.id}
              hideOnSinglePage="true"
              size="small"
            />
          </li>
          <li>
            <h1>配送信息</h1>
            <div>收货人：{orderData.receiver}  {orderData.mobile}</div>
            <div>收货地址：{orderData.province}{orderData.city}{orderData.area}{orderData.address}  {orderData.post_code}</div>
          </li>
          <li>
            <h1>发货方式</h1>
            <div className="flex-blocks">
              <label>快递名称：</label>
              <Select defaultValue={this.state.defaultValue} onChange={this.selExpressNameEvent} style={{width: '50%'}}>
                {
                  this.state.expressData.map((item, index) => <Option key={index} value={item.express_name}>{item.express_name}</Option>)
                }
              </Select>
            </div>
            <div className="flex-blocks">
              <label>快递单号：</label>
              <Input onChange={this.orderNumberEvent} style={{width: '50%'}} value={this.state.expno} />
            </div>
          </li>
          <li>
            <p className="red">说明：如若是软件商品，可不填写快递信息</p>
          </li>
        </ul>
      </div>
    );
  }
}
export default sendDelivery;
