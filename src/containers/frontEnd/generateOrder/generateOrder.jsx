import React, {Component} from 'react';
import moment from 'moment';
import {Form, Input, Cascader, Button, message} from 'antd';
import {Redirect} from 'react-router';
import {adData} from '../../../utils/area';
import './generateOrder.less';


class GenerateOrder extends Component {
  constructor(props) {
    super(props);
    this.state = {
      info: {}, // 商品信息
      consignee: {}, // 收货人信息
      redirect: false,
    };
  }

  componentWillMount() {
    if (window.common.loginOut(this)) {
      const consignee = JSON.parse(window.localStorage.getItem('orderInfo'));
      this.setState({info: this.props.location.state.info, consignee});
    } else {
      message.error('登录信息失效，请重新登录');
    }
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
            address: `${res.province} ${res.city} ${res.area} ${res.address}`,
            goods_name: this.state.info.name
          };
          this.props.history.push('/cashier', {info});
        }).catch((error) => {
          if (error.service_error_code === 'EPS000000801') {
            this.setState({redirect: true});
          }
          message.error(error.service_error_message);
        });
      }
    });
  }
  render() {
    if (this.state.redirect) {
      return (<Redirect to="/login" />);
    }
    const {info, consignee} = this.state;
    const {getFieldDecorator} = this.props.form;
    return (
      <div id="generateOrder">
        <div className="content">
          <div className="page-title">确认订单信息</div>
          <div className="goods">
            <img src={info.img} />
            <div className="goods-info">
              <h2>{info.name}</h2>
              <p className="price">￥{info.price} <span> × 1</span></p>
            </div>
            <div className="price"><em>合计：￥</em><b>{(info.count * Number(info.price)).toFixed(2)}</b></div>
          </div>
          <div className="page-title">填写收货人信息</div>
          <div className="bottom">
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
                      {pattern: /^^1(3|4|5|7|8|9)\d{9}$/, message: '请输入正确的手机号码'}
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
                <Button type="primary" size="large" htmlType="submit">提交订单</Button>
              </Form.Item>
            </Form>
          </div>
        </div>
      </div>
    );
  }
}

export default Form.create()(GenerateOrder);
