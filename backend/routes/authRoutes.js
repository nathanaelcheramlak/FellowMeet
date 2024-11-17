import express from 'express';
import {
  signup,
  login,
  logout,
  verify,
} from '../controller/auth.controller.js';

const app = express.Router();

app.post('/signup', signup);
app.post('/login', login);
app.delete('/logout', logout);
app.get('/verify', verify);

export default app;
