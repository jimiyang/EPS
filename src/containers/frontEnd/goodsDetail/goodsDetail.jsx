import React, {Component} from 'react';
import {InputNumber, message} from 'antd';
import {Redirect} from 'react-router';
import './goodsDetail.less';

class GoodsDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 1, // 购买的商品数量
      detail: {}, // 商品详情
      redirect: false,
    };
  }
  componentWillMount() {
    if (window.common.loginOut(this)) {
      this.getDetail(this.props.location.state.id);
    } else {
      message.error('登录信息失效，请重新登录');
    }
  }

  // 跳转到生成订单页
  toOrder = () => {
    const {detail} = this.state;
    const goodsDetail = {
      img: detail.goods_picture,
      count: this.state.count,
      price: detail.sale_price,
      name: detail.goods_name,
      id: detail.id,
    };
    this.props.history.push('/generateOrder', {info: goodsDetail});
  }

  // 改变购买数量
  changeCount = (value) => {
    this.setState({count: value});
  }

  // 获取商品信息
  getDetail = (id) => {
    const params = {id};
    window.api('goods.getgoodsdetail', params).then(res => {
      res.sale_price = (res.sale_price).toFixed(2);
      this.setState({detail: res});
    }).catch((error) => {
      if (error.service_error_code === 'EPS000000801') {
        this.setState({redirect: true});
      }
      message.error(error.service_error_message);
    });
  }
  render() {
    if (this.state.redirect) {
      return (<Redirect to="/login" />);
    }
    const detail = this.state.detail;
    return (
      <div id="goodsDetail">
        <section className="sale">
          <div className="poster">
            <img src={detail.goods_picture} />
          </div>
          <div className="info">
            <h3>{detail.goods_name}</h3>
            <div className="price">
              <p><em>￥</em>{detail.sale_price}</p>
            </div>
            {/* <div className="address">
              <p>发货地：</p>
              <p>{detail.address}</p>
              <p>24小时发货</p>
            </div> */}
            <div className="count">
              <p>数量：</p>
              <div>
                <InputNumber min={1} max={999} defaultValue={1} onChange={this.changeCount} />
              </div>
            </div>
            <button onClick={this.toOrder}>立即购买</button>
          </div>
        </section>
        <section className="detail">
          <div className="title">商品详情</div>
          <div className="content" dangerouslySetInnerHTML={{__html: detail.goods_details}} />
        </section>
      </div>
    );
  }
}

export default GoodsDetail;
