import React, {Component} from 'react';
import {Input, Modal, AutoComplete, Button, Icon, Table, Popconfirm, message} from 'antd';
import {Redirect} from 'react-router';
import './style.less';
import AddSn from './addsn';
import utils from '../../../utils/common';

const {Option} = AutoComplete;
class InventoryList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuData: ['硬件', '软件'],
      isActive: 0,
      isLoading: false,
      addvisible: false,
      pagination: {
        page_size: 10,
        current: 1,
        total: '',
        onChange: this.changePage
      },
      id: null, // 要删除的库存的id
      goodsProperty: 2, // 2 硬件 1 软件
      goods_name: null, // 搜索的商品名称
      device_sn: null, // 搜索的sn码
      storageList: [], // 库存列表
      goodsNameData: [], // 商品名称模糊搜索
      snData: [] // sn码模糊搜索
    };
  }

  componentWillMount() {
    this.getStorageList(1, this.state.goodsProperty);
  }

  renderOption(item, index) {
    return (
      <Option key={item.name} text={item.name}>
        {item.name}
      </Option>
    );
  }

  // 获取库存列表
  getStorageList = (currentPage, property) => {
    let params = {
      page_num: 10,
      page_no: currentPage,
      goods_property: property,
      device_sn: this.state.device_sn,
      goods_name: this.state.goods_name,
      id: this.state.id,
    };
    params = utils.dealElement(params);
    window.api('storage.query', params).then(res => {
      const pagination = {
        page_size: 10,
        current: Number(currentPage),
        total: Number(res.count),
        onChange: this.changePage
      };
      this.setState({storageList: res.storage_list, isLoading: false, pagination});
    }).catch((error) => {
      if (error.service_error_code === 'EPS000000801') {
        this.setState({redirect: true});
      }
      message.error(error.service_error_message);
      this.setState({isLoading: false});
    });
  }

  // 删除库存
  delete = (id) => {
    window.api('storage.delete', {id}).then(() => {
      message.success('删除成功');
      this.getStorageList(this.state.pagination.current, this.state.goodsProperty);
    }).catch((error) => {
      if (error.service_error_code === 'EPS000000801') {
        this.setState({redirect: true});
      }
      message.error(error.service_error_message);
      this.setState({isLoading: false});
    });
  }

  // 改变tab的值
  async selTap(index) {
    const goodsProperty = index === 1 ? 1 : 2;
    await this.setState({
      goodsProperty, isActive: index, device_sn: '', goods_name: ''
    });
    this.getStorageList(1, goodsProperty);
  }

  // 按条件改变页面
  changePage = (page) => {
    page = page === 0 ? 1 : page;
    this.getStorageList(page, this.state.goodsProperty);
  }

  // 获取搜索信息
  getSearchInfo(type, value) {
    if (value === undefined) return;
    //value = value.replace(/\s/g, '');
    if (Object.prototype.toString.call(value) === '[Object String]' && value.test(/\s/g)) value = value.replace(/\s/g, '');
    this.setState({[type]: value});
  }

  // 打开新增品牌弹框
  operationDialog = (type) => {
    const addvisible = type === 'open' ? Boolean(1) : Boolean(0);
    this.setState({addvisible});
    type === 'operation' ? this.getStorageList(this.state.pagination.current, this.state.goodsProperty) : null;
  }

  render() {
    const {
      pagination, redirect, storageList, goodsProperty, addvisible, isActive, menuData, goodsNameData, snData, isLoading
    } = this.state;
    if (redirect) return (<Redirect to="/login" />);
    const otherColumn = goodsProperty === 2 ? [{
      title: '设备sn码',
      key: 'device_sn',
      dataIndex: 'device_sn'
    }] : [
      {
        title: 'license',
        key: 'device_sn',
        dataIndex: 'device_sn'
      },
      {
        title: '有效期限(天)',
        key: 'expiry_date',
        dataIndex: 'expiry_date'
      },
    ];
    const columns = [
      {
        title: '商品类型',
        key: 'goods_category_name',
        dataIndex: 'goods_category_name'
      },
      {
        title: '商品品牌',
        key: 'goods_brand_name',
        dataIndex: 'goods_brand_name'
      },
      {
        title: '商品名称',
        key: 'goods_name',
        dataIndex: 'goods_name'
      },
      ...otherColumn,
      {
        title: '设备唯一标识码',
        key: 'biz_tid',
        dataIndex: 'biz_tid'
      },
      {
        title: '状态',
        key: 'send_status',
        dataIndex: 'send_status',
        render: (status) => (
          <span>{Number(status) === 1 ? '已发货' : '待发货'}</span>
        ),
      },
      {
        title: '操作',
        dataIndex: '',
        key: 'operation',
        render: (record) => (
          <div className="opearte-blocks">
            <Popconfirm
              title="是否要删除？"
              onConfirm={() => this.delete(record.id)}
              okText="是"
              cancelText="否"
            >
              <span className="ml10">删除</span>
            </Popconfirm>
          </div>
        )
      }
    ];
    return (
      <div className="sn-blocks">
        {addvisible ? <Modal
          title="新增终端码"
          visible={addvisible}
          onCancel={this.operationDialog.bind(this, 'cancel')}
          footer={null}
        >
          <AddSn
            onClick={this.operationDialog.bind(this, 'cancel')}
            addtionBrandEvent={this.operationDialog.bind(this, 'operation')}
          />
        </Modal> : null}
        <div className="nav-items">
          <div className="tap-items">
            {
              menuData.map((item, index) => <span key={index} onClick={() => this.selTap(index)} className={isActive === index ? 'active' : ''}>{item}</span>)
            }
          </div>
          <Button type="primary" onClick={this.operationDialog.bind(this, 'open')}>新增sn码</Button>
        </div>
        <ul className="search-blocks">
          <li className="items"><label>商品名称：</label>
            <AutoComplete
              className="certain-category-search"
              dropdownClassName="certain-category-search-dropdown"
              dropdownMatchSelectWidth={false}
              size="large"
              style={{width: '200px'}}
              dataSource={goodsNameData.map(this.renderOption)}
              placeholder="请输入商品名称"
              optionLabelProp="text"
              onBlur={this.getSearchInfo.bind(this, 'goods_name')}
              onSelect={this.getSearchInfo.bind(this, 'goods_name')}
              onChange={this.getSearchInfo.bind(this, 'goods_name')}
              value={this.state.goods_name}
            >
              <Input suffix={<Icon type="search" className="certain-category-icon" />} />
            </AutoComplete>
          </li>
          <li className="items"><label>sn码：</label>
            <AutoComplete
              className="certain-category-search"
              dropdownClassName="certain-category-search-dropdown"
              dropdownMatchSelectWidth={false}
              size="large"
              style={{width: '200px'}}
              dataSource={snData.map(this.renderOption)}
              placeholder="请输入sn码"
              optionLabelProp="text"
              onBlur={this.getSearchInfo.bind(this, 'device_sn')}
              onSelect={this.getSearchInfo.bind(this, 'device_sn')}
              onChange={this.getSearchInfo.bind(this, 'device_sn')}
              value={this.state.device_sn}
            >
              <Input suffix={<Icon type="search" className="certain-category-icon" />} />
            </AutoComplete>
          </li>
          <li className="items"><Button type="primary" onClick={this.changePage.bind(this, 0)}>搜索</Button></li>
        </ul>
        <Table
          columns={columns}
          dataSource={storageList}
          pagination={pagination}
          className="table-box"
          rowKey={record => record.id}
          loading={isLoading}
        />
      </div>
    );
  }
}
export default InventoryList;
