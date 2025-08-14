import { listarChamados, obterChamadoPorId, criarChamado, atualizarChamado, excluirChamado } from "../models/Chamado.js";
import { fileURLToPath } from 'url';
import path from 'path';


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const listarChamadoController = async (req, res) => {
    try {
        const Chamados = await listarChamados()
        res.status(200).send(Chamados)
    } catch (err) {
        res.status(500).json({ message: 'Erro interno no servidor', err })
        console.error(err)
    }
};

const obterChamadoPorIdController = async (req, res) => {
    try {
        const Chamado = await obterChamadoPorId(req.params.id)

        if (!Chamado) {
            return res.status(404).json({ message: 'Chamado não encontrado' });
        }

        return res.status(200).json(Chamado)

    } catch (err) {
        res.status(500).json({ message: 'Erro interno no servidor', err })
        console.error('Erro ao obter Chamado por ID: ', err)
    }
};

const criarChamadoController = async (req, res) => {
    try {
        const { titulo, descricao, isbn } = req.body;
        let capaPath = null;
        if (req.file) {
            capaPath = req.file.path.replace(__filename.replace('\\controllers', ''), '')
        }

        const ChamadoData = {
            titulo: titulo,
            descricao: descricao,
            isbn: isbn,
            capa: capaPath
        }

        const ChamadoId = await criarChamado(ChamadoData);
        res.status(201).json({message: 'Chamado criado com sucesso.', ChamadoId});

    } catch (err) {
        console.error('Erro ao criar Chamado: ', err);
        res.status(500).json({message: 'Erro ao criar Chamado'})
    }
}

const atualizarChamadoController = async (req, res) => {
    try {

        const ChamadoId = req.params.id ;
        const { titulo, descricao, isbn} = req.body;
        
        let capaPath = null;
        if (req.file) {
            capaPath = req.file.path.replace(__filename.replace('\\controllers', ''), '')
    }
    
    const ChamadoData = {
        titulo: titulo,
        descricao: descricao,
        isbn: isbn,
        capa: capaPath
    }
    await atualizarChamado(ChamadoId, ChamadoData);
    res.status(200).json({message: 'Chamado atualizado com sucesso.', ChamadoId});

} catch (err) {
    console.error('Erro ao atualizar Chamado: ', err);
    res.status(500).json({message: 'Erro ao atualizar Chamado'})
}
}
    
const excluirChamadoController = async (req, res) => {
        try {
            const ChamadoId = req.params.id;
            await excluirChamado(ChamadoId)
            res.status(200).json({message: 'Chamado excluído com sucesso. ', ChamadoId})
        } catch (err) {
            console.error('Erro ao excluir Chamado: ', err);
            res.status(500).json({message: 'Erro ao excluir Chamado'})
        }
}

export { listarChamadoController, obterChamadoPorIdController, atualizarChamadoController, criarChamadoController, excluirChamadoController }

