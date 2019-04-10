import React, {Component} from 'react';
import {Modal, message} from 'antd';
import {Redirect} from 'react-router';
import './cashier.less';

class Cashier extends Component {
  constructor(props) {
    super(props);
    this.state = {
      detail: {},
      payInfo: {},
      index: 0, // 支付模式 0 返佣账户 1 充值账户
      payMode: ['返佣账户'], // ['返佣账户', '充值账户']
      ModalText: '确认支付当前订单？',
      visible: false,
      confirmLoading: false,
      redirect: false,
    };
  }

  componentWillMount() {
    if (window.common.loginOut(this)) {
      const detail = this.props.location.state.info;
      this.setState({detail});
      this.getPayInfo();
    } else {
      message.error('登录信息失效，请重新登录');
    }
  }

  // 改变付款方式
  changeWay = (index) => {
    this.setState({index});
  }

  // 获取支付信息
  getPayInfo() {
    const params = {
      login_name: JSON.parse(window.localStorage.getItem('headParams')).login_name
    };
    window.api('Info.getaccountlist', params).then(res => {
      res.account[0].available_balance = (Number(res.account[0].available_balance)).toFixed(2);
      this.setState({payInfo: res.account[0]});
    }).catch((error) => {
      error.service_error_code === 'EPS000000801' ? this.setState({redirect: true}) : null;
      message.error(error.service_error_message);
    });
  }

  // 打开支付窗口
  showModal = () => {
    this.setState({
      visible: true,
    });
  }

  // 确认支付
  handleOk = () => {
    this.setState({
      ModalText: '正在支付，请稍候',
      confirmLoading: true,
    });
    const {detail, index, payInfo} = this.state;
    const params = {
      order_no: detail.order_no,
      pay_mode: index,
      pay_account_no: payInfo.account_no,
      account_balance: payInfo.available_balance
    };
    window.api('trade.innerpay', params).then(() => {
      message.success('支付成功');
      this.setState({
        visible: false,
        confirmLoading: false,
        ModalText: '确认支付当前订单？',
      });
      this.props.history.push('/successfulPayment', {order_no: params.order_no});
    }).catch((error) => {
      error.service_error_code === 'EPS000000801' ? this.setState({redirect: true}) : null;
      this.setState({
        visible: false,
        confirmLoading: false,
        ModalText: '确认支付当前订单？',
      });
      message.error(error.service_error_message);
    });
  }

  // 关闭支付窗口
  handleCancel = () => {
    this.setState({
      visible: false,
    });
  }

  render() {
    if (this.state.redirect) {
      return (<Redirect to="/login" />);
    }
    const {
      visible, confirmLoading, ModalText, payMode, detail, payInfo
    } = this.state;
    return (
      <div id="cashier">
        <div>
          <Modal
            visible={visible}
            onOk={this.handleOk}
            confirmLoading={confirmLoading}
            onCancel={this.handleCancel}
          >
            <p>{ModalText}</p>
          </Modal>
        </div>
        <section className="pay">
          <div>订单提交成功，请尽快付款！订单号：{detail.order_no}</div>
          <div className="money">应付金额<p>{detail.total_amt}</p>元</div>
        </section>
        <section className="info">
          <p>收货地址：{detail.address}</p>
          <p>商品名称：{detail.goods_name}</p>
        </section>
        <section className="way">
          <div className="title">选择支付方式</div>
          <div className="content">
            <ul>
              {
                payMode.map((item, index) => (
                  <li onClick={this.changeWay.bind(this, index)} key={index}>
                    <div>
                      <span className={this.state.index === index ? 'isChecked' : 'notChecked'} />
                      <p className="name">{item}</p>
                    </div>
                    <p className="remainder">账户余额: ￥{payInfo.available_balance}</p>
                    <p className={this.state.index === index ? null : 'notChecked'}>支付<span className="price">{detail.real_amt}</span>元</p>
                  </li>
                ))
              }
            </ul>
          </div>
        </section>
        <section className="button">
          <button onClick={this.showModal}>立即支付</button>
        </section>
      </div>
    );
  }
}

export default Cashier;
