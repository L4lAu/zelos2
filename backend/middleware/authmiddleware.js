import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/jwt.js';

const authMiddleware = (req, res, next) => {
  try {
    const authHeader = req.headers?.authorization;

    if (!authHeader) {
      return res.status(401).json({ mensagem: 'Não autorizado: Token não fornecido' });
    }

    const [bearer, token] = authHeader.split(' ');

    if (bearer !== 'Bearer' || !token) {
      return res.status(401).json({ mensagem: 'Formato de token inválido' });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded; // Adiciona usuário no request
    next();
  } catch (error) {
    console.error('Erro no middleware de autenticação:', error);
    return res.status(403).json({ mensagem: 'Não autorizado: Token inválido' });
  }
};

// Middleware adicional para roles
authMiddleware.withRole = (roles = []) => {
  return (req, res, next) => {
    // Primeiro chama authMiddleware para validar token
    authMiddleware(req, res, (err) => {
      if (err) return next(err);

      // Depois valida role
      if (!req.user) {
        return res.status(401).json({ mensagem: 'Não autorizado' });
      }

      if (roles.length > 0 && !roles.includes(req.user.tipo)) {
        return res.status(403).json({
          mensagem: `Acesso negado. Requer permissão de: ${roles.join(', ')}`
        });
      }

      next();
    });
  };
};

export default authMiddleware;
