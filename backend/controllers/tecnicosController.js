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