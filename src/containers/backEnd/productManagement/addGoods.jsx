import React, {Component} from 'react';
import {
  Form,
  Input,
  Radio,
  Button,
  message,
  Spin,
  Select
} from 'antd';
import {Redirect} from 'react-router';
import ReactQuill from 'react-quill';//富文本编辑器(react-quill)
import 'react-quill/dist/quill.snow.css'; // ES6
import './list.css';
import api from '../../../api/api';
import TreeMenu from '../../../components/backEnd/treeMenu';//商品类型模版

const RadioGroup = Radio.Group;
const Option = Select.Option;
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
        cost_price: '',
        sale_price: '',
        goods_pic: require('../../../assets/backEnd/autoImg.jpg'), //默认图片require('../../../assets/backEnd/autoImg.jpg')
        pay_type: 0, //付款方式
        is_attribute: '', //选择商品属性
        is_self: 0, //是否自营
        rebate_type: 0, //返佣方式
      },
      is_hardwarestate: false, //判断是否选择的硬件，显示硬件的条件
      is_selfstate: false, //判断商品属性是软件，是否显示自营、非自营
      //is_rebeatstate: false, //选择业绩返佣，显示返佣条件
      redirect: false,
      maxLength: 10,
      isLoading: false
    };
  }
  componentWillMount() {
    if (window.common.loginOut(this)) {
      this.initForm();
    } else {
      message.error('登录信息失效，请重新登录');
    }
  }
  componentDidMount() {
    const textbox = this.refs.textarea;
  }
  initForm = () => {
    if (!this.props.location.query) {
      return false;
    }
    window.api('goods.getgoodsdetail', {id: this.props.location.query.id}).then((res) => {
      const pid = res.goods_category_id === '' ? 0 : res.goods_category_id;
      const params = {
        goods_name: res.goods_name,
        goods_bar_no: res.goods_bar_no,
        goods_category_id: pid,
        cost_price: res.cost_price,
        sale_price: res.sale_price,
        is_post: res.is_post,
        goods_details: res.goods_details,
        id: res.id,
        goods_pic: res.goods_picture
      };
      const form = Object.assign(this.state.form, params);
      this.setState({
        form
      });
    }).catch((error) => {
      if (error.service_error_code === 'EPS000000801') {
        this.setState({redirect: true});
      }
      message.error(error.service_error_message);
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
        if (this.state.form.goods_pic === '/static/img/autoImg.fdadbc7.jpg') {
          message.error('请上传商品图片');
          return false;
        }
        if (this.state.form.goods_details === '') {
          message.error('请填写商品内容');
          return false;
        }
        if (!this.props.location.query) {
          window.api('goods.addgoods', form).then((res) => {
            if (res.service_error_code === 'EPS000000801') {
              message.error(res.service_error_message);
              this.setState({redirect: true});
            } else {
              message.success(res.service_error_message);
              this.props.history.push({pathname: '/main/list'});
            }
          });
        } else {
          window.api('goods.modgoods', form).then((res) => {
            if (res.service_error_code === 'EPS000000801') {
              message.error(res.service_error_message);
              this.setState({redirect: true});
            } else {
              message.success(res.service_error_message);
              this.props.history.push({pathname: '/main/list'});
            }
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
      this.props.form.setFieldsValue({
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
  //选择付款方式
  selpayTypeEvent = (e) => {
    const form = Object.assign(this.state.form, {pay_type: e.target.value});
    this.setState({
      form
    });
  }
  //选择商品属性
  selAttributeEvent = (e) => {
    let hardwarestate = '';
    let selfstate = '';
    let rebatetype = '';
    if (e.target.value === 0) {
      hardwarestate = true;
      selfstate = false;
    } else {
      hardwarestate = false;
      selfstate = true;
      rebatetype = 0;
    }
    const form = Object.assign(this.state.form, {is_attribute: e.target.value, rebate_type: rebatetype});
    this.setState({
      form,
      is_hardwarestate: hardwarestate,
      is_selfstate: selfstate
    });
  }
  selSelfEvent = (e) => {
    const form = Object.assign(this.state.form, {is_self: e.target.value});
    this.setState({
      form
    });
  }
  selRebateEvent = (e) => {
    const form = Object.assign(this.state.form, {rebate_type: e.target.value});
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
        <Spin spinning={this.state.isLoading}>
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
              {getFieldDecorator(
                'goods_bar_no',
                {
                  initialValue: this.state.form.goods_bar_no || '',
                  rules: [{required: true, message: '请输入商品名称！'}]
                }
              )(<Input placeholder="请生成商品条形码" style={{width: '60%'}} disabled={this.state.disabled} />)
              }
              <Button type="primary" onClick={this.getbarno.bind(this)}>生成条形码</Button>
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
              label="商品品牌"
            >
              {getFieldDecorator(
                'goods_category_id',
                {
                  initialValue: this.state.form.goods_category_id || '',
                  rules: [
                    {required: true, message: '请选择商品品牌'}
                  ]
                }
              )(<Select style={{width: '60%'}}>
                <Option value="lucy">Lucy</Option>
              </Select>)
              }
            </Form.Item>
            <Form.Item
              label="商品成本价"
            >
              {getFieldDecorator(
                'cost_price',
                {
                  initialValue: `${this.state.form.cost_price}`,
                  rules: [
                    {required: true, message: '请输入商品成本价！'},
                    {pattern: /^[0-9]+([.]{1}[0-9]{1,2})?$/, message: '只能输入整数或小数(保留后两位)'}
                  ]
                }
              )(<Input placeholder="请输入商品成本价" maxLength={this.state.maxLength} />)
              }元
            </Form.Item>
            <Form.Item
              label="商品售价"
            >
              {getFieldDecorator(
                'sale_price',
                {
                  initialValue: `${this.state.form.sale_price}`,
                  rules: [
                    {required: true, message: '请输入商品售价！'},
                    {pattern: /^[0-9]+([.]{1}[0-9]{1,2})?$/, message: '只能输入整数或小数(保留后两位)'}
                  ]
                }
              )(<Input placeholder="请输入商品售价" maxLength={this.state.maxLength} />)
              }元
            </Form.Item>
            <Form.Item
              label="付款方式"
            >
              <RadioGroup onChange={this.selpayTypeEvent} value={this.state.form.pay_type}>
                <Radio value={0}>冻结</Radio>
                <Radio value={1}>扣款</Radio>
              </RadioGroup>
            </Form.Item>
            <Form.Item
              label="选择商品属性"
            >
              <RadioGroup onChange={this.selAttributeEvent} value={this.state.form.is_attribute}>
                <Radio value={0}>硬件</Radio>
                <Radio value={1}>软件</Radio>
              </RadioGroup>
            </Form.Item>
            <Form.Item
              label="选择返佣方式"
              className={this.state.is_hardwarestate === true ? null : 'hide'}
            >
              <RadioGroup onChange={this.selRebateEvent} value={this.state.form.rebate_type}>
                <Radio value={0}>激活返佣</Radio>
                <Radio value={1}>业余返佣</Radio>
              </RadioGroup>
            </Form.Item>
            <Form.Item
              label="商品激活价格"
              className={this.state.is_hardwarestate === true ? null : 'hide'}
            >
              {getFieldDecorator(
                'sale_price',
                {
                  initialValue: `${this.state.form.sale_price}`,
                  rules: [
                    {required: true, message: '请输入商品激活价格！'},
                    {pattern: /^[0-9]+([.]{1}[0-9]{1,2})?$/, message: '只能输入整数或小数(保留后两位)'}
                  ]
                }
              )(<Input placeholder="请输入商品激活价格" maxLength={this.state.maxLength} />)
              }元
            </Form.Item>
            <Form.Item
              label="商品返佣价格"
              className={this.state.is_hardwarestate === true ? null : 'hide'}
            >
              {getFieldDecorator(
                'sale_price',
                {
                  initialValue: `${this.state.form.sale_price}`,
                  rules: [
                    {required: true, message: '请输入商品返佣价格！'},
                    {pattern: /^[0-9]+([.]{1}[0-9]{1,2})?$/, message: '只能输入整数或小数(保留后两位)'}
                  ]
                }
              )(<Input placeholder="请输入商品返佣价格" maxLength={this.state.maxLength} />)
              }元
            </Form.Item>
            <Form.Item
              label="返佣设备个数"
              className={this.state.is_hardwarestate === true ? null : 'hide'}
            >
              {getFieldDecorator(
                'sale_price',
                {
                  initialValue: `${this.state.form.sale_price}`,
                  rules: [
                    {required: true, message: '请输入商品返佣设备个数！'},
                    {pattern: /^[0-9]+([.]{1}[0-9]{1,2})?$/, message: '只能输入整数或小数(保留后两位)'}
                  ]
                }
              )(<Input placeholder="请输入商品返佣设备个数" maxLength={this.state.maxLength} />)
              }元
            </Form.Item>
            <Form.Item
              label="返佣条件"
              className={this.state.form.rebate_type === 1 ? null : 'hide'}
            >
              交易额满
              {getFieldDecorator(
                'rebeat_conditions',
                {
                  rules: [
                    {required: true, message: '请输入交易额！'},
                    {pattern: /^[0-9]+([.]{1}[0-9]{1,2})?$/, message: '只能输入整数或小数(保留后两位)'}
                  ]
                }
              )(<Input style={{width: '200px'}} placeholder="精确到小数点后两位" />)
              }元
            </Form.Item>
            <Form.Item
              label="是否为自营"
              className={this.state.is_selfstate === true ? null : 'hide'}
            >
              <RadioGroup onChange={this.selSelfEvent} value={this.state.form.is_self}>
                <Radio value={0}>自营</Radio>
                <Radio value={1}>非自营</Radio>
              </RadioGroup>
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
                  placeholder="请输入商品描述详情"
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
        </Spin>
      </div>
    );
  }
}
export default Form.create()(Add);
