import React, {Component} from 'react';
import {Redirect} from 'react-router';
import {connect} from 'react-redux';
import {message, AutoComplete, Icon, Input, Button, Modal} from 'antd';
// 路由
import './app.less';
import {changeSearchDetail} from '../../../store/reduces/frontEnd';

function IsLogin(props) {
  return props.fullName ? <div className="headers-user"><p>{props.fullName}</p></div> : <div><p className="not">您还未登录，请登录</p></div>;
}
@connect(
  (state) => (state),
  {changeSearchDetail},
)
export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchContent: '', // 搜索的内容
      dataSource: [], // 搜索列表
      goodsType: ['软件', '硬件'], // 商品类型列表
      type: null, // 查询类型
      id: 'null', // property或category
      ModalText: '是否登出当前账户？',
      visible: false,
      confirmLoading: false,
      fullName: null, // 用户名
      redirect: false,
    };
  }

  componentWillMount() {
    if (window.common.loginOut(this)) {
      if (!window.localStorage.getItem('PKEY')) {
        this.props.history.push('/login');
      } else {
        const list = window.localStorage.getItem('dataSource');
        const dataSource = list !== null ? JSON.parse(list) : [];
        const fullName = window.localStorage.getItem('fullName');
        this.setState({dataSource, fullName});
      }
    }
  }

  componentWillReceiveProps(props) {
    let info = {};
    if (props.location.pathname === '/searchDetail') {
      info = props.location.state;
    } else {
      info = {id: null, type: null, searchContent: null};
    }
    this.setState(info);
  }

  // 跳转到指定页面
  link = (link) => {
    if (this.props.location.pathname !== link) {
      this.props.history.push(link);
    }
  }

  // 跳转到搜索页
  toSearchDetail = (type, id, searchContent) => {
    const info = {type, id, searchContent};
    const {dataSource} = this.state;
    if (type === 'search') {
      if (searchContent !== '') { // 获取下拉列表
        const list = dataSource;
        const index = dataSource.indexOf(searchContent);
        list.unshift(searchContent);
        if (index !== -1) {
          list.splice(index + 1, 1);
        } else {
          list.length > 5 ? list.splice(list.length - 1, 1) : null;
        }
        window.localStorage.setItem('dataSource', JSON.stringify(list));
      }
    }
    this.setState(info);
    this.props.changeSearchDetail(info);
    this.props.history.push('/searchDetail', info);
  }

  // 登出
  logout = () => {
    this.setState({ModalText: '登出中,请稍后...', confirmLoading: true});
    const loginName = JSON.parse(window.localStorage.getItem('headParams')).login_name;
    const params = {login_name: loginName};
    window.api('eps.logout', params).then(res => {
      message.success('已登出');
      this.setState({visible: false, confirmLoading: false, ModalText: '是否登出当前账户？'});
      window.localStorage.clear();
      this.props.history.push('/login');
    }).catch((error) => {
      error.service_error_code === 'EPS000000801' ? this.setState({redirect: true}) : null;
      message.error(error.service_error_message);
    });
  }

  // 空值Modal
  changeModal = () => {
    this.setState({visible: !this.state.visible});
  }

  // 获取搜索框内容
  getSearchContent = (value) => {
    value !== this.state.searchContent ? this.setState({searchContent: value}) : null;
  }

  render() {
    const {
      redirect, dataSource, searchContent, visible, confirmLoading, ModalText, goodsType, id, fullName, type
    } = this.state;
    if (redirect) return (<Redirect to="/login" />);
    return (
      <div className="page">
        <div className="headers-bar">
          <div className="container">
            <div className="headers-bar-nav">
              <div onClick={this.link.bind(this, '/')}>首页</div>
              <div onClick={this.link.bind(this, '/orderList')}>我的订单</div>
              <div onClick={this.link.bind(this, '/deviceManagement')}>我的设备</div>
              <div onClick={this.changeModal}>登出</div>
            </div>
            <div className="headers-tool">
              <IsLogin fullName={fullName} />
            </div>
          </div>
        </div>
        <header className="headers">
          <div className="container headers-container">
            <h1 className="headers-logo" onClick={this.toHome}><Icon type="code-sandbox" />联拓富商城 </h1>
            <div className="headers-cont">
              <ul className="headers-menu">
                {
                  goodsType.map((item, index) => (
                    <li className={type === 'property' && index + 1 === id ? 'isChecked' : null} key={index} onClick={this.toSearchDetail.bind(this, 'property', Number(index + 1), '')}>{item}</li>
                  ))
                }
              </ul>
              <div className="search" style={{width: 300}}>
                <AutoComplete
                  dataSource={dataSource}
                  className="search-cont"
                  size="large"
                  value={searchContent}
                  onChange={this.getSearchContent}
                  placeholder="搜索商品"
                  style={{width: '100%'}}
                ><Input suffix={(<Button className="search-btn" size="large" type="primary" onClick={this.toSearchDetail.bind(this, 'search', 0, searchContent)}><Icon type="search" /></Button>)} />
                </AutoComplete>
              </div>
            </div>
          </div>
        </header>
        <section className="container">{this.props.children}</section>
        <div className="footer">
          ©2019 lianfutong.com
        </div>
        <div>
          <Modal
            visible={visible}
            onOk={this.logout}
            confirmLoading={confirmLoading}
            onCancel={this.changeModal}
          >
            <p>{ModalText}</p>
          </Modal>
        </div>
      </div>
    );
  }
}
