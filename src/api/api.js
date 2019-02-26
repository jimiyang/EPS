import axios from './instance.js';

//通用接口
function baseInstance(service, params) {
  let headParams = '';
  let userName = '';
  if (service === 'eps.login') {
    userName = params.login_name;
  } else {
    headParams = JSON.parse(window.localStorage.getItem('head_params'));
    userName = headParams.login_name;
  }
  const form = {
    param: {
      head: {
        service,
        sign: headParams.sign,
        partner_id: headParams.partner_id,
        login_name: userName
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
