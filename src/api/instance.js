import axios from 'axios';
import {message} from 'antd';
import { RSA_NO_PADDING } from 'constants';

const instance = axios.create({
  baseURL: '/api',
  timeout: 1000,
  withCredentials: true,
  headers: {'content-type': 'application/x-www-form-urlencoded'}
});

//const tid = localStorage.getItem('tid');
//axios.defaults.headers.tid = tid || ''; // axios headers token
instance.interceptors.response.use(
  res => {
    //if(res.data.errorCode === 'F') {
    //message.error(res.data.returnMsg);
    //}
    console.log(res.data.errorCode);
  },
  err => {
    const {data: {err: errnum, error}} = (err || {}).response;
    console.log(errnum);
    if (errnum === 200 && error) {
      message.success(error);
    } else {
      message.error(error);
    }
    if (window.localStorage.getItem('checkLogin') === null) {
    //msg.error('您的登录已过期，请重新登录！');
      this.props.history.push({pathname: '/login'});
    }
  }
);
export default instance;
