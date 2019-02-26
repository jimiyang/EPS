import React, {Component} from 'react';
import {message, Input, Icon} from 'antd';
import './login.css';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: 'jrpt',
      userPwd: '111qqq',
      authCode: '',
      txtCode: ''
    };
  }

  //组件刚经历constructor,初始完数据,未渲染,dom还未渲染
  componentWillMount() {
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
    document.addEventListener('keydown', this.onKeyDown);
  }

  // 登录
  login() {
    const _this = this;
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
    window.api('eps.login', params).then(rs => {
      const obj = {
        login_name: _this.state.userName,
        partner_id: rs.partner_id,
        sign: ''
      };
      window.localStorage.setItem('head_params', JSON.stringify(obj));
      window.localStorage.setItem('checkLogin', '100');
      this.props.history.push({pathname: '/'});
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
        <div className="type">
          <a href="#" className="active">密码登录</a>
          <a href="#">扫码登录</a>
        </div>
        <ul className="user-info">
          <li>
            <Input
              placeholder="请输入用户名"
              prefix={<Icon type="user" style={{color: 'rgba(0,0,0,.25)'}} />}
              onChange={this.onChangeUserName}
              value={this.state.userName}
            />
          </li>
          <li>
            <Input.Password placeholder="请输入密码" value={this.state.userPwd} />
          </li>
          <li className="flex-blocks">
            <Input
              placeholder="请输入验证码"
              onChange={this.onChangeAuthName}
              className="auth-code"
              value={this.state.txtCode}
            />
            <span onClick={this.authCodeEvent.bind(this)} >{this.state.authCode}</span>
          </li>
          <li className="btn-submit">
            <input
              type="button"
              className="blue-btn"
              value="登录"
              onClick={this.loginInEvent.bind(this)}
            />
          </li>
        </ul>
      </div>
    );
  }
}
export default Login;
