const Product = require('../models/Product');
const Cart = require('../models/Cart');

const calculateSummary = (items) => {
  let subtotal = 0;
  let discountTotal = 0;

  for (const item of items) {
    const qty = item.quantity || 1;
    const sellingPrice = item.price || 0;
    const original = item.oldPrice != null ? item.oldPrice : sellingPrice;

    subtotal += original * qty;
    discountTotal += (original - sellingPrice) * qty;
  }

  subtotal = Math.round(subtotal * 100) / 100;
  discountTotal = Math.round(discountTotal * 100) / 100;
  const deliveryFee = items.length > 0 ? 15 : 0;
  const total = Math.round((subtotal - discountTotal + deliveryFee) * 100) / 100;

  return { subtotal, discountTotal, deliveryFee, total };
};

const formatCartResponse = (cart) => {
  const items = cart?.items || [];
  return {
    _id: cart?._id || null,
    user: cart?.user || null,
    guestId: cart?.guestId || null,
    items,
    summary: calculateSummary(items),
  };
};

const getCartQuery = (req) => {
  if (req.user) {
    return { user: req.user._id };
  }
  const guestId = req.headers['x-guest-id'];
  if (!guestId) {
    return null;
  }
  return { guestId };
};

const findOrCreateCart = async (req) => {
  if (req.user) {
    let cart = await Cart.findOne({ user: req.user._id });
    if (!cart) {
      cart = await Cart.create({ user: req.user._id, items: [] });
    }
    return cart;
  }

  const guestId = req.headers['x-guest-id'];
  if (!guestId) {
    const err = new Error('Guest cart requires x-guest-id header');
    err.statusCode = 400;
    throw err;
  }

  let cart = await Cart.findOne({ guestId });
  if (!cart) {
    cart = await Cart.create({ guestId, items: [] });
  }
  return cart;
};

exports.getCart = async (req, res, next) => {
  try {
    const query = getCartQuery(req);
    if (!query) {
      return res.json(formatCartResponse({ items: [] }));
    }

    const cart = await Cart.findOne(query);
    if (!cart) {
      return res.json(formatCartResponse({ items: [], ...query }));
    }

    res.json(formatCartResponse(cart));
  } catch (error) {
    next(error);
  }
};

exports.addItem = async (req, res, next) => {
  try {
    const { productId, quantity = 1, size, color } = req.body;

    if (!productId || !size || !color) {
      return res.status(400).json({
        message: 'productId, size, and color are required',
      });
    }

    const qty = Math.max(parseInt(quantity, 10) || 1, 1);
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    const cart = await findOrCreateCart(req);

    const existing = cart.items.find(
      (item) =>
        item.product.toString() === product._id.toString() &&
        item.size === size &&
        item.color === color
    );

    if (existing) {
      existing.quantity += qty;
    } else {
      cart.items.push({
        product: product._id,
        name: product.name,
        image: product.images?.[0] || '',
        price: product.price,
        oldPrice: product.oldPrice ?? null,
        discount: product.discount ?? null,
        size,
        color,
        quantity: qty,
      });
    }

    await cart.save();
    res.status(201).json(formatCartResponse(cart));
  } catch (error) {
    next(error);
  }
};

exports.updateItem = async (req, res, next) => {
  try {
    const { quantity, size, color } = req.body;
    const cart = await findOrCreateCart(req);
    const item = cart.items.id(req.params.itemId);

    if (!item) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    if (quantity !== undefined) {
      const qty = parseInt(quantity, 10);
      if (Number.isNaN(qty) || qty < 1) {
        return res.status(400).json({ message: 'Quantity must be at least 1' });
      }
      item.quantity = qty;
    }

    if (size !== undefined) item.size = size;
    if (color !== undefined) item.color = color;

    await cart.save();
    res.json(formatCartResponse(cart));
  } catch (error) {
    next(error);
  }
};

exports.removeItem = async (req, res, next) => {
  try {
    const cart = await findOrCreateCart(req);
    const item = cart.items.id(req.params.itemId);

    if (!item) {
      return res.status(404).json({ message: 'Cart item not found' });
    }

    item.deleteOne();
    await cart.save();
    res.json(formatCartResponse(cart));
  } catch (error) {
    next(error);
  }
};

exports.clearCart = async (req, res, next) => {
  try {
    const query = getCartQuery(req);
    if (!query) {
      return res.json(formatCartResponse({ items: [] }));
    }

    const cart = await Cart.findOne(query);
    if (!cart) {
      return res.json(formatCartResponse({ items: [], ...query }));
    }

    cart.items = [];
    await cart.save();
    res.json(formatCartResponse(cart));
  } catch (error) {
    next(error);
  }
};
