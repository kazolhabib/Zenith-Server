import { Request, Response } from 'express';
import { Listing } from '../models/Listing';
import { AuthRequest } from '../middleware/authMiddleware';

// @desc    Fetch all listings
// @route   GET /api/listings
// @access  Public
export const getListings = async (req: Request, res: Response): Promise<void> => {
  try {
    const listings = await Listing.find({});
    res.json(listings);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Fetch single listing
// @route   GET /api/listings/:id
// @access  Public
export const getListingById = async (req: Request, res: Response): Promise<void> => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (listing) {
      res.json(listing);
    } else {
      res.status(404).json({ message: 'Listing not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a listing
// @route   POST /api/listings
// @access  Private
export const createListing = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, fullDescription, price, location, date, image } = req.body;

    const listing = new Listing({
      title,
      description,
      fullDescription,
      price,
      location,
      date,
      image: image || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80',
      user: req.user._id,
      rating: 0
    });

    const createdListing = await listing.save();
    res.status(201).json(createdListing);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete a listing
// @route   DELETE /api/listings/:id
// @access  Private
export const deleteListing = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const listing = await Listing.findById(req.params.id);

    if (listing) {
      if (listing.user.toString() !== req.user._id.toString()) {
        res.status(401).json({ message: 'User not authorized to delete this listing' });
        return;
      }
      await listing.deleteOne();
      res.json({ message: 'Listing removed' });
    } else {
      res.status(404).json({ message: 'Listing not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user listings
// @route   GET /api/listings/my
// @access  Private
export const getMyListings = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const listings = await Listing.find({ user: req.user._id });
    res.json(listings);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
