import React, {Component} from 'react';
import {Form, Input, Radio, Button, message, Spin, Select} from 'antd';
import {Redirect} from 'react-router';
import ReactQuill from 'react-quill';//富文本编辑器(react-quill)
import 'react-quill/dist/quill.snow.css'; // ES6
import './list.css';
import api from '../../../api/api';
import utils from '../../../utils/common';
import TreeMenu from '../../../components/backEnd/treeMenu';//商品类型模版

const RadioGroup = Radio.Group;
const Option = Select.Option;
class Add extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: true,
      isShow: true, // 显示商品图片 false显示
      form: {
        goods_name: '', // 商品名称
        goods_category_id: '', // 商品类别ID
        goods_bar_no: '', // 商品条形码
        is_post: 0, // 是否需要发货
        sale_price: '', // 商品售价
        cost_price: '', // 商品成本
        goods_pic: require('../../../assets/backEnd/autoImg.jpg'), // 默认商品图片require('../../../assets/backEnd/autoImg.jpg')
        goods_details: '', // 商品描述
        goods_brand_name: null, // 商品品牌名称
        goods_brand_id: '', // 商品品牌id
        goods_property: '', // 商品属性 1 硬件 2 软件
        self_support: null, // 是否自营 1 是 2 否
        pay_type: 1, // 支付方式
        return_com_type: '', // 返佣类型 1 激活返佣 2 业绩返佣
        return_com_con: '', // 返佣条件
        return_com_price: '', // 返佣金额
        return_device_num: '', // 返佣设备数
        goods_activate_price: '', // 激活金额
        use_third_channel: '', // 是否调用第三方接口 1 是 2 否
        third_channel_id: '', // 第三方通道主键id
        channel_flag: '', // 接口厂商标识 1 MYBANK
        // edit
        sell_out: '', // 销售量
        status: '', // 商品状态
      },
      //is_rebeatstate: false, //选择业绩返佣，显示返佣条件
      redirect: false,
      maxLength: 10,
      isLoading: false,
      treeData: [], // 商品类别
      brandsList: [], // 品牌列表
      thirdChannelList: [], // 第三方场上列表
    };
  }

  componentWillMount() {
    if (window.common.loginOut(this)) {
      // 获取商品类型，商品品牌，第三方厂商
      Promise.all([window.api('goods.getcategorylist', {}), window.api('eps.getgoodsbrand', {brand_status: 1, page_size: 100}), window.api('goods.getthirdchannellist')]).then(res => {
        res[2].goods_third_channel_list.forEach(item => {
          item.id = Number(item.id);
        });
        res[1].goods_brand_list.forEach(item => {
          item.id = Number(item.id);
        });
        this.setState({treeData: res[0].goods_category_list, brandsList: res[1].goods_brand_list, thirdChannelList: res[2].goods_third_channel_list});
        this.initForm();
      }).catch(err => {
        if (err.service_error_code === 'EPS000000801') {
          this.setState({redirect: true});
        }
        message.error(err.service_error_message);
      });
    } else {
      message.error('登录信息失效，请重新登录');
    }
  }

  //生成条形码
  getbarno = () => {
    api.baseInstance('goods.getbarno', {}).then((rs) => {
      const form = Object.assign(this.state.form, {goods_bar_no: rs.barNo});
      this.setState({form});
      this.props.form.setFieldsValue({goods_bar_no: rs.barNo});
    }).catch(error => {
      message.error(error.service_error_message);
    });
  }

  // 上传图片
  uploadImgEvent = (e) => {
    e.preventDefault();
    const info = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(info);
    const flag = window.common.beforeUpload(info, message); //上传之前判断图片大小
    const _this = this;
    if (flag === true) {
      reader.onload = function () {
        const params = {pic_name: info.name, goods_pic: this.result};
        api.baseInstance('eps.upload', params).then(rs => {
          const form = Object.assign(_this.state.form, {goods_pic: rs.pic_path});
          _this.setState({form, isShow: false});
        }).catch(error => {
          message.error(error);
        });
      };
    }
  }

  // 编辑时初始化表格
  initForm = () => {
    if (!this.props.location.state.id) return false;
    window.api('goods.getgoodsdetail', {id: this.props.location.state.id}).then((res) => {
      let params = {...res};
      params.goods_pic = res.goods_picture;
      params.goods_picture = null;
      params = utils.dealElement(params);
      const form = Object.assign(this.state.form, params);
      this.setState({form, isShow: false});
    }).catch((error) => {
      if (error.service_error_code === 'EPS000000801') {
        this.setState({redirect: true});
      }
      message.error(error.service_error_message);
    });
  }

  // 添加商品
  addtionProEvent = (e) => {
    e.preventDefault();
    this.props.form.validateFields((err, values) => {
      if (!err) {
        const form = Object.assign(this.state.form, values);
        if (form.goods_property) {
          if (Number(form.goods_property) === 2) {
            if (!form.return_com_type) {
              message.error('请选择返佣方式');
              return;
            } else if (!form.use_third_channel) {
              message.error('请选择是否需要调用第三方接口');
              return;
            }
          } else if (Number(form.goods_property) === 1) {
            // eslint-disable-next-line no-lonely-if
            if (!form.self_support) {
              message.error('请选择该商品是否为自营');
              return;
            }
          }
        } else {
          message.error('请选择商品属性');
          return;
        }
        if (form.goods_pic === '/static/img/autoImg.fdadbc7.jpg') {
          message.error('请上传商品图片');
          return false;
        }
        if (form.goods_details === '') {
          message.error('请填写商品内容');
          return false;
        }
        const otherParams = {
          goods_brand_name: null,
          channel_flag: null
        };
        if (form.goods_brand_id) {
          this.state.brandsList.forEach(item => {
            item.id === form.goods_brand_id ? otherParams.goods_brand_name = item.brand_name : null;
          });
        }
        if (form.third_channel_id) {
          this.state.thirdChannelList.forEach(item => {
            item.id === form.third_channel_id ? otherParams.channel_flag = item.channel_flag : null;
          });
        }
        let params = Object.assign(form, otherParams);
        params = utils.dealElement(params);
        const url = form.id ? 'goods.modgoods' : 'goods.addgoods';
        window.api(url, params).then((res) => {
          if (res.service_error_code === 'EPS000000801') {
            message.error(res.service_error_message);
            this.setState({redirect: true});
          } else {
            message.success(res.service_error_message);
            this.props.history.push({pathname: '/main/list'});
          }
        });
      }
    });
  }

  // 关闭添加/编辑商品
  resetEvent = () => {
    this.props.history.goBack();
  }

  // 改变表单选项
  changeForm = (type, value) => {
    if (value === undefined) return;
    if (Object.prototype.toString.call(value) === '[Object String]' && value.test(/\s/g)) value = value.replace(/\s/g, '');
    let form = this.state.form;
    switch (type) {
      case 'goods_category_id':
        this.props.form.setFieldsValue({goods_category_id: value});
        break;
      case 'return_com_type':
        if (Number(value.target.value) === 1) {
          form = Object.assign(form, {return_com_con: ''});
        }
        value = value.target.value;
        break;
      case 'use_third_channel':
        if (Number(value.target.value) === 2) {
          form = Object.assign(form, {channel_flag: '', third_channel_id: ''});
        }
        value = value.target.value;
        break;
      case 'goods_property':
        if (Number(value.target.value) === 2) { // 硬件
          form = Object.assign(form, {self_support: ''});
        } else {
          const change = {
            return_com_type: '',
            return_com_con: '',
            return_com_price: '',
            return_device_num: '',
            goods_activate_price: '',
            use_third_channel: '',
            channel_flag: '',
            third_channel_id: '',
          };
          form = Object.assign(form, change);
        }
        value = value.target.value;
        break;
      case 'goods_details':
        value;
        break;
      default:
        value = value.target.value;
    }
    form = Object.assign(form, {[type]: value});
    this.setState({form});
  }

  render() {
    const {getFieldDecorator} = this.props.form;
    const {
      brandsList, redirect, isLoading, form, disabled, treeData, maxLength, isShow, thirdChannelList, showThirdChannel
    } = this.state;
    if (redirect) return (<Redirect to="/login" />);
    return (
      <div className="add-blocks">
        <Spin spinning={isLoading}>
          <Form onSubmit={this.addtionProEvent} className="form" name="form" id="form">
            <Form.Item
              label="商品名称"
            >
              {getFieldDecorator(
                'goods_name',
                {
                  initialValue: form.goods_name || '',
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
                  initialValue: form.goods_bar_no || '',
                  rules: [{required: true, message: '请生成商品条形码！'}]
                }
              )(<Input placeholder="请生成商品条形码" style={{width: '60%'}} disabled={disabled} />)
              }
              <Button type="primary" onClick={this.getbarno.bind(this)}>生成条形码</Button>
            </Form.Item>
            <Form.Item
              label="商品类型"
            >
              {getFieldDecorator(
                'goods_category_id',
                {
                  initialValue: form.goods_category_id || '',
                  rules: [
                    {required: true, message: '请选择商品类型'}
                  ]
                }
              )(<TreeMenu selParentEvent={this.changeForm.bind(this, 'goods_category_id')} parent_id={form.goods_category_id} treeData={treeData} />)
              }
            </Form.Item>
            <Form.Item
              label="商品品牌"
            >
              {getFieldDecorator(
                'goods_brand_id',
                {
                  initialValue: form.goods_brand_id || '',
                  rules: [
                    {required: true, message: '请选择商品品牌'}
                  ]
                }
              )(<Select style={{width: '60%'}}>
                {
                  brandsList.map((item, index) => (
                    <Option value={item.id} key={index}>{item.brand_name}</Option>
                  ))
                }
              </Select>)
              }
            </Form.Item>
            <Form.Item
              label="商品成本价"
            >
              {getFieldDecorator(
                'cost_price',
                {
                  initialValue: `${form.cost_price}` || '',
                  rules: [
                    {required: true, message: '请输入商品成本价！'},
                    {pattern: /^[0-9]+([.]{1}[0-9]{1,2})?$/, message: '只能输入整数或小数(保留后两位)'}
                  ]
                }
              )(<Input placeholder="请输入商品成本价" maxLength={maxLength} />)
              }元
            </Form.Item>
            <Form.Item
              label="商品售价"
            >
              {getFieldDecorator(
                'sale_price',
                {
                  initialValue: `${form.sale_price}` || '',
                  rules: [
                    {required: true, message: '请输入商品售价！'},
                    {pattern: /^[0-9]+([.]{1}[0-9]{1,2})?$/, message: '只能输入整数或小数(保留后两位)'}
                  ]
                }
              )(<Input placeholder="请输入商品售价" maxLength={maxLength} />)
              }元
            </Form.Item>
            <Form.Item
              label="付款方式"
            >
              {getFieldDecorator(
                'pay_type',
                {
                  initialValue: form.pay_type || '',
                  rules: [
                    {required: true, message: '请付款方式！'}
                  ]
                }
              )(<RadioGroup onChange={this.changeForm.bind(this, 'pay_type')}>
                <Radio value={1}>扣款</Radio>
                <Radio value={2}>冻结</Radio>
              </RadioGroup>)
              }
            </Form.Item>
            <Form.Item
              label="选择商品属性"
            >
              {getFieldDecorator(
                'goods_property',
                {
                  initialValue: form.goods_property || '',
                  rules: [
                    {required: true, message: '请选择商品属性！'}
                  ]
                }
              )(<RadioGroup onChange={this.changeForm.bind(this, 'goods_property')}>
                <Radio value={1}>软件</Radio>
                <Radio value={2}>硬件</Radio>
              </RadioGroup>)
              }
            </Form.Item>
            {
              Number(form.goods_property) === 2 ?
                (<div>
                  <Form.Item
                    label="选择返佣方式"
                  >
                    {
                      getFieldDecorator(
                        'return_com_type',
                        {
                          initialValue: form.return_com_type || '',
                          rules: [
                            {required: true, message: '请选择返佣方式！'}
                          ]
                        }
                      )(<RadioGroup onChange={this.changeForm.bind(this, 'return_com_type')}>
                        <Radio value={1}>激活返佣</Radio>
                        <Radio value={2}>业绩返佣</Radio>
                      </RadioGroup>)
                    }
                  </Form.Item>
                  <Form.Item
                    label="商品激活价格"
                  >
                    {getFieldDecorator(
                      'goods_activate_price',
                      {
                        initialValue: `${form.goods_activate_price}` || '',
                        rules: [
                          {required: true, message: '请输入商品激活价格！'},
                          {pattern: /^[0-9]+([.]{1}[0-9]{1,2})?$/, message: '只能输入整数或小数(保留后两位)'}
                        ]
                      }
                    )(<Input placeholder="请输入商品激活价格" maxLength={maxLength} />)
                    }元
                  </Form.Item>
                  <Form.Item
                    label="商品返佣价格"
                  >
                    {getFieldDecorator(
                      'return_com_price',
                      {
                        initialValue: `${form.return_com_price}` || '',
                        rules: [
                          {required: true, message: '请输入商品返佣价格！'},
                          {pattern: /^[0-9]+([.]{1}[0-9]{1,2})?$/, message: '只能输入整数或小数(保留后两位)'}
                        ]
                      }
                    )(<Input placeholder="请输入商品返佣价格" maxLength={maxLength} />)
                    }元
                  </Form.Item>
                  <Form.Item
                    label="返佣设备个数"
                  >
                    {getFieldDecorator(
                      'return_device_num',
                      {
                        initialValue: `${form.return_device_num}` || '',
                        rules: [
                          {required: true, message: '请输入商品返佣设备个数！'},
                          {pattern: /^[0-9]+([.]{1}[0-9]{1,2})?$/, message: '只能输入整数或小数(保留后两位)'}
                        ]
                      }
                    )(<Input placeholder="请输入商品返佣设备个数" maxLength={maxLength} />)
                    }个
                  </Form.Item>
                  {
                    form.return_com_type === 2 ? <Form.Item
                      label="返佣条件"
                    >
                      交易额满
                      {getFieldDecorator(
                        'return_com_con',
                        {
                          initialValue: `${form.return_com_con}` || '',
                          rules: [
                            {required: true, message: '请输入交易额！'},
                            {pattern: /^[0-9]+([.]{1}[0-9]{1,2})?$/, message: '只能输入整数或小数(保留后两位)'}
                          ]
                        }
                      )(<Input style={{width: '200px'}} placeholder="精确到小数点后两位" />)
                      }万元
                    </Form.Item> : null
                  }
                  <Form.Item
                    label="调用第三方接口"
                  >
                    {getFieldDecorator(
                      'use_third_channel',
                      {
                        initialValue: `${form.use_third_channel}` || '',
                        rules: [
                          {required: true, message: '请选择是否调用第三方接口！'},
                        ]
                      }
                    )(<RadioGroup onChange={this.changeForm.bind(this, 'use_third_channel')}>
                      <Radio value={1}>是</Radio>
                      <Radio value={2}>否</Radio>
                    </RadioGroup>)
                    }
                  </Form.Item>
                  {
                    Number(form.use_third_channel) === 1 ? <Form.Item
                      label="接口厂商"
                    >
                      {getFieldDecorator(
                        'third_channel_id',
                        {
                          initialValue: form.third_channel_id || '',
                          rules: [
                            {required: true, message: '请选择接口厂商'}
                          ]
                        }
                      )(<Select style={{width: '60%'}}>
                        {
                          thirdChannelList.map((item, index) => (
                            <Option value={item.id} key={index}>{item.channel_name}</Option>
                          ))
                        }
                      </Select>)
                      }
                    </Form.Item> : null
                  }
                </div>)
                : null
            }
            {
              Number(form.goods_property) === 1 ? <Form.Item
                label="是否为自营"
              >
                {getFieldDecorator(
                  'self_support',
                  {
                    initialValue: form.self_support || '',
                    rules: [
                      {required: true, message: '请选择是否为自营'}
                    ]
                  },
                )(<RadioGroup onChange={this.changeForm.bind(this, 'self_support')}>
                  <Radio value={1}>自营</Radio>
                  <Radio value={2}>非自营</Radio>
                </RadioGroup>)
                }
              </Form.Item> : null
            }
            <Form.Item
              label="是否需要发货"
            >
              {getFieldDecorator(
                'is_post',
                {
                  initialValue: form.is_post || '',
                  rules: [
                    {required: true, message: '请选择是否发货'}
                  ]
                },
              )(<RadioGroup onChange={this.changeForm.bind(this, 'is_post')}>
                <Radio value={0}>是</Radio>
                <Radio value={1}>否</Radio>
              </RadioGroup>)
              }
            </Form.Item>
            <div className="content">
              <div className="ant-form-item-label">
                <label className="ant-form-item-required">商品图片</label>
              </div>
              <div className="col-md-6">
                <input type="file" accept="image/jpg,image/jpeg,image/png,image/bmp" onChange={this.uploadImgEvent} ref="file" name="file" className="valid coverfile" />
                <img src={form.goods_pic} className={`show-pic ${isShow === true ? 'hide' : null}`} />
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
                  value={form.goods_details}
                  onChange={this.changeForm.bind(this, 'goods_details')}
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
