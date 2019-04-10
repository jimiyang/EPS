import React, {Component} from 'react';
import {Redirect} from 'react-router';
import {Button, Input, Form, message, Select} from 'antd';
import './style.less';

const Option = Select.Option;

class AddSN extends Component {
  constructor(props) {
    super(props);
    this.state = {
      file_name: '', // 上传文件
      file_str: '', // 上传文件
      goodsList: [], // 商品列表
      redirect: false, // 是否重定位
      id: null, // 选中的商品id
    };
  }

  componentWillMount() {
    this.getGoodsList();
  }

  // 获取商品列表
  getGoodsList = () => {
    const params = {
      page_size: 100,
      current_page: 1,
    };
    window.api('goods.getgoodslist', params).then(res => {
      this.setState({goodsList: res.goods_list});
    }).catch((error) => {
      error.service_error_code === 'EPS000000801' ? this.setState({redirect: true}) : null;
      message.error(error.service_error_message);
    });
  }

  // 获取商品id
  getSearchInfo(type, value) {
    this.setState({[type]: value});
  }

  // 获取文件
  getFile = ($event) => {
    const file = $event.target.files[0];
    const name = $event.target.files[0].name;
    if (!/\.(xlsx|xls)$/.test($event.target.value)) {
      message.error('请上传excel表格');
      return false;
    }
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = (e) => {
      const ary = e.target.result.split(',');
      this.setState({file_str: ary[ary.length - 1], file_name: name});
    };
  }

  // 添加
  addtionBrandEvent = (e) => {
    e.preventDefault();
    // eslint-disable-next-line camelcase
    const {id, file_name, file_str} = this.state;
    if (!id) {
      message.error('请选择商品');
      return;
    }
    if (!this.state.file_name) {
      message.error('请选择文件');
      return;
    }
    const params = {file_name, file_str, goods_id: id};
    window.api('storage.add.batch', params).then(() => {
      this.props.addtionBrandEvent(e);
      message.success('添加成功');
    }).catch((error) => {
      error.service_error_code === 'EPS000000801' ? this.setState({redirect: true}) : null;
      message.error(error.service_error_message);
    });
  }

  render() {
    const {
      allowClear, redirect, goodsList, id
    } = this.state;
    if (redirect) return (<Redirect to="/login" />);
    return (
      <div className="sn-blocks">
        <ul className="list">
          <li className="items"><label>商品名称：</label>
            <Select className="select" value={id} placeholder="请选择商品" onChange={this.getSearchInfo.bind(this, 'id')} allowClear={allowClear}>
              {
                goodsList.map((item, index) => (
                  <Option value={item.id} key={index}>{item.goods_name}</Option>
                ))
              }
            </Select>
          </li>
          <li>
            <label>选择文件：</label>
            <div className="file">点击上传文件
              <input type="file" onChange={this.getFile} />
            </div>
          </li>
          <li>
            <Button type="primary" onClick={this.addtionBrandEvent}>添加</Button>
          </li>
        </ul>
      </div>
    );
  }
}
export default Form.create()(AddSN);
