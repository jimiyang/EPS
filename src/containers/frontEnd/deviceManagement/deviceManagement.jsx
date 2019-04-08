import React, {Component} from 'react';
import {Tabs, Input, message, Modal, Empty} from 'antd';
import {Redirect} from 'react-router';
import './deviceManagement.less';

const TabPane = Tabs.TabPane;
const Search = Input.Search;

class DeviceManagement extends Component {
  state = {
    visible: false, // 是否显示modal
    list: [], // 设备列表
    confirmLoading: false,
  }

  componentWillMount() {
    if (window.common.loginOut(this)) {
      console.log('deviceManagement');
    } else {
      message.error('登录信息失效，请重新登录');
    }
  }

  // 获取设备列表
  getDeviceList = () => {

  }

  // 打开取消窗口
  showModal = () => {
    this.setState({visible: true});
  }

  // 关闭取消窗口
  handleCancel = () => {
    this.setState({visible: false});
  }

  render() {
    const {
      redirect, list, loadMore, loadText, visible, confirmLoading, ModalText
    } = this.state;
    if (redirect) return (<Redirect to="/login" />);
    return (
      <div id="deviceManagement">
        <section className="top">
          <Search
            className="searchInput"
            placeholder="商品名称/sn码"
            enterButton="搜索"
            size="default"
            onSearch={this.toOrderDetail}
          />
        </section>
        <section className="content">
          <ul className="status">
            <li style={{width: '450px'}}>商品名称</li>
            <li style={{width: '200px'}}>sn码</li>
            <li style={{width: '120px'}}>绑定状态</li>
            <li style={{width: '185px'}}>商户编号/商户名称</li>
            <li style={{width: '120px'}}>激活状态</li>
            <li style={{width: '120px'}}>操作</li>
          </ul>
        </section>
        <section className="pagination" hidden={list.length === 0}>
          {
            loadMore ? <button onClick={this.getDeviceList.bind(this)}>{loadText}</button> : <button>{loadText}</button>
          }
        </section>
        <section className="default" hidden={list.length > 0}>
          <Empty />
        </section>
        <div>
          <Modal
            visible={visible}
            onOk={this.cancelOrder}
            confirmLoading={confirmLoading}
            onCancel={this.handleCancel}
          >
            <p>{ModalText}</p>
          </Modal>
        </div>
      </div>
    );
  }
}

export default DeviceManagement;
