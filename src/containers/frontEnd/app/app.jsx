import React, {Component} from 'react';
import {BrowserRouter, Route, Switch, Link, Redirect} from 'react-router-dom';
import {hashHistory} from 'react-router';
import {Breadcrumb, AutoComplete} from 'antd';
import commodities from '../commodities/commodities';
import searchDetail from '../searchDetail/searchDetail';
import commoditiesDetail from '../commoditiesDetail/commoditiesDetail';
import generateOrder from '../generateOrder/generateOrder';
import cashier from '../cashier/cashier';
import './app.less';

function IsLogin(props) {
  if (props.loginstate) {
    return <div><img src={require('../../../assets/logo.png')} /><p>刘玲一级代理商</p></div>;
  }
  return <div><p className="not">您还未登录，请登录</p></div>;
}

class App extends Component {
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
      <div id="frontEnd">
        <header id="header">
          <Breadcrumb itemRender={this.itemRender} routes={routes} />
          <div>
            <IsLogin loginstate={loginstate} />
            <span>|</span>
            <p className="myOrder">我的订单</p>
          </div>
        </header>
        <section id="search">
          <h1>联拓富新零售赋能平台</h1>
          <div className="search">
            <AutoComplete
              dataSource={dataSource}
              value={this.state.searchContent}
              onChange={this.getSearchContent}
            />
            <div onClick={this.toSearchDetail} className="searchButton">
              <img src={require('../../../assets/frontEnd/search.png')} />
            </div>
          </div>
        </section>
        <section id="content">
          <Route exact path="/" component={commodities} />
          <Route path="/searchDetail" params={this.state.searchContent} component={searchDetail} />
          <Route path="/commoditiesDetail" component={commoditiesDetail} />
          <Route path="/generateOrder" component={generateOrder} />
          <Route path="/cashier" component={cashier} />
        </section>
      </div>
    );
  }
}

export default App;
