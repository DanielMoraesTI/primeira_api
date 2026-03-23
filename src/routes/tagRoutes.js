import express from 'express';
import * as tagController from '../controllers/tagController.js';

const router = express.Router();
// Caminho utilizado para obter acesso e utilizar as funcionalidades atribuídas pelas funções, respostas pelo controller que por sua vez busca as funções no service sobre TAGS.
router.get('/', tagController.getAllTags);
router.get('/:id/tasks', tagController.getTasksByTag);
router.post('/', tagController.createTag);
router.delete('/:id', tagController.deleteTag);

export default router;
