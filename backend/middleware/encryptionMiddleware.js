import { encrypt, decrypt } from '../utils/encryption.js';

// Middleware para descriptografar dados sensíveis na entrada
export function decryptRequestBody(req, res, next) {
  try {
    // const camposSensiveis = ['email', 'telefone', 'cpf'];
    
    // camposSensiveis.forEach(campo => {
    //   if (req.body[campo]) {
    //     req.body[campo] = decrypt(req.body[campo]) || req.body[campo];
    //   }
    // });
    
    next();
  } catch (error) {
    // console.error('Erro ao descriptografar request:', error);
    // next();
  }
}

// Middleware para criptografar dados sensíveis na saída
export function encryptResponseData(req, res, next) {
  // const originalJson = res.json;
  
  // res.json = function(data) {
  //   try {
  //     if (data && typeof data === 'object') {
  //       const camposSensiveis = ['email', 'telefone', 'cpf'];
        
  //       const encryptData = (obj) => {
  //         if (Array.isArray(obj)) {
  //           return obj.map(item => encryptData(item));
  //         } else if (obj && typeof obj === 'object') {
  //           const encrypted = { ...obj };
  //           camposSensiveis.forEach(campo => {
  //             if (obj[campo]) {
  //               encrypted[campo] = encrypt(obj[campo]);
  //             }
  //           });
  //           return encrypted;
  //         }
  //         return obj;
  //       };
        
  //       data = encryptData(data);
  //     }
  //   } catch (error) {
  //     console.error('Erro ao criptografar response:', error);
  //   }
    
  //   originalJson.call(this, data);
  // };
  
  next();
}