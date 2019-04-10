import axios from './instance';
import getSign from './sign/sign';
import aes from './aes/public';
//通用接口
function baseInstance(service, params) {
  const baseUrl = 'http://192.168.19.118:8000/eps/base/';
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
  return (
    axios.post(`${baseUrl}gateway.in`, form).then((response) => response)
  );
}
export default {baseInstance};
