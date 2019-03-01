import React, {Component} from 'react';

import {
  Input,
  Form,
  Button,
  message
} from 'antd';

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
      parent_id: 0
    };
  }
  //react 父组件传值给子组件，子组件定义一个变量来接收props值，所传的值在父组件中更改赋值，子组件中如何同步更新
  componentWillReceiveProps(props) {
    this.getTypeById(props.selfId);
  }
  componentWillMount() {
    this.getTypeById(this.props.selfId);
  }
  getTypeById = (sId) => {
    window.api('goods.getcategorylist', {id: sId}).then(rs => {
      this.setState({
        form: rs.goods_category_list[0],
        parent_id: rs.goods_category_list[0].superior_id,
      });
    }).catch(error => {
      message.error(error);
    });
  }
  modifyEvent = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        window.api('goods.modcategory', this.state.form).then((rs) => {
          message.success(rs.service_error_message);
        }).catch(error => {
          message.error(error);
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
    const form = Object.assign({}, this.state.form, {superior_id: value});
    this.setState({
      form,
      parent_id: value
    });
  }
  render() {
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
            label="父级目录"
          >
            <TreeMenu selParentEvent={this.selParentEvent.bind(this)} parent_id={this.state.parent_id} />
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
