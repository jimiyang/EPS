import React from 'react';
import ReactDOM from 'react-dom';
import axios from './api/instance';
import api from './api/api.js';
import Root from './router';
import common from './utils/common';
// css
import './style/reset.css';
// iconfont
import './assets/iconfont.css';
import './assets/iconfont.js';
//utils
window.axios = axios;
window.common = common;
window.api = api.baseInstance;
window.uploadFile = api.uploadFile;
ReactDOM.render(<Root />, document.getElementById('app'));
