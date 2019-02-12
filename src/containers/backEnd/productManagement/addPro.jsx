import React, {Component} from 'react';

import {
  Form,
  Input,
  Radio,
  Button
} from 'antd';

import './list.css';

class Add extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentWillMount() {
    //console.log(this.props);
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
  }
  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <div className="add-blocks">
        <Form onSubmit={this.handleSubmit} className="form">
          <Form.Item
            label="商品名称"
          >
            {getFieldDecorator(
              'name',
              {
                rules: [{required: true, message: '请输入商品名称！'}]
              }
            )(<Input />)
            }
          </Form.Item>
          <Form.Item
            label="商品条形码"
          >
            {getFieldDecorator(
              'code',
              {
                rules: [{required: true, message: '请输入商品条形码！'}]
              }
            )(<Input />)
            }
            <Button type="primary">生成</Button>
          </Form.Item>
          <Form.Item>
            <Button type="primary" htmlType="submit">保存</Button>
          </Form.Item>
        </Form>
      </div>
    );
  }
}
//const EnhancedForm =  Form.create()(Add);
//<EnhancedForm wrappedComponentRef={(form) => this.form = form} />
export default Form.create()(Add);

