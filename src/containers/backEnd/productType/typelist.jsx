import React, {Component} from 'react';

import {
  Input,
  Select,
  Button,
  Table,
  Modal,
  TreeSelect,
  Form,
  Popconfirm
} from 'antd';

import './style.css';

import TypeEdit from './typeedit';

const Option = Select.Option;
class ProductType extends Component {
  constructor(props) {
    super(props);
    this.state = {
      form: {
        goods_category_name: '',
        id: '',
        superior_id: ''
      },
      visible: false,
      defaultExpandAllRows: true, //是否默认展开树形结构
      typeData: ['硬件', '软件'],
      parentData: [{
        uid: '1',
        goods_category_name: '父级1',
        children: [
          {
            uid: '01',
            goods_category_name: '子级1',
          }
        ]
      }, {
        uid: '2',
        goods_category_name: '父级2',
        children: [
          {
            uid: '02',
            goods_category_name: '子级2',
          }
        ]
      }
      ]
    };
  }
  componentWillMount() {
    console.log('sseee');
    this.loadList();
  }
  //商品类型查询接口
  loadList = () => {
    const params = {
      service: 'goods.getcategorylist'
    };
    window.api.baseInstance('goods.getcategorylist').then((rs) => {
      console.log(rs);
    });
  }
  editEvent = (item) => {
    this.setState({
      visible: true
    });
    window.api.baseInstance('goods.modcategory').then((rs) => {
      console.log(rs);
    });
  }
  delEvent = (item) => {
    const params = {id: item.id};
    window.api.baseInstance('goods.delcategory', params).then((rs) => {
      console.log(rs);
    });
  }
  cancelEvent = () => {
    this.setState({
      visible: false
    });
  }
  selTypeId = (id) => {
    const form = Object.assign({}, this.state.form, {id});
    this.setState({
      form
    });
  }
  goodsNameEvent = (e) => {
    const form = Object.assign({}, this.state.form, {goods_category_name: e.target.value});
    this.setState({
      form
    });
  }
  //新增商品类型
  addTypeEvent = (e) => {
    //console.log(this.state.form);
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
      }
    });
    //Object.assign(this.form, {service: 'goods.addcategory'});
    window.api.baseInstance('goods.addcategory', this.form).then((rs) => {
      console.log(rs);
    });
  }
  render() {
    const columns = [{
      title: '类别名称',
      dataIndex: 'goods_category_name',
      key: 'goods_category_name',
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
        >
          <TypeEdit />
        </Modal>
        <div className="left">
          <Form onSubmit={this.addTypeEvent} className="form" name="form">
            <h1 className="title">分类目录</h1>
            <p>添加新分类项目</p>
            <Form.Item>
              {getFieldDecorator(
                'goods_category_name',
                {
                  initialValue: this.state.form.goods_category_name || '',
                  rules: [{required: true, message: '请输入商品名称！'}]
                }
              )(<Input onChange={this.goodsNameEvent} placeholder="请输入商品名称" />)
              }
            </Form.Item>
            <p>所属分类</p>
            <Form.Item>
              {getFieldDecorator(
                'id',
                {
                  initialValue: this.state.form.id || '',
                  rules: [{required: true, message: '请选择所属分类'}]
                }
              )(<Select onSelect={this.selTypeId} style={{width: '100%'}}>
                {
                  this.state.typeData.map((item, index) => (
                    <Option key={index} value={item}>{item}</Option>
                  ))
                }
              </Select>)
              }
            </Form.Item>
            <p>父级分类目录</p>
            <Form.Item>
              {
                getFieldDecorator(
                  'superior_id',
                  {
                    initialValue: this.state.form.superior_id || '',
                    rules: [{required: true, message: '请选择父级分类'}]
                  }
                )(<TreeSelect
                  style={{width: '100%'}}
                  dropdownStyle={{maxHeight: 400, overflow: 'auto'}}
                  treeData={treeData}
                  placeholder="请选择父级目录"
                  treeDefaultExpandAll
                  onChange={this.onChange}
                />)
              }
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">添加新分类目录</Button>
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
