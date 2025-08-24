import CryptoJS from 'crypto-js';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || '320c2a4afff5ab80f94f1264f3e643a15d6d391affa6cde663a458c515f76e2d6e171700fa0c8916bdc1a0ee376627ac8b239faed6b5b7e533b1565ba789d60c';

export function encrypt(text) {
  try {
    if (!text) return null;
    return CryptoJS.AES.encrypt(text, ENCRYPTION_KEY).toString();
  } catch (error) {
    console.error('Erro ao criptografar:', error);
    return null;
  }
}

export function decrypt(encryptedText) {
  try {
    if (!encryptedText) return null;
    const bytes = CryptoJS.AES.decrypt(encryptedText, ENCRYPTION_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Erro ao descriptografar:', error);
    return null;
  }
}

export function encryptObject(obj, fieldsToEncrypt) {
  const encryptedObj = { ...obj };
  
  fieldsToEncrypt.forEach(field => {
    if (obj[field]) {
      encryptedObj[field] = encrypt(obj[field]);
    }
  });
  
  return encryptedObj;
}

export function decryptObject(obj, fieldsToDecrypt) {
  const decryptedObj = { ...obj };
  
  fieldsToDecrypt.forEach(field => {
    if (obj[field]) {
      decryptedObj[field] = decrypt(obj[field]);
    }
  });
  
  return decryptedObj;
}