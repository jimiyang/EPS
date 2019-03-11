import React, {Component} from 'react';
import {
  Form,
  Input,
  Radio,
  Button,
  message
} from 'antd';
import {Redirect} from 'react-router';
import ReactQuill from 'react-quill';//富文本编辑器(react-quill)
import 'react-quill/dist/quill.snow.css'; // ES6
import './list.css';
import api from '../../../api/api';
import TreeMenu from '../../../components/backEnd/treeMenu';//商品类型模版

const RadioGroup = Radio.Group;
class Add extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: true,
      isShow: true,
      form: {
        goods_bar_no: '',
        is_post: 0,
        goods_details: '',
        goods_category_id: '',
        goods_pic: require('../../../assets/backEnd/autoImg.jpg')//默认图片
      },
      redirect: false,
      maxLength: 10
    };
  }
  componentWillMount() {
    this.initForm();
    //验证是否需要登录
    window.common.loginOut(this, message);
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
      const params = {
        goods_name: rs.goods_name,
        goods_bar_no: rs.goods_bar_no,
        goods_category_id: pid,
        cost_price: rs.cost_price,
        sale_price: rs.sale_price,
        is_post: rs.is_post,
        goods_details: rs.goods_details,
        id: rs.id,
        goods_pic: rs.goods_picture
      };
      const form = Object.assign(this.state.form, params);
      this.setState({
        form
      });
    }).catch(error => {
      message.error(error);
      if (error === '用户信息失效，请重新登录') {
        this.setState({
          redirect: true
        });
      }
    });
  }
  addtionProEvent = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const form = Object.assign(this.state.form, values);
        //console.log(values);
        this.setState({
          form
        });
        //console.log(this.state.form.goods_details);
        if (this.state.form.goods_bar_no === '') {
          message.error('请生成商品条形码');
          return false;
        }
        if (this.state.form.goods_pic === '/static/img/autoImg.fdadbc7.jpg') {
          message.error('请上传商品图片');
          return false;
        }
        if (this.state.form.goods_details === '') {
          message.error('请填写商品内容');
          return false;
        }
        if (!this.props.location.query) {
          window.api('goods.addgoods', form).then((rs) => {
            message.success(rs.service_error_message);
            this.props.history.push({pathname: '/main/list'});
          }).catch(error => {
            message.error(error);
          });
        } else {
          window.api('goods.modgoods', form).then((rs) => {
            message.success(rs.service_error_message);
            this.props.history.push({pathname: '/main/list'});
          }).catch(error => {
            message.error(error);
          });
        }
      }
    });
  }
  resetEvent = () => {
    /*this.props.form.resetFields();
    const form = {
      goods_bar_no: '',
      is_post: 0,
      goods_details: '',
      goods_category_id: '',
      goods_pic: require('../../../assets/backEnd/autoImg.jpg')//默认图片
    };
    this.setState({
      form
    });*/
    this.props.history.push({pathname: '/main/list'});
  }
  uploadImgEvent = (e) => {
    e.preventDefault();
    const info = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(info);
    const flag = window.common.beforeUpload(info, message); //上传之前判断图片大小
    const _this = this;
    if (flag === true) {
      reader.onload = function (ev) {
        const params = {
          pic_name: info.name,
          goods_pic: this.result
        };
        api.baseInstance('eps.upload', params).then(rs => {
          const form = Object.assign(_this.state.form, {goods_pic: rs.pic_path});
          _this.setState({
            form,
            isShow: false
          });
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
    const form = Object.assign(this.state.form, {goods_category_id: value});
    this.setState({
      form
    });
    this.props.form.setFieldsValue({
      goods_category_id: value
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
    if (this.state.redirect) {
      return (<Redirect to="/login" />);
    }
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
          <div className="content">
            <div className="ant-form-item-label">
              <label className="ant-form-item-required">商品条形码</label>
            </div>
            <div className="ant-form-item-control-wrapper">
              <Input placeholder="请生成商品条形码" disabled={this.state.disabled} value={this.state.form.goods_bar_no} />
              <Button type="primary" onClick={this.getbarno.bind(this)}>生成条形码</Button>
            </div>
          </div>
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
            )(<Input placeholder="请输入商品成本价" maxLength={this.state.maxLength} />)
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
            )(<Input placeholder="请输入商品售价" maxLength={this.state.maxLength} />)
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
          <div className="content">
            <div className="ant-form-item-label">
              <label className="ant-form-item-required">商品图片</label>
            </div>
            <div className="col-md-6">
              <input type="file" accept="image/jpg,image/jpeg,image/png,image/bmp" onChange={this.uploadImgEvent} ref="file" name="file" className="valid coverfile" />
              <img src={this.state.form.goods_pic} className={`show-pic ${this.state.isShow === true ? 'hide' : null}`} />
              <div className="ant-upload ant-upload-select ant-upload-select-picture-card upload-v-img adImgUrl">
                <span className="rc-upload coverbutton" role="button">
                  <i className="anticon anticon-plus">+</i>
                  <div className="ant-upload-text">上传商品图</div>
                </span>
              </div>
              <div className="ant-upload-list-item-info v-img-box ad_p_img">
                <i className="icon-close anticon-delete voucherImgIcon" />
              </div>
            </div>
          </div>
          <div className="content" style={{height: 400}}>
            <div className="ant-form-item-label">
              <label className="ant-form-item-required">商品详情</label>
            </div>
            <div>
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
            </div>
          </div>
          <Form.Item>
            <div className="g-tc">
              <Button type="primary" htmlType="submit">保存</Button>
              <Button style={{marginLeft: 8}} onClick={this.resetEvent}>
                取消
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    );
  }
}
export default Form.create()(Add);
