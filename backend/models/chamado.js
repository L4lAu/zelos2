import { readAll, read } from '../config/database.js'

const listarChamado = async () => {
    try {
        return await readAll('Chamado')
    } catch (error) {
        console.error('Erro ao obter Chamado', error)
        throw error;
    }
}

const obterChamadoPorId = async (id) => {
    try {
        return await read('Chamado', `id = ${id}`)
    } catch (error) {
        console.error('Erro ao obter Chamado por ID', error)
        throw error;
    }
}

const criarChamado = async (ChamadoData) => {
    try {
        return await create('Chamado', ChamadoData)
    } catch (err) {
        console.error('Erro ao criar Chamado ', err);
        throw err;
    }
}

const atualizarChamado = async (ChamadoData, id) => {
        try {
            return await update('Chamado', ChamadoData, `id = ${id}`);
        } catch (err) {
            console.error('Erro ao atualizar Chamado', err)
            throw err;
        }
}

const excluirChamado = async(id) => {
    try {
        return await update('Chamado', `id = ${id}`);
    } catch (err) { 
        console.error('Erro ao excluir o Chamado' , err)
        throw err;
    } 
}

export { listarChamado, obterChamadoPorId, criarChamado, atualizarChamado, excluirChamado };