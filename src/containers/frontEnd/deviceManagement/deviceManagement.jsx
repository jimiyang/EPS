import React, {Component} from 'react';
import {Pagination, Input, message, Modal, Empty, Select, Button} from 'antd';
import {Redirect} from 'react-router';
import './deviceManagement.less';
import utils from '../../../utils/common';
import Detail from '../../backEnd/facilityMangement/facilitydetail';
import api2 from '../../../api/api2';
import aes from '../../../api/aes/public';

const Option = Select.Option;
const Search = Input.Search;

class DeviceManagement extends Component {
  state = {
    visible: false, // 是否显示modal
    confirmLoading: false, // 确认loading
    modalText: '确认解除绑定当前设备？', // 弹窗内容
    isvisible: false, // 显示详情弹窗
    list: [], // 设备列表
    total: 0, // 总条目数
    deviceId: null, // 选中的设备id
    currentPage: 1, // 当前页数
    searchType: undefined, // 搜索类型
    searchContent: '', // 搜索内容
    bindStatus: undefined, // 绑定状态
    activateStatus: undefined, // 激活状态
    unbindDevice: null, // 解绑的设备详情
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
    }).catch(error => {
      error.service_error_code === 'EPS000000801' ? this.setState({redirect: true}) : null;
      message.error(error.service_error_message);
    });
  }

  // 翻页
  changePage = (page) => {
    this.getDeviceList(page);
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
  openDetail = (id) => {
    this.setState({deviceId: id, isvisible: true});
  }

  // 控制弹窗
  changeModal = async (type, value) => {
    let info = {};
    if (type === 'cancel') {
      info = value === 'detail' ? {isvisible: false} : {visible: false};
    } else {
      info = value === 'detail' ? {isvisible: true} : {visible: true, unbindDevice: value};
    }
    await this.setState(info);
  }

  // 获取和新商户key
  getPartnerIdKey = async () => {
    const item = this.state.unbindDevice;
    const requestNo = await window.common.getRequestNo(16);
    window.localStorage.setItem('platform_no', item.platform_no);
    window.localStorage.setItem('merchant_code', item.bind_core_merchant_code);
    window.localStorage.setItem('request_no', requestNo);
    const params = {
      out_request_no: requestNo, //随机生成
      core_merchant_no: item.bind_core_merchant_code //核心商户编号
    };
    api2.baseInstance('merchant.pidkeyquery', params).then(async (res) => {
      const key = aes.Decrypt(window.localStorage.getItem('PKEY'));
      await window.localStorage.setItem('partnerID', aes.Decrypt(res.partner_id_key, key));
      await this.unbind(item);
    }).catch(error => {
      message.error(error.message);
    });
  }

  // 解绑
  unbind = (item) => {
    const params = {
      out_trade_no: `EPSUNBIND${window.common.getRequestNo(10)}`, //商户请求单号(自动生成)
      merchant_no: item.bind_merchant_code, //门店编号
      identify_type: 'SN', //device_sn
      goods_id: item.goods_id, //商品goods_id
      device_sn: item.device_sn, //sn码
      operator_id: JSON.parse(window.localStorage.getItem('headParams')).login_name, //操作员登录人userName
      notify_url: (window.common.getUrl())[0] //
    };
    window.api('device.unbind', params).then(res => {
      message.success('解绑成功');
      this.getDeviceList(this.state.currentPage);
    }).catch(error => {
      message.error(error.message);
    });
    this.setState({visible: false});
  }

  render() {
    const {
      redirect, list, currentPage, visible, modalText, confirmLoading, total, isvisible, deviceId
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
                    item.activate_status === '1' ? <p>未激活</p> : <p>{item.activate_status === '2' ? '激活中' : '已激活'}</p>
                  }
                  <div className="operation">
                    {
                      item.bind_status === '1' ? (
                        <div>
                          <p onClick={this.openDetail.bind(this, item.id)}>详情</p>
                          <p onClick={this.changeModal.bind(this, 'open', item)}>解绑</p>
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
            onOk={this.getPartnerIdKey}
            confirmLoading={confirmLoading}
            onCancel={this.changeModal.bind(this, 'cancel')}
          >
            <p>{modalText}</p>
          </Modal>
          <Modal
            title="详情"
            visible={isvisible}
            onCancel={this.changeModal.bind(this, 'cancel', 'detail')}
            width="800px"
            footer={
              <Button onClick={this.changeModal.bind(this, 'cancel', 'detail')}>关闭</Button>
            }
          >
            <Detail id={deviceId} />
          </Modal>
        </div>
      </div>
    );
  }
}

export default DeviceManagement;
