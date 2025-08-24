import { readAll } from '../config/database.js';
import { Parser } from 'json2csv';
import PDFDocument from 'pdfkit';

function formatarDadosRelatorio(dados) {
  return dados.map(item => ({
    ...item,
    criado_em: item.criado_em ? new Date(item.criado_em).toLocaleDateString('pt-BR') : '',
    fechado_em: item.fechado_em ? new Date(item.fechado_em).toLocaleDateString('pt-BR') : ''
  }));
}

export async function relatorioChamados(req, res) {
  try {
    const { status, tipo, data_inicio, data_fim, tecnico, formato } = req.query;
    
    let whereConditions = [];
    let values = [];

    if (status) {
      whereConditions.push('c.status = ?');
      values.push(status);
    }

    if (tipo) {
      whereConditions.push('c.tipo = ?');
      values.push(tipo);
    }

    if (data_inicio) {
      whereConditions.push('c.criado_em >= ?');
      values.push(data_inicio);
    }

    if (data_fim) {
      whereConditions.push('c.criado_em <= ?');
      values.push(data_fim + ' 23:59:59');
    }

    if (tecnico) {
      whereConditions.push('c.id_tecnico = ?');
      values.push(tecnico);
    }

    const whereClause = whereConditions.length > 0 
      ? `WHERE ${whereConditions.join(' AND ')}` 
      : '';

    const sql = `
      SELECT 
        c.*,
        u.nome as nome_usuario,
        t.nome as nome_tecnico,
        TIMESTAMPDIFF(HOUR, c.criado_em, c.fechado_em) as tempo_resolucao_horas
      FROM chamados c
      LEFT JOIN usuarios u ON c.id_usuario = u.id
      LEFT JOIN usuarios t ON c.id_tecnico = t.id
      ${whereClause}
      ORDER BY c.criado_em DESC
    `;

    const chamados = await readAll(sql, values);
    const chamadosFormatados = formatarDadosRelatorio(chamados);

    // Exportação em CSV
    if (formato === 'csv') {
      try {
        const parser = new Parser();
        const csv = parser.parse(chamadosFormatados);
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=relatorio-chamados.csv');
        return res.send(csv);
      } catch (error) {
        console.error('Erro ao gerar CSV:', error);
        return res.status(500).json({ error: 'Erro ao gerar CSV' });
      }
    }

    // Exportação em PDF
    if (formato === 'pdf') {
      try {
        const doc = new PDFDocument();
        const filename = 'relatorio-chamados.pdf';
        
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        
        doc.pipe(res);
        doc.fontSize(20).text('Relatório de Chamados', 100, 100);
        doc.fontSize(12);
        
        let y = 150;
        chamadosFormatados.forEach((chamado, index) => {
          if (y > 700) {
            doc.addPage();
            y = 100;
          }
          
          doc.text(`${index + 1}. ${chamado.patrimonio} - ${chamado.tipo}`, 100, y);
          doc.text(`Status: ${chamado.status} | Técnico: ${chamado.nome_tecnico || 'N/A'}`, 100, y + 20);
          doc.text(`Criado: ${chamado.criado_em}`, 100, y + 40);
          y += 70;
        });

        doc.end();
        return;
      } catch (error) {
        console.error('Erro ao gerar PDF:', error);
        return res.status(500).json({ error: 'Erro ao gerar PDF' });
      }
    }

    // Retorno padrão JSON
    res.json({
      total: chamados.length,
      chamados: chamadosFormatados
    });

  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
}

export async function relatorioEstatisticas(req, res) {
  try {
    const { data_inicio, data_fim, formato } = req.query;
    
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

    // Estatísticas por técnico (DETALHADO)
    const statsTecnico = await readAll(`
      SELECT 
        t.id,
        t.nome as tecnico,
        COUNT(c.id) as total_chamados,
        SUM(CASE WHEN c.status = 'fechado' THEN 1 ELSE 0 END) as chamados_concluidos,
        AVG(TIMESTAMPDIFF(HOUR, c.criado_em, c.fechado_em)) as tempo_medio_resolucao_horas,
        MIN(TIMESTAMPDIFF(HOUR, c.criado_em, c.fechado_em)) as tempo_minimo_resolucao,
        MAX(TIMESTAMPDIFF(HOUR, c.criado_em, c.fechado_em)) as tempo_maximo_resolucao
      FROM chamados c
      LEFT JOIN usuarios t ON c.id_tecnico = t.id
      ${whereClause.replace('criado_em', 'c.criado_em')}
      GROUP BY c.id_tecnico
      HAVING total_chamados > 0
    `, values);

    // Dados para gráficos
    const dadosGraficos = {
      status: statsStatus.map(item => ({ name: item.status, value: item.total })),
      tipo: statsTipo.map(item => ({ name: item.tipo, value: item.total })),
      tecnico: statsTecnico.map(item => ({ name: item.tecnico, value: item.total_chamados }))
    };

    const resultado = {
      por_status: statsStatus,
      por_tipo: statsTipo,
      por_tecnico: statsTecnico,
      graficos: dadosGraficos
    };

    // Exportação em CSV
    if (formato === 'csv') {
      try {
        const parser = new Parser();
        const csvData = [
          ...statsStatus.map(s => ({ Categoria: 'Status', Item: s.status, Total: s.total, Percentual: `${s.percentual}%` })),
          ...statsTipo.map(t => ({ Categoria: 'Tipo', Item: t.tipo, Total: t.total, Percentual: `${t.percentual}%` })),
          ...statsTecnico.map(tec => ({ 
            Categoria: 'Técnico', 
            Item: tec.tecnico, 
            'Total Chamados': tec.total_chamados,
            'Chamados Concluídos': tec.chamados_concluidos,
            'Tempo Médio (h)': tec.tempo_medio_resolucao_horas?.toFixed(2) || 'N/A'
          }))
        ];

        const csv = parser.parse(csvData);
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=estatisticas-chamados.csv');
        return res.send(csv);
      } catch (error) {
        console.error('Erro ao gerar CSV:', error);
        return res.status(500).json({ error: 'Erro ao gerar CSV' });
      }
    }

    res.json(resultado);

  } catch (error) {
    console.error('Erro ao gerar estatísticas:', error);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
}

// NOVO: Relatório detalhado por técnico
export async function relatorioTecnicoDetalhado(req, res) {
  try {
    const { tecnicoId, data_inicio, data_fim } = req.query;
    
    if (!tecnicoId) {
      return res.status(400).json({ error: 'ID do técnico é obrigatório' });
    }

    let whereConditions = ['c.id_tecnico = ?'];
    let values = [tecnicoId];

    if (data_inicio) {
      whereConditions.push('c.criado_em >= ?');
      values.push(data_inicio);
    }

    if (data_fim) {
      whereConditions.push('c.criado_em <= ?');
      values.push(data_fim + ' 23:59:59');
    }

    const whereClause = whereConditions.join(' AND ');

    // Dados do técnico
    const tecnico = await read('usuarios', `id = ${tecnicoId} AND tipo = 'tecnico'`);
    if (!tecnico) {
      return res.status(404).json({ error: 'Técnico não encontrado' });
    }

    // Estatísticas do técnico
    const estatisticas = await readAll(`
      SELECT 
        COUNT(*) as total_chamados,
        SUM(CASE WHEN c.status = 'fechado' THEN 1 ELSE 0 END) as concluidos,
        SUM(CASE WHEN c.status = 'em_andamento' THEN 1 ELSE 0 END) as em_andamento,
        SUM(CASE WHEN c.status = 'aberto' THEN 1 ELSE 0 END) as abertos,
        AVG(TIMESTAMPDIFF(HOUR, c.criado_em, c.fechado_em)) as tempo_medio_resolucao,
        MIN(TIMESTAMPDIFF(HOUR, c.criado_em, c.fechado_em)) as tempo_minimo,
        MAX(TIMESTAMPDIFF(HOUR, c.criado_em, c.fechado_em)) as tempo_maximo
      FROM chamados c
      WHERE ${whereClause}
    `, values);

    // Chamados recentes do técnico
    const chamadosRecentes = await readAll(`
      SELECT 
        c.*,
        u.nome as nome_usuario,
        TIMESTAMPDIFF(HOUR, c.criado_em, c.fechado_em) as tempo_resolucao
      FROM chamados c
      LEFT JOIN usuarios u ON c.id_usuario = u.id
      WHERE ${whereClause}
      ORDER BY c.criado_em DESC
      LIMIT 10
    `, values);

    // Distribuição por tipo
    const porTipo = await readAll(`
      SELECT 
        tipo,
        COUNT(*) as total
      FROM chamados 
      WHERE ${whereClause}
      GROUP BY tipo
    `, values);

    res.json({
      tecnico: {
        id: tecnico.id,
        nome: tecnico.nome,
        username: tecnico.username
      },
      estatisticas: estatisticas[0] || {},
      distribuicao_tipo: porTipo,
      ultimos_chamados: chamadosRecentes
    });

  } catch (error) {
    console.error('Erro ao gerar relatório técnico:', error);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
}