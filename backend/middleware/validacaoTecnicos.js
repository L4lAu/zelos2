export function validarAtualizacaoTecnico(req, res, next) {
  const { email, username, password, telefone, cpf } = req.body;
  const errors = [];

  if (email && !email.includes('@')) {
    errors.push('Email inválido');
  }

  if (username && username.trim().length < 3) {
    errors.push('Username deve ter pelo menos 3 caracteres');
  }

  if (password && password.length < 6) {
    errors.push('Senha deve ter pelo menos 6 caracteres');
  }

  if (telefone && telefone.replace(/\D/g, '').length < 10) {
    errors.push('Telefone inválido');
  }

  if (cpf && cpf.replace(/\D/g, '').length !== 11) {
    errors.push('CPF inválido');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
}

export function validarAtualizacaoTecnico(req, res, next) {
  const { email, username, password } = req.body;
  const errors = [];

  if (email && !email.includes('@')) {
    errors.push('Email inválido');
  }

  if (username && username.trim().length < 3) {
    errors.push('Username deve ter pelo menos 3 caracteres');
  }

  if (password && password.length < 6) {
    errors.push('Senha deve ter pelo menos 6 caracteres');
  }

  if (errors.length > 0) {
    return res.status(400).json({ errors });
  }

  next();
}