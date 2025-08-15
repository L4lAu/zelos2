import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/jwt.js';

export function authMiddleware(roles = []) {
  return (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ message: 'Token não fornecido' });

    const token = authHeader.split(' ')[1];
    try {
      const decoded = jwt.verify(token, JWT_SECRET);
      if (roles.length && !roles.includes(decoded.tipo)) {
        return res.status(403).json({ message: 'Sem permissão' });
      }
      req.user = decoded;
      next();
    } catch {
      return res.status(403).json({ message: 'Token inválido ou expirado' });
    }
  };
}