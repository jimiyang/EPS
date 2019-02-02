import React, {Component} from 'react';

import {Layout, Menu, Icon} from 'antd';

import {
  BrowserRouter as Router,
  Route,
  Link,
} from 'react-router-dom';

import './main.css';

import Center from '../center';

console.log(Center);
//const SubMenu = Menu.SubMenu;
const {SubMenu} = Menu;
const {
  Header, Sider, Content,
} = Layout;

class Main extends Component {
  render() {
    return (
      <Layout className="main-blocks">
        <Header>采购平台-管理后台</Header>
        <Layout>
          <Sider>
            <Menu mode="inline">
              <Menu.Item key="1"><Link to="/center/list">商品管理</Link></Menu.Item>
              <Menu.Item key="2">发货订单管理</Menu.Item>
              <Menu.Item key="3">商品类型管理</Menu.Item>
              <SubMenu key="sub1" title={<span>员工管理</span>}>
                <Menu.Item key="4">员工管理</Menu.Item>
                <Menu.Item key="5">添加员工</Menu.Item>
              </SubMenu>
            </Menu>
          </Sider>
          <Content>
            <Route path="/center/list" component={Center} />
          </Content>
        </Layout>
      </Layout>
    );
  }
}
export default Main;

