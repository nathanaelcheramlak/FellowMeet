import express from 'express';

import userRoute from './user.route.js';
import authRoute from './auth.route.js';

const app = express.Router();

app.use('/auth', authRoute);
app.use('/user', userRoute);

export default app;