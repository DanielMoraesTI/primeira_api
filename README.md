# Primeira API

Uma API REST desenvolvida com **Node.js** e **Express** para gerenciar tarefas, usuários, tags e comentários.

## 👤 Autor

**Daniel Moraes**
**218 (Identificação UpSkill)**

## 🔗 Repositório

https://github.com/DanielMoraesTI/primeira_api.git

---

## 🚀 Como Executar

### Pré-requisitos
- Node.js instalado (versão 16 ou superior)
- npm ou yarn

### Passos para Instalar e Rodar

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/DanielMoraesTI/primeira_api.git
   cd Primeira_API
   ```

2. **Instale as dependências:**
   ```bash
   npm install
   ```

3. **Inicie o servidor:**
   ```bash
   npm start
   ```

4. **Acesse a API:**
   ```
   http://localhost:3000
   ```

O servidor estará rodando na porta 3000 e exibirá mensagem de confirmação no console.

---

## 📋 Recursos Disponíveis

### Usuários (`/users`)
- `GET /users` - Listar usuários (com filtro por nome e ordenação)
- `GET /users?search=` - Buscar usuários por nome
- `GET /users?sort=asc|desc` - Ordenar usuários
- `POST /users` - Criar novo usuário
- `PUT /users/:id` - Atualizar usuário
- `PATCH /users/:id` - Atualizar parcialmente usuário
- `DELETE /users/:id` - Deletar usuário
- `GET /users/stats` - Estatísticas de usuários
- `GET /users/:id/tasks` - Obter tarefas de um usuário

### Tarefas (`/tasks`)
- `GET /tasks` - Listar tarefas
- `GET /tasks?search=` - Buscar tarefas por título
- `GET /tasks?sort=asc|desc` - Ordenar tarefas
- `POST /tasks` - Criar tarefa
- `PUT /tasks/:id` - Atualizar tarefa
- `DELETE /tasks/:id` - Deletar tarefa
- `GET /tasks/stats` - Estatísticas de tarefas
- `GET /tasks/:id/comments` - Obter comentários da tarefa
- `POST /tasks/:id/comments` - Adicionar comentário à tarefa
- `PUT /tasks/:id/comments/:commentId` - Atualizar comentário
- `DELETE /tasks/:id/comments/:commentId` - Remover comentário
- `POST /tasks/:id/tags` - Associar tag à tarefa
- `DELETE /tasks/:id/tags/:tagId` - Remover tag da tarefa

### Tags (`/tags`)
- `GET /tags` - Listar tags
- `POST /tags` - Criar tag
- `DELETE /tags/:id` - Deletar tag
- `GET /tags/:id/tasks` - Obter tarefas com a tag

---

## 🎯 Principais Decisões Tomadas

### 1. **Arquitetura em Camadas**
- **Controllers**: Responsáveis por receber e validar requisições HTTP
- **Services**: Contêm toda a lógica de negócios
- **Routes**: Definem os endpoints e aplicam middlewares

**Justificativa**: Essa separação promove código mais limpo, testável e fácil de manter. Cada camada tem uma responsabilidade única e bem definida.

### 2. **Padronização de Nomes de Tabelas em Inglês**
- Todas as tabelas e queries utilizam nomenclatura em inglês: `users`, `tasks`, `tags`, `comments`
- Evita inconsistências entre diferentes bancos de dados

**Justificativa**: Padroniza o código para contextos internacionais e facilita manutenção em equipes multilíngues.

### 3. **Sistema Único de Comentários**
- Comentários são gerenciados exclusivamente pelo `commentService.js`
- Todas as operações de comentários passam por um único ponto de controle

**Justificativa**: Elimina conflitos de lógica e garante consistência nas operações de comentários.

### 4. **Relacionamento N:N Entre Tarefas e Tags**
- Tabela `task_tags` gerencia a relação entre tarefas e tags
- Implementadas funções: `getTaskTags()`, `addTagToTask()`, `removeTagFromTask()`

**Justificativa**: Permite que uma tarefa tenha múltiplas tags e vice-versa, com integridade referencial garantida.

### 5. **Padronização de Respostas HTTP**
- `201 Created` - Recurso criado com sucesso
- `400 Bad Request` - Erro de validação
- `404 Not Found` - Recurso não encontrado
- `200 OK` - Operação bem-sucedida

**Justificativa**: Segue padrões RESTful, facilitando integração com ferramentas e bibliotecas HTTP.

### 6. **Middlewares de Validação**
- `checkUserExists`: Verifica se usuário existe antes de operações PUT, PATCH e DELETE
- `loggerMiddleware`: Registra todas as requisições recebidas

**Justificativa**: Reduz código duplicado e centraliza lógica transversal.

---

## 📦 Alterações Recentes (Branch: Exercícios-de-Backend-—-Migração-para-MySQL---Exercícios-Guiados-5)

### ✅ Atualizações Implementadas

1. **Padronização de Nomenclatura**
   - `tarefas` → `tasks`
   - `usuarios` → `users`
   - Mantém consistência em todo o projeto

2. **Implementação de Funções de Tags em Tarefas**
   - `getTaskTags(taskId)` - Obtém tags associadas a uma tarefa
   - `addTagToTask(taskId, tagId)` - Associa uma tag a uma tarefa
   - `removeTagFromTask(taskId, tagId)` - Remove uma tag de uma tarefa

3. **Alinhamento com Especificações do Projeto**

4. **Validações Aprimoradas**
   - Verificação de duplicação em associações tag-tarefa
   - Validação de existência de recursos antes de operações
   - Mensagens de erro consistentes e descritivas

### 🔄 Como Usar a Nova Branch

```bash
git checkout refactor/mysql-standardization
npm install
npm start
```

---

---

## 🏗️ Estrutura do Projeto

```
Primeira_API/
├── src/
│   ├── app.js                      # Servidor Express principal
│   ├── controllers/
│   │   ├── userController.js       # Lógica de API de usuários
│   │   ├── taskController.js       # Lógica de API de tarefas
│   │   └── tagController.js        # Lógica de API de tags
│   ├── services/
│   │   ├── userService.js          # Lógica de negócios: usuários
│   │   ├── taskService.js          # Lógica de negócios: tarefas
│   │   ├── tagService.js           # Lógica de negócios: tags
│   │   └── commentService.js       # Lógica de negócios: comentários
│   ├── routes/
│   │   ├── userRoutes.js           # Endpoints de usuários
│   │   ├── taskRoutes.js           # Endpoints de tarefas
│   │   └── tagRoutes.js            # Endpoints de tags
│   └── middlewares/
│       ├── checkUserExists.js      # Validação de existência do usuário
│       └── loggerMiddleware.js     # Log de requisições HTTP
├── package.json
└── README.md
```

## ✨ Características

- ✅ Validação de dados (email, duplicação, campos obrigatórios)
- ✅ Tratamento de erros padronizado e consistente
- ✅ Busca e ordenação de dados
- ✅ Relacionamentos entre recursos (Tarefas ↔ Tags ↔ Comentários)
- ✅ Middleware de logging de requisições
- ✅ Geração automática de IDs únicos

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
