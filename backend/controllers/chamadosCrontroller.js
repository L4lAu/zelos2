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
  const chamadoExistente = await read('chamados', `patrimonio='${patrimonio}' AND tipo='${tipo}' AND status='aberto'`);
  if (chamadoExistente) {
    return res.status(400).json({ error: 'Já existe um chamado aberto para este patrimônio e tipo' });
  }
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

export async function atribuirTecnico(req, res) {
  try {
    const { id } = req.params;
    const { id_tecnico } = req.body;

    // Validar se o técnico existe
    const tecnico = await read('usuarios', `id=${id_tecnico} AND tipo='tecnico'`);
    if (!tecnico) {
      return res.status(404).json({ error: 'Técnico não encontrado' });
    }

    // Validar se o chamado existe e está aberto
    const chamado = await read('chamados', `id=${id}`);
    if (!chamado) {
      return res.status(404).json({ error: 'Chamado não encontrado' });
    }

    if (chamado.status !== 'aberto') {
      return res.status(400).json({ error: 'Só é possível atribuir técnico a chamados abertos' });
    }

    // Atualizar chamado com o técnico
    const rows = await update('chamados', { 
      id_tecnico: id_tecnico, 
      status: 'em_andamento' 
    }, `id=${id}`);

    res.json({ 
      message: 'Técnico atribuído com sucesso',
      rows_affected: rows 
    });

  } catch (error) {
    console.error('Erro ao atribuir técnico:', error);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
}