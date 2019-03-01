import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://192.168.19.118:8000/eps/base/',
  timeout: 1000,
  withCredentials: true,
  headers: {
    'Access-Control-Allow-Origin': '*',
    'access-control-allow-methods': 'GET, POST, OPTIONS, PUT, DELETE',
    'access-control-expose-headers': 'Authorization'
  }
});
instance.interceptors.response.use(
  res => {
    const promise = new Promise((resolve, reject) => {
      if (res.status === 200 && res.data.body.service_status === 'S' && res.data.head.visit_status === 'S') {
        resolve(res.data.body);
      } else {
        reject(res.data.body.service_error_message);
      }
    });
    return promise;
  },
  err => {
    //const {data: {err: errnum, error}} = (err || {}).response;
    console.log(`失败：${err}`);
    /*if (errnum === 200 && error) {
      message.success(error);
    } else {
      message.error(error);
    }*/
    if (window.localStorage.getItem('checkLogin') === null) {
    //msg.error('您的登录已过期，请重新登录！');
      //this.props.history.push({pathname: '/login'});
    }
  }
);
export default instance;
