import { read } from '../config/database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/jwt.js';

export async function login(req, res) {
  const { username, password } = req.body;

  if (!username || !password) return res.status(400).json({ message: 'Username e password obrigatórios' });

  const user = await read('usuarios', `username='${username}'`);
  if (!user) return res.status(401).json({ message: 'Usuário não encontrado' });

  const senhaValida = await bcrypt.compare(password, user.senha_hash);
  if (!senhaValida) return res.status(401).json({ message: 'Senha incorreta' });
  console.log()

  const token = jwt.sign({ id: user.id, nome: user.nome, tipo: user.tipo }, JWT_SECRET, { expiresIn: '8h' });
  res.json({ token, tipo: user.tipo });
}

