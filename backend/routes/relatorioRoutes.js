import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { 
  relatorioChamados, 
  relatorioEstatisticas,
  relatorioTecnicoDetalhado  // ← NOVA IMPORTação
} from '../controllers/relatorioController.js';

const router = express.Router();

// Apenas administradores podem acessar relatórios
router.get('/chamados', authMiddleware(['adm']), relatorioChamados);
router.get('/estatisticas', authMiddleware(['adm']), relatorioEstatisticas);
router.get('/tecnico', authMiddleware(['adm']), relatorioTecnicoDetalhado);

export default router;