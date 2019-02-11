import React from 'react';
import ReactDOM from 'react-dom';
import axios from './api/api';

import Root from './router';

// css
import './style/reset.css';
import './style/index.styl';
// iconfont
import './assets/iconfont.css';
import './assets/iconfont.js';
//utils
import common from './utils/common';

window.axios = axios;
window.common = common;

ReactDOM.render(<Root />, document.getElementById('app'));
