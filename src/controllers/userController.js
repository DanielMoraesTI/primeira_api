import * as userService from "../services/userService.js"
// Controlador responsável apenas por lidar com as requisições e respostas sobre usuários, delegando a lógica de negócios para o service.

export const getAllUsers = async (req, res) => {
  try {
    const { search = '', sort = '' } = req.query;
    // O await é para aguardar resposta do service, que pode ser uma operação assíncrona (ex: consulta a banco de dados)
     const users = await userService.getAllUsers({ search, sort });
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
};

export const createUser = async (req, res) => {
  try {
    // O await é para aguardar resposta do service, que pode ser uma operação assíncrona (ex: consulta a banco de dados)
    const newUser = await userService.createUser(req.body);
    if (newUser.error) {
      return res.status(400).json(newUser);
    }
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar usuário' });
  }
};

export const updateUser = async (req, res) => {
  try {
  const id = parseInt(req.params.id);
  const updatedUser = await userService.updateUser(id, req.body);
  if (updatedUser.error) {
    return res.status(404).json(updatedUser);
  }
  res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
};


export const deleteUser = async (req, res) => {
  try {
    const id = parseInt(req.params.id);

    const deletedUser = await userService.deleteUser(id);

    if (deletedUser.error) {
      return res.status(404).json(deletedUser);
    }
      res.json({ message: "Usuário deletado com sucesso", user: deletedUser });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar usuário' });
  }
};

export const getUserStats = async (req, res) => {
  try {
    const stats = await userService.getUserStats();
    res.json(stats)
} catch (error) {
    res.status(500).json({ error: 'Erro ao obter estatísticas de usuários' });
  }
};

export const toggleUserStatus = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const user = await userService.toggleUserStatus(id);
    if (user.error) {
      return res.status(404).json(user);
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao alternar status do usuário' });
  }
};

export const getUserTasks = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const tasks = await userService.getUserTasks(id);
    if (tasks.error) {
      return res.status(404).json(tasks);
    }
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar tarefas do usuário' });
  }
};
