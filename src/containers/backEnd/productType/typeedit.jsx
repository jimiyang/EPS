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
      this.setState({parent_id: this.props.selfId, treeData: this.props.treeData});
    } else {
      message.error('登录信息失效，请重新登录');
    }
  }

  componentWillReceiveProps(props) {
    if (props.treeData === undefined) {
      this.setState({parent_id: props.parent_id});
    } else {
      this.setState({treeData: props.treeData, parent_id: props.parent_id});
    }
  }

  // 变更分类
  modifyEvent = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const form = Object.assign(this.state.form, values);
        window.api('goods.modcategory', form).then((res) => {
          message.success(res.service_error_message);
          //this.props.onSelectRefresh();
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

  //
  categoryNameEvent = (e) => {
    const form = Object.assign({}, this.state.form, {goods_category_name: e.target.value});
    this.setState({form});
  }


  selParentEvent = (value) => {
    const pid = value === '' ? 0 : value;
    const form = Object.assign({}, this.state.form, {superior_id: pid});
    this.setState({
      form,
      parent_id: value
    });
  }

  render() {
    const {treeData, redirect, form} = this.state;
    if (redirect) {
      return (<Redirect to="/login" />);
    }
    const {getFieldDecorator} = this.props.form;
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
              <Button type="primary" htmlType="submit" onClick={this.props.onClick}>保存</Button>
              <Button onClick={this.props.onClick}>取消</Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    );
  }
}
export default Form.create()(TypeEdit);
