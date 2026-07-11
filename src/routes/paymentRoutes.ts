import express from 'express';
import { createCheckoutSession, verifyCheckoutSession } from '../controllers/paymentController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/create-checkout-session', protect, createCheckoutSession);
router.post('/verify-session', protect, verifyCheckoutSession);

export default router;
