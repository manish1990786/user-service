const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('User Service MongoDB Connected...');
  } catch (err) {
    console.error('Database connection error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;