import axios from './instance.js';

//通用接口
function baseInstance(service, params) {
  const form = {
    Header: {
      sign: '',
      partner_id: '',
      login_name: '',
      service,
    },
    Body: params
  };
  console.log(form);
  return (
    axios.get('/gateway.in', {params}).then((response) => response)
  );
}
export default {baseInstance};
