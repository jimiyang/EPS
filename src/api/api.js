import axios from './instance';
import getSign from './sign/sign';


//通用接口
function baseInstance(service, params) {
  let userName = '';
  let _params = localStorage.getItem('USER') ? params.assign(params, localStorage.getItem('USER')) : params;
  if (service === 'eps.login') {
    userName = params.login_name;
  } else {
    userName = window.localStorage.getItem('head_params').login_name;
    _params = getSign(_params, localStorage.getItem('USER').partner_key);
  }
  const form = {
    param: {
      head: {
        service,
        sign: null,
        partner_id: null,
        login_name: userName
      },
      body: _params
    }
  };
  return (
    axios.post('/gateway.in', {}, {params: form}).then((response) => response)
  );
}
export default {baseInstance};
