import React, {Component} from 'react';
import {Layout, Menu, Upload, message, Icon} from 'antd';
import {
  BrowserRouter as Router,
  Route,
  Link,
} from 'react-router-dom';
import './main.less';

const {
  Header, Sider, Content,
} = Layout;
class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      login_name: ''
    };
  }
  componentWillMount() {
    //验证是否需要登录
    window.common.loginOut(this, message);
    if (JSON.parse(window.localStorage.getItem('headParams')) !== null) {
      this.setState({
        login_name: JSON.parse(window.localStorage.getItem('headParams')).login_name
      });
    }
  }
  loginOutEvent = () => {
    window.api('eps.logout', {login_name: this.state.login_name}).then(rs => {
      if (rs.service_status === 'S') {
        this.props.history.push({pathname: '/login'});
      }
    });
  }
  render() {
    return (
      <Layout>
        <Header className="header">
          <div className="header-logo">联拓富新零售赋能平台</div>
          <div className="header-person">
            <label>当前用户：{this.state.login_name}</label>
            <span onClick={this.loginOutEvent}>退出登录</span>
          </div>
        </Header>
        <Layout>
          <Sider>
            <Menu mode="inline" style={{height: '100%', borderRight: 0}}>
              <Menu.Item key="1"><Icon type="appstore" /><span><Link to="/main/list">商品管理</Link></span></Menu.Item>
              <Menu.Item key="2"><Icon type="folder" /><span><Link to="/main/deliverylist">发货订单管理</Link></span></Menu.Item>
              <Menu.Item key="3"><Icon type="project" /><span><Link to="/main/typelist">商品类型管理</Link></span></Menu.Item>
            </Menu>
          </Sider>
          <Content className="main-content">
            <div style={{margin: 24, padding: 20, background: '#fff'}}>{this.props.children}</div>
          </Content>
        </Layout>
      </Layout>
    );
  }
}
export default Main;
