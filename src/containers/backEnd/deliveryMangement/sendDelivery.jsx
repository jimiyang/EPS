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
      defaultValue: '请选择快递',
      orderData: [],
      order_no: ''
    };
  }
  async componentWillMount() {
    //验证是否需要登录
    if (!window.common.loginOut(this)) {
      message.error('登录信息失效，请重新登录');
    }
    await this.setState({
      order_no: this.props.order_no
    });
    this.loadList();
  }
  async componentWillReceiveProps(props) {
    await this.setState({
      order_no: props.order_no
    });
  }
  loadList() {
    window.api('order.orderList', {order_no: this.state.order_no}).then(rs => {
      this.setState({orderData: rs.orders[0].order_details});
    });
  }
  selExpressNameEvent = (value) => {
    this.props.selExpressNameEvent(value);
  }
  orderNumberEvent = (e) => {
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
        dataIndex: 'status'
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
    return (
      <div className="delivery-blocks">
        <ul className="express-items">
          <li>(选择商品 待发货：1已发货：1）</li>
          <li>
            <Table
              rowSelection={rowSelection}
              columns={columns}
              dataSource={this.state.orderData}
              className="table-box"
              rowKey={record => record.id}
              hideOnSinglePage="true"
              size="small"
            />
          </li>
          <li>
            <h1>配送信息</h1>
            <div>收货人：张三  15001200720</div>
            <div>收货地址：北京市朝阳区北花园中路联拓集团院内六号四合院  102500</div>
          </li>
          <li>
            <h1>发货方式</h1>
            <div className="flex-blocks">
              <label>快递名称：</label>
              <Select defaultValue={this.state.defaultValue} onChange={this.selExpressNameEvent} style={{width: '50%'}}>
                {
                  this.state.expressData.map((item, index) => <Option key={index} value={item.express_coding}>{item.express_name}</Option>)
                }
              </Select>
            </div>
            <div className="flex-blocks">
              <label>快递单号：</label>
              <Input onChange={this.orderNumberEvent} style={{width: '50%'}} />
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
