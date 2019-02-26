import axios from './instance';
import getSign from './sign/sign';

//通用接口
function baseInstance(service, params) {
  const localStorage = window.localStorage;
  let headParams = {};
  if (service === 'eps.login') {
    headParams = params;
  } else {
    headParams = JSON.parse(localStorage.getItem('headParams'));
    const singParams = {
      service,
      ...headParams,
      ...params,
    };
    console.log(singParams);
    headParams = {
      ...headParams,
      ...getSign(singParams, localStorage.getItem('PKEY'))
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
  console.log(form);
  return (
    axios.post('/gateway.in', {}, {params: form}).then((response) => response)
  );
}
export default {baseInstance};
