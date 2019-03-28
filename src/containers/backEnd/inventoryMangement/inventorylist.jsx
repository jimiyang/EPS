import React, {Component} from 'react';
import {Input, Modal, AutoComplete, Button, Icon, Table, Popconfirm, message} from 'antd';
import './style.less';
import AddSn from './addsn';

const {Option} = AutoComplete;
class InventoryList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      menuData: ['硬件', '软件'],
      isActive: 0,
      isLoading: false,
      isvisible: false,
      search: {
        page_size: 10,
      },
      snList: [
        {
          id: 1,
          goods_type: '哈哈哈',
          goods_name: '不知道写什么',
          goods_category: '华为',
          goods_sn: '111112323',
          goods_key: '42343214032',
          status: 0
        }
      ],
      goodsNameData: [], //商品名称模糊搜索
      snData: [] //sn码模糊搜索
    };
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
      isActive: index
    });
  }
  searchEvent = () => {
    alert('搜索在这儿呢！');
  }
  addsnEvent = () => {
    this.setState({
      isvisible: true
    });
  }
  cancel = () => {
    this.setState({
      isvisible: false
    });
  }
  delete = (id) => {
    message.success('删除成功');
  }
  render() {
    const columns = [
      {
        title: '商品类型',
        key: 'goods_type',
        dataIndex: 'goods_type'
      },
      {
        title: '商品名称',
        key: 'goods_name',
        dataIndex: 'goods_name'
      },
      {
        title: '商品品牌',
        key: 'goods_category',
        dataIndex: 'goods_category'
      },
      {
        title: '设备sn码',
        key: 'goods_sn',
        dataIndex: 'goods_sn'
      },
      {
        title: '设备唯一标识码',
        key: 'goods_key',
        dataIndex: 'goods_key'
      },
      {
        title: '状态',
        key: 'status',
        dataIndex: 'status',
        render: (status) => (
          <span>{status === 1 ? '已发货' : '待发货'}</span>
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
        <Modal
          title="新增终端码"
          visible={this.state.isvisible}
          onCancel={this.cancel}
          footer={null}
        >
          <AddSn />
        </Modal>
        <div className="nav-items">
          <div className="tap-items">
            {
              this.state.menuData.map((item, index) => <span key={index} onClick={this.selTap.bind(this, index)} className={this.state.isActive === index ? 'active' : ''}>{item}</span>)
            }
          </div>
          <Button type="primary" onClick={this.addsnEvent.bind(this)}>新增sn码</Button>
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
          <li className="items"><label>sn码：</label>
            <AutoComplete
              className="certain-category-search"
              dropdownClassName="certain-category-search-dropdown"
              dropdownMatchSelectWidth={false}
              size="large"
              style={{width: '200px'}}
              dataSource={this.state.snData.map(this.renderOption)}
              onBlur={this.handleNameSearch}
              placeholder="请输入商品名称"
              optionLabelProp="text"
              onSelect={this.selGoodsNameEvent}
              onChange={this.selNameEvent}
            >
              <Input suffix={<Icon type="search" className="certain-category-icon" />} />
            </AutoComplete>
          </li>
          <li className="items"><Button type="primary" onClick={this.searchEvent.bind(this)}>搜索</Button></li>
        </ul>
        <Table
          columns={columns}
          dataSource={this.state.snList}
          pagination={this.state.search}
          className="table-box"
          rowKey={record => record.id}
          loading={this.state.isLoading}
        />
      </div>
    );
  }
}
export default InventoryList;
