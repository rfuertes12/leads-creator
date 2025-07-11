import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import leadsRoutes from './routes/leads.js';

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

app.use('/leads', leadsRoutes);

export default app;