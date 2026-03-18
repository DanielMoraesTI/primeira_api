import * as taskService from '../services/taskService.js';
import * as commentService from '../services/commentService.js';
// Controlador responsável apenas por lidar com as requisições e respostas sobre tarefas e, comentários e TAGS vinculadas a alguma tarefa, delegando a lógica de negócios para o service.

export const getAllTasks = (req, res) => {
  const { search = '', sort = '' } = req.query
  const tasks = taskService.getAllTasks(search, sort);
  res.json(tasks);
}

export const createTask = (req, res) => {
  const { title } = req.body;
  if (!title) {
    return res.status(400).json({ error: 'Título da tarefa é obrigatório' });
  }
  const newTask = taskService.createTask(req.body);
  res.status(201).json(newTask);
}

export const updateTask = (req, res) => {
  const id = parseInt(req.params.id);
  const updatedTask = taskService.updateTask(id, req.body);
  if (updatedTask.error) {
    return res.status(404).json(updatedTask);
  }
  res.json(updatedTask);
}

export const deleteTask = (req, res) => {
  const id = parseInt(req.params.id);
  const deletedTask = taskService.deleteTask(id);
  if (deletedTask.error) {
    return res.status(404).json(deletedTask);
  }
  res.json(deletedTask);
}

export const getTaskStats = (req, res) => {
  const stats = taskService.getTaskStats();
  res.json(stats);
}

// COMENTÁRIOS

export const getTaskComments = (req, res) => {
  const taskId = parseInt(req.params.id);
  const comments = commentService.getCommentsByTask(taskId);
  
  if (comments.error) {
    return res.status(404).json(comments);
  }
  res.json(comments);
}

export const createTaskComment = (req, res) => {
  const taskId = parseInt(req.params.id);
  const { userId, conteudo } = req.body;
  
  if (!userId || !conteudo) {
    return res.status(400).json({ error: 'ID do Usuário e conteúdo são obrigatórios' });
  }
  
  const comment = commentService.createComment(taskId, userId, { conteudo });
  
  if (comment.error) {
    return res.status(404).json(comment);
  }
  
  res.status(201).json(comment);
}

export const deleteTaskComment = (req, res) => {
  const commentId = parseInt(req.params.commentId);
  
  const result = commentService.deleteComment(commentId);
  
  if (result.error) {
    return res.status(404).json(result);
  }
  
  res.json(result);
}

// TAGS

export const getTaskTags = (req, res) => {
  const taskId = parseInt(req.params.id);
  const tags = taskService.getTaskTags(taskId);
  
  if (tags.error) {
    return res.status(404).json(tags);
  }
  res.json(tags);
}

export const addTagToTask = (req, res) => {
  const taskId = parseInt(req.params.id);
  const { tagId } = req.body;
  
  if (!tagId) {
    return res.status(400).json({ error: 'O ID da TAG deve ser informado' });
  }
  
  const result = taskService.addTagToTask(taskId, tagId);
  
  if (result.error) {
    return res.status(404).json(result);
  }
  res.status(201).json(result);
}

export const removeTagFromTask = (req, res) => {
  const taskId = parseInt(req.params.id);
  const tagId = parseInt(req.params.tagId);
  
  const result = taskService.removeTagFromTask(taskId, tagId);
  
  if (result.error) {
    return res.status(404).json(result);
  }
  res.json(result);
}