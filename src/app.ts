import express, { Application } from 'express';
import cookieParser from 'cookie-parser';

//routes
import authRoutes from './routes/auth.routes';
import machineRoutes from './routes/machine.routes';

const app: Application = express();

app.set('port', 3001);

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth', authRoutes);

app.use('/api/machine', machineRoutes);

export default app;
