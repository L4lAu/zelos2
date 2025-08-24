import { encrypt, decrypt, encryptObject, decryptObject } from '../utils/encryption.js';

// Campos sensíveis que serão criptografados
const CAMPOS_SENSIVEIS = ['email', 'telefone', 'cpf'];

export async function listarTecnicos(req, res) {
  try {
    const tecnicos = await readAll('usuarios', "tipo = 'tecnico'");
    
    // Descriptografar dados sensíveis
    const tecnicosFormatados = tecnicos.map(tecnico => {
      const tecnicoDecriptado = decryptObject(tecnico, CAMPOS_SENSIVEIS);
      
      return {
        id: tecnicoDecriptado.id,
        nome: tecnicoDecriptado.nome,
        email: tecnicoDecriptado.email,
        username: tecnicoDecriptado.username,
        tipo: tecnicoDecriptado.tipo,
        ativo: tecnicoDecriptado.ativo,
        criado_em: tecnicoDecriptado.criado_em
      };
    });

    res.json(tecnicosFormatados);

  } catch (error) {
    console.error('Erro ao listar técnicos:', error);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
}

export async function criarTecnico(req, res) {
  try {
    const { nome, email, telefone, cpf, username, password } = req.body;

    // Validar campos obrigatórios
    if (!nome || !email || !username || !password) {
      return res.status(400).json({ error: 'Todos os campos são obrigatórios' });
    }

    // Verificar se username já existe
    const usuarioExistente = await read('usuarios', `username = '${username}'`);
    if (usuarioExistente) {
      return res.status(400).json({ error: 'Username já está em uso' });
    }

    // Criptografar dados sensíveis antes de verificar duplicatas
    const emailCriptografado = encrypt(email);
    const telefoneCriptografado = telefone ? encrypt(telefone) : null;
    const cpfCriptografado = cpf ? encrypt(cpf) : null;

    // Verificar se email já existe (usando dados criptografados)
    const emailExistente = await read('usuarios', `email_criptografado = '${emailCriptografado}'`);
    if (emailExistente) {
      return res.status(400).json({ error: 'Email já está em uso' });
    }

    // Criptografar senha
    const saltRounds = 12;
    const senhaHash = await bcrypt.hash(password, saltRounds);

    const novoTecnico = {
      nome,
      email_criptografado: emailCriptografado,
      telefone_criptografado: telefoneCriptografado,
      cpf_criptografado: cpfCriptografado,
      username,
      senha_hash: senhaHash,
      tipo: 'tecnico',
      ativo: true,
      criado_em: new Date()
    };

    const novoId = await create('usuarios', novoTecnico);

    res.status(201).json({ 
      id: novoId,
      message: 'Técnico criado com sucesso',
      tecnico: {
        id: novoId,
        nome,
        email,
        username,
        tipo: 'tecnico'
      }
    });

  } catch (error) {
    console.error('Erro ao criar técnico:', error);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
}

export async function obterTecnico(req, res) {
  try {
    const { id } = req.params;

    const tecnico = await read('usuarios', `id = ${id} AND tipo = 'tecnico'`);
    
    if (!tecnico) {
      return res.status(404).json({ error: 'Técnico não encontrado' });
    }

    // Descriptografar dados sensíveis
    const tecnicoDecriptado = decryptObject(tecnico, CAMPOS_SENSIVEIS);

    // Remover informações sensíveis
    const { senha_hash, email_criptografado, telefone_criptografado, cpf_criptografado, ...tecnicoFormatado } = tecnicoDecriptado;

    res.json(tecnicoFormatado);

  } catch (error) {
    console.error('Erro ao obter técnico:', error);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
}

export async function atualizarTecnico(req, res) {
  try {
    const { id } = req.params;
    const { nome, email, telefone, cpf, username, ativo } = req.body;

    // Verificar se técnico existe
    const tecnico = await read('usuarios', `id = ${id} AND tipo = 'tecnico'`);
    if (!tecnico) {
      return res.status(404).json({ error: 'Técnico não encontrado' });
    }

    // Verificar se novo username já existe (se foi alterado)
    if (username && username !== tecnico.username) {
      const usernameExistente = await read('usuarios', `username = '${username}' AND id != ${id}`);
      if (usernameExistente) {
        return res.status(400).json({ error: 'Username já está em uso' });
      }
    }

    // Verificar se novo email já existe (se foi alterado)
    if (email && email !== decrypt(tecnico.email_criptografado)) {
      const emailCriptografado = encrypt(email);
      const emailExistente = await read('usuarios', `email_criptografado = '${emailCriptografado}' AND id != ${id}`);
      if (emailExistente) {
        return res.status(400).json({ error: 'Email já está em uso' });
      }
    }

    // Preparar dados para atualização
    const dadosAtualizacao = {};
    
    if (nome) dadosAtualizacao.nome = nome;
    if (username) dadosAtualizacao.username = username;
    if (ativo !== undefined) dadosAtualizacao.ativo = ativo;

    // Criptografar campos sensíveis se fornecidos
    if (email) {
      dadosAtualizacao.email_criptografado = encrypt(email);
    }
    if (telefone) {
      dadosAtualizacao.telefone_criptografado = encrypt(telefone);
    }
    if (cpf) {
      dadosAtualizacao.cpf_criptografado = encrypt(cpf);
    }

    // Atualizar técnico
    const rowsAffected = await update('usuarios', dadosAtualizacao, `id = ${id}`);

    if (rowsAffected === 0) {
      return res.status(400).json({ error: 'Nenhum dado foi alterado' });
    }

    // Buscar técnico atualizado
    const tecnicoAtualizado = await read('usuarios', `id = ${id}`);
    const tecnicoDecriptado = decryptObject(tecnicoAtualizado, CAMPOS_SENSIVEIS);

    res.json({
      message: 'Técnico atualizado com sucesso',
      tecnico: {
        id: tecnicoDecriptado.id,
        nome: tecnicoDecriptado.nome,
        email: tecnicoDecriptado.email,
        username: tecnicoDecriptado.username,
        tipo: tecnicoDecriptado.tipo,
        ativo: tecnicoDecriptado.ativo,
        criado_em: tecnicoDecriptado.criado_em
      }
    });

  } catch (error) {
    console.error('Erro ao atualizar técnico:', error);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
}

export async function desativarTecnico(req, res) {
  try {
    const { id } = req.params;

    // Verificar se técnico existe
    const tecnico = await read('usuarios', `id = ${id} AND tipo = 'tecnico'`);
    if (!tecnico) {
      return res.status(404).json({ error: 'Técnico não encontrado' });
    }

    if (!tecnico.ativo) {
      return res.status(400).json({ error: 'Técnico já está desativado' });
    }

    // Desativar técnico
    const rowsAffected = await update('usuarios', { ativo: false }, `id = ${id}`);

    res.json({
      message: 'Técnico desativado com sucesso',
      rows_affected: rowsAffected
    });

  } catch (error) {
    console.error('Erro ao desativar técnico:', error);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
}

export async function ativarTecnico(req, res) {
  try {
    const { id } = req.params;

    // Verificar se técnico existe
    const tecnico = await read('usuarios', `id = ${id} AND tipo = 'tecnico'`);
    if (!tecnico) {
      return res.status(404).json({ error: 'Técnico não encontrado' });
    }

    if (tecnico.ativo) {
      return res.status(400).json({ error: 'Técnico já está ativo' });
    }

    // Ativar técnico
    const rowsAffected = await update('usuarios', { ativo: true }, `id = ${id}`);

    res.json({
      message: 'Técnico ativado com sucesso',
      rows_affected: rowsAffected
    });

  } catch (error) {
    console.error('Erro ao ativar técnico:', error);
    res.status(500).json({ error: 'Erro interno no servidor' });
  }
}