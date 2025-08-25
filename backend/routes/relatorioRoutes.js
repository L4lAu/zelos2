import express from 'express';
import authMiddleware from '../middleware/authmiddleware.js';
import { 
  relatorioChamados, 
  relatorioEstatisticas,
  relatorioTecnicoDetalhado  // ← NOVA IMPORTação
} from '../controllers/relatorioController.js';

const router = express.Router();

// Apenas administradores podem acessar relatórios
router.get('/chamados', authMiddleware.withRole(['adm']), relatorioChamados);
router.get('/estatisticas', authMiddleware.withRole(['adm']), relatorioEstatisticas);
router.get('/tecnico', authMiddleware.withRole(['adm']), relatorioTecnicoDetalhado);

export default router;