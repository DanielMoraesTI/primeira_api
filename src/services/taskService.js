let tasks = [
  { id: 1, title: "Insanidade", categoria: "Pessoal", concluida: false, responsavelNome: "Daniel Moraes", dataConclusao: null, comments: [], tags: [] },
  { id: 2, title: "Beira da Loucura", categoria: "Trabalho", concluida: true, responsavelNome: "Tais Dias", dataConclusao: "2024-03-10", comments: [], tags: [] },
  { id: 3, title: "Coringar kkkkkkkk", categoria: "Pessoal", concluida: false, responsavelNome: "Natalia", dataConclusao: null, comments: [], tags: [] },
  { id: 4, title: "Visualiza o plano", categoria: "Trabalho", concluida: false, responsavelNome: "Leonor", dataConclusao: null, comments: [], tags: [] },
  { id: 5, title: "Se não der certo não é determinante", categoria: "Pessoal", concluida: true, responsavelNome: "Tiago", dataConclusao: "2024-03-05", comments: [], tags: [] },
  { id: 6, title: "O que é o ClickUp?", categoria: "Aprendizado", concluida: false, responsavelNome: "Danilo", dataConclusao: null, comments: [], tags: [] },
  { id: 7, title: "Dama de Vermelho kkkkkkkkkk", categoria: "Pessoal", concluida: false, responsavelNome: "Sarah", dataConclusao: null, comments: [], tags: [] },
]

// Função para obter todos a tarefas ou, se for fornecido o search, filtrar por nome. Se for fornecido o sort, ordenar por nome.
export const getAllTasks = (search = '', sort = '') => {
  let filtered = tasks
  
  // Filtrar por search se fornecido
  if (search) {
    filtered = filtered.filter(t => 
      t.title.toLowerCase().includes(search.toLowerCase())
    )
  }
  
  // Ordenar por título se sort for fornecido
  if (sort === 'asc') {
    filtered.sort((a, b) => a.title.localeCompare(b.title))
  } else if (sort === 'desc') {
    filtered.sort((a, b) => b.title.localeCompare(a.title))
  }
  
  return filtered
}

// Função para criar uma nova tarefa. A tarefa é criada com os dados fornecidos e valores padrão para campos opcionais (categoria e responsavelNome).
export const createTask = (data) => {
  //Gera um novo ID automaticamente, para nova tarefa, com base no maior ID existente (Math.max) ou 1 se a lista estiver vazia.
  const newId = tasks.length > 0 ? Math.max(...tasks.map(t => t.id)) + 1 : 1
  
  const newTask = {
    id: newId,
    title: data.title,
    categoria: data.categoria || "Geral",
    concluida: false,
    responsavelNome: data.responsavelNome || "Responsável não atribuído",
    dataConclusao: null,
    ...data
  }
  
  tasks.push(newTask)
  return newTask
}

// Função para atualizar tarefa existente. Verifica se a tarefa existe antes de atualizar e retorna a tarefa atualizada ou um erro se não encontrada.
export const updateTask = (id, data) => {
  const index = tasks.findIndex(t => t.id === id)
  
  if (index !== -1) {
    tasks[index] = { ...tasks[index], ...data }
    return tasks[index]
  }
  return { error: "A Tarefa não foi encontrada" }
}

// Função para deletar uma tarefa. Verifica se a tarefa existe antes de deletar e retorna o tarefa deletada ou null se não encontrada.
export const deleteTask = (id) => {
  const index = tasks.findIndex(t => t.id === id)
  
  if (index !== -1) {
    const deletedTask = tasks.splice(index, 1)
    return deletedTask[0]
  }
  return { error: "A Tarefa não foi encontrada" }
}

// Função para obter estatísticas das tarefas, incluindo total, concluódas, pendentes e percentagem de concluídas.
export const getTaskStats = () => {
  const total = tasks.length
  const concluidas = tasks.filter(t => t.concluida).length
  const pendentes = total - concluidas
  const percentagemConcluidas = total > 0 ? ((concluidas / total) * 100).toFixed(2) : 0
  
  return {
    total,
    concluidas,
    pendentes,
    percentagemConcluidas: parseFloat(percentagemConcluidas) // Convertendo para número para evitar string com 2 casas decimais
  }
}

// Comentários são gerenciados por commentService.js
// Este arquivo se concentra exclusivamente em tarefas e suas tags associadas

// TAGS
// Função para obter as tags associadas a uma tarefa específica. Verifica se a tarefa existe antes de retornar as tags ou um erro se não encontrada.
export const getTaskTags = (taskId) => {
  const task = tasks.find(t => t.id === taskId)
  
  if (!task) {
    return { error: "A Tarefa não foi encontrada" }
  }
  
  return task.tags || []
}
// Função para adicionar uma tag a uma tarefa específica. Verifica se a tarefa existe e se a tag já está associada antes de adicionar ou retorna um erro se não encontrados ou já associados.
export const addTagToTask = (taskId, tagId) => {
  const task = tasks.find(t => t.id === taskId)
  
  if (!task) {
    return { error: "A Tarefa não foi encontrada" }
  }
  
  // Verificar existência na tarefa
  if (task.tags.includes(tagId)) {
    return { error: "Esta TAG já está associada à tarefa" }
  }
  
  task.tags.push(tagId)
  
  return {
    taskId: taskId,
    tagId: tagId,
    message: "A TAG foi adicionada com sucesso",
    tags: task.tags
  }
}
// Função para remover uma tag de uma tarefa específica. Verifica se a tarefa existe e se a tag está associada antes de remover ou retorna um erro se não encontrados ou não associados.
export const removeTagFromTask = (taskId, tagId) => {
  const task = tasks.find(t => t.id === taskId)
  
  if (!task) {
    return { error: "A Tarefa não foi encontrada" }
  }
  
  const tagIndex = task.tags.indexOf(tagId)
  
  if (tagIndex === -1) {
    return { error: "A TAG não está associada a esta tarefa" }
  }
  
  task.tags.splice(tagIndex, 1)
  
  return {
    taskId: taskId,
    tagId: tagId,
    message: "A TAG foi removida com sucesso",
    tags: task.tags
  }
}
