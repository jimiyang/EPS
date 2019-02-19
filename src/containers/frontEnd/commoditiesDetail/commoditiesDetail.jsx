import React, {Component} from 'react';
import {InputNumber} from 'antd';
import './commoditiesDetail.less';

class CommoditiesDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
  }
  componentWillMount() {
  }
  componentDidMount() {
  }
  // 跳转到生成订单页
  toOrder = () => {
    this.props.history.push('/generateOrder');
  }
  // 改变购买数量
  changeCount = (value) => {
    console.log(value);
  }
  render() {
    return (
      <div id="commoditiesDetail">
        <section className="sale">
          <div className="poster">
            <img src={require('../../../assets/bg.jpg')} />
          </div>
          <div className="info">
            <h3>收款小精灵新零售平台（一年有效期）商圈版</h3>
            <div className="price">
              <p>价格：</p>
              <p>￥999.00</p>
            </div>
            <div className="address">
              <p>发货地：</p>
              <p>北京</p>
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
