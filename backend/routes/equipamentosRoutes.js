import express from 'express';
import authMiddleware from '../middleware/authmiddleware.js';
import {
  listarEquipamentos,
  buscarEquipamento,
  criarEquipamento,
  atualizarEquipamento,
  deletarEquipamento
} from '../controllers/equipamentosController.js';

const router = express.Router();

// Apenas administradores podem gerenciar equipamentos
router.get('/', authMiddleware.withRole(['adm', 'tecnico']), listarEquipamentos);
router.get('/:patrimonio', authMiddleware.withRole(['adm', 'tecnico', 'usuario']), buscarEquipamento);
router.post('/', authMiddleware.withRole(['adm']), criarEquipamento);
router.put('/:id', authMiddleware.withRole(['adm']), atualizarEquipamento);
router.delete('/:id', authMiddleware.withRole(['adm']), deletarEquipamento);

export default router;