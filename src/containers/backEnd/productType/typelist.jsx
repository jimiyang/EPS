import React, {Component} from 'react';
import {
  Input,
  Button,
  Table,
  Modal,
  Form,
  Popconfirm,
  message
} from 'antd';
import {Redirect} from 'react-router';
import './style.css';
import TypeEdit from './typeedit';
import TreeMenu from '../../../components/backEnd/treeMenu';//商品类型模版

class ProductType extends Component {
  constructor(props) {
    super(props);
    this.state = {
      formParams: {
        goods_category_name: ''
      },
      search: {
        page_size: 100,
        current_page: 1
      },
      parent_id: '', //类别父级id
      selfId: '', //类别自身id
      visible: false,
      defaultExpandAllRows: true, //是否默认展开树形结构
      productTypeData: [],
      treeData: [],
      redirect: false,
      isLoading: true
    };
  }
  componentWillMount() {
    if (window.common.loginOut(this)) {
      this.loadList();
    } else {
      message.error('登录信息失效，请重新登录');
    }
  }
  getChildData = (data, pid) => {
    const children = [];
    data.map((item) => {
      if (item.superior_id === pid) {
        children.push({
          goods_category_name: item.goods_category_name,
          id: item.id,
          superior_id: item.superior_id,
          children: this.getChildData(data, item.id)
        });
      }
    });
    return children;
  }
  //商品类型查询接口
  loadList = () => {
    window.api('goods.getcategorylist', this.state.search).then((res) => {
      const productTypeData = res.goods_category_list;
      const arr = [];
      if (productTypeData.length > 0) {
        productTypeData.map(item => {
          if (item.superior_id === 0) {
            arr.push({
              goods_category_name: item.goods_category_name,
              id: item.id,
              superior_id: item.superior_id,
              children: this.getChildData(productTypeData, item.id)
            });
          }
        });
        this.setState({
          treeData: productTypeData,
          isLoading: false
        });
      }
      this.setState({
        productTypeData: arr
      });
    }).catch((error) => {
      if (error.service_error_code === 'EPS000000801') {
        this.setState({redirect: true});
      }
      message.error(error.service_error_message);
      this.setState({
        isLoading: false
      });
    });
  }
  editEvent = (id) => {
    this.setState({
      visible: true,
      selfId: id
    });
  }
  delEvent = (id) => {
    window.api('goods.delcategory', {id}).then((res) => {
      message.success(res.service_error_message);
      this.loadList();
    }).catch((error) => {
      if (error.service_error_code === 'EPS000000801') {
        this.setState({redirect: true});
      }
      message.error(error.service_error_message);
    });
  }
  cancelEvent = () => {
    this.setState({
      visible: false
    });
    this.loadList();
  }
  goodsNameEvent = (e) => {
    const formParams = Object.assign({}, this.state.formParams, {goods_category_name: e.target.value});
    this.setState({
      formParams
    });
  }
  selParentEvent = (value) => {
    this.setState({
      parent_id: value
    });
  }
  //新增商品类型
  addTypeEvent = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const pid = this.state.parent_id === '' ? 0 : this.state.parent_id;
        this.setState({
          formParams: values
        });
        Object.assign(this.state.formParams, {superior_id: pid});
        window.api('goods.addcategory', this.state.formParams).then((res) => {
          message.success(res.service_error_message);
          this.loadList();
        }).catch((error) => {
          if (error.service_error_code === 'EPS000000801') {
            this.setState({redirect: true});
          }
          message.error(error.service_error_message);
        });
      }
    });
  }
  modifyEvent = (e) => {
    this.loadList();
  }
  resetEvent = () => {
    this.props.form.resetFields();
    this.setState({
      formParams: {
        goods_category_name: ''
      },
      parent_id: ''
    });
  }
  render() {
    const columns = [{
      title: '类别名称',
      dataIndex: 'goods_category_name',
      key: 'goods_category_name'
    }, {
      title: '操作',
      dataIndex: '',
      key: 'operation',
      render: (record) => (
        <div className="opearte-blocks">
          <span className="ml10" onClick={() => this.editEvent(record.id)}>编辑</span>
          <Popconfirm title="是否要删除此分类?" onConfirm={() => this.delEvent(record.id)} onCancel={this.cancelEvent} okText="确定" cancelText="取消">
            <span className="ml10">删除</span>
          </Popconfirm>
        </div>
      )
    }];
    const {getFieldDecorator} = this.props.form;
    if (this.state.redirect) {
      return (<Redirect to="/login" />);
    }
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
          <TypeEdit selfId={this.state.selfId} onClick={this.cancelEvent.bind(this)} modifyEvent={this.modifyEvent} />
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
              <TreeMenu selParentEvent={this.selParentEvent.bind(this)} parent_id={this.state.parent_id} productTypeData={this.state.treeData} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">添加</Button>
              <Button onClick={this.resetEvent}>清空</Button>
            </Form.Item>
          </Form>
        </div>
        <div className="right">
          <Table isLoading={this.state.isLoading} rowKey={record => record.id} defaultExpandAllRows={this.state.defaultExpandAllRows} columns={columns} dataSource={this.state.productTypeData} />
        </div>
      </div>
    );
  }
}
export default Form.create()(ProductType);
