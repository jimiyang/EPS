import axios from './instance.js';

//通用接口
function baseInstance(service, params) {
  const form = {
    Body: params
  };
  console.log(form);
  return (
    axios.get('/gateway.in', {params}).then((response) => response)
  );
}
export default {baseInstance};
