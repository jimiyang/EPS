import React, {Component} from 'react';

import {
  Form,
  Input,
  Radio,
  Button,
  Upload,
  Icon,
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
      loading: false,
      disabled: true,
      goods_bar_no: '',
      form: {
        is_post: 0,
        goods_details: '',
        goods_category_id: '',
      },
      goods_picture: ''
    };
    //this.handleChange = this.handleChange.bind(this);
  }
  componentWillMount() {
    this.initForm();
    console.log(this.state.goods_picture);
  }
  componentDidMount() {
    const textbox = this.refs.textarea;
  }
  initForm = () => {
    if (!this.props.location.query) {
      return false;
    }
    //console.log(this.props.location.query.id);
    console.log(window.api);
    window.api('goods.getgoodsdetail', {goods_id: this.props.location.query.id}).then((rs) => {
      console.log(rs);
    });
  }
  addtionProEvent = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const form = Object.assign(this.state.form, values);
        console.log(form);
        this.setState({
          form
        });
        if (!this.props.location.query) {
          console.log('add');
          window.api('goods.addgoods', form, {goods_picture: this.state.goods_picture}).then((rs) => {
            console.log(rs);
          });
        } else {
          console.log('edit');
          window.api('goods.modgoods', form).then((rs) => {
            console.log(rs);
          });
        }
      }
    });
  }
  uploadFile = (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    const reader = new FileReader();
  }
  getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
    console.log(reader);
  }
  beforeUpload = (file) => {
    const isJPG = file.type === 'image/jpeg';
    if (!isJPG) {
      message.error('You can only upload JPG file!');
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error('Image must smaller than 2MB!');
    }
    return isJPG && isLt2M;
  }
  uploadImgEvent = (e) => {
    e.preventDefault();
    const info = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(info);
    reader.onload = function (ev) {
      const params = {
        filePath: 'goods_pic',
        fileName: info.name,
        uploadPic: this.result
      };
      console.log(params);
      window.uploadFile(params).then(rs => {
        console.log(rs);
      });
    };
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
      this.setState({
        goods_bar_no: rs.barNo
      });
    }).catch(error => {
      message.error(error);
    });
  }
  displayRender(label) {
    return label[label.length - 1];
  }
  selParentEvent = (value) => {
    const form = Object.assign(this.state.form, {goods_category_id: value});
    console.log(form);
    this.setState({
      form
    });
  }
  selIspostEvent = (value) => {
    const form = Object.assign(this.state.form, {is_post: value});
    this.setState({
      form
    });
  }
  render() {
    const {getFieldDecorator} = this.props.form;
    const imageUrl = this.state.imageUrl;
    const uploadButton = (
      <div>
        <Icon type={this.state.loading ? 'loading' : 'plus'} />
        <div className="ant-upload-text">请上传2M以内,JPG/JPEG/PNG格式</div>
      </div>
    );
    return (
      <div className="add-blocks">
        <Form onSubmit={this.addtionProEvent} className="form" name="form">
          <Form.Item
            label="商品名称"
          >
            {getFieldDecorator(
              'goods_name',
              {
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
                  initialValue: this.state.goods_bar_no || '',
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
              <input type="file" accept="image/jpg,image/jpeg,image/png" onChange={this.uploadImgEvent} ref="file" name="file" className="valid coverfile" />
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
