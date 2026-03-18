import * as userService from "../services/userService.js"
// Controlador responsável apenas por lidar com as requisições e respostas sobre usuários, delegando a lógica de negócios para o service.

export const getUsers = (req, res) => {
  const { search = '', sort = '' } = req.query
  const users = userService.getAllUsers(search, sort)
  res.json(users)
}

export const createUser = (req, res) => {
  const user = userService.createUser(req.body)
  
  if (user.error) {
    res.status(400).json(user)
  } else {
    res.status(201).json(user)
  }
}

export const updateUser = (req, res) => {
  const id = parseInt(req.params.id)
  const user = userService.updateUser(id, req.body)
  
  if (user) {
    res.json(user)
  } else {
    res.status(404).json({ error: "Usuário não encontrado" })
  }
}

export const deleteUser = (req, res) => {
  const id = parseInt(req.params.id)
  const user = userService.deleteUser(id)
  
  if (user) {
    res.json({ message: "Usuário deletado com sucesso", user })
  } else {
    res.status(404).json({ error: "Usuário não encontrado" })
  }
}

export const getUserStats = (req, res) => {
  const stats = userService.getUserStats()
  res.json(stats)
}

export const toggleUserStatus = (req, res) => {
  const id = parseInt(req.params.id)
  const user = userService.toggleUserStatus(id)
  
  if (user.error) {
    res.status(404).json(user)
  } else {
    res.json(user)
  }
}
