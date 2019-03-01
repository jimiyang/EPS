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
      disabled: true,
      goods_bar_no: '',
      form: {
        is_post: 0,
        goods_details: '',
        goods_category_id: '',
        goods_pic: ''
      },
      formData: ''
    };
    //this.handleChange = this.handleChange.bind(this);
  }
  componentWillMount() {
    this.initForm();
    this.setState({
      formData: new FormData()
    });
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
        console.log(values);
        this.setState({
          form
        });
        if (!this.props.location.query) {
          console.log('add');
          window.api('goods.addgoods', form).then((rs) => {
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
  getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
    console.log(reader);
  }
  uploadImgEvent = (e) => {
    e.preventDefault();
    const info = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(info);
    const flag = window.common.beforeUpload(info, message); //上传之前判断图片大小
    this.state.formData.append('upload', info);
    //console.log(this.state.formData);
    if (flag === true) {
      const headers = {
        'Content-Type': 'multipart/form-data'
      };
      api.baseInstance('eps.upload', null, this.state.formData, headers).then(rs => {
        console.log(rs);
      }).catch(error => {
        message.error(error);
      });
      /*reader.onload = function (ev) {
        const params = {
          filePath: 'goods_pic',
          fileName: info.name,
          uploadPic: this.result
        };
      };*/
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
    return (
      <div className="add-blocks">
        <Form onSubmit={this.addtionProEvent} className="form" name="form" id="form">
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
