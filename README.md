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
- MySQL Server instalado (versão 5.7 ou superior)

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

3. **Configure o banco de dados MySQL:**
   - Crie um banco de dados chamado `primeira_api`
   - Execute as queries SQL para criar as tabelas
   - Insira os dados de teste (veja as queries em SCHEMA_MYSQL.sql no seu computador local)

4. **Configure as variáveis de ambiente** (arquivo `.env`):
   ```env
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=sua_senha
   DB_NAME=primeira_api
   DB_PORT=3306
   PORT=3000
   ```

5. **Inicie o servidor:**
   ```bash
   npm start
   ```

6. **Acesse a API:**
   ```
   http://localhost:3000
   ```

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

## 🏗️ Estrutura do Projeto

```
Primeira_API/
├── src/
│   ├── app.js                      # Servidor Express principal
│   ├── db.js                       # Pool de conexão MySQL
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
│       ├── checkUserExists.js      # Validação de usuário
│       └── loggerMiddleware.js     # Log de requisições
├── package.json
├── .env                            # Variáveis de ambiente
└── README.md
```

---

## 📝 Exemplos Rápidos

### Listar Usuários
```bash
GET http://localhost:3000/users
```

### Criar Tarefa
```bash
POST http://localhost:3000/tasks
Content-Type: application/json

{
  "title": "Nova tarefa",
  "categoria": "Trabalho",
  "user_id": 1
}
```

### Adicionar Comentário em Tarefa
```bash
POST http://localhost:3000/tasks/1/comments
Content-Type: application/json

{
  "userId": 2,
  "conteudo": "Comentário sobre a tarefa"
}
```

### Associar Tag a Tarefa
```bash
POST http://localhost:3000/tasks/1/tags
Content-Type: application/json

{
  "tagId": 3
}
```

### Obter Estatísticas
```bash
GET http://localhost:3000/users/stats
GET http://localhost:3000/tasks/stats
```

---

## 📚 Conceitos Utilizados

- **REST API** - Arquitetura orientada a recursos
- **MVC** - Separação de responsabilidades
- **Middlewares** - Processamento de requisições
- **HTTP Status Codes** - 200, 201, 400, 404, etc
- **JSON** - Formato de dados
- **MySQL** - Banco de dados relacional
- **Relacionamentos** - 1:N (tarefas → usuários) e N:N (tarefas ↔ tags)

---

*Projeto educacional - Curso Backend Node.js e APIs no Programa UpSkill*
