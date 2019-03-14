import axios from 'axios';

const instance = axios.create({
<<<<<<< HEAD
  //baseURL: 'http://192.168.19.118:8000/eps/base/',
  baseURL: 'http://eps.liantuobank.com/eps/base/',
=======
  baseURL: 'http://192.168.19.118:8000/eps/base/',
  // baseURL: 'http://eps.liantuobank.com/eps/base/',
>>>>>>> master
  timeout: 50000,
  withCredentials: true
});
instance.interceptors.response.use(
  res => {
    const promise = new Promise((resolve, reject) => {
      if (res.status === 200 && res.data.body.service_status === 'S' && res.data.head.visit_status === 'S') {
        resolve(res.data.body);
      } else {
        reject(res.data.body);
      }
    });
    return promise;
  },
  err => {
    //const {data: {err: errnum, error}} = (err || {}).response;
    /*if (errnum === 200 && error) {
      message.success(error);
    } else {
      message.error(error);
    }*/
  }
);
export default instance;
