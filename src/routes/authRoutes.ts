import express from 'express';
import { registerUser, loginUser, googleSignIn } from '../controllers/authController';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleSignIn);

export default router;
