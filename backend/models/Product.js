const mongoose = require('mongoose');

const colorSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    hex: { type: String, required: true },
  },
  { _id: false }
);

const productSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    category: {
      type: String,
      required: true,
      enum: ['t-shirts', 'shorts', 'shirts', 'hoodie', 'jeans'],
    },
    dressStyle: {
      type: String,
      required: true,
      enum: ['casual', 'formal', 'party', 'gym'],
    },
    description: { type: String, required: true },
    price: { type: Number, required: true, min: 0 },
    oldPrice: { type: Number, default: null },
    discount: { type: Number, default: null },
    rating: { type: Number, default: 0, min: 0, max: 5 },
    images: [{ type: String }],
    sizes: [{ type: String }],
    colors: [colorSchema],
    stock: { type: Number, default: 0, min: 0 },
    isNewArrival: { type: Boolean, default: false },
    isTopSelling: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Product', productSchema);
