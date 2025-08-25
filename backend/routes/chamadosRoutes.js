import express from 'express';
import authMiddleware from '../middleware/authmiddleware.js';

import {
  listarChamados,
  criarChamado,
  atualizarChamado,
  fecharChamado,
  atribuirTecnico
} from '../controllers/chamadosCrontroller.js';

const router = express.Router();

router.get('/listar', authMiddleware.withRole(['usuario','tecnico','adm']), listarChamados);
router.post('/doChamado', authMiddleware.withRole(['usuario']), criarChamado);
router.put('/:id', authMiddleware.withRole(['tecnico','adm']), atualizarChamado);
router.put('/:id/fechar', authMiddleware.withRole(['tecnico','adm']), fecharChamado);
router.put('/:id/atribuir', authMiddleware.withRole(['tecnico', 'adm']), atribuirTecnico);

export default router;