import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {
  listarEquipamentos,
  buscarEquipamento,
  criarEquipamento,
  atualizarEquipamento,
  deletarEquipamento
} from '../controllers/equipamentosController.js';

const router = express.Router();

// Apenas administradores podem gerenciar equipamentos
router.get('/', authMiddleware(['adm', 'tecnico']), listarEquipamentos);
router.get('/:patrimonio', authMiddleware(['adm', 'tecnico', 'usuario']), buscarEquipamento);
router.post('/', authMiddleware(['adm']), criarEquipamento);
router.put('/:id', authMiddleware(['adm']), atualizarEquipamento);
router.delete('/:id', authMiddleware(['adm']), deletarEquipamento);

export default router;