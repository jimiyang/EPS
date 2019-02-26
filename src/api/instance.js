import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://192.168.4.115:9999/eps/base/',
  timeout: 1000,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
    'Access-Control-Allow-Origin': '*',
    'access-control-allow-methods': 'GET, POST, OPTIONS, PUT, DELETE',
    'access-control-expose-headers': 'Authorization'
  }
});
instance.interceptors.response.use(
  res => {
    //if(res.data.errorCode === 'F') {
    //message.error(res.data.returnMsg);
    //}
    console.log(res);
    console.log(`成功：${res}`);
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
