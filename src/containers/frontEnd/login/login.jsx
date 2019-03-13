import React, {Component} from 'react';
import {message, Input, Icon, Button} from 'antd';
import './login.less';
import aes from '../../../api/aes/public';
import common from '../../../utils/common.js';


class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: '', // dlsy_test128 ptdls1 jrpt
      userPwd: '',
      authCode: '',
      txtCode: ''
    };
  }

  //组件刚经历constructor,初始完数据,未渲染,dom还未渲染
  componentWillMount() {
    this.getKey();
    this.setState({
      authCode: window.common.createCode()
    });
  }

  //组件渲染完成
  componentDidMount() {
    //注册keydown事件
    document.addEventListener('keydown', this.onKeyDown);
  }

  //组件销毁
  componentWillUnmount() {
    document.removeEventListener('keydown', this.onKeyDown);
  }

  getKey() {
    const query = this.props.location.search;
    if (query) {
      const key = common.getQueryString(query).key;
      const res = JSON.parse(aes.Decrypt(key));
      this.loginCallback(res);
    }
  }
  loginCallback(res) {
    window.localStorage.setItem('fullName', res.full_name);
    window.localStorage.setItem('PKEY', res.partner_key);
    window.localStorage.setItem('identity', res.identity);
    const headParams = {
      login_name: res.login_name,
      partner_id: res.partner_id,
    };
    window.localStorage.setItem('headParams', JSON.stringify(headParams));
    if (res.identity === 0) {
      this.props.history.push({pathname: '/main'});
    } else {
      this.props.history.push({pathname: '/'});
    }
  }
  // 登录
  login() {
    if (this.state.userName === '' || this.state.userPwd === '') {
      message.error('请输入用户名或密码');
      return false;
    }
    if (this.state.txtCode === '') {
      message.error('验证码不能为空，请输入验证码');
      return false;
    } else if (this.state.txtCode !== this.state.authCode) {
      message.error('验证码输入不一致');
      return false;
    }
    const params = {
      login_name: this.state.userName,
      login_pwd: this.state.userPwd
    };
    window.api('eps.login', params).then(res => {
      this.loginCallback(res);
    }).catch(error => {
      message.error(error);
    });
  }
  onKeyDown = (e) => {
    if (e.keyCode === 13) {
      this.login();
    }
  }
  onChangeUserName = (e) => {
    this.setState({
      userName: e.target.value
    });
  }
  onChangeUserPwd = (e) => {
    this.setState({
      userPwd: e.target.value
    });
  }
  onChangeAuthName = (e) => {
    this.setState({
      txtCode: e.target.value.toUpperCase()
    });
  }
  authCodeEvent = (e) => {
    this.setState({
      authCode: window.common.createCode()
    });
  }
  //登录
  loginInEvent = () => {
    this.login();
  }
  render() {
    return (
      <div className="login-blocks">
        <h2>联富通商城</h2>
        <ul className="user-info">
          <li>
            <Input
              placeholder="请输入用户名"
              size="large"
              prefix={
                <Icon type="user" />
              }
              onChange={this.onChangeUserName}
              value={this.state.userName}
            />
          </li>
          <li>
            <Input.Password
              placeholder="请输入密码"
              size="large"
              prefix={
                <Icon type="lock" />
              }
              onChange={this.onChangeUserPwd}
              value={this.state.userPwd}
            />
          </li>
          <li>
            <Input
              placeholder="请输入验证码"
              size="large"
              onChange={this.onChangeAuthName}
              value={this.state.txtCode}
              addonAfter={this.state.authCode}
            />
          </li>
          <li className="btn-submit">
            <Button
              type="primary"
              size="large"
              onClick={this.loginInEvent.bind(this)}
              block
            >
              登录
            </Button>
          </li>
        </ul>
      </div>
    );
  }
}
export default Login;
