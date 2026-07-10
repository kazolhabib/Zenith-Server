import mongoose from 'mongoose';

const listingSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true }, // Short description
    fullDescription: { type: String }, // Optional full description
    price: { type: Number, required: true },
    location: { type: String, required: true },
    date: { type: String, required: true },
    image: { type: String, required: true },
    rating: { type: Number, default: 0 },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
  },
  {
    timestamps: true,
  }
);

// Map _id to id in JSON response to match frontend
listingSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret) {
    ret.id = ret._id;
    delete ret._id;
  }
});

export const Listing = mongoose.model('Listing', listingSchema);
