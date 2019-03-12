import React, {Component} from 'react';
import {Empty, message} from 'antd';
import {Redirect} from 'react-router';
import './goods.less';

export default class Goods extends Component {
  constructor(props) {
    super(props);
    this.state = {
      part: [], // 一级类的列表
      partList: [], // 类的商品列表
      redirect: false,
    };
  }
  componentWillMount() {
    if (window.common.loginOut(this)) {
      if (window.localStorage.getItem('PKEY')) {
        this.getHomepage();
      } else {
        this.props.history.push('/login');
      }
    } else {
      message.error('登录信息失效，请重新登录');
    }
  }
  // 首页信息
  getHomepage() {
    window.api('goods.homepage', {}).then(res => {
      const info = res.hot_category;
      const part = [];
      const partList = [];
      info.forEach((item, index) => {
        part.push(item);
        partList.push(item.goods);
      });
      this.setState({part, partList});
    }).catch((error) => {
      if (error.service_error_code === 'EPS000000801') {
        this.setState({redirect: true});
      }
      message.error(error.service_error_message);
    });
  }
  // 跳转到搜索页
  toSearchDetail = (id, typeName) => {
    this.props.history.push('/searchDetail', {id, typeName, searchContent: ''});
  }
  // 跳转到详情页
  toDetail = (id) => {
    this.props.history.push('/goodsDetail', {id});
  }
  render() {
    if (this.state.redirect) {
      return (<Redirect to="/login" />);
    }
    const {part, partList} = this.state;
    return (
      <div className="sku">
        {
          partList.length > 0 ? (
            part.map((item, index) => (
              <section className="sku-block" key={index} hidden={partList[index].length === 0}>
                <h3 style={{cursor: 'pointer'}} className="sku-cat-title" onClick={this.toSearchDetail.bind(this, item.id, item.goods_category_name)}>{item.goods_category_name}</h3>
                <ul className="sku-list">
                  {
                    partList[index].map(($0, $1) => (
                      <li key={$1} onClick={this.toDetail.bind(this, $0.id)}>
                        <img src={$0.goods_picture} />
                        <div className="sku-cont">
                          <p className="price"><em>¥</em>{($0.sale_price).toFixed(2)}</p>
                          <h2>{$0.goods_name}</h2>
                        </div>
                      </li>))
                  }
                </ul>
              </section>
            ))) : (<div><Empty /></div>)
        }
      </div>
    );
  }
}
