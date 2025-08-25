import express from 'express';
import authMiddleware from '../middleware/authmiddleware.js';
import { validarApontamento } from '../middleware/validacaoApontamentos.js';
import { 
  listarApontamentos, 
  criarApontamento, 
  atualizarApontamento,
  finalizarApontamento,
  obterEstatisticasTempo
} from '../controllers/apontamentosController.js';

const router = express.Router();

router.get('/:chamadoId', authMiddleware.withRole(['tecnico', 'adm', 'usuario']), listarApontamentos);
router.get('/:chamadoId/listar', authMiddleware.withRole(['tecnico', 'adm', 'usuario']), listarApontamentos);
router.put('/:apontamentoId', authMiddleware.withRole(['tecnico']), atualizarApontamento);
router.patch('/:apontamentoId/finalizar', authMiddleware.withRole(['tecnico']), finalizarApontamento);
router.get('/estatisticas/tempo', authMiddleware.withRole(['tecnico', 'adm']), obterEstatisticasTempo);

export default router;