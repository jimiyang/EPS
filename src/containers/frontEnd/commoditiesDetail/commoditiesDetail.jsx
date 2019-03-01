import React, {Component} from 'react';
import {InputNumber} from 'antd';
import './commoditiesDetail.less';

class CommoditiesDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 1, // 购买的商品数量
      detail: {}, // 商品详情
    };
  }
  componentWillMount() {
    this.getDetail(this.props.location.state.id);
  }
  componentDidMount() {
  }
  // 跳转到生成订单页
  toOrder = () => {
    const {detail} = this.state;
    const commoditiesDetail = {
      img: detail.goods_picture,
      count: this.state.count,
      price: detail.sale_price,
      name: detail.goods_name,
      barNo: detail.goods_bar_no,
    };
    this.props.history.push('/generateOrder', {info: commoditiesDetail});
  }

  // 改变购买数量
  changeCount = (value) => {
    this.setState({count: value});
  }

  // 获取商品信息
  getDetail = (id) => {
    const params = {id};
    window.api('goods.getgoodsdetail', params).then(res => {
      this.setState({detail: res});
    });
  }
  render() {
    const detail = this.state.detail;
    return (
      <div id="commoditiesDetail">
        <section className="sale">
          <div className="poster">
            <img src={detail.goods_picture} />
          </div>
          <div className="info">
            <h3>{detail.goods_name}</h3>
            <div className="price">
              <p>价格：</p>
              <p>￥{detail.sale_price}</p>
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
          <div className="content">{detail.goods_details}</div>
        </section>
      </div>
    );
  }
}

export default CommoditiesDetail;
