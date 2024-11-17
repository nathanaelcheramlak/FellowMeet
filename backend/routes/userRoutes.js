import express from 'express';
import upload from '../middleware/upload.js';
import protectRoute from '../middleware/protectRoute.js';

import {
  uploadImage,
  createUser,
  getAllUsers,
  getUser,
  updateUser,
  deleteUser,
} from '../controller/user.controller.js';

const router = express.Router();

router.post('/upload-img', upload.single('file'), uploadImage);
router.post('/create', protectRoute, createUser);
router.get('/:userId', protectRoute, getUser);
router.get('/', getAllUsers);
router.put('/edit', protectRoute, updateUser);
router.delete('/delete', protectRoute, deleteUser);

export default router;
