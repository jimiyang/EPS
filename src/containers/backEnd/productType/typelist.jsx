import React, {Component} from 'react';

import {
  Input,
  Select,
  Button,
  Table,
  Checkbox,
  Modal
} from 'antd';

import './style.css';

import TypeEdit from './typeedit';

const Option = Select.Option;
const { TextArea } = Input;
const CheckboxGroup = Checkbox.Group;
class ProductType extends Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      defaultExpandAllRows: true //是否默认展开树形结构
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
  render() {
    const columns = [{
      title: '类别名称',
      dataIndex: 'name',
      key: 'name',
    }, {
      title: '描述',
      dataIndex: 'describe',
      key: 'describe'
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
    const data = [
      {
        key: 1,
        name: '父级1',
        describe: '我是父级1',
        children: [{
          key: 11,
          name: '子级1',
          describe: '我是子级1',
        }]
      },
      {
        key: 12,
        name: '父级2',
        describe: '我是父级2',
        children: [{
          key: 121,
          name: '子级2',
          describe: '我是子级2',
        }],
      }
    ];
    const rowSelection = {
      /*onChange: (selectedRowKeys, selectedRows) => {
        console.log(`selectedRowKeys: ${selectedRowKeys}`, 'selectedRows: ', selectedRows);
      },*/
      onSelect: (record, selected, selectedRows) => {
        console.log(record, selected, selectedRows);
      },
      onSelectAll: (selected, selectedRows, changeRows) => {
        console.log(selected, selectedRows, changeRows);
      }
    };
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
          <Input />
          <p>父级分类目录</p>
          <Select defaultValue="lucy" style={{ width: '100%'}}>
            <Option value="lucy">Lucy</Option>
          </Select>
          <p>类别描述</p>
          <TextArea rows={4} />
          <Button type="primary">添加新分类目录</Button>
        </div>
        <div className="right">
          <Table defaultExpandAllRows={this.state.defaultExpandAllRows} rowSelection={rowSelection} columns={columns} dataSource={data} />
        </div>
      </div>
    );
  }
}
export default ProductType;
