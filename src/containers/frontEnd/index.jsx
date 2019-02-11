import React, {Component} from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
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
    };
  }
  componentWillMount() {
  }
  toSearchDetail = () => {
    this.props.history.push('/index/searchDetail');
  }
  logout = () => {
    this.setState({loginstate: !this.state.loginstate});
  }
  render() {
    const {loginstate} = this.state;
    return (
      <div id="frontEnd">
        <header id="header">
          <ul>
            <li>首页</li>
          </ul>
          <div>
            <IsLogin loginstate={loginstate} />
            <span>|</span>
            <p>我的订单</p>
          </div>
        </header>
        <section id="search">
          <h1>联拓富新零售赋能平台</h1>
          <input type="text" />
          <div onClick={this.toSearchDetail}>
            <img src={require('../../assets/frontENd/search.png')} />
          </div>
        </section>
        <section>
          <Route path="/index/listOfCommodities" component={listOfCommodities} />
          <Route path="/index/searchDetail" component={searchDetail} />
        </section>
      </div>
    );
  }
}

export default Index;
