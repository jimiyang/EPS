import axios from './instance.js';

//通用接口
function baseInstance(service, params) {
  const form = {
    param: {
      head: {
        service,
        sign: null,
        partner_id: null,
        login_name: 'jrpt'
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
