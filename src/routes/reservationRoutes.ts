import express from 'express';
import {
  createReservation,
  getMyReservations,
  getAllReservations,
  updateReservationStatus,
  deleteReservation
} from '../controllers/reservationController';
import { protect, admin } from '../middleware/authMiddleware';

const router = express.Router();

router.post('/', protect, createReservation);
router.get('/my', protect, getMyReservations);
router.get('/', protect, admin, getAllReservations);
router.put('/:id', protect, admin, updateReservationStatus);
router.delete('/:id', protect, deleteReservation);

export default router;
