import { read } from '../config/database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/jwt.js';
import { encrypt, decrypt } from '../utils/encryption.js';

export async function login(req, res) {
  const { username, password } = req.body;

  if (!username || !password) return res.status(400).json({ message: 'Username e password obrigatórios' });

  // Buscar usuário descriptografando email para comparação
  const user = await read('usuarios', `username='${username}'`);
  if (!user) return res.status(401).json({ message: 'Usuário não encontrado' });

  // Descriptografar email para uso interno
  const emailDecriptado = decrypt(user.email_criptografado);

  const senhaValida = await bcrypt.compare(password, user.senha_hash);
  if (!senhaValida) return res.status(401).json({ message: 'Senha incorreta' });

  const token = jwt.sign({ 
    id: user.id, 
    nome: user.nome, 
    tipo: user.tipo,
    email: emailDecriptado // Email descriptografado no token
  }, JWT_SECRET, { expiresIn: '8h' });

  res.json({ 
    token, 
    tipo: user.tipo,
    user: {
      id: user.id,
      nome: user.nome,
      username: user.username,
      email: emailDecriptado,
      tipo: user.tipo
    }
  });
}