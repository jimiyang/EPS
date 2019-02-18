import React, {Component} from 'react';

import {
  AutoComplete,
  Icon,
  Input,
  Button,
  Form
} from 'antd';

import './style.css';

const {Option} = AutoComplete;
class Addition extends Component {
  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <div className="employess-blocks">
        <Form onSubmit={this.handleSubmit} className="form" name="form">
          <Form.Item
            label="联系人姓名"
          >
            {getFieldDecorator(
              'name',
              {
                rules: [{required: true, message: '请输入联系人姓名'}]
              }
            )(<Input />)
            }
          </Form.Item>
          <Form.Item
            label="联系人手机"
          >
            {getFieldDecorator(
              'phone',
              {
                rules: [{required: true, message: '请输入联系人手机'}]
              }
            )(<Input />)
            }
          </Form.Item>
          <Form.Item
            label="联系人手机"
          >
            <Input placeholder="请输入邮箱地址" />
          </Form.Item>
          <Form.Item
            label="登录名"
          >
            {getFieldDecorator(
              'loginName',
              {
                rules: [{required: true, message: '请输入登录名'}]
              }
            )(<Input />)
            }
          </Form.Item>
          <Form.Item
            label="登录密码"
          >
            {getFieldDecorator(
              'loginPwd',
              {
                rules: [{required: true, message: '请输入登录密码'}]
              }
            )(<Input />)
            }
          </Form.Item>
          <Form.Item
            label="确认密码"
          >
            {getFieldDecorator(
              'confirmPwd',
              {
                rules: [{required: true, message: '请输入确认密码'}]
              }
            )(<Input />)
            }
          </Form.Item>
          <Form.Item>
            <div className="btn-blocks">
              <Button type="primary" htmlType="submit">添加</Button>
              <Button>返回</Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    );
  }
}
export default Form.create()(Addition);
