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
      search: {
        page_size: 10,
        status: 0
      },
      goodsList: [],
      goods_name: '',
      goods_bar_no: '',
      goods_category_id: '',
      redirect: false,
      isLoading: true,
      treeData: [], // 分类列表
    };
  }

  //数据加载，dom未初始化
  componentWillMount() {
    if (window.common.loginOut(this)) {
      this.loadList(this.state.search);
      this.getCategoryList();
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
  loadList = (params) => {
    params = utils.dealElement(params);
    window.api('goods.getgoodslist', params).then(rs => {
      this.setState({
        goodsList: rs.goods_list,
        isLoading: false
      });
    }).catch((error) => {
      if (error.service_error_code === 'EPS000000801') {
        this.setState({redirect: true});
      }
      message.error(error.service_error_message);
      this.setState({isLoading: false});
    });
  }

  // 获取分类列表
  getCategoryList = () => {
    window.api('goods.getcategorylist', {}).then((rs) => {
      this.setState({treeData: rs.goods_category_list});
    }).catch(error => {
      message.error(error.service_error_message);
    });
  }

  // 根据tab切换提示框显示内容
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

  // 是否下架或重新出售
  confirm = (item) => {
    const status = item.status === 0 ? 1 : 0;
    const params = {id: item.id, status};
    window.api('goods.modgoods', params).then(rs => {
      message.success(rs.service_error_message);
      this.loadList(this.state.search);
    }).catch((error) => {
      if (error.service_error_code === 'EPS000000801') {
        this.setState({redirect: true});
      }
      message.error(error.service_error_message);
    });
  }

  // 商品名称模糊搜索
  handleNameSearch = (value) => {
    const form = {
      goods_name: value,
      ...this.state.search
    };
    if (!value) return;
    window.api('goods.getgoodslist', form).then(res => {
      let node = [];
      if (res.good_list.length > 0) {
        node = res.goods_list.map((item) => ({
          name: `${item.goods_name}`
        }));
      }
      this.setState({productNameData: node, goods_name: value});
    }).catch((error) => {
      if (error.service_error_code === 'EPS000000801') {
        this.setState({redirect: true});
      }
      message.error(error.service_error_message);
    });
  }

  // 选择缓存中的商品名称
  selGoodsNameEvent = (value) => {
    this.setState({goods_name: value});
  }

  // 双向绑定输入的条形码条形码
  changeBarEvent = (e) => {
    this.setState({goods_bar_no: e.target.value});
  }

  // 选择商品类型，获取id
  selParentEvent = (value) => {
    this.setState({goods_category_id: value});
  }

  //列表查询
  searchEvent = () => {
    const params = {};
    // eslint-disable-next-line camelcase
    const {goods_name, goods_bar_no, goods_category_id} = this.state;
    Object.assign(params, this.state.search, {goods_name, goods_bar_no, goods_category_id});
    this.loadList(params);
  }

  // 跳转到添加商品页面
  addProduct = () => {
    this.props.history.push({pathname: '/main/addGoods'});
  }

  // 跳转到编辑页面
  edit = (item) => {
    this.props.history.push({pathname: '/main/addGoods', query: {id: item.id}});
  }

  render() {
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
        key: 'goods_sum',
        dataIndex: 'goods_sum'
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
              onChange={this.selGoodsNameEvent}
            >
              <Input suffix={<Icon type="search" className="certain-category-icon" />} />
            </AutoComplete>
          </li>
          <li className="items"><label style={{width: '150px'}}>商品条形码：</label>
            <Input value={this.state.goods_bar_no} onChange={this.changeBarEvent} placeholder="请输入商品条形码" />
          </li>
          <li className="items"><label>商品类型：</label>
            <TreeMenu selParentEvent={this.selParentEvent.bind(this)} parent_id={this.state.goods_category_id} productTypeData={this.state.treeData} />
          </li>
          <li className="items"><Button type="primary" onClick={this.searchEvent.bind(this)}>搜索</Button></li>
        </ul>
        <Table
          columns={columns}
          dataSource={this.state.goodsList}
          pagination={this.state.search}
          className="table-box"
          rowKey={record => record.id}
          loading={this.state.isLoading}
        />
      </div>
    );
  }
}
export default ProductList;

