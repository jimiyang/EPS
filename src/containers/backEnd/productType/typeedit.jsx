import React, {Component} from 'react';
import {
  Input,
  Form,
  Button,
  message
} from 'antd';
import {Redirect} from 'react-router';
import './style.css';
import TreeMenu from '../../../components/backEnd/treeMenu';//商品类型模版

class TypeEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        id: '',
        goods_category_name: '',
        superior_id: ''
      },
      parent_id: 0,
      disabled: true,
      treeData: null,
    };
  }

  componentWillMount() {
    if (window.common.loginOut(this)) {
      this.setState({treeData: this.props.treeData, parent_id: this.props.editInfo.id, form: this.props.editInfo});
    } else {
      message.error('登录信息失效，请重新登录');
    }
  }

  // 变更分类
  modifyEvent = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err) => {
      if (!err) {
        window.api('goods.modcategory', this.state.form).then((res) => {
          message.success(res.service_error_message);
          this.props.modifyEvent(e);
        }).catch((error) => {
          if (error.service_error_code === 'EPS000000801') {
            this.setState({redirect: true});
          }
          message.error(error.service_error_message);
        });
      }
    });
  }

  // 获取修改后的类型名称
  categoryNameEvent = (e) => {
    const form = Object.assign({}, this.state.form, {goods_category_name: e.target.value});
    this.setState({form});
  }

  // 获取当前选择类型的id（编辑时类型无法更改）
  selParentEvent = (value) => {
    this.setState({parent_id: value});
  }

  render() {
    const {treeData, redirect, form} = this.state;
    const {getFieldDecorator} = this.props.form;
    if (redirect) return (<Redirect to="/login" />);
    return (
      <div className="typeedit-blocks">
        <Form onSubmit={this.modifyEvent} className="form" name="form">
          <Form.Item
            label="类别名称"
          >
            {getFieldDecorator(
              'goods_category_name',
              {
                initialValue: form.goods_category_name || '',
                rules: [{required: true, message: '类别名称'}]
              }
            )(<Input onChange={this.categoryNameEvent} />)
            }
          </Form.Item>
          <Form.Item
            label="所属目录"
          >
            <TreeMenu selParentEvent={this.selParentEvent.bind(this)} parent_id={this.state.parent_id} productTypeData={treeData} disabled={this.state.disabled} />
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
export default Form.create()(TypeEdit);
