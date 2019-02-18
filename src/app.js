import React from 'react';
import moment from 'moment';
import ReactDOM from 'react-dom';
import 'moment/locale/zh-cn';
import axios from './api/api';
import Root from './router';
import common from './utils/common';
// css
import './style/reset.css';
// iconfont
import './assets/iconfont.css';
import './assets/iconfont.js';
//utils

moment.locale('zh-cn');
window.axios = axios;
window.common = common;

ReactDOM.render(<Root />, document.getElementById('app'));
