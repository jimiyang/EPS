import React, {Component} from 'react';
import {Form, Input, Tooltip, Icon, Cascader, Select, Row, Col, Checkbox, Button, AutoComplete} from 'antd';
import './generateOrder.less';

const residences = [{
  value: 'zhejiang',
  label: '北京',
  children: [{
    value: 'hangzhou',
    label: '北京',
    children: [{
      value: 'xihu',
      label: '丰台区',
    }],
  }],
}, {
  value: 'jiangsu',
  label: '天津',
  children: [{
    value: 'nanjing',
    label: '天津',
    children: [{
      value: 'zhonghuamen',
      label: '海州区',
    }],
  }],
}];

class GenerateOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        consignee: null,
        address: null,
        phoneNumber: null,
        postalCode: null,
      }
    };
  }
  componentWillMount() {
  }
  componentDidMount() {
  }
  // 跳转到收银台
  toCashier = () => {
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.history.push('/cashier');
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        console.log(this.state.form.goodDetaile);
        this.setState({
          form: {
            is_post: 0
          }
        });
      }
    });
  }
  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <div id="generateOrder">
        <section className="top">
          <div className="title">确认订单信息</div>
          <div className="content">
            <ul className="header">
              <li>商品名</li>
              <li>单价</li>
              <li>数量</li>
              <li>合计</li>
            </ul>
            <ul className="commodities">
              <li>
                <img src={require('../../../assets//bg.jpg')} />
                <p>联拓POS机</p>
              </li>
              <li>￥999.00</li>
              <li>1</li>
              <li>￥999.00</li>
            </ul>
          </div>
        </section>
        <section className="bottom">
          <div className="title">填写收货人信息</div>
          <div className="content">
            <Form onSubmit={this.handleSubmit} className="form" name="form">
              <Form.Item
                label="所在地区"
              >
                {getFieldDecorator(
                  'residence',
                  {
                    rules: [{type: 'array', required: true, message: '请选择所在地区'}],
                  }
                )(<Cascader options={residences} placeholder="请选择所在地区" />)
                }
              </Form.Item>
              <Form.Item
                label="收货人"
              >
                {getFieldDecorator(
                  'consignee',
                  {
                    rules: [{required: true, message: '请输入收货人'}]
                  }
                )(<Input placeholder="请输入收货人" />)
                }
              </Form.Item>
              <Form.Item
                label="详细地址"
              >
                {getFieldDecorator(
                  'address',
                  {
                    rules: [{required: true, message: '请输入详细地址'}]
                  }
                )(<Input placeholder="请输入详细地址" />)
                }
              </Form.Item>
              <Form.Item
                label="手机号码"
              >
                {getFieldDecorator(
                  'phoneNumber',
                  {
                    rules: [
                      {required: true, message: '请输入手机号码'},
                      {pattern: /^1\d{10}$/, message: '请输入正确的手机号码'}
                    ]
                  }
                )(<Input placeholder="请输入手机号码" />)
                }
              </Form.Item>
              <Form.Item
                label="邮政编码"
              >
                {getFieldDecorator(
                  'postalCode',
                  {
                    rules: [
                      {required: false},
                      {pattern: /^[0-9]{6}$/, message: '邮政编码格式有误'}
                    ]
                  }
                )(<Input placeholder="请输入邮编" />)
                }
              </Form.Item>
              <Form.Item className="submitButton">
                <Button type="primary" htmlType="submit">提交订单</Button>
              </Form.Item>
            </Form>
          </div>
        </section>
      </div>
    );
  }
}

export default Form.create()(GenerateOrder);
