import React, {Component} from 'react';

import {
  Input,
  Select,
  Button,
  Form
} from 'antd';

import './style.css';

const Option = Select.Option;
const { TextArea } = Input;
class TypeEdit extends Component {
  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <div className="typeedit-blocks">
        <Form onSubmit={this.handleSubmit} className="form" name="form">
          <Form.Item
            label="角色名称"
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
            label="父级目录"
          >
            <Select defaultValue="lucy">
              <Option value="jack">Jack</Option>
              <Option value="lucy">Lucy</Option>
              <Option value="disabled" disabled>Disabled</Option>
              <Option value="Yiminghe">yiminghe</Option>
            </Select>
          </Form.Item>
          <Form.Item
            label="描述"
          >
            <TextArea rows={4} />
          </Form.Item>
        </Form>
      </div>
    );
  }
}
export default Form.create()(TypeEdit);
