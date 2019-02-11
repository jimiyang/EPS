import React, {Component} from 'react';

import {Input, Button, Table, Popconfirm, message} from 'antd';

import './list.css';

const {Search} = Input;
class ProductList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: {
        total: 3,
        defaultCurrent: 1,
        pageSize: '2',
        showSizeChanger: true,
      }
    };
  }
  componentWillMount() {
    console.log(this.state.search);
  }
  searchName = () => {
    console.log('aa');
  }
  selType = () => {
    console.log(1);
  }
  //编辑
  edit = (item) => {
    console.log(`id：${item.id}`);
  }
  //下架
  confirm = (item) => {
    console.log(item);
    message.success('下架成功！');
  }
  cancel = () => {
    message.error('已取消！');
  }
  render() {
    const columns = [
      {
        title: '商品名称',
        key: 'name',
        dataIndex: 'name'
      },
      {
        title: '商品类型',
        key: 'type',
        dataIndex: 'type'
      },
      {
        title: '商品单价',
        key: 'price',
        dataIndex: 'price'
      },
      {
        title: '商品条形码',
        key: 'code',
        dataIndex: 'code'
      },
      {
        title: '已卖出数量',
        key: 'count',
        dataIndex: 'count'
      },
      {
        title: '操作',
        dataIndex: '',
        key: 'operation',
        render: (record) => (
          <div className="opearte-blocks">
            <span className="ml10" onClick={() => this.edit(record)}>编辑</span>
            <Popconfirm
              title="是否确定下架此产品?"
              onConfirm={() => this.confirm(record)}
              onCancel={() => this.cancel()}
              okText="是"
              cancelText="否"
            >
              <span className="ml10">下架</span>
            </Popconfirm>
          </div>
        )
      }
    ];
    const data = [
      {
        key: 1,
        id: 1,
        name: '联富通',
        type: '软件',
        price: '999999',
        code: '2004903625979',
        count: '99999999'
      },
      {
        key: 2,
        id: 2,
        name: '联富通1',
        type: '软件',
        price: '999999',
        code: '2004903625979',
        count: '5555'
      },
      {
        key: 3,
        id: 3,
        name: '联富通2',
        type: '软件',
        price: '999999',
        code: '2004903625979',
        count: '88888'
      }
    ];
    return (
      <div className="product-blocks">
        <div className="nav-items">
          <a href="" className="active">出售中的商品</a>|
          <a href="">已下架的商品</a>
        </div>
        <ul className="search-blocks">
          <li className="items"><label>商品名称：</label>
            <Search
              placeholder="请输入商品名称"
              onSearch={this.searchName.bind(this)}
            />
          </li>
          <li className="items"><label>商品条形码：</label><Search placeholder="请输入商品条形码" /></li>
          <li className="items"><label>商品类型：</label>
            <Input
              placeholder="请选择商品类型"
              onClick={this.selType.bind(this)}
            />
          </li>
          <li className="items"><Button type="primary">搜索</Button></li>
        </ul>
        <Table columns={columns} dataSource={data} pagination={this.state.search} className="table-box" />
      </div>
    );
  }
}
export default ProductList;

