import React, {Component} from 'react';
import {connect} from 'react-redux';
import {Route} from 'react-router-dom';
import {AutoComplete, Icon, Input, Button} from 'antd';
// 路由
import commodities from '../commodities/commodities';
import searchDetail from '../searchDetail/searchDetail';
import commoditiesDetail from '../commoditiesDetail/commoditiesDetail';
import generateOrder from '../generateOrder/generateOrder';
import cashier from '../cashier/cashier';
import successfulPayment from '../successfulPayment/successfulPayment';
import orderList from '../orderList/orderList';
import orderDetail from '../orderDetail/orderDetail';
import './app.less';
import {changeSearchContent} from '../../../store/reduces/frontEnd';

function IsLogin(props) {
  return props.loginstate ? <div className="header-user"><img src={require('../../../assets/logo.png')} /><p>刘玲一级代理商</p></div> : <div><p className="not">您还未登录，请登录</p></div>;
}
@connect(
  (state) => ({searchContent: state.frontEnd.searchContent, commoditiesType: state.frontEnd.commoditiesType}),
  {changeSearchContent},
)
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loginstate: true, // 0 未登录 1 已登录
      canSearch: false, // 是否能够搜索
      searchContent: '', // 搜索的内容
      dataSource: [], // 搜索列表
      commoditiesType: [], // 商品类型列表
    };
  }

  componentWillMount() {
    if (window.localStorage) {
      const list = window.localStorage.getItem('dataSource');
      const dataSource = list !== null ? JSON.parse(list) : [];
      this.setState({dataSource});
    } else {
      alert('浏览器不支持localStorage');
    }
    this.getCategoryList();
  }

  componentWillReceiveProps(props) {
    if (props.searchContent === '') {
      this.setState({searchContent: props.searchContent});
    }
  }

  // 获取产品类型列表
  getCategoryList = () => {
    const params = {
      page_size: 100,
      current_page: 1,
      superior_id: 0,
    };
    window.api('goods.getcategorylist', params).then(res => {
      const commoditiesType = res.goods_category_list;
      this.setState({commoditiesType});
      window.localStorage.setItem('commoditiesType', JSON.stringify(commoditiesType));
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
  toSearchDetail = (id) => {
    const {
      searchContent, dataSource, canSearch
    } = this.state;
    this.props.location.pathname !== '/searchDetail' ? this.props.history.push('/searchDetail') : null;
    if (canSearch) {
      if (searchContent !== '') { // 获取下拉列表
        const list = dataSource;
        const index = dataSource.indexOf(searchContent);
        list.unshift(searchContent);
        if (list.length > 5) {
          index === -1 ? list.splice(5, 1) : list.splice(index + 1, 1);
        }
        window.localStorage.setItem('dataSource', JSON.stringify(list));
      }
    }
    this.props.changeSearchContent({searchContent, id});
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
    const {dataSource, loginstate} = this.state;
    return (
      <div className="page">
        <div className="header-bar">
          <div className="container">
            <div className="header-bar-nav">
              <div onClick={this.toHome}>首页</div>
              <div>其他入口</div>
              <div>其他链接</div>
              <div>MS系统</div>
            </div>
            <div className="header-tool">
              <IsLogin loginstate={loginstate} />  <div className="header-order" onClick={this.toMyOrder}><Icon type="file-text" />我的订单</div>
            </div>
          </div>
        </div>
        <header className="header">
          <div className="container header-container">
            <h1 className="header-logo"><Icon type="code-sandbox" />联拓富商城 </h1>
            <div className="header-cont">
              <div className="header-menu">
                <ul className="nav">
                  {
                    this.state.commoditiesType.map((item, index) => (
                      <li key={index} onClick={this.toSearchDetail.bind(this, item.id)}>{item.goods_category_name}</li>
                    ))
                  }
                </ul>
              </div>
              <div className="search" style={{width: 300}}>
                <AutoComplete
                  dataSource={dataSource}
                  className="search-cont"
                  size="large"
                  value={this.state.searchContent}
                  onChange={this.getSearchContent}
                  placeholder="搜索商品"
                  style={{width: '100%'}}
                ><Input suffix={(<Button className="search-btn" size="large" type="primary" onClick={this.toSearchDetail.bind(this, null)}><Icon type="search" /></Button>)} />
                </AutoComplete>
              </div>
            </div>
          </div>
        </header>
        <section className="container">
          <Route exact path="/" component={commodities} />
          <Route path="/searchDetail" component={searchDetail} />
          <Route path="/commoditiesDetail" component={commoditiesDetail} />
          <Route path="/generateOrder" component={generateOrder} />
          <Route path="/cashier" component={cashier} />
          <Route path="/successfulPayment" component={successfulPayment} />
          <Route path="/orderList" component={orderList} />
          <Route path="/orderDetail" component={orderDetail} />
        </section>
        <div className="footer">
          ©2019 lianfutong.com
        </div>
      </div>
    );
  }
}
