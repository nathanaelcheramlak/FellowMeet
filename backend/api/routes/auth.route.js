import express from 'express';
import validate from '../middleware/validation.middleware.js';
import { loginSchema, registerSchema } from '../validations/auth.validation.js';
import {
  register,
  login,
  logout,
  me,
} from '../controller/auth.controller.js';

const app = express.Router();

app.post('/register', validate(registerSchema), register);
app.post('/login', validate(loginSchema), login);
app.delete('/logout', logout);
app.get('/me', me);

export default app;
