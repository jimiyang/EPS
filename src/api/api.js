import axios from './instance';
import getSign from './sign/sign';
import aes from './aes/public';
//通用接口
function baseInstance(service, params) {
  let baseUrl = 'http://192.168.19.118:8000/eps/base/';
  const localStorage = window.localStorage;
  let headParams = {};
  let form = {};
  let signParams = {};
  if (service === 'eps.login') {
    headParams = params;
  } else {
    headParams = JSON.parse(localStorage.getItem('headParams'));
    headParams.partner_id = aes.Decrypt(headParams.partner_id);
    signParams = {
      service,
      ...headParams,
      ...params,
    };
    headParams = {
      ...headParams,
      ...getSign(signParams, aes.Decrypt(localStorage.getItem('PKEY')))
    };
  }
  form = {
    head: {
      service,
      ...headParams
    },
    body: params
  };
  switch (service) {
    case 'merchant.pidkeyquery': //通过核心商户编号获取pid和key
      baseUrl = 'http://192.168.19.31:8000/NewFront/base/';
      form = {
        requestJson: {
          head: {
            service,
            version: '1.0',
            sign_type: 'MD5',
            input_charset: 'UFT-8',
            channel_partner_id: headParams.partner_id, //渠道合作编号
            platform_merchant_no: window.localStorage.getItem('platform_no'), //平台编号
            ...getSign(signParams, aes.Decrypt(localStorage.getItem('PKEY'))),
          },
          body: params
        }
      };
      console.log(`获取商户pid和key：${form}`);
      break;
    case 'device.unbind': //解绑
      baseUrl = 'http://192.168.19.119:8000/sahp/base/';
      form = {
        head: {
          service,
          version: '1.0',
          sign_type: 'MD5',
          input_charset: 'UTF-8',
          request_time: window.common.getDate(new Date(), true),
          core_merchant_no: window.localStorage.getItem('merchant_code'),
          ...getSign(signParams, aes.Decrypt(localStorage.getItem('PKEY'))),
        }
      };
      console.log(`解绑：${form}`);
      break;
    default:
      baseUrl = 'http://192.168.19.118:8000/eps/base/';
      break;
  }
  return (
    axios.post(`${baseUrl}gateway.in`, form).then((response) => response)
  );
}
export default {baseInstance};
