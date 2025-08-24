import { readAll, read, create, update, deleteRecord } from '../config/database.js';

export async function listarEquipamentos(req, res) {
  try {
    const { tipo, localizacao, status } = req.query;
    
    let whereConditions = [];
    let values = [];

    if (tipo) {
      whereConditions.push('tipo = ?');
      values.push(tipo);
    }

    if (localizacao) {
      whereConditions.push('localizacao LIKE ?');
      values.push(`%${localizacao}%`);
    }

    if (status) {
      whereConditions.push('status = ?');
      values.push(status);
    }

    const whereClause = whereConditions.length > 0 ? whereConditions.join(' AND ') : null;
    const equipamentos = await readAll('equipamentos', whereClause, values);

    res.json(equipamentos);
  } catch (error) {
    console.error('Erro ao listar equipamentos:', error);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
}

export async function buscarEquipamento(req, res) {
  try {
    const { patrimonio } = req.params;
    const equipamento = await read('equipamentos', `patrimonio = '${patrimonio}'`);

    if (!equipamento) {
      return res.status(404).json({ error: 'Equipamento não encontrado' });
    }

    res.json(equipamento);
  } catch (error) {
    console.error('Erro ao buscar equipamento:', error);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
}

export async function criarEquipamento(req, res) {
  try {
    const { patrimonio, descricao, tipo, localizacao, status } = req.body;

    if (!patrimonio) {
      return res.status(400).json({ error: 'Número de patrimônio é obrigatório' });
    }

    // Verificar se patrimônio já existe
    const existe = await read('equipamentos', `patrimonio = '${patrimonio}'`);
    if (existe) {
      return res.status(400).json({ error: 'Patrimônio já cadastrado' });
    }

    const novoEquipamento = {
      patrimonio,
      descricao,
      tipo,
      localizacao,
      status: status || 'ativo'
    };

    const id = await create('equipamentos', novoEquipamento);
    res.status(201).json({ id, message: 'Equipamento criado com sucesso' });

  } catch (error) {
    console.error('Erro ao criar equipamento:', error);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
}

export async function atualizarEquipamento(req, res) {
  try {
    const { id } = req.params;
    const dados = req.body;

    const equipamento = await read('equipamentos', `id = ${id}`);
    if (!equipamento) {
      return res.status(404).json({ error: 'Equipamento não encontrado' });
    }

    const rows = await update('equipamentos', dados, `id = ${id}`);
    res.json({ message: 'Equipamento atualizado', rows_affected: rows });

  } catch (error) {
    console.error('Erro ao atualizar equipamento:', error);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
}

export async function deletarEquipamento(req, res) {
  try {
    const { id } = req.params;

    const equipamento = await read('equipamentos', `id = ${id}`);
    if (!equipamento) {
      return res.status(404).json({ error: 'Equipamento não encontrado' });
    }

    const rows = await deleteRecord('equipamentos', `id = ${id}`);
    res.json({ message: 'Equipamento deletado', rows_affected: rows });

  } catch (error) {
    console.error('Erro ao deletar equipamento:', error);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
}