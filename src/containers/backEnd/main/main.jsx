import React, {Component} from 'react';

import {Layout, Menu, Icon} from 'antd';

import {
  BrowserRouter as Router,
  Route,
  Link,
} from 'react-router-dom';

import './main.css';

import List from '../productManagement/list';

import DeliveryList from '../deliveryMangement/deliverylist';

import TypeList from '../productType/typelist';

import Addition from '../employeesMangement/add';

import EmployessList from '../employeesMangement/employesslist';

import employessDetaile from '../employeesMangement/detaile';//员工详情

import AddPro from '../productManagement/addPro';

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
              <Menu.Item key="1"><Link to="/list">商品管理</Link></Menu.Item>
              <Menu.Item key="2"><Link to="/deliverylist">发货订单管理</Link></Menu.Item>
              <Menu.Item key="3"><Link to="/typelist">商品类型管理</Link></Menu.Item>
              <SubMenu key="sub1" title={<span>员工管理</span>}>
                <Menu.Item key="5"><Link to="/employesslist">员工管理</Link></Menu.Item>
                <Menu.Item key="4"><Link to="/add">添加员工</Link></Menu.Item>
              </SubMenu>
            </Menu>
          </Sider>
          <Content className="main-content">
            <Route path="/list" component={List} />
            <Route path="/deliverylist" component={DeliveryList} />
            <Route path="/typelist" component={TypeList} />
            <Route path="/add" component={Addition} />
            <Route path="/employesslist" component={EmployessList} />
            <Route path="/detaile" component={employessDetaile} />
            <Route path="/addPro" component={AddPro} />
          </Content>
        </Layout>
      </Layout>
    );
  }
}
export default Main;

