import React, {Component} from 'react';

import {
  Input,
  Select,
  Button,
  Table,
  Modal,
  TreeSelect
} from 'antd';

import './style.css';

import TypeEdit from './typeedit';

const Option = Select.Option;
class ProductType extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        goods_category_name: '',
        id: '',
        superior_id: ''
      },
      visible: false,
      defaultExpandAllRows: true, //是否默认展开树形结构
      typeData: [],
      parentData: [{
        id: 1,
        goods_category_name: '父级1',
        children: [
          {
            goods_category_name: '子级1',
          }
        ]
      }]
    };
  }
  edit = (item) => {
    this.setState({
      visible: true
    });
  }
  cancelEvent = () => {
    this.setState({
      visible: false
    });
  }
  selTypeId = (id) => {
    const form = Object.assign({}, this.state.form, {id});
    this.setState({
      form
    });
  }
  goodsNameEvent = (e) => {
    const form = Object.assign({}, this.state.form, {goods_category_name: e.target.value});
    this.setState({
      form
    });
  }
  addTypeEvent = () => {
    console.log(this.state.form);
  }
  render() {
    const columns = [{
      title: '类别名称',
      dataIndex: 'goods_category_name',
      key: 'goods_category_name',
    }, {
      title: '操作',
      dataIndex: '',
      key: 'operation',
      render: (record) => (
        <div className="opearte-blocks">
          <span className="ml10" onClick={() => this.edit(record)}>编辑</span>
        </div>
      )
    }];
    const treeData = [{
      title: 'Node1',
      value: '0-0',
      key: '0-0',
      children: [{
        title: 'Child Node1',
        value: '0-0-1',
        key: '0-0-1',
      }, {
        title: 'Child Node2',
        value: '0-0-2',
        key: '0-0-2',
      }],
    }, {
      title: 'Node2',
      value: '0-1',
      key: '0-1',
    }];
    return (
      <div className="type-blocks">
        <Modal
          title="编辑"
          okText="保存"
          cancelText="取消"
          onCancel={this.cancelEvent}
          visible={this.state.visible}
        >
          <TypeEdit />
        </Modal>
        <div className="left">
          <h1 className="title">分类目录</h1>
          <p>添加新分类项目</p>
          <Input value={this.state.form.goods_category_name} onChange={this.goodsNameEvent} />
          <p>所属分类</p>
          <Select defaultValue={this.state.form.id} onSelect={this.selTypeId} style={{ width: '100%'}}>
            {
              this.state.typeData.map((item) => (
                <Option value={item.id}>{item.name}</Option>
              ))
            }
          </Select>
          <p>父级分类目录</p>
          <Button type="primary" onClick={this.addTypeEvent}>添加新分类目录</Button>
        </div>
        <div className="right">
          <Table rowKey="id" defaultExpandAllRows={this.state.defaultExpandAllRows} columns={columns} dataSource={this.state.parentData} />
        </div>
      </div>
    );
  }
}
export default ProductType;
