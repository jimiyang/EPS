import axios from './api.js';

//通用接口
function baseInstance(params) {
  return (
    axios.get('/login', {params}).then((response) => response)
  );
}
export default {baseInstance};
