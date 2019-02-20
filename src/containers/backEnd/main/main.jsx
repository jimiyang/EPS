import React, {Component} from 'react';

import {Layout, Menu, message} from 'antd';

import {
  BrowserRouter as Router,
  Route,
  Link,
} from 'react-router-dom';

import './main.css';

import List from '../productManagement/list';

import DeliveryList from '../deliveryMangement/deliverylist';

import TypeList from '../productType/typelist';

import AddPro from '../productManagement/addPro';

//const SubMenu = Menu.SubMenu;
const {SubMenu} = Menu;
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
          采购平台-管理后台
          <div>
            <Link to="/login">退出登录</Link>
          </div>
        </Header>
        <Layout>
          <Sider>
            <Menu mode="inline">
              <Menu.Item key="1"><Link to="/list">商品管理</Link></Menu.Item>
              <Menu.Item key="2"><Link to="/deliverylist">发货订单管理</Link></Menu.Item>
              <Menu.Item key="3"><Link to="/typelist">商品类型管理</Link></Menu.Item>
            </Menu>
          </Sider>
          <Content className="main-content">
            <Route path="/list" component={List} />
            <Route path="/deliverylist" component={DeliveryList} />
            <Route path="/typelist" component={TypeList} />
            <Route path="/addPro" component={AddPro} />
          </Content>
        </Layout>
      </Layout>
    );
  }
}
export default Main;

