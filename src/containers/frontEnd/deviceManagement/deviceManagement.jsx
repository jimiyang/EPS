import React, {Component} from 'react';
import {Pagination, Input, message, Modal, Empty, Select} from 'antd';
import {Redirect} from 'react-router';
import './deviceManagement.less';
import utils from '../../../utils/common';

const Option = Select.Option;
const Search = Input.Search;

class DeviceManagement extends Component {
  state = {
    visible: false, // 是否显示modal
    list: [], // 设备列表
    total: 0, // 总条目数
    confirmLoading: false,
    currentPage: 1,
    searchType: undefined, // 搜索类型
    searchContent: '', // 搜索内容
    bindStatus: undefined, // 绑定状态
    activateStatus: undefined, // 激活状态
  }

  componentWillMount() {
    if (window.common.loginOut(this)) {
      this.getDeviceList(1);
    } else {
      message.error('登录信息失效，请重新登录');
    }
  }

  // 获取设备列表
  getDeviceList = (page) => {
    const {
      searchContent, searchType, bindStatus, activateStatus
    } = this.state;
    let params = {
      page_size: 10,
      current_page: page,
      [searchType]: searchContent,
      bind_status: bindStatus,
      activate_status: activateStatus
    };
    params = utils.dealElement(params);
    window.api('eps.getordergoodsmanager', params).then(res => {
      this.setState({list: res.order_goods_manager_list, total: res.total_result, currentPage: page});
    });
  }

  // 翻页
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

  // 搜索订单
  searchDevice = async (value) => {
    const {searchType} = this.state;
    if (!searchType && value !== '') {
      message.warn('请选择搜索类型');
      return;
    }
    await this.setState({searchContent: value});
    this.getDeviceList(1);
  }

  // 改变下拉框
  changeSelect = async (type, value) => {
    await this.setState({[type]: value});
    type !== 'searchType' ? this.getDeviceList(1) : null;
  }

  // 打开详情
  openDetail = () => {
    console.log(1);
  }

  render() {
    const {
      redirect, list, currentPage, visible, ModalText, confirmLoading, total
    } = this.state;
    if (redirect) return (<Redirect to="/login" />);
    return (
      <div id="deviceManagement">
        <section className="top">
          <Select
            style={{width: '150px', marginRight: '15px'}}
            placeholder="请选择搜索类型"
            onChange={this.changeSelect.bind(this, 'searchType')}
          >
            <Option value="goods_name">商品名称</Option>
            <Option value="device_sn">sn码</Option>
          </Select>
          <Search
            className="searchInput"
            placeholder="请输入"
            enterButton="搜索"
            size="default"
            onSearch={this.searchDevice}
          />
        </section>
        <section className="content">
          <ul className="status">
            <li style={{width: '250px'}}>商品名称</li>
            <li style={{width: '200px'}}>sn码</li>
            <li>
              <Select
                style={{width: '100px', marginRight: '15px'}}
                defaultValue="绑定状态"
                onChange={this.changeSelect.bind(this, 'bindStatus')}
              >
                <Option className="statusOption" value="">绑定状态</Option>
                <Option className="statusOption" value="1">已绑定</Option>
                <Option className="statusOption" value="2">未绑定</Option>
              </Select>
            </li>
            <li style={{width: '350px'}} className="coreCode">
              <p>商户编号/商户名称</p>
              <p>门店编号/门店名称</p>
            </li>
            <li>
              <Select
                style={{width: '100px', marginRight: '15px'}}
                defaultValue="激活状态"
                onChange={this.changeSelect.bind(this, 'activateStatus')}
              >
                <Option className="statusOption" value="">激活状态</Option>
                <Option className="statusOption" value="1">未激活</Option>
                <Option className="statusOption" value="2">激活中</Option>
                <Option className="statusOption" value="3">已激活</Option>
              </Select>
            </li>
            <li>操作</li>
          </ul>
          <ul className="deviceList">
            {
              list.map((item, index) => (
                <li key={index}>
                  <p style={{width: '250px', fontSize: '16px'}}>{item.goods_name}</p>
                  <p style={{width: '200px'}}>{item.device_sn}</p>
                  <p>{item.bind_status === '1' ? '绑定' : '未绑定'}</p>
                  <div style={{width: '350px'}} className="coreCode">
                    <p hidden={!item.bind_core_merchant_code}>{item.bind_core_merchant_code}/{item.bind_core_merchant_name}</p>
                    <p hidden={!item.bind_merchant_code}>{item.bind_merchant_code}/{item.bind_merchant_name}</p>
                  </div>
                  {
                    item.activate_status === '1' ? <p>未激活</p> : <p>{item.activate_status === '2' ? '激活中' : '未激活'}</p>
                  }
                  <div className="operation">
                    {
                      item.bind_status === '1' ? (
                        <div>
                          <p onClick={this.openDetail.bind(this)}>详情</p>
                          <p>解绑</p>
                        </div>
                      ) : null
                    }
                  </div>
                </li>
              ))
            }
          </ul>
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
