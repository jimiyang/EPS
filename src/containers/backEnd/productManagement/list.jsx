import React, {Component} from 'react';
import {Icon, Input, AutoComplete, Button, Table, Popconfirm, message, Select} from 'antd';
import {Redirect} from 'react-router';
import utils from '../../../utils/common';
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
      pagination: {
        page_size: 10,
        current: 1,
        total: null,
        onChange: this.changePage
      },
      status: 0,
      goodsList: [],
      goods_name: '',
      goods_bar_no: '',
      goods_brand_id: undefined, // 品牌id
      goods_category_id: '',
      redirect: false,
      isLoading: true,
      treeData: [], // 分类列表
      brandList: [], // 品牌列表
      allowClear: true, // 支持品牌框清除内容
    };
  }

  //数据加载，dom未初始化
  componentWillMount() {
    if (window.common.loginOut(this)) {
      Promise.all([window.api('eps.getgoodsbrand', {page_size: 100}), window.api('goods.getcategorylist', {})]).then((res) => {
        this.loadList(1, this.state.status);
        this.setState({brandList: res[0].goods_brand_list, treeData: res[1].goods_category_list});
      });
    } else {
      message.error('登录信息失效，请重新登录');
    }
  }

  // 渲染
  renderOption(item) {
    return (
      <Option key={item.name} text={item.name}>
        {item.name}
      </Option>
    );
  }

  // 获取商品列表
  loadList = (currentPage, status) => {
    let params = {
      page_size: 10,
      current_page: currentPage,
      status,
      goods_category_id: this.state.goods_category_id,
      goods_bar_no: this.state.goods_bar_no,
      goods_name: this.state.goods_name,
      goods_brand_id: this.state.goods_brand_id
    };
    params = utils.dealElement(params);
    window.api('goods.getgoodslist', params).then(rs => {
      const pagination = {
        page_size: 10,
        current: Number(currentPage),
        total: Number(rs.total_result),
        onClick: this.changePage
      };
      this.setState({goodsList: rs.goods_list, isLoading: false, pagination});
    }).catch((error) => {
      if (error.service_error_code === 'EPS000000801') {
        this.setState({redirect: true});
      }
      message.error(error.service_error_message);
      this.setState({isLoading: false});
    });
  }

  // 根据tab切换提示框显示内容
  async selTap(index) {
    const statusTxt = index !== 0 ? '出售' : '下架';
    const statusCon = index !== 0 ? '是否确定要出售此产品？' : '是否确定要下架此产品？';
    await this.setState({
      isActive: index,
      statusTxt,
      statusCon,
      status: index,
      goods_name: '',
      goods_bar_no: '',
      goods_brand_id: undefined,
      goods_category_id: '',
    });
    await this.loadList(1, index);
  }

  // 是否下架或重新出售
  confirm = (item) => {
    const status = item.status === 0 ? 1 : 0;
    const params = {id: item.id, status};
    window.api('goods.modgoods', params).then(rs => {
      message.success(rs.service_error_message);
      this.loadList(this.state.pagination.current, this.state.status);
    }).catch((error) => {
      if (error.service_error_code === 'EPS000000801') {
        this.setState({redirect: true});
      }
      message.error(error.service_error_message);
    });
  }

  // 获取搜索信息
  getSearchInfo(type, value) {
    if (type === 'goods_bar_no') {
      this.setState({[type]: value.target.value});
      return;
    }
    this.setState({[type]: value});
  }

  //列表查询
  searchEvent = () => {
    this.loadList(1, this.state.status);
  }

  // 改变页码
  changePage = (page) => {
    this.loadList(page, this.state.status);
  }

  // 跳转到添加/编辑商品页面
  addProduct = (id) => {
    this.props.history.push('/main/addGoods', {id});
  }

  render() {
    const {
      brandList, statusCon, statusTxt, redirect, menuData, isActive, productNameData, goodsList, pagination, isLoading, allowClear
    } = this.state;
    const columns = [
      {
        title: '商品名称',
        key: 'goods_name',
        dataIndex: '',
        render: (record) => (
          <span>
            <img src={record.goods_picture} className="img-ico" />
            {record.goods_name}
          </span>
        )
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
        title: '库存',
        key: 'goods_num',
        dataIndex: 'goods_num'
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
            <span className="ml10" onClick={() => this.addProduct(record.id)}>编辑</span>
            <Popconfirm
              title={statusCon}
              onConfirm={() => this.confirm(record)}
              okText="是"
              cancelText="否"
            >
              <span className="ml10">{statusTxt}</span>
            </Popconfirm>
          </div>
        )
      }
    ];
    if (redirect) return (<Redirect to="/login" />);
    return (
      <div className="product-blocks">
        <div className="nav-items">
          <div className="tap-items">
            {
              menuData.map((item, index) => <span key={index} onClick={() => this.selTap(index)} className={isActive === index ? 'active' : ''}>{item}</span>)
            }
          </div>
          <Button type="primary" onClick={this.addProduct.bind(this, 0)}>新增商品</Button>
        </div>
        <ul className="search-blocks">
          <li className="items"><label>商品名称：</label>
            <AutoComplete
              className="certain-category-search"
              dropdownClassName="certain-category-search-dropdown"
              dropdownMatchSelectWidth={false}
              size="large"
              style={{width: '100%'}}
              dataSource={productNameData.map(this.renderOption)}
              onBlur={this.getSearchInfo.bind(this, 'goods_name')}
              placeholder="请输入商品名称"
              optionLabelProp="text"
              onSelect={this.getSearchInfo.bind(this, 'goods_name')}
              onChange={this.getSearchInfo.bind(this, 'goods_name')}
              value={this.state.goods_name}
            >
              <Input suffix={<Icon type="search" className="certain-category-icon" />} />
            </AutoComplete>
          </li>
          <li className="items"><label style={{width: '150px'}}>商品条形码：</label>
            <Input value={this.state.goods_bar_no} onChange={this.getSearchInfo.bind(this, 'goods_bar_no')} placeholder="请输入商品条形码" />
          </li>
          <li className="items category"><label>商品类型：</label>
            <TreeMenu style={{flex: 1}} selParentEvent={this.getSearchInfo.bind(this, 'goods_category_id')} parent_id={this.state.goods_category_id} productTypeData={this.state.treeData} />
          </li>
          <li className="items"><label>商品品牌：</label>
            <Select style={{flex: 1}} value={this.state.goods_brand_id} placeholder="请选择商品品牌" onChange={this.getSearchInfo.bind(this, 'goods_brand_id')} allowClear={allowClear}>
              {
                brandList.map((item, index) => (
                  <Option value={item.id} key={index}>{item.brand_name}</Option>
                ))
              }
            </Select>
          </li>
          <li className="items" style={{width: '100px'}}><Button type="primary" onClick={this.searchEvent.bind(this)}>搜索</Button></li>
        </ul>
        <Table
          columns={columns}
          dataSource={goodsList}
          pagination={pagination}
          className="table-box"
          rowKey={record => record.id}
          loading={isLoading}
        />
      </div>
    );
  }
}
export default ProductList;

