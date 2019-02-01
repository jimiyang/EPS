const utils = {
  //获取验证码
  createCode() {
    let code = '';
    const codeLength = 4;
    const ArrWords = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];
    const random = ArrWords.concat([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
    for (let i = 0; i < codeLength; i++) {
      const index = Math.floor(Math.random() * 36);
      code += random[index];
    }
    return code.toUpperCase();
  }
};
export default utils;
