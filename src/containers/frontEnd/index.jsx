import React, {Component} from 'react';
import {BrowserRouter, Route, Switch, Link} from 'react-router-dom';
import {hashHistory} from 'react-router';
import listOfCommodities from './listOfCommodities/listOfCommodities';
import searchDetail from './searchDetail/searchDetail';
import './index.less';

function IsLogin(props) {
  if (props.loginstate) {
    return <div><img src={require('../../assets/logo.png')} /><p>刘玲一级代理商</p></div>;
  }
  return <div><p className="not">您还未登录，请登录</p></div>;
}

class Index extends Component {
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
  // 获取搜索框内容
  getSearchContent = (e) => {
    e.target.value !== this.state.searchContent ? this.setState({searchContent: e.target.value, canSearch: true}) : null;
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
    return (
      <div id="frontEnd">
        <header id="header">
          <ul>
            <li onClick={this.toHome}>首页</li>
          </ul>
          <div>
            <IsLogin loginstate={loginstate} />
            <span>|</span>
            <p className="myOrder">我的订单</p>
          </div>
        </header>
        <section id="search">
          <h1>联拓富新零售赋能平台</h1>
          <div className="search">
            <input type="text" onChange={this.getSearchContent} value={this.state.searchContent} />
            <div onClick={this.toSearchDetail}>
              <img src={require('../../assets/frontENd/search.png')} />
            </div>
          </div>
        </section>
        <section>
          <Route path="/listOfCommodities" component={listOfCommodities} />
          <Route exact path="/" component={listOfCommodities} />
          <Route path="/searchDetail" params={this.state.searchCOntent} component={searchDetail} />
        </section>
      </div>
    );
  }
}

export default Index;
