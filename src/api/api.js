import axios from './instance';
import getSign from './sign/sign';


//通用接口
function baseInstance(service, params) {
  let headParams = '';
  let userName = '';
  let _params = localStorage.getItem('USER') ? params.assign(params, localStorage.getItem('USER')) : params;
  if (service === 'eps.login') {
    userName = params.login_name;
  } else {
<<<<<<< HEAD
    userName = window.localStorage.getItem('head_params').login_name;
    _params = getSign(_params, localStorage.getItem('USER').partner_key);
=======
    headParams = JSON.parse(window.localStorage.getItem('head_params'));
    userName = headParams.login_name;
>>>>>>> 6f8d002f2ffe6d96e4242c0bd3ab2a7a36147b89
  }
  const form = {
    param: {
      head: {
        service,
        sign: headParams.sign,
        partner_id: headParams.partner_id,
        login_name: userName
      },
      body: _params
    }
  };
  console.log(form);
  return (
    axios.post('/gateway.in', {}, {params: form}).then((response) => response)
  );
}
export default {baseInstance};
