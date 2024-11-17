import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import connectToDB from './db/connectToMongo.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();
const PORT = process.env.PORT;

const isProduction = process.env.NODE_ENV === 'production';

app.use(
  cors({
    origin: isProduction
      ? 'https://fellow-meet4k.vercel.app/'
      : 'http://localhost:3000',
    credentials: true,
    exposedHeaders: ['set-cookie'],
  }),
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use('/api/user', userRoutes);
app.use('/api/auth', authRoutes);

app.listen(PORT, () => {
  connectToDB();
  console.log(`Server started on http://localhost:${PORT}`);
});
