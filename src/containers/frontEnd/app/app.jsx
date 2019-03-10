import React, {Component} from 'react';
import {Route} from 'react-router-dom';
import {connect} from 'react-redux';
import {message, AutoComplete, Icon, Input, Button, Menu, Dropdown} from 'antd';
// 路由
import goods from '../goods/goods';
import searchDetail from '../searchDetail/searchDetail';
import goodsDetail from '../goodsDetail/goodsDetail';
import generateOrder from '../generateOrder/generateOrder';
import cashier from '../cashier/cashier';
import successfulPayment from '../successfulPayment/successfulPayment';
import orderList from '../orderList/orderList';
import orderDetail from '../orderDetail/orderDetail';
import './app.less';
import {changeSearchDetail} from '../../../store/reduces/frontEnd';
import NotFound from '../../404';

function IsLogin(props) {
  return props.loginstate ? <div className="headers-user"><img src={require('../../../assets/logo.png')} /><p>刘玲一级代理商</p></div> : <div><p className="not">您还未登录，请登录</p></div>;
}
@connect(
  (state) => (state),
  {changeSearchDetail},
)
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginstate: true, // 0 未登录 1 已登录
      canSearch: false, // 是否能够搜索
      searchContent: '', // 搜索的内容
      dataSource: [], // 搜索列表
      goodsType: [], // 商品类型列表
      typeName: '请选择分类', // 选择分类名称
    };
  }

  componentWillMount() {
    if (window.localStorage) {
      if (!window.localStorage.getItem('PKEY')) {
        this.props.history.push('/login');
      } else {
        const list = window.localStorage.getItem('dataSource');
        const dataSource = list !== null ? JSON.parse(list) : [];
        this.setState({dataSource});
        this.getCategoryList();
      }
    }
  }

  componentWillReceiveProps(props) {
    let typeName = '请选择分类';
    let searchContent = '';
    if (props.location.pathname === '/searchDetail') {
      const info = props.location.state;
      typeName = info.typeName ? info.typeName : '请选择分类';
      searchContent = info.searchContent;
    }
    this.setState({typeName, searchContent});
  }

  // 获取产品类型列表
  getCategoryList = () => {
    const params = {
      page_size: 100,
      current_page: 1,
      superior_id: 0,
    };
    window.api('goods.getcategorylist', params).then((res) => {
      const goodsType = res.goods_category_list;
      this.setState({goodsType});
      window.localStorage.setItem('goodsType', JSON.stringify(goodsType));
    }).catch(err => {
      if (err === '用户信息失效，请重新登录') {
        message.error(err);
        this.props.history.push('/login');
      }
    });
  }

  // 跳转到首页
  toHome = () => {
    if (this.props.location.pathname !== '/') {
      this.props.history.push('/');
    }
  }

  // 跳转到我的订单
  toMyOrder = () => {
    if (this.props.location.pathname !== '/orderList') {
      this.props.history.push('/orderList');
    }
  }

  // 跳转到搜索页
  toSearchDetail = (id, typeName, searchContent) => {
    const {
      dataSource, canSearch
    } = this.state;
    this.props.history.push('/searchDetail', {id, typeName, searchContent});
    if (canSearch) {
      if (searchContent !== '') { // 获取下拉列表
        const list = dataSource;
        const index = dataSource.indexOf(searchContent);
        list.unshift(searchContent);
        if (index !== -1) {
          list.splice(index + 1, 1);
        } else {
          list.length > 5 ? list.splice(list.length - 1, 1) : null;
        }
        window.localStorage.setItem('dataSource', JSON.stringify(list));
      }
    }
    this.props.changeSearchDetail({id, typeName, searchContent});
    this.setState({typeName, searchContent});
  }

  // 登出
  logout = () => {
    this.setState({loginstate: !this.state.loginstate});
  }

  // 获取搜索框内容
  getSearchContent = (value) => {
    value !== this.state.searchContent ? this.setState({searchContent: value, canSearch: true}) : null;
  }

  render() {
    const {
      dataSource, loginstate, typeName, searchContent
    } = this.state;
    const menu = (
      <Menu>
        <Menu.Item key="0" onClick={this.toSearchDetail.bind(this, null, '全部', '')}>全部</Menu.Item>
        <Menu.Divider />
        {
          this.state.goodsType.map((item, index) => (
            <Menu.Item key={index + 1}>
              <a onClick={this.toSearchDetail.bind(this, item.id, item.goods_category_name, '')}>{item.goods_category_name}</a>
            </Menu.Item>
          ))
        }
      </Menu>
    );
    return (
      <div className="page">
        <div className="headers-bar">
          <div className="container">
            <div className="headers-bar-nav">
              <div onClick={this.toHome}>首页</div>
              <div>其他入口</div>
              <div>其他链接</div>
              <div>MS系统</div>
            </div>
            <div className="headers-tool">
              <IsLogin loginstate={loginstate} />  <div className="headers-order" onClick={this.toMyOrder}><Icon type="file-text" />我的订单</div>
            </div>
          </div>
        </div>
        <header className="headers">
          <div className="container headers-container">
            <h1
              className="headers-logo"
              onClick={this.toHome}
            ><Icon type="code-sandbox" />联拓富商城 </h1>
            <div className="headers-cont">
              <div className="headers-menu">
                <Dropdown overlay={menu} trigger={['click']}>
                  <a className="ant-dropdown-link" href="#">
                    {typeName} <Icon type="down" />
                  </a>
                </Dropdown>
              </div>
              <div className="search" style={{width: 300}}>
                <AutoComplete
                  dataSource={dataSource}
                  className="search-cont"
                  size="large"
                  value={searchContent}
                  onChange={this.getSearchContent}
                  placeholder="搜索商品"
                  style={{width: '100%'}}
                ><Input suffix={(<Button className="search-btn" size="large" type="primary" onClick={this.toSearchDetail.bind(this, null, '全部', searchContent)}><Icon type="search" /></Button>)} />
                </AutoComplete>
              </div>
            </div>
          </div>
        </header>
        <section className="container">{this.props.children}</section>
        <div className="footer">
          ©2019 lianfutong.com
        </div>
      </div>
    );
  }
}
