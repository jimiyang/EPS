import axios from './instance';
import getSign from './sign/sign';
import aes from './aes/public';
//通用接口
function baseInstance(service, params) {
  const localStorage = window.localStorage;
  let headParams = {};
  if (service === 'eps.login') {
    headParams = params;
  } else {
    headParams = JSON.parse(localStorage.getItem('headParams'));
    headParams.partner_id = aes.Decrypt(headParams.partner_id);
    const signParams = {
      service,
      ...headParams,
      ...params,
    };
    console.log(signParams);
    headParams = {
      ...headParams,
      ...getSign(signParams, aes.Decrypt(localStorage.getItem('PKEY')))
    };
  }
  const form = {
    param: {
      head: {
        service,
        ...headParams
      },
      body: params
    }
  };
  return (
    axios.post('/gateway.in', {}, {params: form}).then((response) => response)
  );
}
export default {baseInstance};
