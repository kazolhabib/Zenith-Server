import express from 'express';
import { registerUser, loginUser, googleSignIn, updateProfile } from '../controllers/authController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleSignIn);
router.put('/profile', protect, updateProfile);

export default router;
