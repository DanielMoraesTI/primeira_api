// Este é o arquivo que realmente é usado como ponto de entrada da aplicação. Ele configura o servidor Express, define as rotas e inicia o servidor na porta 3000. Ele também importa e usa o middleware de logger para registrar as requisições recebidas.
import express from 'express';
import userRoute from './routes/userRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import tagRoutes from './routes/tagRoutes.js';
import logger from './middlewares/loggerMiddleware.js';

const app = express();

app.use(express.json());
app.use(logger);

app.use('/tasks', taskRoutes);
app.use('/users', userRoute);
app.use('/tags', tagRoutes);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

