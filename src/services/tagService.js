let tags = [
  { id: 1, name: "FrontEnd" },
  { id: 2, name: "BackEnd" },
  { id: 3, name: "JavaScript" },
  { id: 4, name: "React" },
  { id: 5, name: "Terapia" },
  { id: 6, name: "Análise" },
  { id: 7, name: "Internação" }
];
// Função para obter todas as TAGS. Retorna a lista completa de tags.
export const getAllTags = () => {
  return tags;
};
// Função para criar uma TAG. Verifica se o nome da TAG é fornecido e se já existe antes de criar a nova TAG ou retorna um erro se não for válido.
export const createTag = (data) => {
  if (!data.name) {
    return { error: "O Nome da TAG é obrigatório" };
  }

  const tagExiste = tags.some(t => t.name.toLowerCase() === data.name.toLowerCase());
  if (tagExiste) {
    return { error: "o Nome da TAG já existe" };
  }
// Gera novo ID automaticamente, para nova TAG, com base no maior ID existente (Math.max) ou 1 se a lista estiver vazia.
  const newId = tags.length > 0 ? Math.max(...tags.map(t => t.id)) + 1 : 1;
  const newTag = {
    id: newId,
    name: data.name
  };

  tags.push(newTag);
  return newTag;
};
// Função para atualizar uma TAG. Verifica se a TAG existe e se o novo nome é válido e não existe para outra TAG antes de atualizar ou retorna um erro se não for válido ou não encontrado.
export const updateTag = (id, data) => {
  const index = tags.findIndex(t => t.id === id);

  if (index === -1) {
    return { error: "A TAG não foi encontrada" };
  }

  if (data.name) {
    const tagExiste = tags.some(t => t.id !== id && t.name.toLowerCase() === data.name.toLowerCase());
    if (tagExiste) {
      return { error: "O Nome da TAG já existe" };
    }
  }

  tags[index] = { ...tags[index], ...data };
  return tags[index];
};
// Função para deletar uma TAG. Verifica se a TAG existe antes de deletar ou retorna um erro se não encontrada.
export const deleteTag = (id) => {
  const index = tags.findIndex(t => t.id === id);

  if (index === -1) {
    return { error: "A Tag não foi encontrada" };
  }

  const deletedTag = tags.splice(index, 1);
  return deletedTag[0];
};