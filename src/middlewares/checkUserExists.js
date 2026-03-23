import * as userService from '../services/userService.js'
// Middleware para verificar se um usuário existe antes de realizar operações de atualização, exclusão ou alteração de status.
export const checkUserExists = async (req, res, next) => {
  const userId = parseInt(req.params.id)
  try {
  const user = await userService.getUserById(userId)
  
  if (user.length === 0) {
    return res.status(404).json({ error: "Utilizador não encontrado" })
    }  
  req.user = user
  next() // Continua para o próximo middleware ou controlador
  }
  catch (error) {
    console.error('Erro ao verificar usuário:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
}
};
