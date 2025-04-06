import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import helmet from 'helmet';
import morgan from 'morgan';

import connectToDB from './db/connection.js';
import routes from './routes/route.js'

const app = express();
const PORT = process.env.PORT;

let backend_url;
let frontend_url;
const isProduction = process.env.NODE_ENV === 'production';

if (isProduction) {
  backend_url = process.env.PROD_BACKEND_URL;
  frontend_url = process.env.PROD_FRONTEND_URL;
} else {
  backend_url = process.env.DEV_BACKEND_URL;
  frontend_url = process.env.DEV_FRONTEND_URL
}

// Cors config
app.use(
  cors({
    origin: frontend_url,
    credentials: true,
    exposedHeaders: ['set-cookie'],
  }),
);

// Middleware
app.use(helmet());
app.use(express.json());
app.use(morgan('dev'));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Route
app.use('/api/v1', routes);

app.listen(PORT, () => {
  connectToDB();
  console.log(`server started on ${backend_url}`);
});
