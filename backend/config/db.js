const mongoose = require('mongoose');
const autoSeed = require('./autoSeed');

global.useMockDb = false;

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI environment variable is not defined.');
    }
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    global.useMockDb = false;
    await autoSeed();
  } catch (error) {
    if (process.env.NODE_ENV === 'production') {
      console.error('FATAL ERROR: Failed to connect to MongoDB Atlas in production mode.');
      console.error(error.message);
      process.exit(1); // Exit process to signal failure in production
    } else {
      console.log('\n================================================================');
      console.log('DATABASE CONNECTED: Running in Mock JSON Database Mode (Local Storage)');
      console.log('Location: backend/config/.mockdb/');
      console.log('All local features (Auth, CRUD, Inquiry forms) are active and functional.');
      console.log('================================================================\n');
      global.useMockDb = true;
      await autoSeed();
    }
  }
};

module.exports = connectDB;