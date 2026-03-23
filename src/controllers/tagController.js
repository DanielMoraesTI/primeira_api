import * as tagService from '../services/tagService.js';
// Controlador responsável apenas por lidar com as requisições e respostas sobre TAGS, delegando a lógica de negócios para o service.
export const getAllTags = async (req, res) => {
  try {
    // O await é para aguardar resposta do service, que pode ser uma operação assíncrona (ex: consulta a banco de dados)
    const tags = await tagService.getAllTags();
    res.json(tags);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar TAGs' });
  }
};

export const createTag = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'O Nome da TAG deve ser informado' });
    }
    // O await é para aguardar resposta do service, que pode ser uma operação assíncrona (ex: consulta a banco de dados)
    const newTag = await tagService.createTag({ name });

    if (newTag.error) {
      return res.status(400).json(newTag);
    }
    res.status(201).json(newTag);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao criar TAG' });
  }
};

export const updateTag = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ error: 'O Nome da TAG deve ser informado' });
    }
    const updatedTag = await tagService.updateTag(id, { name });
    if (updatedTag.error) {
      return res.status(404).json(updatedTag);
    }
    res.json(updatedTag);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao atualizar TAG' });
  }
};

export const deleteTag = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const deletedTag = await tagService.deleteTag(id);
    if (deletedTag.error) {
      return res.status(404).json(deletedTag);
    }
    res.json({ message: "TAG deletada com sucesso", tag: deletedTag });
  } catch (error) {
    res.status(500).json({ error: 'Erro ao deletar TAG' });
  }
};

export const getTasksByTag = async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const tasks = await tagService.getTasksByTag(id);
    if (tasks.error) {
      return res.status(404).json(tasks);
    }
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ error: 'Erro ao buscar tarefas da tag' });
  }
};