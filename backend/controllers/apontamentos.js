import { readAll, create } from '../config/database.js';

export async function listarApontamentos(req, res) {
  const { chamadoId } = req.params;
  const apontamentos = await readAll('apontamentos', `id_chamado=${chamadoId}`);
  res.json(apontamentos);
}

export async function criarApontamento(req, res) {
  const { chamadoId } = req.params;
  const { descricao, inicio, fim } = req.body;
  const novoId = await create('apontamentos', { id_chamado: chamadoId, id_tecnico: req.user.id, descricao, inicio, fim, criado_em: new Date() });
  res.json({ id: novoId });
}