import React, {Component} from 'react';

import {
  Icon,
  Input,
  AutoComplete,
  Button,
  Table,
  Popconfirm,
  message,
  Modal
} from 'antd';

import './list.css';

import Tree from './treeMenu';//树形结构商品类型

const {Option} = AutoComplete;
class ProductList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      search: {
        total: 3,
        defaultCurrent: 1,
        pageSize: 2,
        showSizeChanger: true,
        typeValue: ''
      },
      typeTitle: '',
      visible: false,
      productNameData: [], ///商品名称数据
      barCodeData: [] //条形码数据
    };
  }
  //数据加载，dom未初始化
  componentWillMount() {
    //console.log(this.state.productNameData.map(this.renderOption));
    //console.log(this.state.barCodeData);
  }
  searchName = () => {
    console.log('aa');
  }
  selType = () => {
    this.setState({
      visible: true
    });
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
  renderOption(item) {
    return (
      <Option key={item.name} text={item.name}>
        {item.name}
      </Option>
    );
  }
  //商品名称模糊搜索
  handleNameSearch = (value) => {
    const data = [
      {name: '上海银行', code: 141},
      {name: '中国银行', code: 142},
      {name: '北京银行', code: 143}
    ];
    const node = data.map((item, idx) => ({
      name: `${item.name}/${item.code}`
    }));
    this.setState({
      productNameData: value ? node : [],
    });
  }
  //商品条形码模糊搜索
  handleCodeSearch = (value) => {
    console.log(value);
  }
  handleOk = () => {
    this.setState({
      typeValue: this.state.typeTitle,
      visible: false
    });
  }
  handleCancel = () => {
    this.setState({
      visible: false
    });
  }
  changeHandler = (key, e) => {
    this.setState({
      typeTitle: e.node.props.title
    });
    //console.log(this.state.typeTitle);
  }
  addProduct = () => {
    this.props.history.push({pathname: '/addPro'});
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
        <Modal
          title="请选择商品类型"
          okText="确定"
          cancelText="取消"
          visible={this.state.visible}
          onOk={this.handleOk}
          onCancel={this.handleCancel}
        >
          <Tree onSelect={this.changeHandler} />
        </Modal>
        <div className="nav-items">
          <div>
            <a href="" className="active">出售中的商品</a>|
            <a href="">已下架的商品</a>
          </div>
          <Button type="primary" onClick={this.addProduct.bind(this)}>新增商品</Button>
        </div>
        <ul className="search-blocks">
          <li className="items"><label>商品名称：</label>
            <AutoComplete
              className="certain-category-search"
              dropdownClassName="certain-category-search-dropdown"
              dropdownMatchSelectWidth={false}
              size="large"
              style={{ width: '100%' }}
              dataSource={this.state.productNameData.map(this.renderOption)}
              onBlur={this.handleNameSearch}
              placeholder="请输入商品名称"
              optionLabelProp="value"
            >
              <Input suffix={<Icon type="search" className="certain-category-icon" />} />
            </AutoComplete>
          </li>
          <li className="items"><label>商品条形码：</label>
            <AutoComplete
              className="certain-category-search"
              dropdownClassName="certain-category-search-dropdown"
              dropdownMatchSelectWidth={false}
              size="large"
              style={{ width: '100%' }}
              dataSource={this.state.barCodeData.map(this.renderOption)}
              onBlur={this.handleCodeSearch}
              placeholder="请输入商品条形码"
              optionLabelProp="value"
            >
              <Input suffix={<Icon type="search" className="certain-category-icon" />} />
            </AutoComplete>
          </li>
          <li className="items"><label>商品类型：</label>
            <Input
              placeholder="请选择商品类型"
              onClick={this.selType.bind(this)}
              value={this.state.typeValue}
            />
          </li>
          <li className="items"><Button type="primary">搜索</Button></li>
        </ul>
        <Table
          columns={columns}
          dataSource={data}
          pagination={this.state.search}
          className="table-box"
        />
      </div>
    );
  }
}
export default ProductList;

