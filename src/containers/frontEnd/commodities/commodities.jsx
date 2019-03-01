import React, {Component} from 'react';
import {connect} from 'react-redux';
import './commodities.less';

export default class Commodities extends Component {
  constructor(props) {
    super(props);
    this.state = {
      part: [], // 一级类的列表
      partList: [], // 类的商品列表
    };
  }

  componentWillMount() {
    this.getCategoryList();
  }

  // 获取产品类型列表
  getCategoryList = () => {
    const params = {
      page_size: 100,
      current_page: 1,
      superior_id: 0,
    };
    window.api('goods.getcategorylist', params).then(res => {
      const part = res.goods_category_list;
      this.setState({part});
      part.forEach((item, index) => {
        this.getCommoditiesList(item.goods_category_name, index);
      });
    });
  }

  // 获取产品列表
  getCommoditiesList(category, index) {
    const params = {
      page_size: 8,
      current_page: 1,
      goods_category_name: category,
    };
    window.api('goods.getgoodslist', params).then(res => {
      const partList = this.state.partList;
      partList[index] = res;
      this.setState({partList});
    });
  }

  // 跳转到详情页
  toDetail = (id) => {
    this.props.history.push('/commoditiesDetail', {id});
  }

  render() {
    const {part, partList} = this.state;
    return (
      <div className="sku">
        {
          partList.map((item, index) => (
            <section className="sku-block" key={index} hidden={item.goods_list.length === 0}>
              <h3 className="sku-cat-title">{part[index].goods_category_name}</h3>
              <ul className="sku-list">
                {
                  item.goods_list.map(($0, $1) => (
                    <li key={$1} onClick={this.toDetail.bind(this, $0.id)}>
                      <img src={$0.goods_picture} />
                      <div className="sku-cont">
                        <h2>{$0.goods_name}</h2>
                        <p className="price">{$0.cost_price}</p>
                      </div>
                    </li>))
                }
              </ul>
            </section>
          ))
        }
      </div>
    );
  }
}
