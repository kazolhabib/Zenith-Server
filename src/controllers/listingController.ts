import { Request, Response } from 'express';
import { Listing } from '../models/Listing';
import { AuthRequest } from '../middleware/authMiddleware';

// @desc    Fetch all listings
// @route   GET /api/listings
// @access  Public
export const getListings = async (req: Request, res: Response): Promise<void> => {
  try {
    const listings = await Listing.find({}).sort({ createdAt: -1 });
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
    const { title, description, fullDescription, price, location, date, image, images, specs } = req.body;

    const defaultImage = image || 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&q=80';
    
    // Gather up to 4 images
    let finalImages = images && Array.isArray(images)
      ? images.filter((img: string) => typeof img === 'string' && img.trim() !== '')
      : [];
    if (finalImages.length === 0) {
      finalImages = [defaultImage, defaultImage, defaultImage, defaultImage];
    } else {
      // Repeat the first image if there are fewer than 4 images
      while (finalImages.length < 4) {
        finalImages.push(finalImages[0]);
      }
    }

    const listing = new Listing({
      title,
      description,
      fullDescription,
      price,
      location,
      date,
      image: defaultImage,
      images: finalImages,
      specs: specs || { guests: 4, bedrooms: 2, beds: 2, baths: 1 },
      user: req.user._id,
      rating: 0,
      isManuallyCreated: true
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
    const listings = await Listing.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(listings);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a listing
// @route   PUT /api/listings/:id
// @access  Private
export const updateListing = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { title, description, fullDescription, price, location, date, image, images, specs } = req.body;
    const listing = await Listing.findById(req.params.id);

    if (listing) {
      // Check ownership or admin role
      if (listing.user.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
        res.status(401).json({ message: 'User not authorized to update this listing' });
        return;
      }

      listing.title = title || listing.title;
      listing.description = description || listing.description;
      listing.fullDescription = fullDescription || listing.fullDescription;
      listing.price = price !== undefined ? price : listing.price;
      listing.location = location || listing.location;
      listing.date = date || listing.date;
      listing.image = image || listing.image;
      
      if (images && Array.isArray(images)) {
        let finalImages = images.filter((img: string) => typeof img === 'string' && img.trim() !== '');
        if (finalImages.length > 0) {
          while (finalImages.length < 4) {
            finalImages.push(finalImages[0]);
          }
          listing.images = finalImages;
        }
      }
      
      if (specs) {
        const currentSpecs = (listing as any).specs || {};
        listing.specs = {
          guests: specs.guests !== undefined ? specs.guests : currentSpecs.guests,
          bedrooms: specs.bedrooms !== undefined ? specs.bedrooms : currentSpecs.bedrooms,
          beds: specs.beds !== undefined ? specs.beds : currentSpecs.beds,
          baths: specs.baths !== undefined ? specs.baths : currentSpecs.baths
        };
      }

      const updatedListing = await listing.save();
      res.json(updatedListing);
    } else {
      res.status(404).json({ message: 'Listing not found' });
    }
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
