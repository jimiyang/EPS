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
    channel_partner_id: headParams.partner_id,
    input_charset: 'UTF-8',
    version: '1.0',
    platform_merchant_no: window.localStorage.getItem('platform_no'),
    ...params,
  };
  //console.log(signParams);
  let baseUrl = 'http://192.168.4.148:8080/NewFront/base/';
  switch (service) {
    case 'merchant.pidkeyquery':
      // baseUrl = 'http://192.168.4.148:8080/NewFront/base/';
      baseUrl = 'http://192.168.19.31:8000/NewFront/base/';
      form = {
        head: {
          service,
          version: '1.0',
          channel_partner_id: headParams.partner_id, //渠道合作编号
          platform_merchant_no: window.localStorage.getItem('platform_no'), //平台编号
          ...getSign(signParams, aes.Decrypt(localStorage.getItem('PKEY'))),
          sign_type: 'MD5',
          input_charset: 'UTF-8'
        },
        body: params
      };
      break;
    case 'device.unbind':
      baseUrl = 'http://192.168.19.119:8000/sahp/base/';
      signParams = {
        service,
        ...headParams,
        ...params,
      };
      form = {
        head: {
          service,
          version: '1.0',
          partner_id: JSON.parse(window.localStorage.getItem('partnerID'))[0].PID,
          core_merchant_no: window.localStorage.getItem('merchant_code'), //联富通核心商户
          ...getSign(signParams, aes.Decrypt(localStorage.getItem('PKEY'))),
          sign_type: 'MD5',
          input_charse: 'UTF-8',
          request_time: window.common.getDate(new Date(), true)
        },
        body: params
      };
      console.log(form);
      break;
    default:
      baseUrl = 'http://192.168.19.118:8000/eps/base/';
      break;
  }
  //console.log(form);
  return (
    axios.post(`${baseUrl}gateway.in?requestJson=${JSON.stringify(form)}`).then((response) => response)
  );
}
export default {baseInstance};
