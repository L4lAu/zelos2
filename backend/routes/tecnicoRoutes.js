import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {
    listarTecnicos,
    obterTecnico,
    criarTecnico,
    atualizarTecnico,
    desativarTecnico,
    ativarTecnico
} from '../controllers/tecnicosController.js';
import { validarCriacaoTecnico, validarAtualizacaoTecnico } from '../middleware/validacaoTecnicos.js';

const router = express.Router();

// Apenas administradores podem gerenciar técnicos
router.get('/', authMiddleware(['adm']), listarTecnicos);
router.get('/:id', authMiddleware(['adm']), obterTecnico);
router.post('/', authMiddleware(['adm']), validarCriacaoTecnico, criarTecnico);
router.put('/:id', authMiddleware(['adm']), validarAtualizacaoTecnico, atualizarTecnico);
router.patch('/:id/desativar', authMiddleware(['adm']), desativarTecnico);
router.patch('/:id/ativar', authMiddleware(['adm']), ativarTecnico);

export default router;