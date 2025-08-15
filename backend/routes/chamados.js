import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import {
  listarChamados,
  criarChamado,
  atualizarChamado,
  fecharChamado
} from '../controllers/chamados.js';

const router = express.Router();

router.get('/', authMiddleware(['usuario','tecnico','adm']), listarChamados);
router.post('/', authMiddleware(['usuario']), criarChamado);
router.put('/:id', authMiddleware(['tecnico','adm']), atualizarChamado);
router.put('/:id/fechar', authMiddleware(['tecnico','adm']), fecharChamado);

export default router;