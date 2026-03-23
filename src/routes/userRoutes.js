import express from 'express';
import * as userController from '../controllers/userController.js';
import { checkUserExists } from '../middlewares/checkUserExists.js';

const router = express.Router();
// Caminho utilizado para obter acesso e utilizar as funcionalidades atribuídas pelas funções, respostas pelo controller que por sua vez busca as funções no service sobre usuários. E busca antes pelo middleware para verificar se o usuário existe antes de realizar operações de atualização, exclusão ou alteração de status.
router.get('/stats', userController.getUserStats);
router.get('/:id/tasks', userController.getUserTasks);
router.get('/', userController.getAllUsers);
router.post('/', userController.createUser);
router.put('/:id', checkUserExists, userController.updateUser);
router.patch('/:id/toggle', checkUserExists, userController.toggleUserStatus);
router.delete('/:id', checkUserExists, userController.deleteUser);

export default router;