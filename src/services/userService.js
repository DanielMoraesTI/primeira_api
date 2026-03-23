import { db } from '../db.js';

// Função para obter todos os usuários.
export const getAllUsers = async (search = '', sort = '') => {
  try {
    let query = 'SELECT * FROM users';
    const params = [];

    // Se houver busca, adicionar cláusula WHERE para filtrar por nome usando LIKE.
    if (search) {
      query += ' WHERE name LIKE ?';
      params.push(`%${search}%`);
    }
    // Se houver ordenação, adicionar cláusula ORDER BY para ordenar por nome em ordem ascendente ou descendente.
    if (sort === 'asc') {
      query += ' ORDER BY name ASC';
    } else if (sort === 'desc') {
      query += ' ORDER BY name DESC';
    }
    // Executar query no banco de dados usando db.query e retornar os usuários encontrados.
    const [users] = await db.query(query, params);
    return users;
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    throw error;
  }
};

export const getUserById = async (id) => {
    const [users] = await db.query(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );
    return users;
};

// Função para criar um novo usuário.
export const createUser = async (data) => {
  try {
    // Validar campos obrigatórios e formato do e-mail
    if (!data.email || !data.email.includes("@")) {
      return { error: "E-mail inválido, o e-mail deve seguir este modelo: nome@dominio.com" }
    }
    // Verificar se email já existe no banco
    const [existingUsers] = await db.query(
      'SELECT * FROM users WHERE email = ?',
      [data.email]
    );
    // Se já existir um usuário com o mesmo email, retornar um erro
    if (existingUsers.length > 0) {
      return { error: "E-mail já cadastrado em outro usuário" }
    }
    // Inserir (INSERT) novo usuário no Banco de Dados. O ? para parametrização e evitar SQL Injection.
    const [result] = await db.query(
      'INSERT INTO users (name, email, ativo, created_at) VALUES (?, ?, ?)',
      [
        data.name,
        data.email,
        true,
        data.created_at
      ]
    );
    // BUSCAR DO BANCO E RETORNAR (não montar manualmente) o usuário criado, incluindo o ID gerado pelo banco de dados.
    const [newUser] = await db.query(
      'SELECT * FROM users WHERE id = ?',
      [result.insertId]
    );
    return newUser[0]; // Retorna o usuário criado

  } catch (error) {
    console.error('Erro ao criar usuário:', error);
    throw error;
  }
};

// Função para atualizar usuário existente.
export const updateUser = async (id, data) => {
  try {
    // Verificar se usuário existe antes de atualizar
    const [existingUsers] = await db.query(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );
    if (existingUsers.length === 0) {
      return { error: "Usuário não encontrado" };
    }
    // Validar e-mail se for fornecido no update
    if (data.email && !data.email.includes("@")) {
      return { error: "E-mail inválido, o e-mail deve seguir este modelo: nome@dominio.com" };
    }
    // Verificar se email já existe para outro usuário no banco de dados
    if (data.email) {
      const [usersWithEmail] = await db.query(
        'SELECT * FROM users WHERE email = ? AND id != ?',
        [data.email, id]
      );
      if (usersWithEmail.length > 0) {
        return { error: "E-mail já cadastrado para outro usuário" };
      }
    }
    // Só atualiza os campos que foram fornecidos (name, email).
    const updates = [];
    const params = [];

    if (data.name) {
      updates.push('name = ?');
      params.push(data.name);
    }
    if (data.email) {
      updates.push('email = ?');
      params.push(data.email);
    }
    // Se nenhum campo for atualizado, retorna dados atuais do usuário sem fazer update
    if (updates.length === 0) {
      return { error: "Nenhum campo para atualizar" };
    }
    // Adicionar ID ao final dos parâmetros para a cláusula WHERE
    params.push(id);
    // Construir query de UPDATE dinamicamente com os campos a serem atualizados. O ? para parametrização e evitar SQL Injection.
    const query = `UPDATE users SET ${updates.join(', ')} WHERE id = ?`;
    await db.query(query, params);
    // Retornar o usuário atualizado, buscando os dados atuais do banco de dados.
    return { id, ...data };
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    throw error;
  }
};

// Função para deletar um usuário
export const deleteUser = async (id) => {
  try {
    // Verificar se usuário existe antes de deletar
    const [userToDelete] = await db.query(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );
    // Se não existir, retornar erro
    if (userToDelete.length === 0) {
      return { error: "Usuário não encontrado" };
    }
    // Deletar usuário do banco de dados usando query DELETE. O ? para parametrização e evitar SQL Injection.
    const [result] = await db.query(
      'DELETE FROM users WHERE id = ?',
      [id]
    );
    // Verificar se linha foi deletada (affectedRows > 0). Se não, retornar erro.
    if (result.affectedRows === 0) {
      return { error: "Erro ao deletar usuário" };
    }
    return userToDelete[0]; // Retorna o usuário deletado
  } catch (error) {
    console.error('Erro ao deletar usuário:', error);
    throw error;
  }
};

// Função para obter todas as tarefas de um usuário específico.
export const getUserTasks = async (userId) => {
  try {
    // Verificar se usuário existe antes de buscar suas tarefas
    const [user] = await db.query(
      'SELECT * FROM users WHERE id = ?',
      [userId]
    );
    if (user.length === 0) {
      return { error: "Usuário não encontrado" };
    }
    // Buscar todas as tarefas do usuário
    const [tasks] = await db.query(
      'SELECT * FROM tasks WHERE user_id = ?',
      [userId]
    );
    return tasks;
  } catch (error) {
    console.error('Erro ao buscar tarefas do usuário:', error);
    throw error;
  }
};

// Função que alterara o status do usuário entre ativo e inativo.
export const toggleUserStatus = async (id) => {
  try {
    const [users] = await db.query(
      'SELECT * FROM users WHERE id = ?',
      [id]
    );
    if (users.length === 0) {
      return { error: "Usuário não encontrado" };
    }
    
    const user = users[0];
    const newStatus = !user.ativo;
    await db.query(
      'UPDATE users SET ativo = ? WHERE id = ?',
      [newStatus, id]
    );
    // Retorna o usuário com o status atualizado
    return { ...user, ativo: newStatus };
  } catch (error) {
    console.error('Erro ao alternar status do usuário:', error);
    throw error;
  }
};

// Função para obter estatísticas dos usuários, incluindo total, ativos, inativos e percentagem de ativos.
export const getUserStats = async () => {
  try {
    const [users] = await db.query('SELECT * FROM users');
    const total = users.length;
    const ativos = users.filter(u => u.ativo).length;
    const inativos = total - ativos;
    const percentagemAtivos = total > 0 ? ((ativos / total) * 100).toFixed(2) : 0;
    return {
      total,
      ativos,
      inativos,
      percentagemAtivos: parseFloat(percentagemAtivos) // Convertendo para número para evitar string com 2 casas decimais
    };
  } catch (error) {
    console.error('Erro ao obter estatísticas de usuários:', error);
    throw error;
  }
};
