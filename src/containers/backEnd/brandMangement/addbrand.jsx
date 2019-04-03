import React, {Component} from 'react';
import {Button, Input, Select, Form, message} from 'antd';
import {Redirect} from 'react-router';
import utils from '../../../utils/common';
import './style.less';

const Option = Select.Option;
class AddBrand extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      name: '',
      editStatus: '1',
      selfId: '',
      isAdd: 0 //0是新增1是编辑
    };
  }
  componentWillMount() {
    this.setState({...this.props.editInfo, isAdd: this.props.isAdd});
  }

  componentWillReceiveProps(props) {
    this.setState({...props.editInfo, isAdd: props.isAdd});
  }

  // 添加/编辑品牌
  addtionBrandEvent = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        if (this.state.isAdd === 0) {
          window.api('eps.creategoodsbrand', values).then(() => {
            this.props.addtionBrandEvent();
          }).catch((error) => {
            if (error.service_error_code === 'EPS000000801') {
              this.setState({redirect: true});
            }
            message.error(error.service_error_message);
          });
        } else {
          values.id = this.state.selfId;
          if (values.brand_name === this.state.name) values.brand_name = '';
          values = utils.dealElement(values);
          window.api('eps.modgoodsbrand', values).then(() => {
            this.props.addtionBrandEvent();
          }).catch((error) => {
            if (error.service_error_code === 'EPS000000801') {
              this.setState({redirect: true});
            }
            message.error(error.service_error_message);
          });
        }
      }
    });
  }

  render() {
    if (this.state.redirect) return (<Redirect to="/login" />);
    const {getFieldDecorator} = this.props.form;
    const {name, editStatus} = this.state;
    return (
      <div className="add-blocks">
        <Form onSubmit={this.addtionBrandEvent} className="form" name="form" id="form">
          <Form.Item
            label="品牌名称"
          >
            {getFieldDecorator(
              'brand_name',
              {
                initialValue: name || '',
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
                initialValue: editStatus || '1'
              }
            )(<Select style={{width: '80%'}}>
              <Option value="1">启用</Option>
              <Option value="2">禁用</Option>
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
