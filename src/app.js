import React from 'react';
import ReactDOM from 'react-dom';
import axios from './api/instance';
import api from './api/api.js';//公共接口（唯一）

import Root from './router';

// css
import './style/index.styl';
// iconfont
import './assets/iconfont.css';
import './assets/iconfont.js';
//utils
import common from './utils/common';

window.axios = axios;
window.common = common;
window.api = api;

ReactDOM.render(<Root />, document.getElementById('app'));
