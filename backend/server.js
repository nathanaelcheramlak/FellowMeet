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
      ? 'https://your-production-url.com' // Replace with your production frontend URL
      : 'http://localhost:3000', // Local development URL
    credentials: true, // Enable cookies to be included in requests
    exposedHeaders: ['set-cookie'], // Expose specific headers to the client
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
