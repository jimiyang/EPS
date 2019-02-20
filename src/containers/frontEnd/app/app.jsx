import React, {Component} from 'react';
import {BrowserRouter, Route, Switch, Link, Redirect} from 'react-router-dom';
import {hashHistory} from 'react-router';
import {Breadcrumb, AutoComplete, Icon, Input, Button} from 'antd';
import commodities from '../commodities/commodities';
import searchDetail from '../searchDetail/searchDetail';
import commoditiesDetail from '../commoditiesDetail/commoditiesDetail';
import generateOrder from '../generateOrder/generateOrder';
import './app.less';

function IsLogin(props) {
  return props.loginstate ? <div className="header-user"><img src={require('../../../assets/logo.png')} /><p>刘玲一级代理商</p></div> : <div><p className="not">您还未登录，请登录</p></div>;
}

export default class App extends Component {
  constructor() {
    super();
    this.state = {
      loginstate: true, // 0 未登录 1 已登录
      canSearch: false, // 是否能够搜索
      searchContent: '', // 搜索的内容
    };
  }
  toHome = () => {
    this.props.history.push('/');
  }
  // 登出
  logout = () => {
    this.setState({loginstate: !this.state.loginstate});
  }
  itemRender = (route, params, routes, paths) => {
    const last = routes.indexOf(route) === routes.length - 1;
    return last ? <span>{route.breadcrumbName}</span> : <Link to={paths.join('/')}>{route.breadcrumbName}</Link>;
  }
  // 获取搜索框内容
  getSearchContent = (value) => {
    value !== this.state.searchContent ? this.setState({searchContent: value, canSearch: true}) : null;
  }
  // 跳转到搜索页
  toSearchDetail = () => {
    if (this.state.canSearch) {
      this.props.history.push(`/searchDetail/${this.state.searchContent}`);
      this.setState({canSearch: false});
    }
  }
  render() {
    const {loginstate} = this.state;
    const dataSource = ['12345', '23456', '34567'];
    const routes = [{
      path: 'index',
      breadcrumbName: '首页'
    }, {
      path: 'first',
      breadcrumbName: '一级面包屑'
    }, {
      path: 'second',
      breadcrumbName: '当前页面'
    }];
    return (
      <div className="page">
        <div className="header-bar">
          <div className="container">
            <div className="header-bar-nav">
              <div>首页</div>
              <div>其他入口</div>
              <div>其他链接</div>
              <div>MS系统</div>
            </div>
            <div className="header-tool">
              <IsLogin loginstate={loginstate} />  <div className="header-order"><Icon type="file-text" />我的订单</div>
            </div>
          </div>
        </div>
        <header className="header">
          <div className="container header-container">
            <h1 className="header-logo"><Icon type="code-sandbox" />联拓富商城 </h1>
            <div className="header-cont">
              <div className="header-menu">
                <div className="nav">
                  <div>首页</div>
                  <div>商品分类1</div>
                  <div>商品分类2</div>
                  <div>我的订单</div>
                </div>
              </div>
              <div className="search" style={{ width: 300 }}>
                <AutoComplete
                  dataSource={dataSource}
                  className="search-cont"
                  size="large"
                  value={this.state.searchContent}
                  onChange={this.getSearchContent}
                  placeholder="搜索商品"
                  style={{ width: '100%' }}
                ><Input suffix={(<Button className="search-btn" size="large" type="primary" ><Icon type="search" /></Button>)} />
                </AutoComplete>
              </div>
            </div>
          </div>
        </header>
        <section className="container">
          <Route exact path="/" component={commodities} />
          <Route path="/searchDetail" params={this.state.searchContent} component={searchDetail} />
          <Route path="/commoditiesDetail" component={commoditiesDetail} />
          <Route path="/generateOrder" component={generateOrder} />
        </section>
        <div className="footer">
          ©2019 lianfutong.com
        </div>
      </div>
    );
  }
}
