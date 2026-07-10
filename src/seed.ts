import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Listing } from './models/Listing';

dotenv.config();

const mockListings = [
  {
    title: "Luxury Beachfront Villa",
    description: "Experience ultimate luxury in this stunning beachfront property with panoramic ocean views.",
    fullDescription: "Experience ultimate luxury in this stunning beachfront property with panoramic ocean views. Featuring contemporary architecture, floor-to-ceiling windows, and a private infinity pool.",
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1200&q=80",
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800&q=80",
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80",
      "https://images.unsplash.com/photo-1600607686527-6fb886090705?w=800&q=80",
    ],
    price: 850,
    rating: 4.9,
    location: "Malibu, CA",
    date: "2026-10-15",
    user: new mongoose.Types.ObjectId() // Generate a random admin user id
  },
  {
    title: "Modern Downtown Loft",
    description: "Sleek and modern loft in the heart of the city.",
    fullDescription: "Sleek and modern loft in the heart of the city. Perfect for urban explorers and business trips. High ceilings and industrial design.",
    image: "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1512918728675-ed5a9ecdebfd?w=1200&q=80",
      "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=800&q=80",
      "https://images.unsplash.com/photo-1505843513577-22bb7d21e455?w=800&q=80",
      "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800&q=80",
    ],
    price: 220,
    rating: 4.7,
    location: "New York, NY",
    date: "2026-10-15",
    user: new mongoose.Types.ObjectId()
  },
  {
    title: "Cozy Mountain Cabin",
    description: "Escape the noise in this charming A-frame cabin surrounded by pine trees.",
    fullDescription: "Escape the noise in this charming A-frame cabin surrounded by pine trees and mountain trails. Complete with a wood-burning fireplace.",
    image: "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1510798831971-661eb04b3739?w=1200&q=80",
      "https://images.unsplash.com/photo-1518780664697-55e3ad937233?w=800&q=80",
      "https://images.unsplash.com/photo-1449844908441-8829872d2607?w=800&q=80",
      "https://images.unsplash.com/photo-1521401830884-6c03c1c87ebb?w=800&q=80",
    ],
    price: 150,
    rating: 4.9,
    location: "Aspen, CO",
    date: "2026-11-01",
    user: new mongoose.Types.ObjectId()
  },
  {
    title: "Desert Oasis Retreat",
    description: "A unique architectural masterpiece in the desert with a private pool.",
    fullDescription: "A unique architectural masterpiece in the desert with a private pool and starry night views. Minimalist design meets natural beauty.",
    image: "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80",
    images: [
      "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=1200&q=80",
      "https://images.unsplash.com/photo-1515263487990-61b07816b324?w=800&q=80",
      "https://images.unsplash.com/photo-1582268611958-ebfd161ef9cf?w=800&q=80",
      "https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?w=800&q=80",
    ],
    price: 450,
    rating: 4.8,
    location: "Joshua Tree, CA",
    date: "2026-10-20",
    user: new mongoose.Types.ObjectId()
  }
];

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || '';
    await mongoose.connect(mongoUri);
    console.log('MongoDB Connected...');
    
    // Clear existing
    await Listing.deleteMany();
    
    // Insert new mock data
    await Listing.insertMany(mockListings);
    
    console.log('Data Imported successfully!');
    process.exit();
  } catch (error) {
    console.error(`Error: ${error}`);
    process.exit(1);
  }
};

seedDatabase();
