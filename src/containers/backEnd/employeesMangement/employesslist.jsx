import React, {Component} from 'react';

import {
  AutoComplete,
  Icon,
  Input,
  Button,
  Table,
  Modal
} from 'antd';

import Detail from './detaile';

import './style.css';

const {Option} = AutoComplete;
class EmployeesList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      Data: [],
      visible: false
    };
  }
  renderOption(item) {
    return (
      <Option key={item.name} text={item.name}>
        {item.name}
      </Option>
    );
  }
  //查看详情
  detaileEvent = (item) => {
    this.setState({
      visible: true
    });
  }
  detailCloseEvent = () => {
    this.setState({
      visible: false
    });
  }
  modifyEvent = (item) => {
    this.props.history.push({pathname: '/add'});
  }
  render() {
    const columns = [
      {
        title: '角色',
        key: 'role',
        dataIndex: 'role'
      },
      {
        title: '用户名',
        key: 'name',
        dataIndex: 'name'
      },
      {
        title: '状态',
        key: 'status',
        dataIndex: 'status'
      },
      {
        title: '操作',
        dataIndex: '',
        key: 'operation',
        render: (record) => (
          <div className="opearte-blocks">
            <span className="ml10" onClick={() => this.detaileEvent(record)}>查看</span>
            <span className="ml10" onClick={() => this.modifyEvent(record)}>编辑</span>
          </div>
        )
      }
    ];
    const dataSource = [
      {
        key: 1,
        id: 1,
        role: '拓展经理',
        name: '北京员工5',
        status: '启用'
      },
      {
        key: 2,
        id: 2,
        role: '拓展经理',
        name: '北京员工5',
        status: '启用'
      }
    ];
    return (
      <div className="employess-blocks">
        <Modal
          title="查看员工信息"
          okText="确定"
          onCancel={this.detailCloseEvent}
          footer={[
            <Button type="primary" onClick={this.detailCloseEvent}>关闭</Button>
          ]}
          visible={this.state.visible}
        >
          <Detail />
        </Modal>
        <div className="search-box">
          <label>角色名称：</label>
          <AutoComplete
            className="certain-category-search"
            dropdownClassName="certain-category-search-dropdown"
            dropdownMatchSelectWidth={false}
            size="large"
            style={{ width: '200px' }}
            dataSource={this.state.Data.map(this.renderOption)}
            onBlur={this.handleNameSearch}
            placeholder="请输入商品名称"
            optionLabelProp="value"
          >
            <Input suffix={<Icon type="search" className="certain-category-icon" />} />
          </AutoComplete>
          <Button type="primary">搜索</Button>
        </div>
        <Table columns={columns} dataSource={dataSource} />
      </div>
    );
  }
}
export default EmployeesList;
