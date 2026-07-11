import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    listing: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Listing',
      required: true,
    },
    title: { type: String, required: true },
    image: { type: String, required: true },
    location: { type: String, required: true },
    price: { type: Number, required: true },
    totalPrice: { type: Number, required: true },
    checkIn: { type: String, required: true },
    checkOut: { type: String, required: true },
    guests: { type: Number, required: true },
    status: {
      type: String,
      enum: ['Pending', 'Confirmed', 'Rejected', 'Cancelled'],
      default: 'Pending',
    },
    rejectionReason: { type: String, default: '' },
    refundAmount: { type: Number, default: 0 },
    refundedAt: { type: String, default: '' }
  },
  {
    timestamps: true,
  }
);

// Map _id to id in JSON response to match frontend
reservationSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: function (doc, ret: any) {
    ret.id = ret._id;
    delete ret._id;
  },
});

export const Reservation = mongoose.model('Reservation', reservationSchema);
