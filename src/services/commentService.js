import * as taskService from './taskService.js';
import * as userService from './userService.js';

const comments = [];
// Função para criar um comentário. Verifica se a tarefa e o usuário existem antes de criar o comentário, gerando um ID automático e armazenando a data de criação.
export const createComment = (taskId, userId, commentData) => {
  // Verificar se tarefa existe
  const task = taskService.getAllTasks().find(t => t.id === taskId);
  if (!task) {
    return { error: "Tarefa não encontrada" };
  }
  
  // Verificar se usuário existe
  const user = userService.getAllUsers().find(u => u.id === userId);
  if (!user) {
    return { error: "Utilizador não encontrado" };
  }
  
  // Gerar ID automático para o comentário, com base no maior ID existente (Math.max) ou 1 se a lista estiver vazia.
  const id = comments.length > 0 ? Math.max(...comments.map(c => c.id)) + 1 : 1;
  
  // Guardar data atual
  const dataCriacao = new Date().toISOString().split('T')[0]; // new Date() para obter a data e hora atual, toISOString() para formatar como string ISO (YYYY-MM-DDTHH:mm:ss.sssZ) e split('T')[0] para obter apenas a parte da data (YYYY-MM-DD) removendo a parte da hora.
  
  const newComment = {
    id,
    taskId,
    userId,
    conteudo: commentData.conteudo,
    dataCriacao
  };
  
  comments.push(newComment);
  return newComment;
};
// Função para obter todos os comentários. Retorna a lista completa de comentários.
export const getAllComments = () => {
  return comments;
};
// Função para obter os comentários em uma tarefa específica. Verifica se a tarefa existe antes de retornar os comentários ou um erro se não encontrada.
export const getCommentsByTask = (taskId) => {
  const task = taskService.getAllTasks().find(t => t.id === taskId);
  
  if (!task) {
    return { error: "Tarefa não encontrada" };
  }
  
  return comments.filter(c => c.taskId === taskId);
};
// Função para obter os comentários de um usuário específico. Verifica se o usuário existe antes de retornar os comentários ou um erro se não encontrado.
export const getCommentsByUser = (userId) => {
  const user = userService.getAllUsers().find(u => u.id === userId);
  
  if (!user) {
    return { error: "Utilizador não encontrado" };
  }
  
  return comments.filter(c => c.userId === userId);
};
// Função para atualizar um comentário. Verifica se o comentário existe antes de atualizar ou retorna um erro se não encontrado.
export const updateComment = (commentId, commentData) => {
  const index = comments.findIndex(c => c.id === commentId);
  
  if (index === -1) {
    return { error: "Comentário não encontrado" };
  }
  
  comments[index] = { ...comments[index], ...commentData };
  return comments[index];
};
// Função para detetar um comentário. Verifica se o comentário existe antes de deletar ou retorna um erro se não encontrado.
export const deleteComment = (commentId) => {
  const index = comments.findIndex(c => c.id === commentId);
  
  if (index === -1) {
    return { error: "Comentário não encontrado" };
  }
  
  const deletedComment = comments.splice(index, 1);
  return deletedComment[0];
};
