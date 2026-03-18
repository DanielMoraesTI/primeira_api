# Primeira API

Uma API REST simples desenvolvida com **Node.js** e **Express** para gerenciar tarefas, usuários, tags e comentários.

## 🚀 Início Rápido

### Executar
```bash
npm install
npm start
```
Servidor rodando em `http://localhost:3000`

## 📋 Recursos

### Usuários (`/users`)
- `GET /users` - Listar usuários
- `POST /users` - Criar usuário
- `PUT /users/:id` - Atualizar usuário
- `DELETE /users/:id` - Deletar usuário
- `GET /users/stats` - Estatísticas
- `PATCH /users/:id/toggle` - Ativar/Desativar

### Tarefas (`/tasks`)
- `GET /tasks` - Listar tarefas
- `POST /tasks` - Criar tarefa
- `PUT /tasks/:id` - Atualizar tarefa
- `DELETE /tasks/:id` - Deletar tarefa
- `GET /tasks/stats` - Estatísticas
- `GET /tasks/:id/comments` - Comentários da tarefa
- `POST /tasks/:id/comments` - Adicionar comentário
- `DELETE /tasks/:id/comments/:commentId` - Remover comentário
- `GET /tasks/:id/tags` - Tags da tarefa
- `POST /tasks/:id/tags` - Adicionar tag
- `DELETE /tasks/:id/tags/:tagId` - Remover tag

### Tags (`/tags`)
- `GET /tags` - Listar tags
- `POST /tags` - Criar tag
- `PUT /tags/:id` - Atualizar tag
- `DELETE /tags/:id` - Deletar tag

## 🏗️ Estrutura

```
src/
├── app.js              # Servidor principal
├── controllers/        # Tratamento de requisições HTTP
├── services/           # Lógica de negócios
├── routes/             # Definição de endpoints
└── middlewares/        # Logger e validações
```

## 💡 Características

- ✅ Validação de dados (email, duplicação, etc)
- ✅ Tratamento de erros consistente
- ✅ Busca e ordenação de dados
- ✅ Relacionamentos entre recursos
- ✅ Geração automática de IDs
- ✅ Middleware de logging

## 📝 Exemplo de Uso

**Criar usuário:**
```bash
POST http://localhost:3000/users
Content-Type: application/json

{
  "name": "João Silva",
  "email": "joao@gmail.com"
}
```

**Resposta:**
```json
{
  "id": 8,
  "name": "João Silva",
  "email": "joao@gmail.com",
  "ativo": true
}
```

## 📚 Conceitos Utilizados

- **REST API** - Arquitetura orientada a recursos
- **MVC** - Separação de responsabilidades
- **Middlewares** - Processamento de requisições
- **HTTP Status Codes** - 200, 201, 400, 404, etc
- **JSON** - Formato de dados

---

*Projeto educacional - Curso Backend Node.js e APIs no Programa UpSkill*
