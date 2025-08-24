import { readAll, create, read, update } from '../config/database.js';

// Função auxiliar para calcular duração em minutos
function calcularDuracao(inicio, fim) {
  if (!inicio || !fim) return null;
  
  const inicioDate = new Date(inicio);
  const fimDate = new Date(fim);
  
  if (isNaN(inicioDate) || isNaN(fimDate)) return null;
  if (fimDate <= inicioDate) return null;
  
  return Math.round((fimDate - inicioDate) / (1000 * 60)); // Duração em minutos
}

export async function listarApontamentos(req, res) {
  try {
    const { chamadoId } = req.params;
    
    const chamado = await read('chamados', `id=${chamadoId}`);
    if (!chamado) {
      return res.status(404).json({ error: 'Chamado não encontrado' });
    }

    // Verificar permissões
    if (req.user.tipo === 'usuario' && chamado.id_usuario !== req.user.id) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    if (req.user.tipo === 'tecnico' && chamado.id_tecnico !== req.user.id) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    const apontamentos = await readAll('apontamentos', `id_chamado=${chamadoId}`);
    
    // Formatar resposta com duração legível
    const apontamentosFormatados = apontamentos.map(apontamento => ({
      ...apontamento,
      duracao_formatada: apontamento.duracao_minutos 
        ? formatarDuracao(apontamento.duracao_minutos)
        : 'Em andamento'
    }));

    res.json(apontamentosFormatados);

  } catch (error) {
    console.error('Erro ao listar apontamentos:', error);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
}

export async function criarApontamento(req, res) {
  try {
    const { chamadoId } = req.params;
    const { descricao, inicio, fim } = req.body;

    if (!descricao || !inicio) {
      return res.status(400).json({ error: 'Descrição e início são obrigatórios' });
    }

    const chamado = await read('chamados', `id=${chamadoId}`);
    if (!chamado) {
      return res.status(404).json({ error: 'Chamado não encontrado' });
    }

    if (chamado.status !== 'em_andamento') {
      return res.status(400).json({ 
        error: 'Só é possível adicionar apontamentos em chamados com status "em_andamento"' 
      });
    }

    if (chamado.id_tecnico !== req.user.id) {
      return res.status(403).json({ 
        error: 'Acesso negado. Você não está atribuído a este chamado' 
      });
    }

    // Calcular duração automaticamente
    const duracaoMinutos = calcularDuracao(inicio, fim);

    if (fim && !duracaoMinutos) {
      return res.status(400).json({ 
        error: 'Data de fim deve ser posterior à data de início' 
      });
    }

    const novoApontamento = {
      id_chamado: chamadoId,
      id_tecnico: req.user.id,
      descricao,
      inicio: new Date(inicio),
      fim: fim ? new Date(fim) : null,
      duracao_minutos: duracaoMinutos,
      criado_em: new Date()
    };

    const novoId = await create('apontamentos', novoApontamento);
    
    res.status(201).json({ 
      id: novoId,
      message: 'Apontamento criado com sucesso',
      duracao_minutos: duracaoMinutos,
      duracao_formatada: duracaoMinutos ? formatarDuracao(duracaoMinutos) : null
    });

  } catch (error) {
    console.error('Erro ao criar apontamento:', error);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
}

export async function atualizarApontamento(req, res) {
  try {
    const { apontamentoId } = req.params;
    const { descricao, inicio, fim } = req.body;

    // Verificar se o apontamento existe e pertence ao técnico
    const apontamento = await read('apontamentos', `id=${apontamentoId}`);
    if (!apontamento) {
      return res.status(404).json({ error: 'Apontamento não encontrado' });
    }

    if (apontamento.id_tecnico !== req.user.id) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    // Calcular nova duração se as datas foram alteradas
    const novaInicio = inicio ? new Date(inicio) : new Date(apontamento.inicio);
    const novaFim = fim ? new Date(fim) : apontamento.fim ? new Date(apontamento.fim) : null;
    
    const novaDuracao = novaFim ? calcularDuracao(novaInicio, novaFim) : null;

    if (novaFim && !novaDuracao) {
      return res.status(400).json({ 
        error: 'Data de fim deve ser posterior à data de início' 
      });
    }

    const dadosAtualizacao = {
      ...(descricao && { descricao }),
      ...(inicio && { inicio: novaInicio }),
      ...(fim && { fim: novaFim }),
      ...(novaDuracao !== null && { duracao_minutos: novaDuracao })
    };

    const rowsAffected = await update('apontamentos', dadosAtualizacao, `id=${apontamentoId}`);

    res.json({ 
      message: 'Apontamento atualizado com sucesso',
      rows_affected: rowsAffected,
      duracao_minutos: novaDuracao,
      duracao_formatada: novaDuracao ? formatarDuracao(novaDuracao) : 'Em andamento'
    });

  } catch (error) {
    console.error('Erro ao atualizar apontamento:', error);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
}

export async function finalizarApontamento(req, res) {
  try {
    const { apontamentoId } = req.params;
    const { fim } = req.body;

    const apontamento = await read('apontamentos', `id=${apontamentoId}`);
    if (!apontamento) {
      return res.status(404).json({ error: 'Apontamento não encontrado' });
    }

    if (apontamento.id_tecnico !== req.user.id) {
      return res.status(403).json({ error: 'Acesso negado' });
    }

    if (apontamento.fim) {
      return res.status(400).json({ error: 'Apontamento já finalizado' });
    }

    const dataFim = fim ? new Date(fim) : new Date();
    const duracaoMinutos = calcularDuracao(apontamento.inicio, dataFim);

    if (!duracaoMinutos) {
      return res.status(400).json({ 
        error: 'Data de fim deve ser posterior à data de início' 
      });
    }

    const rowsAffected = await update('apontamentos', {
      fim: dataFim,
      duracao_minutos: duracaoMinutos
    }, `id=${apontamentoId}`);

    res.json({ 
      message: 'Apontamento finalizado com sucesso',
      duracao_minutos: duracaoMinutos,
      duracao_formatada: formatarDuracao(duracaoMinutos)
    });

  } catch (error) {
    console.error('Erro ao finalizar apontamento:', error);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
}

// Função para formatar duração em formato legível
function formatarDuracao(minutos) {
  if (!minutos) return null;
  
  const horas = Math.floor(minutos / 60);
  const mins = minutos % 60;
  
  if (horas > 0) {
    return mins > 0 ? `${horas}h ${mins}min` : `${horas}h`;
  }
  return `${mins}min`;
}