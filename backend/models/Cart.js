const mongoose = require('mongoose');

const cartItemSchema = new mongoose.Schema({
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true,
  },
  name: { type: String, required: true },
  image: { type: String, default: '' },
  price: { type: Number, required: true },
  oldPrice: { type: Number, default: null },
  discount: { type: Number, default: null },
  size: { type: String, required: true },
  color: { type: String, required: true },
  quantity: { type: Number, required: true, min: 1, default: 1 },
});

const cartSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      sparse: true,
      default: undefined,
    },
    guestId: {
      type: String,
      sparse: true,
      default: undefined,
    },
    items: [cartItemSchema],
  },
  { timestamps: true }
);

cartSchema.index({ user: 1 }, { unique: true, sparse: true });
cartSchema.index({ guestId: 1 }, { unique: true, sparse: true });

module.exports = mongoose.model('Cart', cartSchema);
