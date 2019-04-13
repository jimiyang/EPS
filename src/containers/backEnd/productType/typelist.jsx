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
      editInfo: {
        id: null,
        goods_category_name: null,
        superior_id: null,
      },
      parent_id: '', //类别父级id
      visible: false,
      defaultExpandAllRows: true, //是否默认展开树形结构
      productTypeData: [],
      treeData: [],
      redirect: false,
      isLoading: true,
      goods_category_hierarchy: 0, // 当前创建的分类的层级
    };
  }

  componentWillMount() {
    if (window.common.loginOut(this)) {
      this.loadList();
    } else {
      message.error('登录信息失效，请重新登录');
    }
  }

  // 将获取的商品类型列表格式化
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
      const treeData = res.goods_category_list;
      const arr = [];
      if (treeData.length > 0) {
        treeData.forEach(item => {
          if (item.superior_id === 0) {
            arr.push({
              goods_category_name: item.goods_category_name,
              id: item.id,
              superior_id: item.superior_id,
              children: this.getChildData(treeData, item.id)
            });
          }
        });
        this.setState({treeData, isLoading: false, productTypeData: arr});
      } else {
        this.setState({productTypeData: arr});
      }
    }).catch((error) => {
      error.service_error_code === 'EPS000000801' ? this.setState({redirect: true}) : null;
      message.error(error.service_error_message);
      this.setState({isLoading: false});
    });
  }

  //新增商品类型
  addTypeEvent = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const pid = this.state.parent_id === '' ? 0 : this.state.parent_id;
        this.setState({formParams: values});
        if (this.state.goods_category_hierarchy === 3) {
          message.warning('只能创建三级分类');
          return false;
        }
        Object.assign(this.state.formParams, {superior_id: pid, goods_category_hierarchy: this.state.goods_category_hierarchy + 1});
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

  // 删除分类
  delEvent = (id) => {
    window.api('goods.delcategory', {id}).then((res) => {
      message.success(res.service_error_message);
      this.loadList();
      id === this.state.parent_id ? this.setState({parent_id: ''}) : null; // 如果删除目录选中项，重置parent_id
    }).catch((error) => {
      error.service_error_code === 'EPS000000801' ? this.setState({redirect: true}) : null;
      message.error(error.service_error_message);
    });
  }

  // 编辑
  editEvent = (item) => {
    const editInfo = {
      goods_category_name: item.goods_category_name,
      id: item.id,
      superior_id: item.superior_id
    };
    this.setState({editInfo, visible: true});
  }

  // 取消
  cancelEvent = () => {
    this.setState({visible: false});
    this.loadList();
  }

  // 编辑保存后触发
  modifyEvent = (e) => {
    this.setState({visible: false});
    this.loadList();
  }

  // 双向绑定商品名称
  goodsNameEvent = (e) => {
    const formParams = Object.assign({}, this.state.formParams, {goods_category_name: e.target.value});
    this.setState({formParams});
  }

  // 获取父级分类目录
  selParentEvent = (value, hierarchy) => {
    this.setState({
      parent_id: value,
      goods_category_hierarchy: hierarchy
    }, () => {
      this.loadList();
    });
  }

  // 重置
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
          <span className="ml10" onClick={() => this.editEvent(record)}>编辑</span>
          <Popconfirm title="是否要删除此分类?" onConfirm={() => this.delEvent(record.id)} onCancel={this.cancelEvent} okText="确定" cancelText="取消">
            <span className="ml10">删除</span>
          </Popconfirm>
        </div>
      )
    }];
    const {getFieldDecorator} = this.props.form;
    const {
      visible, formParams, redirect, treeData, isLoading, defaultExpandAllRows, productTypeData, editInfo
    } = this.state;
    if (redirect) {
      return (<Redirect to="/login" />);
    }
    return (
      <div className="type-blocks">
        {visible ? <Modal
          title="编辑"
          okText="保存"
          cancelText="取消"
          onCancel={this.cancelEvent}
          visible={visible}
          footer={null}
        >
          <TypeEdit editInfo={editInfo} treeData={treeData} onClick={this.cancelEvent.bind(this)} modifyEvent={this.modifyEvent} />
        </Modal> : null}
        <div className="left">
          <Form onSubmit={this.addTypeEvent} className="form" name="form">
            <h1 className="title">分类目录</h1>
            <p>添加新分类项目</p>
            <Form.Item>
              {getFieldDecorator(
                'goods_category_name',
                {
                  initialValue: formParams.goods_category_name || '',
                  rules: [{required: true, message: '请输入商品名称！'}]
                }
              )(<Input onChange={this.goodsNameEvent} placeholder="请输入商品名称" />)
              }
            </Form.Item>
            <p>父级分类目录</p>
            <Form.Item>
              <TreeMenu selParentEvent={this.selParentEvent.bind(this)} parent_id={this.state.parent_id} treeData={treeData} />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit">添加</Button>
              <Button onClick={this.resetEvent}>清空</Button>
            </Form.Item>
          </Form>
        </div>
        <div className="right">
          <Table isLoading={isLoading} rowKey={record => record.id} defaultExpandAllRows={defaultExpandAllRows} columns={columns} dataSource={productTypeData} />
        </div>
      </div>
    );
  }
}
export default Form.create()(ProductType);
