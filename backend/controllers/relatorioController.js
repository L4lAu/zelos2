import { readAll } from '../config/database.js';

export async function relatorioChamados(req, res) {
  try {
    const { status, tipo, data_inicio, data_fim, tecnico } = req.query;
    
    let whereConditions = [];
    let values = [];

    // Construir condições dinâmicas
    if (status) {
      whereConditions.push('status = ?');
      values.push(status);
    }

    if (tipo) {
      whereConditions.push('tipo = ?');
      values.push(tipo);
    }

    if (data_inicio) {
      whereConditions.push('criado_em >= ?');
      values.push(data_inicio);
    }

    if (data_fim) {
      whereConditions.push('criado_em <= ?');
      values.push(data_fim + ' 23:59:59'); // Até o final do dia
    }

    if (tecnico) {
      whereConditions.push('id_tecnico = ?');
      values.push(tecnico);
    }

    const whereClause = whereConditions.length > 0 
      ? `WHERE ${whereConditions.join(' AND ')}` 
      : '';

    // Query principal
    const sql = `
      SELECT 
        c.*,
        u.nome as nome_usuario,
        t.nome as nome_tecnico
      FROM chamados c
      LEFT JOIN usuarios u ON c.id_usuario = u.id
      LEFT JOIN usuarios t ON c.id_tecnico = t.id
      ${whereClause}
      ORDER BY c.criado_em DESC
    `;

    const chamados = await readAll(sql, values);
    
    res.json({
      total: chamados.length,
      chamados: chamados
    });

  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
}

export async function relatorioEstatisticas(req, res) {
  try {
    const { data_inicio, data_fim } = req.query;
    
    let whereConditions = [];
    let values = [];

    if (data_inicio) {
      whereConditions.push('criado_em >= ?');
      values.push(data_inicio);
    }

    if (data_fim) {
      whereConditions.push('criado_em <= ?');
      values.push(data_fim + ' 23:59:59');
    }

    const whereClause = whereConditions.length > 0 
      ? `WHERE ${whereConditions.join(' AND ')}` 
      : '';

    // Estatísticas por status
    const statsStatus = await readAll(`
      SELECT 
        status,
        COUNT(*) as total,
        ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM chamados ${whereClause})), 2) as percentual
      FROM chamados 
      ${whereClause}
      GROUP BY status
    `, values);

    // Estatísticas por tipo
    const statsTipo = await readAll(`
      SELECT 
        tipo,
        COUNT(*) as total,
        ROUND((COUNT(*) * 100.0 / (SELECT COUNT(*) FROM chamados ${whereClause})), 2) as percentual
      FROM chamados 
      ${whereClause}
      GROUP BY tipo
    `, values);

    // Estatísticas por técnico
    const statsTecnico = await readAll(`
      SELECT 
        t.nome as tecnico,
        COUNT(c.id) as total_chamados,
        AVG(TIMESTAMPDIFF(HOUR, c.criado_em, c.fechado_em)) as tempo_medio_resolucao
      FROM chamados c
      LEFT JOIN usuarios t ON c.id_tecnico = t.id
      ${whereClause}
      GROUP BY c.id_tecnico
    `, values);

    res.json({
      por_status: statsStatus,
      por_tipo: statsTipo,
      por_tecnico: statsTecnico
    });

  } catch (error) {
    console.error('Erro ao gerar estatísticas:', error);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
}