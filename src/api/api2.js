import axios from './instance';
import getSign from './sign/sign';
import aes from './aes/public';
//通用接口
function baseInstance(service, params) {
  const localStorage = window.localStorage;
  let headParams = {};
  let form = {};
  let signParams = {};
  headParams = JSON.parse(localStorage.getItem('headParams'));
  headParams.partner_id = aes.Decrypt(headParams.partner_id);
  signParams = {
    service,
    channel_partner_id: '18012410231176228',
    input_charset: 'UTF-8',
    version: '1.0',
    platform_merchant_no: window.localStorage.getItem('platform_no'),
    ...params,
  };
  //console.log(signParams);
  const baseUrl = 'http://192.168.4.148:8080/NewFront/base/';
  form = {
    head: {
      service,
      version: '1.0',
      channel_partner_id: '18012410231176228', //渠道合作编号
      platform_merchant_no: window.localStorage.getItem('platform_no'), //平台编号
      ...getSign(signParams, aes.Decrypt(localStorage.getItem('PKEY'))),
      sign_type: 'MD5',
      input_charset: 'UTF-8'
    },
    body: params
  };
  //console.log(form);
  return (
    axios.post(`${baseUrl}gateway.in?requestJson=${JSON.stringify(form)}`).then((response) => response)
  );
}
export default {baseInstance};
