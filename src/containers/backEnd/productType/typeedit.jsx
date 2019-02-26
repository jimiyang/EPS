import React, {Component} from 'react';

import {
  Input,
  Select,
  TreeSelect,
  Form,
  Button
} from 'antd';

import './style.css';

const Option = Select.Option;
const {TextArea} = Input;
class TypeEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        id: '',
        goods_category_name: '',
        superior_id: ''
      }
    };
  }
  componentWillMount() {
    const form = Object.assign({}, this.state.form, {id: this.props.id});
    this.setState({
      form
    });
  }
  modifyEvent = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        //console.log('Received values of form: ', values);
        console.log(this.state.form);
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
      form
    });
  }
  render() {
    const {getFieldDecorator} = this.props.form;
    const treeData = [{
      title: '我的分类',
      value: '0-0',
      key: '0-0',
      children: [{
        title: '首款小精灵',
        value: '0-0-1',
        key: '0-0-1',
      }, {
        title: '硬件',
        value: '0-0-2',
        key: '0-0-2',
      }],
    }, {
      title: '软件',
      value: '0-1',
      key: '0-1',
    }
    ];
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
            {getFieldDecorator(
              'superior_id',
              {
                initialValue: this.state.form.superior_id || '',
                rules: [{required: true, message: '请选择父级分类'}]
              }
            )(<TreeSelect
              style={{width: '100%'}}
              dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
              treeData={treeData}
              placeholder="请选择父级目录"
              treeDefaultExpandAll
              onChange={this.selParentEvent}
            />)
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
export default Form.create()(TypeEdit);
