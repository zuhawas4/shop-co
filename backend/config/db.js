const mongoose = require('mongoose');

/**
 * Connect to MongoDB.
 * Caches the connection so serverless (Vercel) cold starts reuse it.
 */
let cached = global.__shopco_mongoose;
if (!cached) {
  cached = global.__shopco_mongoose = { conn: null, promise: null };
}

const connectDB = async () => {
  const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/shopco';

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    cached.promise = mongoose.connect(uri).then((mongooseInstance) => {
      console.log('MongoDB connected');
      return mongooseInstance;
    });
  }

  cached.conn = await cached.promise;
  return cached.conn;
};

module.exports = connectDB;
