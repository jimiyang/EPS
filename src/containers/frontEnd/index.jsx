import React, {Component} from 'react';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import listOfCommodities from './listOfCommodities/listOfCommodities';
import searchDetail from './searchDetail/searchDetail';
import './index.less';

class Index extends Component {
  state = {
  }
  componentWillMount() {
  }
  toSearchDetail = () => {
    this.props.history.push('/searchDetail');
  }
  render() {
    return (
      <div id="frontEnd">
        <header id="header">
          <ul>
            <li>首页</li>
          </ul>
          <div>
            <img src={require('../../assets/logo.png')} />
            <p>刘玲一级代理商</p>
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
          <Route path="/searchDetail" component={searchDetail} />
        </section>
      </div>
    );
  }
}

export default Index;
