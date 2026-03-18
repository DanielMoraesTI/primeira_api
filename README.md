# Primeira API

Uma API REST desenvolvida com **Node.js** e **Express** para gerenciar tarefas, usuários, tags e comentários.

## 👤 Autor

**Daniel Moraes**

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
- `POST /users` - Criar novo usuário
- `PUT /users/:id` - Atualizar usuário
- `DELETE /users/:id` - Deletar usuário
- `GET /users/stats` - Estatísticas de usuários
- `PATCH /users/:id/toggle` - Ativar/Desativar usuário

### Tarefas (`/tasks`)
- `GET /tasks` - Listar tarefas
- `POST /tasks` - Criar tarefa
- `PUT /tasks/:id` - Atualizar tarefa
- `DELETE /tasks/:id` - Deletar tarefa
- `GET /tasks/stats` - Estatísticas de tarefas
- `GET /tasks/:id/comments` - Obter comentários da tarefa
- `POST /tasks/:id/comments` - Adicionar comentário
- `DELETE /tasks/:id/comments/:commentId` - Remover comentário
- `GET /tasks/:id/tags` - Obter tags associadas
- `POST /tasks/:id/tags` - Associar tag
- `DELETE /tasks/:id/tags/:tagId` - Remover associação de tag

### Tags (`/tags`)
- `GET /tags` - Listar tags
- `POST /tags` - Criar tag
- `PUT /tags/:id` - Atualizar tag
- `DELETE /tags/:id` - Deletar tag

---

## 🎯 Principais Decisões Tomadas

### 1. **Arquitetura em Camadas**
- **Controllers**: Responsáveis por receber e validar requisições HTTP
- **Services**: Contêm toda a lógica de negócios
- **Routes**: Definem os endpoints e aplicam middlewares

**Justificativa**: Essa separação promove código mais limpo, testável e fácil de manter. Cada camada tem uma responsabilidade única e bem definida.

### 2. **Padronização de Respostas de Erro**
- Todas as operações retornam objetos com propriedade `error` quando algo falha
- Padrão: `{ error: "mensagem descritiva" }`

**Justificativa**: Garante consistência na tratamento de erros pelos clientes da API, facilitando a integração e previsibilidade do comportamento.

### 3. **Sistema Único de Comentários**
- Comentários são gerenciados exclusivamente pelo `commentService.js`
- Remover duplicação que existia entre `taskService` e `commentService`

**Justificativa**: Elimina conflitos de lógica e garante que todas as operações de comentários passem por um único ponto de controle.

### 4. **Status HTTP Padronizados**
- `201 Created` - Recurso criado com sucesso
- `400 Bad Request` - Erro de validação
- `404 Not Found` - Recurso não encontrado
- `200 OK` - Operação bem-sucedida

**Justificativa**: Segue os padrões RESTful, facilitando a integração com ferramentas de teste (Postman, Insomnia, etc.) e bibliotecas HTTP.

### 5. **Middlewares de Validação**
- `checkUserExists`: Verifica se usuário existe antes de operações PUT, PATCH e DELETE
- `loggerMiddleware`: Registra todas as requisições recebidas

**Justificativa**: Middlewares reduzem código duplicado nos controllers e centralizam lógica transversal de validação.

### 6. **Nomenclatura Consistente**
- Todas as funções de listagem começam com `getAll*` (ex: `getAllUsers`, `getAllTasks`)
- Padrão aplicado em controllers, services e arquivos

**Justificativa**: Melhora legibilidade e previsibilidade do código, facilitando onboarding de novos desenvolvedores.

### 7. **Geração Automática de IDs**
- IDs são gerados automaticamente com base no maior ID existente
- Incremento baseado em `Math.max(...ids) + 1`

**Justificativa**: Garante IDs únicos sem necessidade de banco de dados externo, apropriado para uma aplicação educacional.

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
