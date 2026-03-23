import * as taskService from '../services/taskService.js';
import * as commentService from '../services/commentService.js';
// Controlador responsável apenas por lidar com as requisições e respostas sobre tarefas e, comentários e TAGS vinculadas a alguma tarefa, delegando a lógica de negócios para o service.

export const getAllTasks = async (req, res) => {
  try {
    const { search = '', sort = '' } = req.query;
    // O await é para aguardar resposta do service, que pode ser uma operação assíncrona (ex: consulta a banco de dados)
    const tasks = await taskService.getAllTasks({ search, sort });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar tarefas' });
  }
};

export const createTask = async (req, res) => {
  try {
    const { title } = req.body;
    if (!title) {
      return res.status(400).json({ error: 'O título da tarefa é obrigatório' });
    }
    // O await é para aguardar resposta do service, que pode ser uma operação assíncrona (ex: consulta a banco de dados)
    const newTask = await taskService.createTask(req.body);
    if (newTask.error) {
      return res.status(400).json(newTask);
    }
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar tarefa' });
  }
};

export const updateTask = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updatedTask = await taskService.updateTask(id, req.body);
    if (updatedTask.error) {
      return res.status(404).json(updatedTask);
    }
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar tarefa' });
  }
};

export const deleteTask = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const deletedTask = await taskService.deleteTask(id);
    if (deletedTask.error) {
      return res.status(404).json(deletedTask);
    }
    res.json({ message: "Tarefa deletada com sucesso", task: deletedTask });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar tarefa' });
  }
};

export const getTaskStats = async (req, res) => {
  try {
    const stats = await taskService.getTaskStats();
    res.json(stats);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao obter estatísticas de tarefas' });
  }
};

// COMENTÁRIOS

export const getTaskComments = async (req, res) => {
  try {
    const taskId = parseInt(req.params.id);
    const comments = await commentService.getCommentsByTask(taskId);
    if (comments.error) {
      return res.status(404).json(comments);
    }
    res.json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar comentários da tarefa' });
  }
};

export const createTaskComment = async (req, res) => {
  try {
    const taskId = parseInt(req.params.id);
    const { userId, conteudo } = req.body;
    if (!userId || !conteudo) {
      return res.status(400).json({ error: 'O ID de usuário e texto do comentário são obrigatórios' });
    }
    const newComment = await commentService.createComment(taskId, userId, req.body);
    if (newComment.error) {
      return res.status(400).json(newComment);
    }
    // Retorna status 201 (Created) e o comentário criado
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar comentário para a tarefa' });
  }
};

export const deleteTaskComment = async (req, res) => {
  try {
    const commentId = parseInt(req.params.commentId);

    const deletedComment = await commentService.deleteComment(commentId);

    if (deletedComment.error) {
      return res.status(404).json(deletedComment);
    }
    // Retorna mensagem de sucesso e o comentário deletado
    res.json({ message: "Comentário deletado com sucesso", comment: deletedComment });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar comentário da tarefa' });
  }
};

export const updateTaskComment = async (req, res) => {
  try {
    const commentId = parseInt(req.params.commentId);
    const { conteudo } = req.body;
    if (!conteudo) {
      return res.status(400).json({ error: 'O texto do comentário é obrigatório' });
    }
    const updatedComment = await commentService.updateComment(commentId, req.body);
    if (updatedComment.error) {
      return res.status(404).json(updatedComment);
    }
    res.json(updatedComment);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar comentário da tarefa' });
  }
};

// TAGS

export const getTaskTags = async (req, res) => {
  try {
    const taskId = parseInt(req.params.id);
    const tags = await taskService.getTaskTags(taskId);
    if (tags.error) {
      return res.status(404).json(tags);
    }
    res.json(tags);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar tags da tarefa' });
  }
};

export const addTagToTask = async (req, res) => {
  try {
    const taskId = parseInt(req.params.id);
    const tagId = parseInt(req.params.tagId);
    const result = await taskService.addTagToTask(taskId, tagId);
    if (result.error) {
      return res.status(404).json(result);
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao adicionar tag à tarefa' });
  }
};

export const removeTagFromTask = async (req, res) => {
  try {
    const taskId = parseInt(req.params.id);
    const tagId = parseInt(req.params.tagId);

    const result = await taskService.removeTagFromTask(taskId, tagId);

    if (result.error) {
      return res.status(404).json(result);
    }
    res.json(result);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao remover tag da tarefa' });
  }
};