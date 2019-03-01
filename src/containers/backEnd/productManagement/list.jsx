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
      isActive: 0,
      typeTitle: '',
      visible: false,
      productNameData: [], ///商品名称数据
      barCodeData: [], //条形码数据
      menuData: ['出售中的商品', '已下架的商品'],
      search: {
        total: 3,
        defaultCurrent: 1,
        pageSize: 2,
        showSizeChanger: true,
        typeValue: ''
      }
    };
  }
  //数据加载，dom未初始化
  componentWillMount() {
    this.loadList();
  }
  loadList = () => {
    window.api('goods.getgoodslist', {}).then(rs => {
      console.log(rs);
    });
  }
  searchName = () => {}
  selTap = (index) => {
    this.setState({
      isActive: index
    });
  }
  selType = () => {
    this.setState({
      visible: true
    });
  }
  //编辑
  edit = (item) => {
    this.props.history.push({pathname: '/addPro', query: {id: item.goods_bar_no}});
  }
  //下架
  confirm = (item) => {
    message.success('下架成功！');
  }
  cancel = () => {}
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
    const node = data.map((item) => ({
      name: `${item.name}/${item.code}`
    }));
    this.setState({
      productNameData: value ? node : [],
    });
  }
  //商品条形码模糊搜索
  handleCodeSearch = (value) => {}
  //列表查询
  searchEvent = () => {
    const params = {
      id: '',
      superior_id: '',
      goods_category_name: '',
      page_size: '',
      current_page: ''
    };
    window.api.baseInstance('goods.getcategorylist', params).then((rs) => {});
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
  }
  addProduct = () => {
    this.props.history.push({pathname: '/addPro'});
  }
  render() {
    const columns = [
      {
        title: '商品名称',
        key: 'goods_name',
        dataIndex: 'goods_name'
      },
      {
        title: '商品类型',
        key: 'goods_category_name',
        dataIndex: 'goods_category_name'
      },
      {
        title: '商品单价',
        key: 'sale_price',
        dataIndex: 'sale_price'
      },
      {
        title: '商品条形码',
        key: 'goods_bar_no',
        dataIndex: 'goods_bar_no'
      },
      {
        title: '已卖出数量',
        key: 'sell_out',
        dataIndex: 'sell_out'
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
        uid: 1,
        goods_name: '联富通',
        goods_category_name: '软件',
        sale_price: '999999',
        goods_bar_no: '2004903625979',
        sell_out: '99999999'
      },
      {
        uid: 2,
        goods_name: '联富通1',
        goods_category_name: '软件',
        sale_price: '999999',
        goods_bar_no: '2004903625979',
        sell_out: '5555'
      },
      {
        uid: 3,
        goods_name: '联富通1',
        goods_category_name: '软件',
        sale_price: '999999',
        goods_bar_no: '2004903625979',
        sell_out: '5555'
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
          <div className="tap-items">
            {
              this.state.menuData.map((item, index) => <span key={index} onClick={this.selTap.bind(this, index)} className={this.state.isActive === index ? 'active' : ''}>{item}</span>)
            }
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
              style={{width: '100%'}}
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
              style={{width: '100%'}}
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
          <li className="items"><Button type="primary" onClick={this.searchEvent.bind(this)}>搜索</Button></li>
        </ul>
        <Table
          columns={columns}
          dataSource={data}
          pagination={this.state.search}
          className="table-box"
          rowKey={record => record.uid}
        />
      </div>
    );
  }
}
export default ProductList;

