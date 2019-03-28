import React, {Component} from 'react';
import {Button, Input, Select, Form} from 'antd';
import './style.less';

const Option = Select.Option;
class AddBrand extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      status: 0,
      selfid: '',
      isadd: 0 //0是新增1是编辑
    };
  }
  componentWillMount() {
    this.setState({
      selfid: this.props.selfid,
      isadd: this.props.is_add
    });
    this.initForm();
  }
  componentWillReceiveProps(props) {
    this.setState({
      selfid: props.selfid,
      isadd: this.props.is_add
    });
    //console.log(props.selfId);
    //console.log(this.props.is_add);
  }
  initForm = () => {
    if (!this.state.selfid) {
      return false;
    }
  }
  selStatusEvent = (value) => {
    console.log(value);
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
  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <div className="add-blocks">
        <Form onSubmit={this.addtionBrandEvent} className="form" name="form" id="form">
          <Form.Item
            label="品牌名称"
          >
            {getFieldDecorator(
              'brand_name',
              {
                initialValue: this.state.name || '',
                rules: [
                  {required: true, message: '请输入品牌名称'}
                ],
              }
            )(<Input placeholder="请输入品牌名称" style={{width: '80%'}} />)
            }
          </Form.Item>
          <Form.Item
            label="品牌状态"
          >
            {getFieldDecorator(
              'brand_status',
              {
                initialValue: this.state.status || '0'
              }
            )(<Select style={{width: '80%'}} onChange={this.selStatusEvent}>
              <Option value="0">启用</Option>
              <Option value="1">禁用</Option>
            </Select>)
            }
          </Form.Item>
          <Form.Item>
            <div className="button-blocks">
              <Button type="primary" htmlType="submit">保存</Button>
              <Button onClick={this.props.onClick}>取消</Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    );
  }
}
export default Form.create()(AddBrand);
