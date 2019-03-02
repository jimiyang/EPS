import React, {Component} from 'react';

import {
  Form,
  Input,
  Radio,
  Button,
  message
} from 'antd';

import ReactQuill from 'react-quill';//富文本编辑器(react-quill)

import 'react-quill/dist/quill.snow.css'; // ES6

import './list.css';

import api from '../../../api/api.js';

import TreeMenu from '../../../components/backEnd/treeMenu';//商品类型模版

const RadioGroup = Radio.Group;
class Add extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: true,
      form: {
        goods_bar_no: '',
        is_post: 0,
        goods_details: '',
        goods_category_id: '',
        goods_pic: 'http://static.liantuobank.com/project/lianfutong/images/imgdemo3.jpg'
      }
    };
  }
  componentWillMount() {
    this.initForm();
  }
  componentDidMount() {
    const textbox = this.refs.textarea;
  }
  initForm = () => {
    if (!this.props.location.query) {
      return false;
    }
    window.api('goods.getgoodsdetail', {id: this.props.location.query.id}).then((rs) => {
      const pid = rs.goods_category_id === '' ? 0 : rs.goods_category_id;
      console.log(rs);
      console.log(pid);
      const params = {
        goods_name: rs.goods_name,
        goods_bar_no: rs.goods_bar_no,
        goods_category_id: pid,
        cost_price: rs.cost_price,
        sale_price: rs.sale_price,
        is_post: rs.is_post,
        goods_details: rs.goods_details,
        id: rs.id
      };
      const form = Object.assign(this.state.form, params);
      this.setState({
        form
      });
    });
  }
  addtionProEvent = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const form = Object.assign(this.state.form, values);
        this.setState({
          form
        });
        console.log(form);
        if (!this.props.location.query) {
          window.api('goods.addgoods', form).then((rs) => {
            message.success(rs.service_error_message);
          }).catch(error => {
            message.error(error);
          });
        } else {
          window.api('goods.modgoods', form).then((rs) => {
            message.success(rs.service_error_message);
          }).catch(error => {
            message.error(error);
          });
        }
      }
    });
  }
  uploadImgEvent = (e) => {
    e.preventDefault();
    const info = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(info);
    const flag = window.common.beforeUpload(info, message); //上传之前判断图片大小
    if (flag === true) {
      reader.onload = function (ev) {
        const params = {
          pic_name: info.name,
          goods_pic: this.result
        };
        api.baseInstance('eps.upload', params).then(rs => {
          console.log(rs);
        }).catch(error => {
          message.error(error);
        });
      };
    }
  }
  handleChange = (value) => {
    const form = Object.assign(this.state.form, {goods_details: value});
    this.setState({
      form
    });
  }
  //生成条形码
  getbarno = () => {
    api.baseInstance('goods.getbarno', {}).then((rs) => {
      const form = Object.assign(this.state.form, {goods_bar_no: rs.barNo});
      this.setState({
        form
      });
    }).catch(error => {
      message.error(error);
    });
  }
  displayRender(label) {
    return label[label.length - 1];
  }
  selParentEvent = (value) => {
    console.log(value);
    const form = Object.assign(this.state.form, {goods_category_id: value});
    this.setState({
      form
    });
  }
  selIspostEvent = (e) => {
    const form = Object.assign(this.state.form, {is_post: e.target.value});
    this.setState({
      form
    });
  }
  render() {
    const {getFieldDecorator} = this.props.form;
    return (
      <div className="add-blocks">
        <Form onSubmit={this.addtionProEvent} className="form" name="form" id="form">
          <Form.Item
            label="商品名称"
          >
            {getFieldDecorator(
              'goods_name',
              {
                initialValue: this.state.form.goods_name || '',
                rules: [{required: true, message: '请输入商品名称！'}]
              }
            )(<Input placeholder="请输入商品名称" />)
            }
          </Form.Item>
          <Form.Item
            label="商品条形码"
          >
            <div>
              {getFieldDecorator(
                'goods_bar_no',
                {
                  initialValue: this.state.form.goods_bar_no || '',
                  rules: [{required: true, message: '请输入商品条形码！'}],
                }
              )(<Input placeholder="请生成商品条形码" disabled={this.state.disabled} />)
              }
              <Button type="primary" onClick={this.getbarno.bind(this)}>生成条形码</Button>
            </div>
          </Form.Item>
          <Form.Item
            label="商品类型"
          >
            {getFieldDecorator(
              'goods_category_id',
              {
                initialValue: this.state.form.goods_category_id || '',
                rules: [
                  {required: true, message: '请输入商品类型'}
                ]
              }
            )(<TreeMenu selParentEvent={this.selParentEvent.bind(this)} parent_id={this.state.form.goods_category_id} />)
            }
          </Form.Item>
          <Form.Item
            label="商品成本价"
          >
            {getFieldDecorator(
              'cost_price',
              {
                initialValue: this.state.form.cost_price || '',
                rules: [
                  {required: true, message: '请输入商品原价！'},
                  {pattern: /^[0-9]+([.]{1}[0-9]{1,2})?$/, message: '只能输入整数或小数(保留后两位)'}
                ]
              }
            )(<Input placeholder="请输入商品成本价" />)
            }
          </Form.Item>
          <Form.Item
            label="商品售价"
          >
            {getFieldDecorator(
              'sale_price',
              {
                initialValue: this.state.form.sale_price || '',
                rules: [
                  {required: true, message: '请输入商品售价！'},
                  {pattern: /^[0-9]+([.]{1}[0-9]{1,2})?$/, message: '只能输入整数或小数(保留后两位)'}
                ]
              }
            )(<Input placeholder="请输入商品售价" />)
            }
          </Form.Item>
          <Form.Item
            label="是否需要发货"
          >
            <RadioGroup onChange={this.selIspostEvent} value={this.state.form.is_post}>
              <Radio value={0}>是</Radio>
              <Radio value={1}>否</Radio>
            </RadioGroup>
          </Form.Item>
          <Form.Item
            label="商品图片"
          >
            <div className="col-md-6">
              <input type="file" accept="image/jpg,image/jpeg,image/png,image/bmp" onChange={this.uploadImgEvent} ref="file" name="file" className="valid coverfile" />
              <div className="ant-upload ant-upload-select ant-upload-select-picture-card upload-v-img adImgUrl">
                <span className="rc-upload coverbutton" role="button">
                  <i className="anticon anticon-plus">+</i>
                  <div className="ant-upload-text">上传广告图</div>
                </span>
              </div>
              <div className="ant-upload-list-item-info v-img-box ad_p_img">
                <i className="icon-close anticon-delete voucherImgIcon" />
              </div>
            </div>
          </Form.Item>
          <Form.Item
            label="商品详情"
            style={{height: 400}}
          >
            <ReactQuill
              placeholder="请输入商品描述详情。。。。。。"
              theme="snow"
              style={{width: 700, height: 300}}
              value={this.state.form.goods_details}
              onChange={this.handleChange}
              modules={{
                toolbar: [
                  ['bold', 'italic', 'underline', 'strike'],
                  ['blockquote', 'code-block'],
                  [{header: 1}, {header: 2}],
                  [{list: 'ordered'}, {list: 'bullet'}],
                  [{script: 'sub'}, {script: 'super'}],
                  [{indent: '-1'}, {indent: '+1'}],
                  [{direction: 'rtl'}],
                  [{header: [1, 2, 3, 4, 5, 6, false]}],
                  [{color: []}, {background: []}],
                  [{font: []}],
                  [{align: []}],
                  ['link', 'image', 'video'],
                  ['clean']
                ],
              }}
            />
          </Form.Item>
          <Form.Item>
            <div className="g-tc"><Button type="primary" htmlType="submit">保存</Button></div>
          </Form.Item>
        </Form>
      </div>
    );
  }
}
export default Form.create()(Add);
