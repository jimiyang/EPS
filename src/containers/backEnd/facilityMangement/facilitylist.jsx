import React, {Component} from 'react';
import {AutoComplete, Select, Button, Input, Icon, Table, message, Popconfirm, Modal} from 'antd';
import {Redirect} from 'react-router';
import './style.less';
import Detail from './facilitydetail';

const Option = Select.Option;
class FacilityList extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isactive: 0,
      status: 0,
      isvisible: false,
      fid: '',
      menuData: ['硬件', '软件'],
      statusData: ['全部', '未绑定', '已绑定', '已解绑'],
      redirect: false,
      goodsName: '',
      agentNo: '',
      deviceSn: '',
      merchantCode: '',
      search: {
        page_size: 10,
        current_page: 1
      },
      facilityData: []
    };
  }
  componentWillMount() {
    this.loadList();
  }
  loadList() {
    const {
      goodsName, agentNo, deviceSn, merchantCode
    } = this.state;
    const params = {
      goods_name: goodsName,
      agent_no: agentNo,
      device_sn: deviceSn,
      merchant_code: merchantCode,
      ...this.state.search
    };
    window.api('eps.getordergoodsmanager', params).then(rs => {
      console.log(rs.order_goods_manager_list);
      this.setState({facilityData: rs.order_goods_manager_list});
    }).catch((error) => {
      if (error.service_error_code === 'EPS000000801') {
        this.setState({redirect: true});
      }
      message.error(error.service_error_message);
      this.setState({isLoading: false});
    });
  }
  getState(status) {
    switch (status) {
      case '1':
        return (<span className="green">已绑定</span>);
      case '2':
        return (<span className="red">未绑定</span>);
      default:
        return (<span className="red">未绑定</span>);
    }
  }
  getActivate(state) {
    switch (state) {
      case '1':
        return (<span className="red">未激活</span>);
      case '2':
        return (<span className="green">激活中</span>);
      case '3':
        return (<span>激活成功</span>);
      default:
        return (<span className="red">未激活</span>);
    }
  }
  selTap = (index) => {
    this.setState({
      isactive: index
    });
  }
  bindValue = (type, e) => {
    if (type === 'status') {
      this.setState({[type]: e});
    } else {
      this.setState({[type]: e.target.value});
    }
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
    console.log(item);
    window.localStorage.setItem('platform_no', item.platform_no);
    window.localStorage.setItem('merchant_code', item.bind_merchant_code);
    const params = {
      out_request_no: window.common.getRequestNo(16), //随机生成
      core_merchant_no: item.bind_merchant_code //核心商户编号
    };
    const head = {
      service: 'device.unbind',
      version: '1.0',
      partner_id: '',
      core_merchant_no: item.bind_merchant_code, //联富通核心商户
      sign: '',
      sign_type: 'MD5',
      input_charse: 'UTF-8',
      request_time: window.common.getDate(new Date(), true)
    };
    const headParams = {
      out_trade_no: '', //商户请求单号
      merchant_no: '', //门店编号
      identify_type: 'SN', //device_sn
      goods_id: '',
      device_sn: '',
      operator_id: ''
    };
    window.api('merchant.pidkeyquery', params).then(rs => {
      console.log(rs);
    });
    //window.api2('device.unbind', params).then(rs => {
    //console.log(rs);
    //});
  }
  searchEvent = () => {
    this.loadList();
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
        key: 'agent_name',
        dataIndex: '',
        render: (record) => (
          <span>{record.agent_no}/{record.agent_name}</span>
        )
      },
      {
        title: 'sn码',
        key: 'device_sn',
        dataIndex: 'device_sn'
      },
      {
        title: '绑定状态',
        key: 'bind_status',
        dataIndex: 'bind_status',
        render: (status) => (
          //console.log(status);
          this.getState(status)
        ),
      },
      {
        title: (<div><p>门店编号/门店名称</p><p>商户编号/商户名称</p></div>),
        key: 'bind_core_merchant_code',
        dataIndex: '',
        render: (record) => (
          <div>
            <p className={!record.bind_merchant_code ? 'hide' : null}>{record.bind_merchant_code}/{record.bind_merchant_name}</p>
            <p className={!record.bind_core_merchant_code ? 'hide' : null}>{record.bind_core_merchant_code}/{record.bind_core_merchant_name}</p>
          </div>
        )
      },
      {
        title: '激活状态',
        key: 'activate_status',
        dataIndex: 'activate_status',
        render: (record) => (
          this.getActivate(record)
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
              title="是否需要解绑"
              onConfirm={() => this.decodingEvent(record)}
              okText="是"
              cancelText="否"
            >
              <span className="ml10">解绑</span>
            </Popconfirm>
          </div>
        )
      }
    ];
    const {redirect} = this.state;
    if (redirect) return (<Redirect to="/login" />);
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
            <Input onChange={this.bindValue.bind(this, 'goodsName')} />
          </li>
          <li className="items">
            <label style={{width: '150px'}}>代理商编号：</label>
            <Input onChange={this.bindValue.bind(this, 'agentNo')} />
          </li>
          <li className="items">
            <label style={{width: '80px'}}>sn码：</label>
            <Input onChange={this.bindValue.bind(this, 'deviceSn')} />
          </li>
          <li className="items">
            <label>绑定状态：</label>
            <Select defaultValue={this.state.status} onChange={this.bindValue.bind(this, 'status')} style={{width: '150px'}}>
              {
                this.state.statusData.map((item, index) => (
                  <Option key={index} value={index}>{item}</Option>
                ))
              }
            </Select>
          </li>
          <li className="items">
            <label style={{width: '120px'}}>商户编号：</label>
            <Input onChange={this.bindValue.bind(this, 'merchantCode')} />
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
