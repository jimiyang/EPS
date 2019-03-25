import React, {Component} from 'react';
import {Layout, Menu, Upload, message, Icon} from 'antd';
import {
  BrowserRouter as Router,
  Route,
  Link,
} from 'react-router-dom';
import {Redirect} from 'react-router';
import './main.less';

const {
  Header, Sider, Content,
} = Layout;
class Main extends Component {
  constructor(props) {
    super(props);
    this.state = {
      redirect: false,
      login_name: ''
    };
  }
  componentWillMount() {
    //验证是否需要登录
    if (window.common.loginOut(this)) {
      if (JSON.parse(window.localStorage.getItem('headParams')) !== null) {
        this.setState({
          login_name: JSON.parse(window.localStorage.getItem('headParams')).login_name
        });
      }
    } else {
      message.error('登录信息失效，请重新登录');
    }
  }
  loginOutEvent = () => {
    window.api('eps.logout', {login_name: this.state.login_name}).then(res => {
      if (res.service_status === 'S') {
        this.props.history.push({pathname: '/login'});
      }
    }).catch((error) => {
      if (error.service_error_code === 'EPS000000801') {
        this.setState({redirect: true});
      }
      message.error(error.service_error_message);
    });
    window.localStorage.clear();
  }
  render() {
    const menuData = [
      {name: '商品管理', url: '/main/list', icon: 'appstore'},
      {name: '发货订单管理', url: '/main/deliverylist', icon: 'folder'},
      {name: '商品类型管理', url: '/main/typelist', icon: 'project'}
    ];
    if (this.state.redirect) {
      return (<Redirect to="/login" />);
    }
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
              {
                menuData.map((item, index) => (
                  (
                    <Menu.Item key={index}><Link to={item.url}><Icon type={item.icon} />{item.name}</Link></Menu.Item>
                  )
                ))
              }
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
