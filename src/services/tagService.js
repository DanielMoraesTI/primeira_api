import { db } from '../db.js';

// Função para obter uma TAG por ID com suas tarefas associadas.
export const getTagById = async (id) => {
  try {
    const [tags] = await db.query(`
      SELECT 
        tg.*,
        COALESCE(
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'id', t.id,
              'title', t.title,
              'categoria', t.categoria,
              'concluida', t.concluida
            )
          ),
          JSON_ARRAY()
        ) as tarefas
      FROM tags tg
      LEFT JOIN task_tags tt ON tg.id = tt.tag_id
      LEFT JOIN tasks t ON tt.task_id = t.id
      WHERE tg.id = ?
      GROUP BY tg.id
    `, [id]);
    
    if (tags.length === 0) {
      return null;
    }
    
    const tag = tags[0];
    // Processar tarefas se for string
    if (typeof tag.tarefas === 'string') {
      tag.tarefas = JSON.parse(tag.tarefas);
    }
    return tag;
  } catch (error) {
    console.error('Erro ao obter TAG por ID:', error);
    throw error;
  }
};

// Função para obter todas as TAGS com suas tarefas associadas. Retorna a lista completa de tags.
export const getAllTags = async () => {
  try {
    const [tags] = await db.query(`
      SELECT 
        tg.*,
        COALESCE(
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'id', t.id,
              'title', t.title,
              'categoria', t.categoria,
              'concluida', t.concluida
            )
          ),
          JSON_ARRAY()
        ) as tarefas
      FROM tags tg
      LEFT JOIN task_tags tt ON tg.id = tt.tag_id
      LEFT JOIN tasks t ON tt.task_id = t.id
      GROUP BY tg.id
    `);
    
    // Processar cada tag para garantir que tarefas é sempre um array
    const processedTags = tags.map(tag => {
      if (typeof tag.tarefas === 'string') {
        tag.tarefas = JSON.parse(tag.tarefas);
      }
      return tag;
    });
    
    return processedTags;
  } catch (error) {
    console.error('Erro ao obter TAGs:', error);
    throw error;
  }
};

// Função para criar uma TAG. Verifica se o nome da TAG é fornecido e se já existe antes de criar a nova TAG ou retorna um erro se não for válido.
export const createTag = async (data) => {
  try {
    if (!data.name) {
      return { error: "O Nome da TAG deve ser informado" };
    }
    // Verifica se já existe uma TAG com o mesmo nome (LOWER para ignorar maiúsculas/minúsculas) evitando duplicidade de nomes de TAGs somente pela diferença entre letras minúsculas e maiúsculas, e retorna um erro se já existir.
    const [existingTags] = await db.query(
      'SELECT * FROM tags WHERE LOWER(name) = LOWER(?)',
      [data.name]
    );
    if (existingTags.length > 0) {
      return { error: "O Nome da TAG já existe" };
    }
    const [result] = await db.query(
      'INSERT INTO tags (name) VALUES (?)',
      [data.name]
    );
    // Retorna a nova TAG criada, incluindo o ID gerado pelo banco de dados.
    const newTag = {
      id: result.insertId,
      name: data.name
    };
    return newTag;
  } catch (error) {
    console.error('Erro ao criar TAG:', error);
    throw error;
  }
};

// Função para atualizar uma TAG. Verifica se a TAG existe e se o novo nome é válido e não existe para outra TAG antes de atualizar ou retorna um erro se não for válido ou não encontrado.
export const updateTag = async (id, data) => {
  try {
    const [existingTags] = await db.query(
      'SELECT * FROM tags WHERE id = ?',
      [id]
    );
    if (existingTags.length === 0) {
      return { error: "A Tag não foi encontrada" };
    }
    if (!data.name) {
      return { error: "O Nome da TAG deve ser informado" };
    }
    // Verifica se já existe outra TAG com o mesmo nome (LOWER para ignorar maiúsculas/minúsculas) evitando duplicidade de nomes de TAGs somente pela diferença entre letras minúsculas e maiúsculas, e retorna um erro se já existir.
    const [tagsWithName] = await db.query(
      'SELECT * FROM tags WHERE LOWER(name) = LOWER(?) AND id != ?',
      [data.name, id]
    );
    if (tagsWithName.length > 0) {
      return { error: "O Nome da TAG já existe para outra TAG" };
    }
    // Retorna a TAG atualizada com suas tarefas
    return await getTagById(id);
    
  } catch (error) {
    console.error('Erro ao atualizar TAG:', error);
    throw error;
  }
};
// Função para obter todas as tarefas associadas a uma tag específica.
export const getTasksByTag = async (tagId) => {
  try {
    // Verificar se a tag existe antes de buscar tarefas
    const [tag] = await db.query(
      'SELECT * FROM tags WHERE id = ?',
      [tagId]
    );
    if (tag.length === 0) {
      return { error: "Tag não encontrada" };
    }
    // Buscar todas as tarefas associadas à tag via tabela de junção task_tags
    const [tasks] = await db.query(
      'SELECT t.* FROM tasks t JOIN task_tags tt ON t.id = tt.task_id WHERE tt.tag_id = ?',
      [tagId]
    );
    return tasks;
  } catch (error) {
    console.error('Erro ao buscar tarefas da tag:', error);
    throw error;
  }
};

// Função para obter todas as tags associadas a uma tarefa específica usando INNER JOIN.
export const getTagsByTask = async (taskId) => {
  try {
    // Verificar se a tarefa existe antes de buscar tags
    const [task] = await db.query(
      'SELECT * FROM tasks WHERE id = ?',
      [taskId]
    );
    if (task.length === 0) {
      return { error: "Tarefa não encontrada" };
    }
    // Buscar todas as tags associadas à tarefa via tabela de junção task_tags usando INNER JOIN
    const [tags] = await db.query(
      `SELECT tg.* FROM tags tg
       INNER JOIN task_tags tt ON tg.id = tt.tag_id
       WHERE tt.task_id = ?`,
      [taskId]
    );
    return tags;
  } catch (error) {
    console.error('Erro ao buscar tags da tarefa:', error);
    throw error;
  }
};

// Função para deletar uma TAG. Verifica se a TAG existe antes de deletar ou retorna um erro se não encontrada.
export const deleteTag = async (id) => {
  try {
    // Buscar tag antes de deletar para retornar a tag deletada ou um erro se não encontrada
    const [existingTags] = await db.query(
      'SELECT * FROM tags WHERE id = ?',
      [id]
    );
    if (existingTags.length === 0) {
      return { error: "A Tag não foi encontrada" };
    }
    // DELETE tag (cascata remove de tarefa_tags também)
    //  O banco de dados deve estar configurado com ON DELETE CASCADE para remover automaticamente as associações em tarefa_tags quando uma tag for deletada, garantindo integridade referencial.
    const [result] = await db.query(
      'DELETE FROM tags WHERE id = ?',
      [id]
    );
    if (result.affectedRows === 0) {
      return { error: "Erro ao deletar a Tag" };
    }
    return existingTags[0]; // Retorna a tag deletada
  } catch (error) {
    console.error('Erro ao deletar TAG:', error);
    throw error;
  }
};