import express from 'express';
import { createPrayer, editPrayer, deletePrayer, getPrayers, getPrayerById, likePrayer, deleteLikePrayer } from '../controller/prayer.controller.js';
import authMiddleware from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/:id', getPrayerById);
router.get('/', getPrayers);

router.post('/', authMiddleware, createPrayer);
router.put('/:id', authMiddleware, editPrayer);
router.delete('/:id', authMiddleware, deletePrayer);

router.get('/add-like/:id', likePrayer);
router.get('/delete-like/:id', deleteLikePrayer);

export default router;