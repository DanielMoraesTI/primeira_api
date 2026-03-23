import { db } from '../db.js';

// Função para obter todas as TAGS. Retorna a lista completa de tags.
export const getAllTags = async () => {
  try {
    const [tags] = await db.query('SELECT * FROM tags');
    return tags;
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
    await db.query(
      'UPDATE tags SET name = ? WHERE id = ?',
      [data.name, id]
    );
    // Retorna a TAG atualizada
    const [updatedTag] = await db.query(
      'SELECT * FROM tags WHERE id = ?',
      [id]
    );
    return updatedTag[0];
    
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