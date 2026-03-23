import { db } from '../db.js';


// Função para criar um comentário.
export const createComment = async (taskId, userId, commentData) => {
  try {
    // Verificar se a tarefa existe antes de criar o comentário
    const [task] = await db.query(
      'SELECT * FROM tasks WHERE id = ?',
      [taskId]
    );
    if (task.length === 0) {
      return { error: "Tarefa não encontrada" };
    }
    // Verificar se o usuário existe antes de criar o comentário
    const [user] = await db.query(
      'SELECT * FROM users WHERE id = ?',
      [userId]
    );
    if (user.length === 0) {
      return { error: "Usuário não encontrado" };
    }
    // Verificar se o conteúdo do comentário foi fornecido
    if (!commentData.conteudo) {
      return { error: "O conteúdo do comentário deve ser informado" };
    }
    const [result] = await db.query(
      'INSERT INTO comments (task_id, user_id, conteudo) VALUES (?, ?, ?)',
      [taskId, userId, commentData.conteudo,]
    );
    // Retornar o comentário criado
    const [newComment] = await db.query(
      'SELECT * FROM comments WHERE id = ?',
      [result.insertId]
    );
    return newComment[0]; // Retorna o comentário criado

  } catch (error) {
    console.error('Erro ao criar comentário:', error);
    throw error;
  }
};
// Função para obter todos os comentários. Retorna a lista completa de comentários.
export const getAllComments = async () => {
  try {
    const [comments] = await db.query('SELECT * FROM comments');
    return comments;
  } catch (error) {
    console.error('Erro ao obter comentários:', error);
    throw error;
  }
};
// Função para obter os comentários em uma tarefa específica. Verifica se a tarefa existe antes de retornar os comentários ou um erro se não encontrada.
export const getCommentsByTask = async (taskId) => {
  try {
    const [task] = await db.query(
      'SELECT * FROM tasks WHERE id = ?',
      [taskId]
    );
    if (task.length === 0) {
      return { error: "Tarefa não encontrada" };
    }
    const [comments] = await db.query(
      'SELECT * FROM comments WHERE task_id = ?',
      [taskId]
    );
    return comments;
  } catch (error) {
    console.error('Erro ao obter comentários da tarefa:', error);
    throw error;
  }
};

// Função para atualizar um comentário. Verifica se o comentário existe antes de atualizar ou retorna um erro se não encontrado.
export const updateComment = async (commentId, commentData) => {
  try {
    // Verificar se o comentário existe antes de atualizar
    const [comment] = await db.query(
      'SELECT * FROM comments WHERE id = ?',
      [commentId]
    );
    if (comment.length === 0) {
      return { error: "Comentário não encontrado" };
    }
    // Construir query UPDATE dinamicamente
    const updates = [];
    const params = [];

    if (commentData.conteudo) {
      updates.push('conteudo = ?');
      params.push(commentData.conteudo);
    }

    if (updates.length === 0) {
      return { error: "Nenhum campo para atualizar" };
    }

    params.push(commentId);
    const query = `UPDATE comments SET ${updates.join(', ')} WHERE id = ?`;
    await db.query(query, params);
    
    // Retornar o comentário atualizado, buscando os dados atuais do banco de dados.
    const [updatedComment] = await db.query(
      'SELECT * FROM comments WHERE id = ?',
      [commentId]
    );
    return updatedComment[0];

  } catch (error) {
    console.error('Erro ao atualizar comentário:', error);
    throw error;
  }
};

// Função para deletar um comentário. Verifica se o comentário existe antes de deletar ou retorna um erro se não encontrado.
export const deleteComment = async (commentId) => {
  try {
    // Verificar se comentário existe antes de deletar
    const [commentToDelete] = await db.query(
      'SELECT * FROM comments WHERE id = ?',
      [commentId]
    );
    if (commentToDelete.length === 0) {
      return { error: "Comentário não encontrado" };
    }
    // Deletar comentário do banco de dados
    const [result] = await db.query(
      'DELETE FROM comments WHERE id = ?',
      [commentId]
    );
    if (result.affectedRows === 0) {
      return { error: "Erro ao deletar comentário" };
    }
    return commentToDelete[0]; // Retorna o comentário deletado
  } catch (error) {
    console.error('Erro ao deletar comentário:', error);
    throw error;
  }
};