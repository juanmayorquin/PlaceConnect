// backend/src/index.ts
import 'dotenv/config';
import express, { Application } from 'express';
import cors from 'cors';
import { connectDB } from './config/db';
import authRouter from './routes/auth';

const app: Application = express();
connectDB();

app.use(cors());
app.use(express.json());

// // Rutas placeholder
// app.use('/api/users', require('./routes/users'));
// app.use('/api/auth', userRouter);
app.use('/api/auth', authRouter);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`🚀 Server running on http://localhost:${PORT}`)
);