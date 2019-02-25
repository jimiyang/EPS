import React, {Component} from 'react';

import './style.css';

class Detaile extends Component {
  render() {
    return (
      <div className="employess-blocks">
        <ul className="detail-box">
          <li>
            <label>员工角色：</label>
            <div className="content">销售员</div>
          </li>
          <li>
            <label>联系人姓名：</label>
            <div className="content">哈哈哈哈哈繁华的挥洒范德萨范德萨</div>
          </li>
          <li>
            <label>联系人手机：</label>
            <div className="content">哈哈哈哈哈繁华的挥洒范德萨范德萨</div>
          </li>
          <li>
            <label>联系人邮箱：</label>
            <div className="content">哈哈哈哈哈繁华的挥洒范德萨范德萨</div>
          </li>
          <li>
            <label>登录名：</label>
            <div className="content">哈哈哈哈哈繁华的挥洒范德萨范德萨</div>
          </li>
        </ul>
      </div>
    );
  }
}
export default Detaile;
