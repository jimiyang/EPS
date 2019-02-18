import React, {Component} from 'react';

import {
  Form,
  Input,
  Radio,
  Button,
  Upload,
  Icon,
  message,
  Modal
} from 'antd';

import ReactQuill from 'react-quill';//富文本编辑器(react-quill)

import 'react-quill/dist/quill.snow.css'; // ES6

import './list.css';

import Tree from './treeMenu';//树形结构商品类型

const RadioGroup = Radio.Group;
class Add extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      form: {
        is_post: 0,
        goodDetaile: ''
      }
    };
    //this.handleChange = this.handleChange.bind(this);
  }
  componentWillMount() {
    console.log(this.props);
  }
  componentDidMount() {
    const textbox = this.refs.textarea;
  }
  handleSubmit = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        console.log('Received values of form: ', values);
        console.log(this.state.form.goodDetaile);
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
      this.setState({ loading: true });
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
        <Form onSubmit={this.handleSubmit} className="form" name="form">
          <Form.Item
            label="商品名称"
          >
            {getFieldDecorator(
              'goods_name',
              {
                rules: [{required: true, message: '请输入商品名称！'}]
              }
            )(<Input />)
            }
          </Form.Item>
          <Form.Item
            label="商品条形码"
          >
            <div>
              {getFieldDecorator(
                'goods_bar_no',
                {
                  rules: [{required: true, message: '请输入商品条形码！'}]
                }
              )(<Input />)
              }
              <Button type="primary">生成条形码</Button>
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
            )(<Input />)
            }
          </Form.Item>
          <Form.Item
            label="商品成本价"
          >
            {getFieldDecorator(
              'cost_price',
              {
                rules: [{required: true, message: '请输入商品原价！'}]
              }
            )(<Input />)
            }
          </Form.Item>
          <Form.Item
            label="商品售价"
          >
            {getFieldDecorator(
              'sale_price',
              {
                rules: [{required: true, message: '请输入商品售价！'}]
              }
            )(<Input />)
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
              style={{ width: 700, height: 300 }}
              value={this.state.form.goodDetaile}
              onChange={this.handleChange}
              modules={{
                toolbar: [
                  ['bold', 'italic', 'underline', 'strike'],
                  ['blockquote', 'code-block'],
                  [{header: 1 }, {header: 2 }],
                  [{list: 'ordered'}, {list: 'bullet'}],
                  [{script: 'sub'}, {script: 'super' }],
                  [{indent: '-1'}, {indent: '+1' }],
                  [{direction: 'rtl' }],
                  [{header: [1, 2, 3, 4, 5, 6, false] }],
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
