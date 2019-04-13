import React, {Component} from 'react';
import {message, Input, Icon, Button} from 'antd';
import './login.less';
import aes from '../../../api/aes/public';
import common from '../../../utils/common.js';


class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: 'csdls', // dlsy_test128 ptdls1 jrpt 登录名
      userPwd: '111qqq', // 登录密码
      authCode: '', // 显示的验证码
      txtCode: '', // 输入的验证码
    };
  }

  //组件刚经历constructor,初始完数据,未渲染,dom还未渲染
  componentWillMount() {
    this.getKey();
    this.setState({authCode: window.common.createCode()});
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

  // 从其他渠道进入login，直接获取登录信息登录
  getKey = () => {
    const query = this.props.location.search;
    if (query) {
      const key = common.getQueryString(query).key;
      const res = JSON.parse(aes.Decrypt(key));
      this.loginCallback(res);
    }
  }

  // 登陆后的处理
  loginCallback = (res) => {
    const headParams = {login_name: res.login_name, partner_id: res.partner_id};
    window.localStorage.setItem('fullName', res.full_name);
    window.localStorage.setItem('PKEY', res.partner_key);
    window.localStorage.setItem('identity', res.identity);
    window.localStorage.setItem('headParams', JSON.stringify(headParams));
    const url = res.identity === 0 ? '/main' : '/';
    this.props.history.push({pathname: url});
  }

  // 登录
  login = () => {
    const {
      userName, userPwd, txtCode, authCode
    } = this.state;
    if (!userName) {
      message.error('请输入用户名');
      return;
    }
    if (!userPwd) {
      message.error('请输入密码');
      return;
    }
    if (!txtCode) {
      message.error('验证码不能为空，请输入验证码');
      return;
    } else if (txtCode !== authCode) {
      message.error('验证码输入不一致');
      return;
    }
    const params = {
      login_name: userName,
      login_pwd: userPwd
    };
    window.api('eps.login', params).then(res => {
      this.loginCallback(res);
    }).catch(error => {
      message.error(error.service_error_message);
    });
  }

  // 按enter键登录
  onKeyDown = (e) => {
    e.keyCode === 13 ? this.login() : null;
  }

  // 变更登录信息
  changeInfo = (type, e) => {
    let value = e.target.value;
    type === 'txtCode' ? value = value.toUpperCase() : null;
    this.setState({[type]: value});
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
              onChange={this.changeInfo.bind(this, 'userName')}
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
              onChange={this.changeInfo.bind(this, 'userPwd')}
              value={this.state.userPwd}
            />
          </li>
          <li>
            <Input
              placeholder="请输入验证码"
              size="large"
              onChange={this.changeInfo.bind(this, 'txtCode')}
              value={this.state.txtCode}
              addonAfter={this.state.authCode}
            />
          </li>
          <li className="btn-submit">
            <Button
              type="primary"
              size="large"
              onClick={this.login}
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
