import React, {Component} from 'react';

import {
  Input,
  Select,
  TreeSelect,
  Form,
  Button,
  message
} from 'antd';

import './style.css';

const Option = Select.Option;
const {TextArea} = Input;
const TreeNode = TreeSelect.TreeNode;
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
      treeData: []
    };
  }
  //react 父组件传值给子组件，子组件定义一个变量来接收props值，所传的值在父组件中更改赋值，子组件中如何同步更新
  componentWillReceiveProps(props) {
    this.getTypeById(props.selfId);
  }
  componentWillMount() {
    this.loadTreeList();
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
  loadTreeList = () => {
    window.api('goods.getcategorylist', {page_size: 100, current_page: 1}).then((rs) => {
      const productTypeData = rs.goods_category_list;
      if (productTypeData.length > 0) {
        this.setState({
          treeData: productTypeData
        });
      }
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
            <TreeSelect
              style={{width: '100%'}}
              dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
              placeholder="请选择父级目录"
              treeDefaultExpandAll
              onChange={this.selParentEvent}
              value={this.state.parent_id}
            >
              <TreeNode value={0} title="我的分类" key="0">
                {
                  this.state.treeData.map((item, index) => (
                    (item.superior_id === 0) ? (
                      <TreeNode value={item.id} title={item.goods_category_name} key={item.id}>
                        {
                          this.state.treeData.map((childData, i) => (
                            (item.id === childData.superior_id) ? (
                              <TreeNode value={childData.id} title={childData.goods_category_name} key={childData.id} />
                            ) : null
                          ))
                        }
                      </TreeNode>
                    ) : null
                  ))
                }
              </TreeNode>
            </TreeSelect>
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
