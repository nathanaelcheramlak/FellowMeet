import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import connectToDB from './db/connectToMongo.js';
import userRoutes from './routes/userRoutes.js';
import authRoutes from './routes/authRoutes.js';

const app = express();

const PORT = process.env.PORT;

app.use(
  cors({
    origin: 'http://localhost:3000', // Allow requests only from this origin
    credentials: true, // Enable cookies to be included in requests
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
