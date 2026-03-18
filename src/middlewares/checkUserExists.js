import * as userService from '../services/userService.js'
// Middleware para verificar se um usuário existe antes de realizar operações de atualização, exclusão ou alteração de status.
export const checkUserExists = (req, res, next) => {
  const userId = parseInt(req.params.id)
  
  const user = userService.getAllUsers().find(u => u.id === userId)
  
  if (!user) {
    return res.status(404).json({ error: "Utilizador não encontrado" })
  }
  
  req.user = user
  next() // Continua para o próximo middleware ou controlador
}
