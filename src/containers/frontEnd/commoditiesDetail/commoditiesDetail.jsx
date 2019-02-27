import React, {Component} from 'react';
import {connect} from 'react-redux';
import {InputNumber} from 'antd';
import './commoditiesDetail.less';
import {getCommoditiesDetail} from '../../../store/reduces/frontEnd';

@connect(
  (state) => ({commoditiesDetail: state.frontEnd.commoditiesDetail}),
  {getCommoditiesDetail},
)

class CommoditiesDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      count: 1, // 购买的商品数量
      detail: {
        title: '收款小精灵新零售平台（一年有效期）商圈版',
        price: '999.00',
        img: 'https://timgsa.baidu.com/timg?image&quality=80&size=b9999_10000&sec=1551075127056&di=e44b795bc442b404220dae36166470a3&imgtype=0&src=http%3A%2F%2Fi0.hdslb.com%2Fbfs%2Farticle%2Fc54fe11edf3254a5aaa8139ac353667ad9361860.jpg',
        address: '北京',
      }, // 商品详情
    };
  }
  componentWillMount() {
  }
  componentDidMount() {
  }
  // 跳转到生成订单页
  toOrder = () => {
    const {detail} = this.state;
    const commoditiesDetail = {
      img: detail.img,
      count: this.state.count,
      price: detail.price,
      title: detail.title,
    };
    this.props.getCommoditiesDetail(commoditiesDetail);
    this.props.history.push('/generateOrder');
  }
  // 改变购买数量
  changeCount = (value) => {
    this.setState({count: value});
  }
  render() {
    const detail = this.state.detail;
    return (
      <div id="commoditiesDetail">
        <section className="sale">
          <div className="poster">
            <img src={detail.img} />
          </div>
          <div className="info">
            <h3>{detail.title}</h3>
            <div className="price">
              <p>价格：</p>
              <p>￥{detail.price}</p>
            </div>
            <div className="address">
              <p>发货地：</p>
              <p>{detail.address}</p>
              <p>24小时发货</p>
            </div>
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
          <div className="content">content</div>
        </section>
      </div>
    );
  }
}

export default CommoditiesDetail;
