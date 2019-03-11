import React, {Component} from 'react';
import {
  Icon,
  Input,
  AutoComplete,
  Button,
  Table,
  Popconfirm,
  message
} from 'antd';
import {Redirect} from 'react-router';
import './list.css';
import TreeMenu from '../../../components/backEnd/treeMenu';//商品类型模版

const {Option} = AutoComplete;
class ProductList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isActive: 0,
      productNameData: [], ///商品名称数据
      menuData: ['出售中的商品', '已下架的商品'],
      statusTxt: '下架',
      statusCon: '是否确定要下架此产品？',
      search: {
        page_size: 10,
        status: 0
      },
      goodsList: [],
      goods_name: '',
      goods_bar_no: '',
      goods_category_id: '',
      redirect: false
    };
  }
  //数据加载，dom未初始化
  componentWillMount() {
    //验证是否需要登录
    window.common.loginOut(this, message);
    this.loadList(this.state.search);
  }
  renderOption(item, index) {
    return (
      <Option key={index} text={item.name}>
        {item.name}
      </Option>
    );
  }
  loadList = (params) => {
    window.api('goods.getgoodslist', params).then(rs => {
      this.setState({
        goodsList: rs.goods_list
      });
    }).catch(error => {
      if (error === '用户信息失效，请重新登录') {
        this.setState({
          redirect: true
        });
      }
      message.error(error);
    });
  }
  selTap = (index) => {
    const form = Object.assign(this.state.search, {status: index});
    const statusTxt = index !== 0 ? '出售' : '下架';
    const statusCon = index !== 0 ? '是否确定要出售此产品？' : '是否确定要下架此产品？';
    this.setState({
      isActive: index,
      search: form,
      statusTxt,
      statusCon
    });
    this.loadList(form);
  }
  //编辑
  edit = (item) => {
    this.props.history.push({pathname: '/main/addGoods', query: {id: item.id}});
  }
  //是否下架或重新出售
  confirm = (item) => {
    const status = item.status === 0 ? 1 : 0;
    const params = {
      id: item.id,
      status
    };
    window.api('goods.modgoods', params).then(rs => {
      message.success(rs.service_error_message);
      this.loadList(this.state.search);
    }).catch(error => {
      message.error(error);
    });
  }
  selNameEvent = (value) => {
    this.setState({
      goods_name: value
    });
  }
  //商品名称模糊搜索
  handleNameSearch = (value) => {
    this.setState({
      goods_name: value
    });
    const form = {
      goods_name: value,
      ...this.state.search
    };
    if (!value) {
      return false;
    }
    window.api('goods.getgoodslist', form).then(rs => {
      const node = rs.goods_list.map((item) => ({
        name: `${item.goods_name}`
      }));
      this.setState({
        productNameData: value ? node : []
      });
    }).catch(error => {
      message.error(error);
    });
  }
  selGoodsNameEvent = (value) => {
    this.setState({
      goods_name: value
    });
  }
  changeBarEvent = (e) => {
    this.setState({
      goods_bar_no: e.target.value
    });
  }
  selParentEvent = (value) => {
    this.setState({
      goods_category_id: value
    });
  }
  //列表查询
  searchEvent = () => {
    const params = {};
    if (this.state.goods_name !== '') {
      Object.assign(params, this.state.search, {goods_name: this.state.goods_name});
    }
    if (this.state.goods_bar_no !== '') {
      Object.assign(params, this.state.search, {goods_bar_no: this.state.goods_bar_no});
    }
    if (this.state.goods_category_id !== '') {
      Object.assign(params, this.state.search, {goods_category_id: this.state.goods_category_id});
    }
    if (Object.keys(params).length === 0) {
      Object.assign(params, this.state.search);
    }
    //console.log(params);
    this.loadList(params);
  }
  addProduct = () => {
    this.props.history.push({pathname: '/main/addGoods'});
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
        title: '商品状态',
        key: 'status',
        dataIndex: 'status',
        render: (status) => (
          <span>{status === 1 ? '已下架' : '出售中'}</span>
        ),
      },
      {
        title: '已售数量',
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
              title={this.state.statusCon}
              onConfirm={() => this.confirm(record)}
              okText="是"
              cancelText="否"
            >
              <span className="ml10">{this.state.statusTxt}</span>
            </Popconfirm>
          </div>
        )
      }
    ];
    if (this.state.redirect) {
      return (<Redirect to="/login" />);
    }
    return (
      <div className="product-blocks">
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
              optionLabelProp="text"
              onSelect={this.selGoodsNameEvent}
              onChange={this.selNameEvent}
            >
              <Input suffix={<Icon type="search" className="certain-category-icon" />} />
            </AutoComplete>
          </li>
          <li className="items"><label>商品条形码：</label>
            <Input value={this.state.goods_bar_no} onChange={this.changeBarEvent} placeholder="请输入商品条形码" />
          </li>
          <li className="items"><label>商品类型：</label>
            <TreeMenu selParentEvent={this.selParentEvent.bind(this)} parent_id={this.state.goods_category_id} />
          </li>
          <li className="items"><Button type="primary" onClick={this.searchEvent.bind(this)}>搜索</Button></li>
        </ul>
        <Table
          columns={columns}
          dataSource={this.state.goodsList}
          pagination={this.state.search}
          className="table-box"
          rowKey={record => record.id}
        />
      </div>
    );
  }
}
export default ProductList;

