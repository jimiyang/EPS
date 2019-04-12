import axios from './instance';
import getSign from './sign/sign';
import aes from './aes/public';
//通用接口
function baseInstance(service, params) {
  let baseUrl = `${(window.common.getUrl())[1]}/eps/base/gateway.in`;
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
    case 'device.unbind':
      baseUrl = `${(window.common.getUrl())[3]}/sahp/base/api/gateway.in`; //'http://192.168.5.21:9999/sahp/base/api/gateway.in';
      signParams = {
        service,
        core_merchant_no: window.localStorage.getItem('merchant_code'), //联富通核心商户
        request_time: window.common.getDate(new Date(), true),
        input_charset: 'UTF-8',
        version: '1.0',
        partner_id: JSON.parse(window.localStorage.getItem('partnerID'))[0].PID,
        ...params,
      };
      //console.log(signParams);
      form = {
        head: {
          service,
          version: '1.0',
          partner_id: JSON.parse(window.localStorage.getItem('partnerID'))[0].PID,
          core_merchant_no: window.localStorage.getItem('merchant_code'), //联富通核心商户
          ...getSign(signParams, JSON.parse(window.localStorage.getItem('partnerID'))[0].KEY),
          sign_type: 'MD5',
          input_charset: 'UTF-8',
          request_time: window.common.getDate(new Date(), true)
        },
        body: params
      };
      //console.log(form);
      break;
    default:
      baseUrl = `${(window.common.getUrl())[1]}/eps/base/gateway.in`; //'http://192.168.19.118:8000/eps/base/gateway.in';
      break;
  }
  return (
    axios.post(baseUrl, form).then((response) => response)
  );
}
export default {baseInstance};
