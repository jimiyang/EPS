import React, {Component} from 'react';
import {Layout, Menu, Upload, message} from 'antd';
import {
  BrowserRouter as Router,
  Route,
  Link,
} from 'react-router-dom';

import './main.css';

import List from '../productManagement/list';

import DeliveryList from '../deliveryMangement/deliverylist';

import TypeList from '../productType/typelist';

import addGoods from '../productManagement/addGoods';

const {
  Header, Sider, Content,
} = Layout;
class Main extends Component {
  componentWillMount() {
    //验证是否需要登录
    window.common.loginOut(this, message);
  }
  render() {
    return (
      <Layout className="main-blocks">
        <Header>
          联拓富新零售赋能平台
          <div>
            <Link to="/login">退出登录</Link>
          </div>
        </Header>
        <Layout>
          <Sider>
            <Menu mode="inline">
              <Menu.Item key="1"><Link to="/main/list">商品管理</Link></Menu.Item>
              <Menu.Item key="2"><Link to="/main/deliverylist">发货订单管理</Link></Menu.Item>
              <Menu.Item key="3"><Link to="/main/typelist">商品类型管理</Link></Menu.Item>
            </Menu>
          </Sider>
          <Content className="main-content">
            <Route path="/main/list" component={List} />
            <Route path="/main/deliverylist" component={DeliveryList} />
            <Route path="/main/typelist" component={TypeList} />
            <Route path="/main/addGoods" component={addGoods} />
          </Content>
        </Layout>
      </Layout>
    );
  }
}
export default Main;

