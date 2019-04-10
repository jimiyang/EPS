import React from 'react';
import ReactDOM from 'react-dom';
import axios from './api/instance';
import api from './api/api.js';
import api2 from './api/api2.js';
import Root from './router';
import common from './utils/common';
// css
import './style/reset.css';
//utils
window.axios = axios;
window.common = common;
window.api = api.baseInstance;
window.api2 = api2.baseInstance;
ReactDOM.render(<Root />, document.getElementById('app'));
