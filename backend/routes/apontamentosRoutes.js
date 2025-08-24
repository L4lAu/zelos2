import express from 'express';
import authMiddleware from '../middleware/authmiddleware.js';
import { validarApontamento } from '../middleware/validacaoApontamentos.js';
import { 
  listarApontamentos, 
  criarApontamento, 
  atualizarApontamento,
  finalizarApontamento
} from '../controllers/apontamentosController.js';

const router = express.Router();

router.get('/:chamadoId', authMiddleware(['tecnico', 'adm', 'usuario']), listarApontamentos);
router.post('/:chamadoId', authMiddleware(['tecnico']), validarApontamento, criarApontamento);
router.put('/:apontamentoId', authMiddleware(['tecnico']), atualizarApontamento);
router.patch('/:apontamentoId/finalizar', authMiddleware(['tecnico']), finalizarApontamento);

export default router;