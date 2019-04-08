import React, {Component} from 'react';
import {DatePicker, Button, Input, Select, Table, Popconfirm, Modal, AutoComplete, Icon, message} from 'antd';
import {Redirect} from 'react-router';
import './style.less';
import utils from '../../../utils/common';
import AdditionBrand from './addbrand';

const Option = Select.Option;
class BrandList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      brandName: '', // 搜索的品牌名称
      startTime: '', // 开始时间
      endTime: '', // 结束时间
      brandStatus: '', // 品牌启用状态
      brandsList: [], //品牌数据名称
      isLoading: false,
      currentPage: 1, // 当前页
      pagination: { // 页码信息
        page_size: 10,
        current: 1, // 当前页
        total: null, // 数据总数
        onChange: this.changePage
      },
      editInfo: { // 编辑信息
        name: null, // 品牌名
        selfId: '', // 品牌id,
        editStatus: null, // 品牌状态
      },
      isAdd: 0, //是添加还是编辑 0 新增 1 编辑
      addvisible: false, // model是否显示
      brandNameData: [],
      redirect: false, // 登录信息是否过期重定向到登录页
    };
  }

  componentWillMount() {
    this.getBrandList(1);
  }

  // 获取品牌列表
  getBrandList = (currentPage) => {
    const {
      brandName, startTime, endTime, brandStatus
    } = this.state;
    if (startTime && endTime && new Date(endTime).getTime() < new Date(startTime).getTime()) {
      message.error('结束时间不得大于开始时间');
      return;
    }
    let params = {
      page_size: 10,
      brand_name: brandName,
      start_time: startTime,
      end_time: endTime,
      brand_status: brandStatus,
      current_page: currentPage
    };
    params = utils.dealElement(params); // 去除空项
    window.api('eps.getgoodsbrand', params).then(res => {
      const pagination = {
        page_size: 10,
        current: Number(currentPage),
        total: Number(res.total_result),
        onChange: this.changePage
      };
      this.setState({brandsList: res.goods_brand_list, pagination, currentPage});
    }).catch((error) => {
      if (error.service_error_code === 'EPS000000801') {
        this.setState({redirect: true});
      }
      message.error(error.service_error_message);
    });
  }
<<<<<<< HEAD
  selbrandsNameEvent = (value) => {
    this.setState({
      brand_name: value
    });
  }
  selStatusEvent = (value) => {
    this.setState({
      brand_status: value
    });
  }
  startTimeEvent = (date, dateString) => {
    this.setState({
      startTime: dateString
    });
  }
  entTimeEvent = (date, dateString) => {
    this.setState({
      endTime: dateString
    });
  }
  searchEvent = () => {
    console.log('search');
  }
  //新增商品
  addBrand = () => {
    this.setState({
      addvisible: true,
      is_add: 0 //0为新增页面
    });
=======

  // 改变页码
  changePage = (page) => {
    this.getBrandList(page);
>>>>>>> 5bec86bd3bd75b59b744fc20dc794c13ea33d025
  }

  // 绑定数据
  bindValue = (type, value1, value2) => {
    if (type === 'startTime' || type === 'endTime') {
      this.setState({[type]: value2});
    } else {
      this.setState({[type]: value1});
    }
  }

  // 打开新增品牌弹框
  operationDialog = (type) => {
    const addvisible = type === 'open' ? Boolean(1) : Boolean(0);
    const editInfo = {name: '', editStatus: '1', selfId: null};
    this.setState({addvisible, isAdd: 0, editInfo});
    type === 'operation' ? this.getBrandList(this.state.currentPage) : null;
  }

  // 打开编辑品牌弹框
  edit = (item) => {
    const editInfo = {name: item.brand_name, editStatus: item.brand_status, selfId: item.id};
    this.setState({addvisible: true, isAdd: 1, editInfo});
  }

  // 品牌的删除或变更
  changeStatus = (type, id) => {
    const params = {id};
    let status = null;
    let tip = null;
    switch (type) {
      case 'start':
        status = 1;
        tip = '已启用';
        break;
      case 'stop':
        status = 2;
        tip = '已停用';
        break;
      case 'delete':
        status = 3;
        tip = '删除成功';
        break;
      default:
        null;
    }
    params.brand_status = status;
    window.api('eps.modgoodsbrand', params).then(() => {
      message.success(tip);
      this.getBrandList(this.state.currentPage);
    }).catch((error) => {
      if (error.service_error_code === 'EPS000000801') {
        this.setState({redirect: true});
      }
      message.error(error.service_error_message);
    });
  }

  // 搜索框下拉列表
  renderOption(item) {
    return (
      <Option key={item.name} text={item.name}>
        {item.name}
      </Option>
    );
  }

  render() {
    if (this.state.redirect) return (<Redirect to="/login" />);
    const {
      isAdd, editInfo, addvisible, brandsList, pagination, brandStatus, brandNameData, isLoading
    } = this.state;
    const columns = [
      {
        title: '品牌名称',
        key: 'brand_name',
        dataIndex: 'brand_name'
      },
      {
        title: '创建时间',
        key: 'gmt_created',
        dataIndex: 'gmt_created'
      },
      {
        title: '品牌状态',
        key: 'brand_status',
        dataIndex: 'brand_status',
        render: (status) => (
          <span>{status === '1' ? '启用' : '禁用'}</span>
        ),
      },
      {
        title: '操作',
        dataIndex: '',
        key: 'operation',
        render: (record) => (
          <div className="opearte-blocks">
            <span className="ml10" onClick={() => this.edit(record)}>编辑</span>
            <Popconfirm
              title="是否要停用此品牌"
              onConfirm={this.changeStatus.bind(this, record.brand_status === '1' ? 'stop' : 'start', record.id)}
              okText="是"
              cancelText="否"
            >
              <span className="ml10">{record.brand_status === '1' ? '停用' : '启用'}</span>
            </Popconfirm>
            <Popconfirm
              title="是否要删除此品牌"
              onConfirm={this.changeStatus.bind(this, 'delete', record.id)}
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
      <div className="brank-blocks">
        {addvisible ? <Modal
          title="添加品牌"
          visible={addvisible}
          onCancel={this.operationDialog.bind(this, 'cancel')}
          footer={null}
        >
          <AdditionBrand
            isAdd={isAdd}
            editInfo={editInfo}
            onClick={this.operationDialog.bind(this, 'cancel')}
            addtionBrandEvent={this.operationDialog.bind(this, 'operation')}
          />
        </Modal> : null}
        <div className="nav-items">
          <span className="active">品牌管理</span>
          <Button type="primary" onClick={this.operationDialog.bind(this, 'open')}>新增品牌</Button>
        </div>
        <ul className="search-blocks">
          <li className="items"><label>品牌名称：</label>
            <AutoComplete
              className="certain-category-search"
              dropdownClassName="certain-category-search-dropdown"
              dropdownMatchSelectWidth={false}
              style={{width: '150px'}}
              dataSource={brandNameData.map(this.renderOption)}
              placeholder="请输入品牌名称"
              optionLabelProp="text"
              onBlur={this.bindValue.bind(this, 'brandName')}
            >
              <Input suffix={<Icon type="search" className="certain-category-icon" />} />
            </AutoComplete>
          </li>
          <li className="items"><label>品牌状态：</label>
            <Select defaultValue={brandStatus} style={{width: '150px'}} onChange={this.bindValue.bind(this, 'brandStatus')}>
              <Option value="">全部</Option>
              <Option value="1">启用</Option>
              <Option value="2">禁用</Option>
            </Select>
          </li>
          <li className="items"><label>开始日期：</label>
            <DatePicker showTime format="YYYY-MM-DD" onChange={this.bindValue.bind(this, 'startTime')} />
          </li>
          <li className="items"><label>结束日期：</label>
            <DatePicker showTime format="YYYY-MM-DD" onChange={this.bindValue.bind(this, 'endTime')} />
          </li>
          <li className="items"><Button type="primary" onClick={this.getBrandList.bind(this, 1)}>搜索</Button></li>
        </ul>
        <Table
          columns={columns}
          dataSource={brandsList}
          pagination={pagination}
          className="table-box"
          rowKey={record => record.id}
          loading={isLoading}
        />
      </div>
    );
  }
}
export default BrandList;
