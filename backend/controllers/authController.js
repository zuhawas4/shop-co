const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');
const Cart = require('../models/Cart');

const signToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

const formatUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
});

const mergeGuestCart = async (userId, guestId) => {
  if (!guestId) return;

  const guestCart = await Cart.findOne({ guestId });
  if (!guestCart || guestCart.items.length === 0) {
    if (guestCart) await Cart.deleteOne({ _id: guestCart._id });
    return;
  }

  let userCart = await Cart.findOne({ user: userId });
  if (!userCart) {
    guestCart.user = userId;
    guestCart.guestId = undefined;
    await guestCart.save();
    return;
  }

  for (const guestItem of guestCart.items) {
    const existing = userCart.items.find(
      (item) =>
        item.product.toString() === guestItem.product.toString() &&
        item.size === guestItem.size &&
        item.color === guestItem.color
    );

    if (existing) {
      existing.quantity += guestItem.quantity;
    } else {
      userCart.items.push(guestItem);
    }
  }

  await userCart.save();
  await Cart.deleteOne({ _id: guestCart._id });
};

exports.signup = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    const hashed = await bcrypt.hash(password, 12);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      password: hashed,
    });

    const guestId = req.headers['x-guest-id'];
    await mergeGuestCart(user._id, guestId);

    const token = signToken(user._id);
    res.status(201).json({ token, user: formatUser(user) });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const guestId = req.headers['x-guest-id'];
    await mergeGuestCart(user._id, guestId);

    const token = signToken(user._id);
    res.json({ token, user: formatUser(user) });
  } catch (error) {
    next(error);
  }
};

exports.getMe = async (req, res, next) => {
  try {
    res.json({ user: formatUser(req.user) });
  } catch (error) {
    next(error);
  }
};
