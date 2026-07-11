import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { connectDB } from './config/db';
import authRoutes from './routes/authRoutes';
import listingRoutes from './routes/listingRoutes';
import paymentRoutes from './routes/paymentRoutes';

dotenv.config();

// Connect to database
connectDB();

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));

app.get('/', (req: Request, res: Response) => {
  res.send('API is running...');
});

app.use('/api/auth', authRoutes);
app.use('/api/listings', listingRoutes);
app.use('/api/payments', paymentRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});
