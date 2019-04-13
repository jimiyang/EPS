const utils = {
  getUrl() {
    let arrUrl = [];
    //测试地址
    //异步通知地址notify_url :::: http://testclubshop.liantuobank.com/notify/device
    //eps接口地址：：：：http://192.168.19.118:8000
    //新前置接口地址::: http://192.168.4.148:8080
    //解绑接口地址::: http://192.168.19.119:8000
    if (window.location.hostname === 'localhost' || window.location.hostname === 'fetest.51ebill.com') {
      arrUrl = [
        'http://testclubshop.liantuobank.com/notify/device',
        'http://192.168.19.118:8000',
        'http://192.168.19.31:8000',
        'http://192.168.19.119:8000'
      ];
    } else {
      arrUrl = [
        'http://api.liantuofu.com/notify/device',
        'http://eps.liantuobank.com',
        'http://newfront.liantuobank.com',
        'http://192.168.19.118:8000'
      ];
    }
    return arrUrl;
  },
  //获取时间
  getDate(time, flag) {
    const date = new Date(time);
    const y = date.getFullYear();
    let m = date.getMonth() + 1;
    m = m < 10 ? (`0${m}`) : m;
    let d = date.getDate();
    d = d < 10 ? (`0${d}`) : d;
    let h = date.getHours();
    h = h < 10 ? (`0${h}`) : h;
    let minute = date.getMinutes();
    let second = date.getSeconds();
    minute = minute < 10 ? (`0${minute}`) : minute;
    second = second < 10 ? (`0${second}`) : second;
    const str = flag ? `${y}-${m}-${d} ${h}:${minute}:${second}` : `${m}月${d}日 ${h}:${minute} `;
    return str;
  },
  //获取验证码
  createCode() {
    let code = '';
    const codeLength = 4;
    /* eslint-disable */
    const ArrWords = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    /* eslint-enable */
    const random = ArrWords.concat([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    for (let i = 0; i < codeLength; i++) {
      const index = Math.floor(Math.random() * 36);
      code += random[index];
    }
    return code.toUpperCase();
  },

  getRequestNo(m) {
    let random = '';
    while (random.length < m) {
      random += `${Math.floor(Math.random() * 10)}`;
    }
    return random;
  },

  // 超时登出
  loginOut(obj) {
    if (window.localStorage.getItem('headParams') === null) {
      //msg.error('请重新登录！');
      obj.props.history.push({pathname: '/login'});
      return false;
      //return false;
    }
    return true;
  },

  // 上传图片之前判断图片大小
  beforeUpload(file, msg) {
    const typeArr = ['image/jpeg', 'image/jpg', 'image/png', 'image/bmg'];
    let isJPG = 'image/jpeg';
    typeArr.map(item => {
      if (item === file.type) {
        isJPG = item;
      }
    });
    if (!isJPG) {
      msg.error(`请上传${isJPG}格式图片！`);
    }
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      msg.error('请上传小于2MB的图片!');
    }
    return isJPG && isLt2M;
  },

  getQueryString(url) {
    const str = url.split('?');
    const arr = str[1].split('&');
    const obj = {};
    for (let i = 0; i < arr.length; i++) {
      const num = arr[i].indexOf('=');
      if (num > 0) {
        obj[arr[i].substring(0, num)] = arr[i].substr(num + 1);
      }
    }
    return obj;
  },

  // 删除对象里的空值
  dealElement(obj) {
    const param = {};
    if (obj === null || obj === undefined || obj === '') return param;
    /* eslint-disable */
    for (let key in obj ) {
      if (obj[key] !== null && obj[key] !== undefined && obj[key] !== '') {
        param[key] = obj[key];
      }
    }
    return param;
  },

  // 删除字符串的空格
  deleteBlank(string) {
    const reg = /\s/g;
    if (Object.prototype.toString.call(string) === '[object String]' && reg.test(string)) string = string.replace(/\s/g, '');
    return string;
  }
};
export default utils;
