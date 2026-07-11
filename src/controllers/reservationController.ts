import { Response } from 'express';
import { AuthRequest } from '../middleware/authMiddleware';
import { Reservation } from '../models/Reservation';

// @desc    Create a new reservation
// @route   POST /api/reservations
// @access  Private
export const createReservation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { listingId, title, image, location, price, totalPrice, checkIn, checkOut, guests } = req.body;

    if (!listingId || !title || !checkIn || !checkOut || !guests) {
      res.status(400).json({ message: 'Please provide all required reservation details' });
      return;
    }

    const reservation = new Reservation({
      user: req.user._id,
      listing: listingId,
      title,
      image,
      location,
      price,
      totalPrice,
      checkIn,
      checkOut,
      guests,
      status: 'Pending'
    });

    const createdReservation = await reservation.save();
    res.status(201).json(createdReservation);
  } catch (error: any) {
    console.error('Create reservation error:', error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Get current user's reservations
// @route   GET /api/reservations/my
// @access  Private
export const getMyReservations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const reservations = await Reservation.find({ user: req.user._id, status: { $ne: 'Cancelled' } }).sort({ createdAt: -1 });
    res.json(reservations);
  } catch (error: any) {
    console.error('Get my reservations error:', error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Get all reservations
// @route   GET /api/reservations
// @access  Private/Admin
export const getAllReservations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const reservations = await Reservation.find({}).sort({ createdAt: -1 }).populate('user', 'name email');
    res.json(reservations);
  } catch (error: any) {
    console.error('Get all reservations error:', error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Update reservation status (Confirm/Reject)
// @route   PUT /api/reservations/:id
// @access  Private/Admin
export const updateReservationStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status, rejectionReason, refundAmount, refundedAt } = req.body;
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      res.status(404).json({ message: 'Reservation not found' });
      return;
    }

    reservation.status = status || reservation.status;
    if (status === 'Rejected') {
      reservation.rejectionReason = rejectionReason || 'No specific reason provided.';
      reservation.refundAmount = refundAmount || reservation.totalPrice;
      reservation.refundedAt = refundedAt || new Date().toISOString();
    }

    const updatedReservation = await reservation.save();
    res.json(updatedReservation);
  } catch (error: any) {
    console.error('Update reservation status error:', error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};

// @desc    Cancel or delete reservation
// @route   DELETE /api/reservations/:id
// @access  Private
export const deleteReservation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const reservation = await Reservation.findById(req.params.id);

    if (!reservation) {
      res.status(404).json({ message: 'Reservation not found' });
      return;
    }

    // Check permissions: Admin can delete, User can only cancel/delete their own
    const isAdmin = req.user && req.user.role === 'admin';
    const isOwner = reservation.user.toString() === req.user._id.toString();

    if (!isAdmin && !isOwner) {
      res.status(401).json({ message: 'Not authorized to modify this reservation' });
      return;
    }

    if (isAdmin) {
      // Admins delete permanently
      await Reservation.findByIdAndDelete(req.params.id);
      res.json({ message: 'Reservation removed successfully', id: req.params.id });
    } else {
      // Users cancel it
      reservation.status = 'Cancelled';
      await reservation.save();
      res.json({ message: 'Reservation cancelled successfully', id: req.params.id, status: 'Cancelled' });
    }
  } catch (error: any) {
    console.error('Delete/Cancel reservation error:', error);
    res.status(500).json({ message: error.message || 'Server Error' });
  }
};
