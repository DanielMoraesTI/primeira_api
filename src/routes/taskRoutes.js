import express from 'express';
import * as taskController from '../controllers/taskController.js';

const router = express.Router();
// Caminho utilizado para obter acesso e utilizar as funcionalidades atribuídas pelas funções, respostas pelo controller que por sua vez busca as funções no service sobre tarefas, comentários e tags.
router.get('/stats', taskController.getTaskStats);
router.get('/:id/comments', taskController.getTaskComments);
router.get('/:id', taskController.getTaskById);  // Deve vir DEPOIS de /stats e /:id/comments
router.get('/', taskController.getAllTasks);
router.post('/', taskController.createTask);
router.post('/:id/comments', taskController.createTaskComment);
router.put('/:id/comments/:commentId', taskController.updateTaskComment);
router.delete('/:id/comments/:commentId', taskController.deleteTaskComment);

// TAGS
router.post('/:id/tags', taskController.addTagToTask);

// TAREFAS
router.put('/:id', taskController.updateTask);
router.delete('/:id', taskController.deleteTask);

export default router;