export function validarApontamento(req, res, next) {
  const { descricao, inicio, fim } = req.body;
  const errors = [];

  if (!descricao || descricao.trim().length < 5) {
    errors.push('Descrição deve ter pelo menos 5 caracteres');
  }

  if (!inicio) {
    errors.push('Data de início é obrigatória');
  } else if (isNaN(new Date(inicio))) {
    errors.push('Data de início inválida');
  }

  if (fim && isNaN(new Date(fim))) {
    errors.push('Data de fim inválida');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
}