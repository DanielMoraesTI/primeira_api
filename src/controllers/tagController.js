import * as tagService from '../services/tagService.js';
// Controlador responsável apenas por lidar com as requisições e respostas sobre TAGS, delegando a lógica de negócios para o service.
export const getAllTags = (req, res) => {
  const tags = tagService.getAllTags();
  res.json(tags);
}

export const createTag = (req, res) => {
  const { name } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'O Nome da TAG deve ser informado' });
  }
  
  const tag = tagService.createTag({ name });
  
  if (tag.error) {
    return res.status(400).json(tag);
  }
  
  res.status(201).json(tag);
}

export const updateTag = (req, res) => {
  const id = parseInt(req.params.id);
  const { name } = req.body;
  
  if (!name) {
    return res.status(400).json({ error: 'O Nome da TAG deve ser informado' });
  }
  
  const tag = tagService.updateTag(id, { name });
  
  if (tag.error) {
    return res.status(404).json(tag);
  }
  
  res.json(tag);
}

export const deleteTag = (req, res) => {
  const id = parseInt(req.params.id);
  
  const tag = tagService.deleteTag(id);
  
  if (tag.error) {
    return res.status(404).json(tag);
  }
  
  res.json(tag);
}
