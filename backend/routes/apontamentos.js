import express from 'express';
import { authMiddleware } from '../middleware/auth.js';
import { listarApontamentos, criarApontamento } from '../controllers/apontamentos.js';

const router = express.Router();

router.get('/:chamadoId', authMiddleware(['tecnico','adm']), listarApontamentos);
router.post('/:chamadoId', authMiddleware(['tecnico']), criarApontamento);

export default router;