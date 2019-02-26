/* eslint-disable */
//MD5
const md5 = require('md5.js');

//对象排序
function sortObj(obj) {
  const arr = [];
  for (let i in obj) {
    arr.push([i, obj[i]]);
  }
  arr.sort();
  var len = arr.length,
    obj = {};
  for (var i = 0; i < len; i++) {
    obj[arr[i][0]] = arr[i][1];
  }
  return obj;
}

//转URL参数
function parseParam(obj, encode) {
  function toQueryPair(key, value) {
    if (typeof value === 'undefined') {
      return key;
    }
    if (encode) {
      return (
        key + "=" + encodeURIComponent(value === null ? "" : String(value))
      );
    } else {
      return key + "=" + (value === null ? "" : String(value));
    }
  }
  var ret = [];
  for (var key in obj) {
    key = encode ? encodeURIComponent(key) : key;
    var values = obj[key];
    if (values && values.constructor == Array) {
      var queryValues = [];
      for (var i = 0, len = values.length, value; i < len; i++) {
        value = values[i];
        queryValues.push(toQueryPair(key, value));
      }
      ret = ret.concat(queryValues);
    } else {
      ret.push(toQueryPair(key, values));
    }
  }
  return ret.join('&');
}

module.exports = {
  getSign: (params, key) => {
    delete params.sign;
    delete params.sign_type;
    const _params = parseParam(sortObj(params));
    const sign = md5(_params + key);
    const MD5 = sign.toLowerCase();
    params.sign = MD5;
    params.sign_type = 'MD5';
    return params;
  },
  parseParam
};
