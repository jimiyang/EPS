import React, {Component} from 'react';
import {Pagination, Tabs, Input, message, Modal, Empty} from 'antd';
import {Redirect} from 'react-router';
import './deviceManagement.less';

const TabPane = Tabs.TabPane;
const Search = Input.Search;

class DeviceManagement extends Component {
  state = {
    visible: false, // 是否显示modal
    list: [], // 设备列表
    total: 0, // 总条目数
    confirmLoading: false,
    currentPage: 1,
  }

  componentWillMount() {
    if (window.common.loginOut(this)) {
      this.getDeviceList(this.state.currentPage);
    } else {
      message.error('登录信息失效，请重新登录');
    }
  }

  // 获取设备列表
  getDeviceList = (page) => {
    const params = {
      page_size: 10,
      current_page: page,
    };
    window.api('eps.getordergoodsmanager', params).then(res => {
      console.log(res);
      this.setState({list: res.order_goods_manager_list, total: res.total_result});
    });
  }

  changePage = (page) => {
    this.getDeviceList(page);
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
      redirect, list, currentPage, visible, ModalText, confirmLoading, total
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
          {/* <ul>
            {
              list.map((item, index) => (
                <li>
                  <img src={item.} alt=""/>
                </li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
                <li></li>
              ))
            }
          </ul> */}
        </section>
        <section className="pagination" hidden={Number(total) === 0}>
          <Pagination
            showQuickJumper
            showSizeChange
            current={currentPage}
            defaultCurrent={1}
            defaultPageSize={10}
            total={total}
            onChange={this.changePage}
          />
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
