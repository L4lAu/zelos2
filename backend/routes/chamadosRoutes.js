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

router.get('/listar', authMiddleware(['usuario','tecnico','adm']), listarChamados);
router.post('/doChamado', authMiddleware(['usuario']), criarChamado);
router.put('/:id', authMiddleware(['tecnico','adm']), atualizarChamado);
router.put('/:id/fechar', authMiddleware(['tecnico','adm']), fecharChamado);
router.put('/:id/atribuir', authMiddleware(['tecnico', 'adm']), atribuirTecnico);

export default router;