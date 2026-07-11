import express from 'express';
import { registerUser, loginUser, googleSignIn, facebookSignIn, updateProfile, getUsers, deleteUser } from '../controllers/authController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/google', googleSignIn);
router.post('/facebook', facebookSignIn);
router.put('/profile', protect, updateProfile);
router.get('/users', protect, admin, getUsers);
router.delete('/users/:id', protect, admin, deleteUser);

export default router;
