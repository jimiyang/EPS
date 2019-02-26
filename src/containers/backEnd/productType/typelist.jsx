import React, {Component} from 'react';

import {
  Input,
  Select,
  Button,
  Table,
  Modal,
  TreeSelect,
  Form,
  Popconfirm,
  message
} from 'antd';

import './style.css';

import TypeEdit from './typeedit';

const Option = Select.Option;
class ProductType extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formParams: {
        goods_category_name: '',
        superior_id: ''
      },
      selfId: '',
      visible: false,
      defaultExpandAllRows: true, //是否默认展开树形结构
      parentData: [{
        uid: '1',
        goods_category_name: '父级1',
        superior_id: '00',
        children: [
          {
            uid: '01',
            superior_id: '父级1',
            goods_category_name: '子级1',
          }
        ]
      }, {
        uid: '2',
        superior_id: '00',
        goods_category_name: '父级2',
        children: [
          {
            uid: '02',
            superior_id: '父级2',
            goods_category_name: '子级2',
          }
        ]
      }
      ]
    };
  }
  componentWillMount() {
    this.loadList();
  }
  //商品类型查询接口
  loadList = () => {
    const params = {
      service: 'goods.getcategorylist'
    };
    window.api('goods.getcategorylist').then((rs) => {
      console.log(rs);
    });
  }
  editEvent = (item) => {
    this.setState({
      visible: true,
      selfId: item.id
    });
  }
  delEvent = (item) => {
    const params = {id: item.id};
    window.api('goods.delcategory', params).then((rs) => {
      message.success(rs.service_error_message);
    });
  }
  cancelEvent = () => {
    this.setState({
      visible: false
    });
  }
  goodsNameEvent = (e) => {
    const formParams = Object.assign({}, this.state.formParams, {goods_category_name: e.target.value});
    this.setState({
      formParams
    });
  }
  selParentEvent = (value) => {
    const formParams = Object.assign({}, this.state.formParams, {superior_id: value});
    this.setState({
      formParams
    });
  }
  //新增商品类型
  addTypeEvent = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        this.setState({
          formParams: values
        });
        window.api('goods.addcategory', this.state.formParams).then((rs) => {
          console.log(rs);
        });
      }
    });
  }
  resetEvent = () => {
    console.log('ddd');
    this.props.form.resetFields();
  }
  render() {
    const columns = [{
      title: '类别名称',
      dataIndex: 'goods_category_name',
      key: 'goods_category_name'
    }, {
      title: '父级名称',
      dataIndex: 'superior_id',
      key: 'superior_id'
    }, {
      title: '操作',
      dataIndex: '',
      key: 'operation',
      render: (record) => (
        <div className="opearte-blocks">
          <span className="ml10" onClick={() => this.editEvent(record)}>编辑</span>
          <Popconfirm title="是否要删除此分类?" onConfirm={() => this.delEvent(record)} onCancel={this.cancelEvent} okText="确定" cancelText="取消">
            <span className="ml10">删除</span>
          </Popconfirm>
        </div>
      )
    }];
    const treeData = [{
      title: '我的分类',
      value: '0-0',
      key: '0-0',
      children: [{
        title: '首款小精灵',
        value: '0-0-1',
        key: '0-0-1',
      }, {
        title: '硬件',
        value: '0-0-2',
        key: '0-0-2',
      }],
    }, {
      title: '软件',
      value: '0-1',
      key: '0-1',
    }
    ];
    const {getFieldDecorator} = this.props.form;
    return (
      <div className="type-blocks">
        <Modal
          title="编辑"
          okText="保存"
          cancelText="取消"
          onCancel={this.cancelEvent}
          visible={this.state.visible}
          footer={null}
        >
          <TypeEdit id={this.state.selfId} onClick={this.cancelEvent.bind(this)} />
        </Modal>
        <div className="left">
          <Form onSubmit={this.addTypeEvent} className="form" name="form">
            <h1 className="title">分类目录</h1>
            <p>添加新分类项目</p>
            <Form.Item>
              {getFieldDecorator(
                'goods_category_name',
                {
                  initialValue: this.state.formParams.goods_category_name || '',
                  rules: [{required: true, message: '请输入商品名称！'}]
                }
              )(<Input onChange={this.goodsNameEvent} placeholder="请输入商品名称" />)
              }
            </Form.Item>
            <p>父级分类目录</p>
            <Form.Item>
              {
                getFieldDecorator(
                  'superior_id',
                  {
                    initialValue: this.state.formParams.superior_id || '',
                    rules: [{required: true, message: '请选择父级分类'}]
                  }
                )(<TreeSelect
                  style={{width: '100%'}}
                  dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                  treeData={treeData}
                  placeholder="请选择父级目录"
                  treeDefaultExpandAll
                  onChange={this.selParentEvent}
                />)
              }
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">添加新分类目录</Button>
              <Button onClick={this.resetEvent}>取消</Button>
            </Form.Item>
          </Form>
        </div>
        <div className="right">
          <Table rowKey={record => record.uid} defaultExpandAllRows={this.state.defaultExpandAllRows} columns={columns} dataSource={this.state.parentData} />
        </div>
      </div>
    );
  }
}
export default Form.create()(ProductType);
