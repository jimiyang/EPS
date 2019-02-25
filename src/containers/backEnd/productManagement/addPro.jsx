import React, {Component} from 'react';

import {
  Form,
  Input,
  Radio,
  Button,
  Upload,
  Icon,
  message,
  Cascader
} from 'antd';

import ReactQuill from 'react-quill';//富文本编辑器(react-quill)

import 'react-quill/dist/quill.snow.css'; // ES6

import './list.css';

import api from '../../../api/instance.js';

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
        goodDetaile: '',
        goods_category_id: '',
        goods_category_name: 'wwwww',
      }
    };
    //this.handleChange = this.handleChange.bind(this);
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
    // console.log(this.props.location.query.id);
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        console.log(this.state.form.goodDetaile);
        this.setState({
          form: {
            is_post: 0
          }
        });
      }
    });
  }
  getBase64 = (img, callback) => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
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
  uploadImgEvent = (info) => {
    if (info.file.status === 'uploading') {
      this.setState({loading: true});
      return;
    }
    if (info.file.status === 'done') {
      // Get this url from response in real world.
      this.getBase64(info.file.originFileObj, imageUrl => this.setState({
        imageUrl,
        loading: false,
      }));
    }
  }
  handleChange = (value) => {
    this.setState({
      form: {
        goodDetaile: value
      }
    });
  }
  //生成条形码
  getbarno = () => {
    const params = {
      service: 'goods.getbarno',
      sign: 'ewqrewq',
      partner_id: '22',
      login_name: 'TMMD'
    };
    //console.log(JSON.stringify(params));
    api.baseInstance(params).then((rs) => {
      console.log(rs);
    });
    this.setState({
      goods_bar_no: '3838737373373'
    });
  }
  displayRender(label) {
    return label[label.length - 1];
  }
  onChange = (value) => {
    // console.log(value[value.length - 1]);
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
    const data = [
      {
        value: '1-1',
        label: '父级1',
        children: [{
          value: '1-01',
          label: '子级1',
        }]
      },
      {
        value: '1-2',
        label: '父级2',
        children: [{
          value: '1-02',
          label: '子级2',
        }],
      }
    ];
    return (
      <div className="add-blocks">
        <Form onSubmit={this.handleSubmit} className="form" name="form">
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
              'goods_category_name',
              {
                rules: [{required: true, message: '请选择商品类型！'}]
              }
            )(<Cascader
              placeholder="请选择商品类型"
              options={data}
              expandTrigger="hover"
              displayRender={this.displayRender}
              onChange={this.onChange.bind(this)}
            />)
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
                  {pattern: /^[0-9]+([.]{1}[0-9]{1,2})?$/, message: '只能输入整数或小数（保留后两位）'}
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
                  {pattern: /^[0-9]+([.]{1}[0-9]{1,2})?$/, message: '只能输入整数或小数（保留后两位）'}
                ]
              }
            )(<Input placeholder="请输入商品售价" />)
            }
          </Form.Item>
          <Form.Item
            label="是否需要发货"
          >
            <RadioGroup onChange={this.onChange} value={this.state.form.is_post}>
              <Radio value={0}>是</Radio>
              <Radio value={1}>否</Radio>
            </RadioGroup>
          </Form.Item>
          <Form.Item
            label="商品图片"
          >
            <Upload
              name="avatar"
              listType="picture-card"
              className="avatar-uploader"
              showUploadList={false}
              action="//jsonplaceholder.typicode.com/posts/"
              beforeUpload={this.beforeUpload}
              onChange={this.uploadImgEvent}
            >
              {imageUrl ? <img src={imageUrl} alt="avatar" /> : uploadButton}
            </Upload>
          </Form.Item>
          <Form.Item
            label="商品详情"
            style={{height: 400 }}
          >
            <ReactQuill
              placeholder="请输入商品描述详情。。。。。。"
              theme="snow"
              style={{width: 700, height: 300}}
              value={this.state.form.goodDetaile}
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
