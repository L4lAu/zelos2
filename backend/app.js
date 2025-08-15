import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import authRoutes from './routes/auth.js';
import chamadosRoutes from './routes/chamados.js';
import apontamentosRoutes from './routes/apontamentos.js';

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: 'http://localhost:3000', credentials: true }));

// Rotas principais
app.use('/api/auth', authRoutes);
app.use('/api/chamados', chamadosRoutes);
app.use('/api/apontamentos', apontamentosRoutes);

// Rota teste
app.get('/api/health', (req, res) => res.json({ status: 'Backend rodando' }));


app.listen(8080, () => console.log('Backend rodando na porta 8080'));