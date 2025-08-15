import { read } from '../config/database.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config/jwt.js';

export async function login(req, res) {
  const { email, senha } = req.body;

  if (!email || !senha) return res.status(400).json({ message: 'Email e senha obrigatórios' });

  const user = await read('usuarios', `email='${email}'`);
  if (!user) return res.status(401).json({ message: 'Usuário não encontrado' });

  const senhaValida = await bcrypt.compare(senha, user.senha_hash);
  if (!senhaValida) return res.status(401).json({ message: 'Senha incorreta' });

  const token = jwt.sign({ id: user.id, nome: user.nome, tipo: user.tipo }, JWT_SECRET, { expiresIn: '8h' });
  res.json({ token, tipo: user.tipo });
}