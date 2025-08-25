import express from 'express';
import authMiddleware from '../middleware/authmiddleware.js';
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
router.get('/', authMiddleware.withRole(['adm']), listarTecnicos);
router.get('/:id', authMiddleware.withRole(['adm']), obterTecnico);
router.post('/', authMiddleware.withRole(['adm']), validarCriacaoTecnico, criarTecnico);
router.put('/:id', authMiddleware.withRole(['adm']), validarAtualizacaoTecnico, atualizarTecnico);
router.patch('/:id/desativar', authMiddleware.withRole(['adm']), desativarTecnico);
router.patch('/:id/ativar', authMiddleware.withRole(['adm']), ativarTecnico);

export default router;