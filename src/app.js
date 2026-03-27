// Este é o arquivo que realmente é usado como ponto de entrada da aplicação. Ele configura o servidor Express, define as rotas e inicia o servidor na porta 3000. Ele também importa e usa o middleware de logger para registrar as requisições recebidas.
import dotenv from 'dotenv';
import path from 'path';

import express from 'express';
import cors from 'cors';

const app = express();

// Configurar CORS
app.use(cors({
    origin: ['http://localhost:5500', 'http://127.0.0.1:5500'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    credentials: true,
    optionsSuccessStatus: 200
}));

app.use(express.json());

import userRoute from './routes/userRoutes.js';
import taskRoutes from './routes/taskRoutes.js';
import tagRoutes from './routes/tagRoutes.js';
import logger from './middlewares/loggerMiddleware.js';

app.use(logger);

app.use('/tasks', taskRoutes);
app.use('/users', userRoute);
app.use('/tags', tagRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

