import axios from './instance';
//通用接口
function baseInstance(service, params) {
  let userName = '';
  if (service === 'eps.login') {
    userName = params.login_name;
  } else {
    userName = window.localStorage.getItem('head_params').login_name;
  }
  const form = {
    param: {
      head: {
        service,
        sign: null,
        partner_id: null,
        login_name: userName
      },
      body: params
    }
  };
  return (
    axios.post('/gateway.in', {}, {params: form}).then((response) => response)
  );
}
export default {baseInstance};
