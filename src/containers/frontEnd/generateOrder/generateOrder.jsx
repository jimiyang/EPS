import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Form, Input, Cascader, Button} from 'antd';
import area from '../../../utils/area';
import './generateOrder.less';

@connect((state) => ({commoditiesDetail: state.frontEnd.commoditiesDetail}))

class GenerateOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      info: {}, // 商品信息
      consignee: {}, // 收货人信息
    };
  }

  componentWillMount() {
    const consignee = JSON.parse(window.localStorage.getItem('orderInfo'));
    this.setState({info: this.props.commoditiesDetail, consignee});
  }

  // 跳转到收银台
  toCashier = () => {
  }

  // 提交表单
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        window.localStorage.setItem('orderInfo', JSON.stringify(values));
        this.props.history.push('/cashier');
      }
    });
  }
  render() {
    const {info, consignee} = this.state;
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
                <img src={info.img} />
                <p>{info.title}</p>
              </li>
              <li>￥{info.price}</li>
              <li>{info.count}</li>
              <li>￥{(info.count * Number(info.price)).toFixed(2)}</li>
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
                    initialValue: consignee.residence || '',
                    rules: [{type: 'array', required: true, message: '请选择所在地区'}],
                  }
                )(<Cascader options={area.node} placeholder="请选择所在地区" />)
                }
              </Form.Item>
              <Form.Item
                label="收货人"
              >
                {getFieldDecorator(
                  'consignee',
                  {
                    initialValue: consignee.consignee || '',
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
                    initialValue: consignee.address || '',
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
                    initialValue: consignee.phoneNumber || '',
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
                    initialValue: consignee.postalCode || '',
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
