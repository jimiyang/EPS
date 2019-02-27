/* eslint-disable */
import CryptoJS from './aes';
let key = CryptoJS.enc.Utf8.parse('fiubHNPc701P_d0z');
function Decrypt(word) {
    let decrypt = CryptoJS.AES.decrypt(word, key, { mode:CryptoJS.mode.ECB, padding:CryptoJS.pad.Pkcs7 });
    return CryptoJS.enc.Utf8.stringify(decrypt).toString();
};
function Encrypt(word) {
    let srcs = CryptoJS.enc.Utf8.parse(word);
    let encrypted = CryptoJS.AES.encrypt(srcs, key, { mode:CryptoJS.mode.ECB, padding:CryptoJS.pad.Pkcs7 });
    return encrypted.toString();
}
export default {Decrypt, Encrypt}
/* eslint-enable */
