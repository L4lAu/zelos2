import express from 'express';
import authMiddleware from '../middleware/authmiddleware.js';

import {
  listarChamados,
  criarChamado,
  atualizarChamado,
  fecharChamado
} from '../controllers/chamadosCrontroller.js';

const router = express.Router();

router.get('/listar', authMiddleware(['usuario','tecnico','adm']), listarChamados);
router.post('/doChamado', authMiddleware(['usuario']), criarChamado);
router.put('/:id', authMiddleware(['tecnico','adm']), atualizarChamado);
router.put('/:id/fechar', authMiddleware(['tecnico','adm']), fecharChamado);

export default router;