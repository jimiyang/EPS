import React, {Component} from 'react';
import moment from 'moment';
import {Form, Input, Cascader, Button} from 'antd';
import {adData} from '../../../utils/area';
import './generateOrder.less';


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
    this.setState({info: this.props.location.state.info, consignee});
  }

  // 提交表单
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        let random = '';
        while (random.length < 10) {
          random += `${Math.floor(Math.random() * 10)}`;
        }
        const orderNo = `${moment().format('YYYYMMDDHHmmssSSS')}${random}`;
        const price = (this.state.info.count * Number(this.state.info.price)).toFixed(2);
        const goods = JSON.stringify([{
          goods_id: this.state.info.id,
          goods_qty: this.state.info.count,
          total_amt: price
        }]);
        const params = {
          order_no: orderNo,
          total_amt: price,
          real_amt: price,
          province: values.residence[0],
          city: values.residence[1],
          area: values.residence[2],
          address: values.address,
          mobile: values.mobile,
          receiver: values.consignee,
          post_code: values.postalCode,
          goods,
        };
        window.localStorage.setItem('orderInfo', JSON.stringify(values));
        window.api('order.createorder', params).then(res => {
          const info = {
            order_no: res.order_no,
            real_amt: res.real_amt,
            total_amt: res.total_amt,
            address: res.address,
            goods_name: this.state.info.name
          };
          this.props.history.push('/cashier', {info});
        });
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
            <ul className="head">
              <li>商品名</li>
              <li>单价</li>
              <li>数量</li>
              <li>合计</li>
            </ul>
            <ul className="goods">
              <li>
                <img src={info.img} />
                <p>{info.name}</p>
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
                    initialValue: consignee ? consignee.residence : '',
                    rules: [{type: 'array', required: true, message: '请选择所在地区'}],
                  }
                )(<Cascader options={adData} placeholder="请选择所在地区" />)
                }
              </Form.Item>
              <Form.Item
                label="收货人"
              >
                {getFieldDecorator(
                  'consignee',
                  {
                    initialValue: consignee ? consignee.consignee : '',
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
                    initialValue: consignee ? consignee.address : '',
                    rules: [{required: true, message: '请输入详细地址'}]
                  }
                )(<Input placeholder="请输入详细地址" />)
                }
              </Form.Item>
              <Form.Item
                label="手机号码"
              >
                {getFieldDecorator(
                  'mobile',
                  {
                    initialValue: consignee ? consignee.mobile : '',
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
                    initialValue: consignee ? consignee.postalCode : '',
                    rules: [
                      {required: true},
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
