import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { validarApontamento } from '../middleware/validacaoApontamentos.js';
import { 
  listarApontamentos, 
  criarApontamento, 
  atualizarApontamento,
  finalizarApontamento,
  obterEstatisticasTempo
} from '../controllers/apontamentosController.js';

const router = express.Router();

router.get('/:chamadoId', authMiddleware(['tecnico', 'adm', 'usuario']), listarApontamentos);
router.post('/:chamadoId', authMiddleware(['tecnico']), validarApontamento, criarApontamento);
router.put('/:apontamentoId', authMiddleware(['tecnico']), atualizarApontamento);
router.patch('/:apontamentoId/finalizar', authMiddleware(['tecnico']), finalizarApontamento);
router.get('/estatisticas/tempo', authMiddleware(['tecnico', 'adm']), obterEstatisticasTempo);

export default router;