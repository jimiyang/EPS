import React from 'react';
import {message} from 'antd';
import ReactDOM from 'react-dom';
import axios from 'axios';

import Root from './router';

// css
import './style/index.styl';
// iconfont
import './assets/iconfont.css';
import './assets/iconfont.js';

//commonjs
import common from './commonJs/common';

window.axios = axios;
window.common = common;

//const tid = localStorage.getItem('tid');
//axios.defaults.headers.tid = tid || ''; // axios headers token
const ajax = axios.create({
  baseURL: '',
  withCredentials: true,
  headers: {'content-type': 'application/x-www-form-urlencoded'}
});
ajax.interceptors.response.use(
  res => res,
  err => {
    const {data: {err: errnum, error}} = (err || {}).response;
    console.log(err);
    if (errnum === 200 && error) {
      message.success(error);
    } else {
      message.error(error);
    }
    /*if (err.response.status === 401) {
      message.info('您的登录已过期，请重新登录');
      setTimeout(() => {
        history.replace('/login');
        localStorage.removeItem('tid');
        window.location.reload();
      }, 600);
    }*/
  }
);
ReactDOM.render(<Root />, document.getElementById('app'));
