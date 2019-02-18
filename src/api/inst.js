import axios from './api.js';

function userLogin(params) {
  return (
    axios.get('/login', {params}).then((response) => {
      console.log(response);
      return response;
    })
  );
}
export default {userLogin};
