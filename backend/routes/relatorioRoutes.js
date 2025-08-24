import express from 'express';
import authMiddleware from '../middleware/authmiddleware.js';
import { relatorioChamados, relatorioEstatisticas } from '../controllers/relatorioController.js';

const router = express.Router();

// Apenas administradores podem acessar relatórios
router.get('/chamados', authMiddleware(['adm']), relatorioChamados);
router.get('/estatisticas', authMiddleware(['adm']), relatorioEstatisticas);

export default router;