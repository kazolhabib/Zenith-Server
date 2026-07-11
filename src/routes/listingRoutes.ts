import express from 'express';
import { getListings, getListingById, createListing, deleteListing, getMyListings, updateListing } from '../controllers/listingController';
import { protect } from '../middleware/authMiddleware';

const router = express.Router();

router.route('/')
  .get(getListings)
  .post(protect, createListing);

router.route('/my')
  .get(protect, getMyListings);

router.route('/:id')
  .get(getListingById)
  .put(protect, updateListing)
  .delete(protect, deleteListing);

export default router;
