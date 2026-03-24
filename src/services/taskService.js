import { db } from '../db.js';

// Função para obter todos a tarefas.
export const getAllTasks = async (search = '', sort = '') => {
  try {
    let query = 'SELECT * FROM tasks';
    const params = [];
    // Se houver busca pelo título da tarefa, adicionar cláusula WHERE para filtrar usando LIKE.
    if (search) {
      query += ' WHERE title LIKE ?';
      params.push(`%${search}%`);
    }
    // Se houver ordenação, adicionar cláusula ORDER BY para ordenar por título em ordem ascendente ou descendente.
    if (sort === 'asc') {
      query += ' ORDER BY title ASC';
    } else if (sort === 'desc') {
      query += ' ORDER BY title DESC';
    }
    // Executar query no MySQL usando db.query, passando a query e os parâmetros. O resultado é um array onde o primeiro elemento são as tarefas.
    const [tasks] = await db.query(query, params);

    return tasks;
  } catch (error) {
    console.error('Erro ao buscar tarefas:', error);
    throw error;
  }
};

// Função para obter uma tarefa por ID.
export const getTaskById = async (id) => {
  try {
    const [tasks] = await db.query(
      'SELECT * FROM tasks WHERE id = ?',
      [id]
    );
    return tasks[0];
  } catch (error) {
    console.error('Erro ao buscar tarefa:', error);
    throw error;
  }
};

// Função para criar uma nova tarefa. A tarefa é criada com os dados fornecidos e valores padrão para campos opcionais (categoria e responsavelNome).
export const createTask = async (data) => {
  try {
    // Validar título (obrigatório)
    if (!data.title) {
      return { error: "O título da tarefa é obrigatório" };
    }

    // NOVO: Se enviou user_id, buscar o nome do usuário
    let responsavelNome = data.responsavelNome || null;

    if (data.user_id) {
      try {
        // Buscar nome do usuário no banco
        const [user] = await db.query(
          'SELECT name FROM users WHERE id = ?',
          [data.user_id]
        );

        // Se encontrou usuário, usar o nome dele
        if (user.length > 0) {
          responsavelNome = user[0].name;
          console.log('Responsável encontrado:', responsavelNome);
        } else {
          // Se user_id não existe no banco
          return { error: `Usuário com ID ${data.user_id} não encontrado` };
        }
      } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        throw error;
      }
    }

    // Inserir tarefa com responsável preenchido
    const [result] = await db.query(
      'INSERT INTO tasks (title, categoria, concluida, responsavelNome, user_id, created_at) VALUES (?, ?, ?, ?, ?, ?)',
      [
        data.title,
        data.categoria || 'Geral',
        false,
        data.responsavelNome,
        data.user_id,
        data.created_at
      ]
    );

    // Retornar tarefa criada
    const [newTask] = await db.query(
      'SELECT * FROM tasks WHERE id = ?',
      [result.insertId]
    );

    return newTask[0];
  
  } catch (error) {
    console.error('Erro ao criar tarefa:', error);
    throw error;
  }
};

// Função para atualizar tarefa existente.
export const updateTask = async (id, data) => {
  try {
    // Verificar se tarefa existe
    const [existingTask] = await db.query(
      'SELECT * FROM tasks WHERE id = ?',
      [id]
    );

    if (existingTask.length === 0) {
      return { error: "A Tarefa não foi encontrada" };
    }

    // SE enviou user_id, buscar nome do responsável automaticamente
    if (data.user_id) {
      try {
        const [user] = await db.query(
          'SELECT name FROM users WHERE id = ?',
          [data.user_id]
        );

        if (user.length === 0) {
          return { error: `Usuário com ID ${data.user_id} não encontrado` };
        }

        // Usar nome do usuário como responsável
        data.responsavelNome = user[0].name;
        console.log('Responsável atualizado para:', data.responsavelNome);

      } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        throw error;
      }
    }

    // Se marcando como concluída SEM enviar data
    if (data.concluida === true && !data.dataConclusao) {
      data.dataConclusao = new Date().toISOString().split('T')[0];
      console.log('Data de conclusão adicionada automaticamente:', data.dataConclusao);
    }

    // Se desmarcando SEM enviar dataConclusao
    if (data.concluida === false && !data.dataConclusao) {
      data.dataConclusao = null;
      console.log('Data de conclusão limpa automaticamente');
    }

    // Construir UPDATE dinamicamente
    const updates = [];
    const params = [];

    if (data.title) {
      updates.push('title = ?');
      params.push(data.title);
    }

    if (data.categoria) {
      updates.push('categoria = ?');
      params.push(data.categoria);
    }

    if (data.concluida !== undefined) {
      updates.push('concluida = ?');
      params.push(data.concluida);
    }

    // Se concluido definido coo true, atualizar
    if (data.dataConclusao !== undefined) {
      updates.push('dataConclusao = ?');
      params.push(data.dataConclusao);
    }

    if (data.responsavelNome) {
      updates.push('responsavelNome = ?');
      params.push(data.responsavelNome);
    }

    if (data.user_id) {
      updates.push('user_id = ?');
      params.push(data.user_id);
    }

    // Validação: há campos para atualizar?
    if (updates.length === 0) {
      return { error: "Nenhum campo para atualizar" };
    }

    // Executar UPDATE
    params.push(id);
    const query = `UPDATE tasks SET ${updates.join(', ')} WHERE id = ?`;
    await db.query(query, params);

    // BUSCAR DO BANCO E RETORNAR (não montar manualmente)
    const [updatedTask] = await db.query(
      'SELECT * FROM tasks WHERE id = ?',
      [id]
    );

    return updatedTask[0];

  } catch (error) {
    console.error('Erro ao atualizar tarefa:', error);
    throw error;
  }
};
  

// Função para deletar uma tarefa.
export const deleteTask = async (id) => {
  try {
    // Verificar se tarefa existe antes de deletar
    const [taskToDelete] = await db.query(
      'SELECT * FROM tasks WHERE id = ?',
      [id]
    );
    // Se não existir, retornar erro
    if (taskToDelete.length === 0) {
      return { error: "Tarefa não encontrada" };
    }
    // Deletar tarefa do banco de dados usando query DELETE. O ? para parametrização e evitar SQL Injection.
    const [result] = await db.query(
      'DELETE FROM tasks WHERE id = ?',
      [id]
    );
    // Verificar se linha foi deletada (affectedRows > 0). Se não não foi deletada, retornar erro.
    if (result.affectedRows === 0) {
      return { error: "Erro ao deletar tarefa" }
    }
    return taskToDelete[0];
  } catch (error) {
    console.error('Erro ao deletar tarefa:', error);
    throw error;
  }
};

// Função para obter estatísticas das tarefas, incluindo total, concluódas, pendentes e percentagem de concluídas.
export const getTaskStats = async () => {
  try {
    const [tasks] = await db.query('SELECT * FROM tasks');
    const total = tasks.length;
    const concluídas = tasks.filter(t => t.concluida).length;
    const pendentes = total - concluídas;
    const percentagemConcluidas = total > 0 ? ((concluídas / total) * 100).toFixed(2) : 0;
    return {
      total,
      concluídas,
      pendentes,
      percentagemConcluidas: parseFloat(percentagemConcluidas) // Convertendo para número para evitar string com 2 casas decimais
    }
  } catch (error) {
    console.error('Erro ao obter estatísticas de tarefas:', error);
    throw error;
  }
};

// TAGS - Funções para gerenciar associação entre tarefas e tags

// Função para obter todas as tags associadas a uma tarefa específica.
export const getTaskTags = async (taskId) => {
  try {
    // Verificar se a tarefa existe
    const [task] = await db.query(
      'SELECT * FROM tasks WHERE id = ?',
      [taskId]
    );
    if (task.length === 0) {
      return { error: "Tarefa não encontrada" };
    }
    // Buscar todas as tags associadas à tarefa via tabela de junção task_tags
    const [tags] = await db.query(
      'SELECT t.* FROM tags t JOIN task_tags tt ON t.id = tt.tag_id WHERE tt.task_id = ?',
      [taskId]
    );
    return tags;
  } catch (error) {
    console.error('Erro ao buscar tags da tarefa:', error);
    throw error;
  }
};

// Função para adicionar uma tag a uma tarefa.
export const addTagToTask = async (taskId, tagId) => {
  try {
    // Verificar se a tarefa existe
    const [task] = await db.query(
      'SELECT * FROM tasks WHERE id = ?',
      [taskId]
    );
    if (task.length === 0) {
      return { error: "Tarefa não encontrada" };
    }
    
    // Verificar se a tag existe
    const [tag] = await db.query(
      'SELECT * FROM tags WHERE id = ?',
      [tagId]
    );
    if (tag.length === 0) {
      return { error: "Tag não encontrada" };
    }
    
    // Verificar se a tag já está associada à tarefa
    const [existingAssociation] = await db.query(
      'SELECT * FROM task_tags WHERE task_id = ? AND tag_id = ?',
      [taskId, tagId]
    );
    if (existingAssociation.length > 0) {
      return { error: "Esta tag já está associada à tarefa" };
    }
    
    // Inserir associação na tabela task_tags
    const [result] = await db.query(
      'INSERT INTO task_tags (task_id, tag_id) VALUES (?, ?)',
      [taskId, tagId]
    );
    
    return { 
      message: "Tag adicionada à tarefa com sucesso",
      taskId,
      tagId,
      tag: tag[0]
    };
  } catch (error) {
    console.error('Erro ao adicionar tag à tarefa:', error);
    throw error;
  }
};



