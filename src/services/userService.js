let users = [
  { id: 1, name: "Daniel Moraes", email: "daniel@gmail.com", ativo: true },
  { id: 2, name: "Tais Dias", email: "tais@gmail.com", ativo: true },
  { id: 3, name: "Natalia", email: "natalia@gmail.com", ativo: true },
  { id: 4, name: "Leonor", email: "leonor@gmail.com", ativo: false },
  { id: 5, name: "Tiago", email: "tiago@gmail.com", ativo: true },
  { id: 6, name: "Danilo", email: "danilo@gmail.com", ativo: true },
  { id: 7, name: "Sarah", email: "sarah@gmail.com", ativo: false }
]

// Função para obter todos os usuários ou, se for fornecido o search, filtrar por nome. Se for fornecido o sort, ordenar por nome.
export const getAllUsers = (search = '', sort = '') => {
  let filtered = users
  
  // Filtrar por search se fornecido
  if (search) {
    filtered = filtered.filter(u => 
      u.name.toLowerCase().includes(search.toLowerCase())
    )
  }
  
  // Ordenar por nome se sort for fornecido
  if (sort === 'asc') {
    filtered.sort((a, b) => a.name.localeCompare(b.name))
  } else if (sort === 'desc') {
    filtered.sort((a, b) => b.name.localeCompare(a.name))
  }
  
  return filtered
}

// Função para criar um novo usuário. Nesta função verifica se o e-mail é válido ou se já existe antes de criar o usuário.
export const createUser = (data) => {
  if (!data.email || !data.email.includes("@")) {
    return { error: "E-mail inválido, o e-mail deve seguir este modelo: nome@dominio.com" }
  }

  const emailExiste = users.some(u => u.email === data.email)
  if (emailExiste) {
    return { error: "E-mail já cadastrado" }
  }
  
  // Gera novo ID automaticamente, para novo usuário, com base no maior ID existente (Math.max) ou 1 se a lista estiver vazia.
  const newId = users.length > 0 ? Math.max(...users.map(u => u.id)) + 1 : 1
  
  const newUser = {
    id: newId,
    ...data,
    ativo: true
  }
  
  users.push(newUser)
  return newUser
}

// Função para atualizar usuário existente. Verifica se o usuário existe, se o e-mail é válido e se o e-mail já existe para outro usuário antes de atualizar.
export const updateUser = (id, data) => {
  const index = users.findIndex(u => u.id === id)
  
  if (index === -1) {
    return { error: "O Utilizador não  foi encontrado" }
  }

  if (data.email) {
    if (!data.email.includes("@")) {
      return { error: "E-mail inválido" }
    }
    
    const emailExiste = users.some(u => u.id !== id && u.email === data.email)
    if (emailExiste) {
      return { error: "E-mail já cadastrado" }
    }
  }

  users[index] = { ...users[index], ...data } // Atualiza os dados do usuário existente com os novos dados fornecidos, mantendo o ID e o status ativo/inativo.
  return users[index]
}

// Função para deletar um usuário. Verifica se o usuário existe antes de deletar e retorna o usuário deletado ou null se não encontrado.
export const deleteUser = (id) => {
  const index = users.findIndex(u => u.id === id)
  
  if (index !== -1) {
    const deletedUser = users.splice(index, 1)
    return deletedUser[0]
  }
  return null
}

// Função que alterara o status do usuário entre ativo e inativo.
export const toggleUserStatus = (id) => {
  const index = users.findIndex(u => u.id === id)
  
  if (index === -1) {
    return { error: "Utilizador não encontrado" }
  }
 
  // Alternar o status entre ativo e inativo
  users[index].ativo = !users[index].ativo
  return users[index]
}

// Função para obter estatísticas dos usuários, incluindo total, ativos, inativos e percentagem de ativos.
export const getUserStats = () => {
  const total = users.length
  const ativos = users.filter(u => u.ativo).length
  const inativos = total - ativos
  const percentagemAtivos = total > 0 ? ((ativos / total) * 100).toFixed(2) : 0
  
  return {
    total,
    ativos,
    inativos,
    percentagemAtivos: parseFloat(percentagemAtivos)// Convertendo para número para evitar string com 2 casas decimais
  }
}