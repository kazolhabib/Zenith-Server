import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Listing } from './src/models/Listing';
const LISTINGS_DATA = require('./mockData.js');

dotenv.config();

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || '';
    if (!mongoUri) {
      console.log('No MONGO_URI, exiting');
      process.exit(1);
    }
    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected...');
    
    await Listing.deleteMany();
    
    const formattedListings = LISTINGS_DATA.map((item: any) => ({
      title: item.title,
      description: item.description,
      fullDescription: item.description,
      image: item.image,
      images: item.images,
      price: item.price,
      rating: item.rating,
      location: item.location,
      date: item.date,
      user: new mongoose.Types.ObjectId()
    }));

    await Listing.insertMany(formattedListings);
    
    console.log('12 Data Imported successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

seedDatabase();
