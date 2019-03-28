import React, {Component} from 'react';
import {Button, Input, Form, AutoComplete} from 'antd';
import './style.less';

class AddSN extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      dataSource: [
        {
          id: 1,
          name: '哈哈哈哈哈哈1'
        },
        {
          id: 2,
          name: '哈哈哈哈哈哈1'
        },
        {
          id: 3,
          name: '哈哈哈哈哈哈1'
        },
        {
          id: 4,
          name: '呵呵呵呵呵呵1'
        }
      ]
    };
  }
  addtionBrandEvent = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log(values);
        if (this.state.isadd === 0) {
          console.log('这是新增');
        } else {
          console.log('这是编辑');
        }
        this.props.addtionBrandEvent(e);
      }
    });
  }
  selNameEvent = (value) => {
    console.log('onSelect', value);
  }
  handleSearch = (value) => {
    this.setState({
      dataSource: !value ? [] : [
        value
      ],
    });
  }
  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <div className="sn-blocks">
        <Form onSubmit={this.addtionBrandEvent} className="form" name="form" id="form">
          <Form.Item
            label="商品名称"
          >
            {getFieldDecorator(
              'brand_name',
              {
                initialValue: this.state.name || '',
                rules: [
                  {required: true, message: '请输入商品名称'}
                ],
              }
            )(<AutoComplete
              dataSource={this.state.dataSource}
              style={{ width: 300 }}
              onSelect={this.selNameEvent}
              onSearch={this.handleSearch}
              placeholder="input here"
            />)
            }
          </Form.Item>
          <Form.Item style={{textAlign: 'center', display: 'block'}}>
            <div className="button-blocks" >
              <Button type="primary" htmlType="submit">批量上传</Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    );
  }
}
export default Form.create()(AddSN);
