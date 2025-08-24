import { readAll, create, update } from '../config/database.js';

export async function listarChamados(req, res) {
  let where = '';
  if (req.user.tipo === 'usuario') {
    where = `id_usuario=${req.user.id}`;
  }
  const chamados = await readAll('chamados', where);
  res.json(chamados);
}

export async function criarChamado(req, res) {
  const { patrimonio, descricao, tipo } = req.body;
  const novoId = await create('chamados', { id_usuario: req.user.id, patrimonio, descricao, tipo, status: 'aberto', criado_em: new Date() });
  res.json({ id: novoId });
}

export async function atualizarChamado(req, res) {
  const { id } = req.params;
  const data = req.body;
  const rows = await update('chamados', data, `id=${id}`);
  res.json({ rows });
}

export async function fecharChamado(req, res) {
  const { id } = req.params;
  const rows = await update('chamados', { status: 'fechado', fechado_em: new Date() }, `id=${id}`);
  res.json({ rows });
}