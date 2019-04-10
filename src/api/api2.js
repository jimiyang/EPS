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
  console.log(headParams.partner_id);
  signParams = {
    service,
    channel_partner_id: headParams.partner_id,
    out_request_no: window.common.getRequestNo(16),
    ...params,
  };
  headParams = {
    service,
    channel_partner_id: headParams.partner_id,
    core_merchant_no: window.localStorage.getItem('merchant_code'),
    input_charset: 'UTF-8',
    platform_merchant_no: window.localStorage.getItem('platform_no'),
    version: '1.0',
    ...getSign(signParams, aes.Decrypt(localStorage.getItem('PKEY')))
  };
  form = {
    head: {
      service,
      ...headParams
    },
    body: params
  };
  const baseUrl = 'http://192.168.5.133:8080/NewFront/base/';
  console.log(headParams);
  form = {
    head: {
      service,
      version: '1.0',
      channel_partner_id: aes.Decrypt(JSON.parse(localStorage.getItem('headParams')).partner_id), //渠道合作编号
      platform_merchant_no: window.localStorage.getItem('platform_no'), //平台编号
      ...getSign(signParams, aes.Decrypt(localStorage.getItem('PKEY'))),
      sign_type: 'MD5',
      input_charset: 'UFT-8'
    },
    body: params
  };
  console.log(form);
  return (
    axios.post(`${baseUrl}gateway.in?requestJson=${JSON.stringify(form)}`, {}).then((response) => response)
  );
}
export default {baseInstance};
