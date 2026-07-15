require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const connectDB = require('../config/db');
const Product = require('../models/Product');

const SIZES = ['Small', 'Medium', 'Large', 'X-Large'];

const defaultColors = [
  { name: 'Black', hex: '#000000' },
  { name: 'White', hex: '#FFFFFF' },
  { name: 'Navy', hex: '#31344B' },
];

const products = [
  {
    name: 'T-shirt with Tape Details',
    category: 't-shirts',
    dressStyle: 'casual',
    description:
      'Soft cotton t-shirt with distinctive tape detailing along the seams. A versatile everyday staple with a relaxed fit.',
    price: 120,
    oldPrice: null,
    discount: null,
    rating: 4.5,
    images: [
      '/images/products/tshirt-with-tape-details.png',
      '/images/products/g1.png',
      '/images/products/g2.png',
      '/images/products/g3.png',
    ],
    sizes: SIZES,
    colors: defaultColors,
    stock: 50,
    isNewArrival: true,
    isTopSelling: false,
  },
  {
    name: 'Skinny Fit Jeans',
    category: 'jeans',
    dressStyle: 'casual',
    description:
      'Classic skinny fit jeans with stretch denim for comfort and a sharp silhouette. Perfect for everyday wear.',
    price: 240,
    oldPrice: 260,
    discount: 20,
    rating: 3.5,
    images: [
      '/images/products/skinny-fit-jeans.png',
      '/images/products/g1.png',
      '/images/products/g2.png',
    ],
    sizes: SIZES,
    colors: [
      { name: 'Blue', hex: '#3B5998' },
      { name: 'Black', hex: '#1A1A1A' },
      { name: 'Grey', hex: '#6B7280' },
    ],
    stock: 50,
    isNewArrival: true,
    isTopSelling: false,
  },
  {
    name: 'Checkered Shirt',
    category: 'shirts',
    dressStyle: 'casual',
    description:
      'Timeless checkered shirt in soft cotton. Easy to dress up or down for a polished casual look.',
    price: 180,
    oldPrice: null,
    discount: null,
    rating: 4.5,
    images: [
      '/images/products/checkered-shirt.png',
      '/images/products/g2.png',
      '/images/products/g3.png',
    ],
    sizes: SIZES,
    colors: [
      { name: 'Red Check', hex: '#B91C1C' },
      { name: 'Blue Check', hex: '#1D4ED8' },
      { name: 'Black', hex: '#111827' },
    ],
    stock: 50,
    isNewArrival: true,
    isTopSelling: false,
  },
  {
    name: 'Sleeve Striped T-shirt',
    category: 't-shirts',
    dressStyle: 'casual',
    description:
      'Sporty striped-sleeve t-shirt with a modern cut. Lightweight fabric ideal for layering or solo wear.',
    price: 130,
    oldPrice: 160,
    discount: 30,
    rating: 4.5,
    images: [
      '/images/products/sleeve-striped-shirt.png',
      '/images/products/g1.png',
      '/images/products/g3.png',
    ],
    sizes: SIZES,
    colors: defaultColors,
    stock: 50,
    isNewArrival: true,
    isTopSelling: false,
  },
  {
    name: 'Vertical Striped Shirt',
    category: 'shirts',
    dressStyle: 'formal',
    description:
      'Crisp vertical striped shirt tailored for a refined formal look. Breathable fabric with a clean collar finish.',
    price: 212,
    oldPrice: 232,
    discount: 20,
    rating: 5.0,
    images: [
      '/images/products/vertical-striped-shirt.png',
      '/images/products/g1.png',
      '/images/products/g2.png',
    ],
    sizes: SIZES,
    colors: [
      { name: 'White Stripe', hex: '#F8FAFC' },
      { name: 'Sky Blue', hex: '#7DD3FC' },
      { name: 'Navy', hex: '#1E3A5F' },
    ],
    stock: 50,
    isNewArrival: false,
    isTopSelling: true,
  },
  {
    name: 'Courage Graphic T-shirt',
    category: 't-shirts',
    dressStyle: 'party',
    description:
      'Bold graphic tee that makes a statement. Soft hand-feel print on premium cotton for nights out and weekends.',
    price: 145,
    oldPrice: null,
    discount: null,
    rating: 4.0,
    images: [
      '/images/products/courage-graphic-tshirt.png',
      '/images/products/g2.png',
      '/images/products/g3.png',
    ],
    sizes: SIZES,
    colors: [
      { name: 'Orange', hex: '#EA580C' },
      { name: 'Black', hex: '#000000' },
      { name: 'White', hex: '#FFFFFF' },
    ],
    stock: 50,
    isNewArrival: false,
    isTopSelling: true,
  },
  {
    name: 'Loose Fit Bermuda Shorts',
    category: 'shorts',
    dressStyle: 'gym',
    description:
      'Loose fit Bermuda shorts built for movement. Moisture-wicking fabric with a secure waistband for workouts.',
    price: 80,
    oldPrice: null,
    discount: null,
    rating: 3.0,
    images: [
      '/images/products/loose-fit-bermuda-shorts.png',
      '/images/products/g1.png',
      '/images/products/g2.png',
    ],
    sizes: SIZES,
    colors: [
      { name: 'Khaki', hex: '#C3B091' },
      { name: 'Black', hex: '#1F2937' },
      { name: 'Olive', hex: '#3F3826' },
    ],
    stock: 50,
    isNewArrival: false,
    isTopSelling: true,
  },
  {
    name: 'Faded Skinny Jeans',
    category: 'jeans',
    dressStyle: 'casual',
    description:
      'Faded wash skinny jeans with a lived-in look. Stretch denim keeps them comfortable from day to night.',
    price: 210,
    oldPrice: null,
    discount: null,
    rating: 4.5,
    images: [
      '/images/products/faded-skinny-jeans.png',
      '/images/products/g2.png',
      '/images/products/g3.png',
    ],
    sizes: SIZES,
    colors: [
      { name: 'Faded Blue', hex: '#6B8CAE' },
      { name: 'Black', hex: '#111827' },
    ],
    stock: 50,
    isNewArrival: false,
    isTopSelling: true,
  },
  {
    name: 'Gradient Graphic T-shirt',
    category: 't-shirts',
    dressStyle: 'casual',
    description:
      'Eye-catching gradient graphic tee in soft cotton. A standout casual piece for everyday style.',
    price: 145,
    oldPrice: null,
    discount: null,
    rating: 3.5,
    images: [
      '/images/products/gradient-graphic-tshirt.png',
      '/images/products/g1.png',
      '/images/products/g3.png',
    ],
    sizes: SIZES,
    colors: defaultColors,
    stock: 50,
    isNewArrival: false,
    isTopSelling: false,
  },
  {
    name: 'One Life Graphic T-shirt',
    category: 't-shirts',
    dressStyle: 'casual',
    description:
      'This graphic t-shirt is perfect for any occasion. Crafted from a soft and breathable fabric, it offers superior comfort and style.',
    price: 260,
    oldPrice: 300,
    discount: 40,
    rating: 4.5,
    images: [
      '/images/products/g1.png',
      '/images/products/g2.png',
      '/images/products/g3.png',
    ],
    sizes: SIZES,
    colors: [
      { name: 'Olive', hex: '#3F3826' },
      { name: 'Green', hex: '#2B4A3E' },
      { name: 'Navy', hex: '#31344B' },
    ],
    stock: 50,
    isNewArrival: false,
    isTopSelling: false,
  },
  {
    name: 'Formal Checkered Oxford',
    category: 'shirts',
    dressStyle: 'formal',
    description:
      'Refined checkered oxford shirt suited for the office or formal events. Crisp collar and tailored silhouette.',
    price: 195,
    oldPrice: null,
    discount: null,
    rating: 4.2,
    images: [
      '/images/products/checkered-shirt.png',
      '/images/products/g1.png',
      '/images/products/g2.png',
    ],
    sizes: SIZES,
    colors: [
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Light Blue', hex: '#BFDBFE' },
      { name: 'Grey', hex: '#9CA3AF' },
    ],
    stock: 50,
    isNewArrival: false,
    isTopSelling: false,
  },
  {
    name: 'Party Stripe Tee',
    category: 't-shirts',
    dressStyle: 'party',
    description:
      'Vibrant striped tee designed for nights out. Soft stretch cotton with a flattering modern cut.',
    price: 135,
    oldPrice: 150,
    discount: 10,
    rating: 4.1,
    images: [
      '/images/products/sleeve-striped-shirt.png',
      '/images/products/g2.png',
      '/images/products/g3.png',
    ],
    sizes: SIZES,
    colors: [
      { name: 'Black', hex: '#000000' },
      { name: 'Red', hex: '#DC2626' },
      { name: 'White', hex: '#FFFFFF' },
    ],
    stock: 50,
    isNewArrival: true,
    isTopSelling: false,
  },
  {
    name: 'Gym Performance Shorts',
    category: 'shorts',
    dressStyle: 'gym',
    description:
      'Lightweight performance shorts for training sessions. Quick-dry fabric and flexible fit for maximum mobility.',
    price: 90,
    oldPrice: null,
    discount: null,
    rating: 4.0,
    images: [
      '/images/products/loose-fit-bermuda-shorts.png',
      '/images/products/g1.png',
      '/images/products/g3.png',
    ],
    sizes: SIZES,
    colors: [
      { name: 'Black', hex: '#0F172A' },
      { name: 'Charcoal', hex: '#374151' },
      { name: 'Navy', hex: '#1E3A5F' },
    ],
    stock: 50,
    isNewArrival: false,
    isTopSelling: false,
  },
  {
    name: 'Classic Hoodie',
    category: 'hoodie',
    dressStyle: 'casual',
    description:
      'Cozy classic hoodie with a soft fleece interior. Everyday comfort with a clean minimal design.',
    price: 220,
    oldPrice: 250,
    discount: 12,
    rating: 4.3,
    images: [
      '/images/products/courage-graphic-tshirt.png',
      '/images/products/g1.png',
      '/images/products/g2.png',
    ],
    sizes: SIZES,
    colors: [
      { name: 'Heather Grey', hex: '#9CA3AF' },
      { name: 'Black', hex: '#111827' },
      { name: 'Navy', hex: '#31344B' },
    ],
    stock: 50,
    isNewArrival: true,
    isTopSelling: false,
  },
  {
    name: 'Formal Navy Slim Shirt',
    category: 'shirts',
    dressStyle: 'formal',
    description:
      'Slim-fit navy shirt for formal occasions. Smooth fabric with subtle structure for a sharp appearance.',
    price: 205,
    oldPrice: null,
    discount: null,
    rating: 4.6,
    images: [
      '/images/products/vertical-striped-shirt.png',
      '/images/products/g3.png',
      '/images/products/g1.png',
    ],
    sizes: SIZES,
    colors: [
      { name: 'Navy', hex: '#1E3A5F' },
      { name: 'White', hex: '#FFFFFF' },
      { name: 'Charcoal', hex: '#374151' },
    ],
    stock: 50,
    isNewArrival: false,
    isTopSelling: true,
  },
];

const seed = async () => {
  try {
    await connectDB();
    await Product.deleteMany({});
    const created = await Product.insertMany(products);
    console.log(`Seeded ${created.length} products`);
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Seed failed:', error.message);
    process.exit(1);
  }
};

seed();
