import axios from 'axios';
import {message} from 'antd';

const instance = axios.create({
  baseURL: '/api',
  timeout: 1000,
  withCredentials: true,
  headers: {'content-type': 'application/x-www-form-urlencoded'}
});

//const tid = localStorage.getItem('tid');
//axios.defaults.headers.tid = tid || ''; // axios headers token
instance.interceptors.response.use(
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

export default instance;
