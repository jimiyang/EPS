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
      disabled: true
    };
  }
  //react 父组件传值给子组件，子组件定义一个变量来接收props值，所传的值在父组件中更改赋值，子组件中如何同步更新
  componentWillReceiveProps(props) {
    this.getTypeById(props.selfId);
  }
  componentWillMount() {
    if (window.common.loginOut(this)) {
      this.getTypeById(this.props.selfId);
    } else {
      message.error('登录信息失效，请重新登录');
    }
  }
  getTypeById = (sId) => {
    window.api('goods.getcategorylist', {id: sId}).then(res => {
      if (res.service_error_code === 'EPS000000801') {
        message.error(res.service_error_message);
        this.setState({redirect: true});
      } else {
        const pid = res.goods_category_list[0].superior_id === 0 ? '' : res.goods_category_list[0].superior_id;
        this.setState({
          form: res.goods_category_list[0],
          parent_id: pid,
        });
      }
    });
  }
  modifyEvent = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const form = Object.assign(this.state.form, values);
        window.api('goods.modcategory', form).then((res) => {
          if (res.service_error_code === 'EPS000000801') {
            message.error(res.service_error_message);
            this.setState({redirect: true});
          } else {
            message.success(res.service_error_message);
            //this.props.onSelectRefresh();
            this.props.modifyEvent(e);
          }
        });
      }
    });
  }
  categoryNameEvent = (e) => {
    const form = Object.assign({}, this.state.form, {goods_category_name: e.target.value});
    this.setState({
      form
    });
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
    if (this.state.redirect) {
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
                initialValue: this.state.form.goods_category_name || '',
                rules: [{required: true, message: '类别名称'}]
              }
            )(<Input onChange={this.categoryNameEvent} />)
            }
          </Form.Item>
          <Form.Item
            label="所属目录"
          >
            <TreeMenu selParentEvent={this.selParentEvent.bind(this)} parent_id={this.state.parent_id} disabled={this.state.disabled} />
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
