import express from 'express';
import passport from '../config/ldap.js';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/jwt.js';
import { read, create } from '../config/database.js';
import bcrypt from 'bcryptjs';

const router = express.Router();

// Rota de Login com LDAP + JWT
router.post('/login', (req, res, next) => {
  passport.authenticate('ldapauth', { session: false }, async (err, user, info) => {
    try {
      if (err) {
        console.error('Erro na autenticação LDAP:', err);
        return res.status(500).json({ error: 'Erro interno no servidor' });
      }

      if (!user) {
        return res.status(401).json({ error: info?.message || 'Credenciais inválidas' });
      }

      // Verificar se usuário existe no banco local, se não, criar
      let localUser = await read('usuarios', `username='${user.sAMAccountName}'`);
      
      if (!localUser) {
        // Criar usuário local baseado no LDAP
        const novoSenhaHash = await bcrypt.hash('senha_temporaria', 12);
        
        localUser = {
          username: user.sAMAccountName,
          nome: user.displayName || user.cn,
          email: user.mail,
          senha_hash: novoSenhaHash,
          tipo: 'usuario', // Tipo padrão
          ativo: true,
          criado_em: new Date()
        };

        const userId = await create('usuarios', localUser);
        localUser.id = userId;
      }

      // Gerar token JWT com dados do usuário
      const token = jwt.sign(
        {
          id: localUser.id,
          username: localUser.username,
          nome: localUser.nome,
          email: localUser.email,
          tipo: localUser.tipo
        },
        JWT_SECRET,
        { expiresIn: '8h' }
      );

      res.json({
        message: 'Autenticado com sucesso',
        token,
        user: {
          id: localUser.id,
          username: localUser.username,
          nome: localUser.nome,
          email: localUser.email,
          tipo: localUser.tipo
        }
      });

    } catch (error) {
      console.error('Erro no processo de login:', error);
      res.status(500).json({ error: 'Erro interno no servidor' });
    }
  })(req, res, next);
});

// Logout (para JWT)
router.post('/logout', (req, res) => {
  res.json({ message: 'Logout realizado com sucesso' });
});

// Verificar autenticação
router.get('/check-auth', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ authenticated: false });
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({
      authenticated: true,
      user: decoded
    });
  } catch (error) {
    res.status(401).json({ authenticated: false });
  }
});

export default router;