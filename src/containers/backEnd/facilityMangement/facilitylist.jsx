import React, {Component} from 'react';
import {AutoComplete, Select, Button, Input, Icon, Table, message, Popconfirm, Modal} from 'antd';
import './style.less';
import Detail from './facilitydetail';

const Option = Select.Option;
class FacilityList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isactive: 0,
      goodsNameData: [],
      status: 0,
      isvisible: false,
      fid: '',
      menuData: ['硬件', '软件'],
      statusData: ['全部', '未绑定', '已绑定', '已解绑'],
      facilityData: [
        {
          id: 1,
          goods_name: '设备一',
          angent_no: '112232432',
          sn_code: '22323232',
          sataus: 0,
          buiness: '343243532',
          name: '联拓天际',
          activation_status: 1
        },
        {
          id: 2,
          goods_name: '设备二',
          angent_no: '112232432',
          sn_code: '22323232',
          sataus: 1,
          buiness: '343243532',
          name: '联拓天际',
          activation_status: 1
        },
        {
          id: 3,
          goods_name: '设备三',
          angent_no: '112232432',
          sn_code: '22323232',
          sataus: 2,
          buiness: '343243532',
          name: '联拓天际',
          activation_status: 1
        }
      ]
    };
  }
  getState(status) {
    switch (status) {
      case 0:
        return (<span className="red">未绑定</span>);
      case 1:
        return (<span className="green">已绑定</span>);
      case 2:
        return (<span>已解绑</span>);
      default:
        return (<span className="red">未绑定</span>);
    }
  }
  renderOption(item, index) {
    return (
      <Option key={item.name} text={item.name}>
        {item.name}
      </Option>
    );
  }
  selTap = (index) => {
    this.setState({
      isactive: index
    });
  }
  selGoodsNameEvent = () => {
    console.log('名称搜索');
  }
  detailEvent = (item) => {
    this.setState({
      fid: item.id,
      isvisible: true
    });
  }
  cancel = () => {
    this.setState({
      isvisible: false
    });
  }
  decodingEvent = (item) => {
    message.success(`解绑成功${item.id}`);
  }
  searchEvent = () => {
    alert('搜索在这儿呢');
  }
  render() {
    const columns = [
      {
        title: '商品名称',
        key: 'goods_name',
        dataIndex: 'goods_name'
      },
      {
        title: '代理商编号/代理商名称',
        key: 'angent_no',
        dataIndex: 'angent_no'
      },
      {
        title: 'sn码',
        key: 'sn_code',
        dataIndex: 'sn_code'
      },
      {
        title: '绑定状态',
        key: 'sataus',
        dataIndex: 'sataus',
        render: (status) => (
          this.getState(status)
        ),
      },
      {
        title: '商户编号/商户名称',
        key: 'buiness',
        dataIndex: '',
        render: (record) => (
          <span>{record.buiness}/{record.name}</span>
        )
      },
      {
        title: '激活状态',
        key: 'activation_status',
        dataIndex: 'activation_status',
        render: (record) => (
          <span>{record === 0 ? '未激活' : '已激活'}</span>
        )
      },
      {
        title: '操作',
        dataIndex: '',
        key: 'operation',
        render: (record) => (
          <div className="opearte-blocks">
            <span className="ml10" onClick={() => this.detailEvent(record)}>详情</span>
            <Popconfirm
              title="是否需要解码"
              onConfirm={() => this.decodingEvent(record.id)}
              okText="是"
              cancelText="否"
            >
              <span className="ml10">解码</span>
            </Popconfirm>
          </div>
        )
      }
    ];
    return (
      <div className="facility-blocks">
        <Modal
          title="详情"
          visible={this.state.isvisible}
          onCancel={this.cancel}
          width="800px"
          footer={
            <Button onClick={this.cancel}>关闭</Button>
          }
        >
          <Detail id={this.state.fid} />
        </Modal>
        <div className="nav-items">
          <div className="tap-items">
            {
              this.state.menuData.map((item, index) => <span key={index} onClick={this.selTap.bind(this, index)} className={this.state.isactive === index ? 'active' : ''}>{item}</span>)
            }
          </div>
        </div>
        <ul className="search-blocks">
          <li className="items"><label>商品名称：</label>
            <AutoComplete
              className="certain-category-search"
              dropdownClassName="certain-category-search-dropdown"
              dropdownMatchSelectWidth={false}
              size="large"
              style={{width: '200px'}}
              dataSource={this.state.goodsNameData.map(this.renderOption)}
              onBlur={this.handleNameSearch}
              placeholder="请输入商品名称"
              optionLabelProp="text"
              onSelect={this.selGoodsNameEvent}
              onChange={this.selNameEvent}
            >
              <Input suffix={<Icon type="search" className="certain-category-icon" />} />
            </AutoComplete>
          </li>
          <li className="items">
            <label style={{width: '150px'}}>代理商编号：</label>
            <Input />
          </li>
          <li className="items">
            <label style={{width: '80px'}}>sn码：</label>
            <Input />
          </li>
          <li className="items">
            <label>绑定状态：</label>
            <Select defaultValue={this.state.status} style={{width: '150px'}}>
              {
                this.state.statusData.map((item, index) => (
                  <Option key={index} value={index}>{item}</Option>
                ))
              }
            </Select>
          </li>
          <li className="items">
            <label style={{width: '120px'}}>商户编号：</label>
            <Input />
          </li>
          <li className="items"><Button type="primary" onClick={this.searchEvent.bind(this)}>搜索</Button></li>
        </ul>
        <Table
          columns={columns}
          dataSource={this.state.facilityData}
          pagination={this.state.search}
          className="table-box"
          rowKey={record => record.id}
          loading={this.state.isLoading}
        />
      </div>
    );
  }
}
export default FacilityList;
