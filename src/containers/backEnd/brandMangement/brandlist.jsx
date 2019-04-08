import React, {Component} from 'react';
import {DatePicker, Button, Input, Select, Table, Popconfirm, Modal, AutoComplete, Icon, message} from 'antd';
import {Redirect} from 'react-router';
import './style.less';
import AdditionBrand from './addbrand';

const Option = Select.Option;
class BrandList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      brand_name: '',
      startTime: '',
      endTime: '',
      brandsList: [
        {
          id: 1,
          brand_name: '华为',
          status: 0,
          create_time: '2018-10-29 10:10:10'
        },
        {
          id: 2,
          brand_name: '小米',
          status: 1,
          create_time: '2018-10-29 10:10:10'
        }
      ], //品牌数据名称
      isLoading: false,
      search: {
        page_size: 10,
        status: 0
      },
      addvisible: false,
      selfId: '', //编辑的时候用,
      is_add: 0, //是添加还是编辑
      brand_status: '', //品牌状态
      brandNameData: [
        {name: '小米'},
        {name: '华为'},
        {name: 'vivo'},
        {name: 'oppo'}
      ],
      redirect: false
    };
  }
  componentWillMount() {
    console.log(this.state.startTime);
    console.log(this.state.endTime);
    console.log(this.state.brand_name);
  }
  renderOption(item) {
    return (
      <Option key={item.name} text={item.name}>
        {item.name}
      </Option>
    );
  }
  selNameEvent = (value) => {
    this.setState({
      brand_name: value
    });
  }
  //品牌名称模糊搜索
  handleNameSearch = (value) => {
    this.setState({
      brand_name: value
    });
    const form = {
      brand_name: value,
      ...this.state.search
    };
    if (!value) {
      return false;
    }
    window.api('goods.getgoodslist', form).then(res => {
      const node = res.goods_list.map((item) => ({
        name: `${item.brand_name}`
      }));
      this.setState({
        brandNameData: value ? node : []
      });
    }).catch((error) => {
      if (error.service_error_code === 'EPS000000801') {
        this.setState({redirect: true});
      }
      message.error(error.service_error_message);
    });
  }
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
  }
  cancelEvent = () => {
    this.setState({
      addvisible: false
    });
  }
  addtionBrandEvent = () => {
    this.setState({
      addvisible: false
    });
    console.log('dddd');
  }
  edit = (item) => {
    this.setState({
      addvisible: true,
      selfId: item.id,
      is_add: 1 //1为编辑页面
    });
  }
  //删除
  delete = (id) => {
    this.setState({
      selfId: id
    });
  }
  render() {
    const columns = [
      {
        title: '品牌名称',
        key: 'brand_name',
        dataIndex: 'brand_name'
      },
      {
        title: '创建时间',
        key: 'create_time',
        dataIndex: 'create_time'
      },
      {
        title: '商品状态',
        key: 'status',
        dataIndex: 'status',
        render: (status) => (
          <span>{status === 1 ? '启用' : '禁用'}</span>
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
              onConfirm={() => this.confirm(record)}
              okText="是"
              cancelText="否"
            >
              <span className="ml10">停用</span>
            </Popconfirm>
            <Popconfirm
              title="是否要删除此品牌"
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
    if (this.state.redirect) {
      return (<Redirect to="/login" />);
    }
    return (
      <div className="brank-blocks">
        <Modal
          title="添加品牌"
          visible={this.state.addvisible}
          onCancel={this.cancelEvent}
          footer={null}
        >
          <AdditionBrand selfid={this.state.selfId} is_add={this.state.is_add} onClick={this.cancelEvent.bind(this)} addtionBrandEvent={this.addtionBrandEvent} />
        </Modal>
        <div className="nav-items">
          <span className="active">品牌管理</span>
          <Button type="primary" onClick={this.addBrand.bind(this)}>新增品牌</Button>
        </div>
        <ul className="search-blocks">
          <li className="items"><label>品牌名称：</label>
            <AutoComplete
              className="certain-category-search"
              dropdownClassName="certain-category-search-dropdown"
              dropdownMatchSelectWidth={false}
              style={{width: '150px'}}
              dataSource={this.state.brandNameData.map(this.renderOption)}
              onBlur={this.handleNameSearch}
              placeholder="请输入品牌名称"
              optionLabelProp="text"
              onSelect={this.selbrandsNameEvent}
              onChange={this.selNameEvent}
            >
              <Input suffix={<Icon type="search" className="certain-category-icon" />} />
            </AutoComplete>
          </li>
          <li className="items"><label>品牌状态：</label>
            <Select defaultValue={this.state.brand_status} style={{width: '150px'}} onChange={this.state.selStatusEvent}>
              <Option value="">全部</Option>
              <Option value="0">启用</Option>
              <Option value="1">禁用</Option>
            </Select>
          </li>
          <li className="items"><label>开始日期：</label>
            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" onChange={this.startTimeEvent} />
          </li>
          <li className="items"><label>结束日期：</label>
            <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" onChange={this.entTimeEvent} />
          </li>
          <li className="items"><Button type="primary" onClick={this.searchEvent.bind(this)}>搜索</Button></li>
        </ul>
        <Table
          columns={columns}
          dataSource={this.state.brandsList}
          pagination={this.state.search}
          className="table-box"
          rowKey={record => record.id}
          loading={this.state.isLoading}
        />
      </div>
    );
  }
}
export default BrandList;
