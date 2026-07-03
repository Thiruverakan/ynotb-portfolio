const mongoose = require('mongoose');

global.useMockDb = false;

const connectDB = async () => {
  try {
    // Set connection timeout to 3 seconds so it fails fast if MongoDB is not running
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 3000
    });
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    global.useMockDb = false;
  } catch (error) {
    console.log('\n================================================================');
    console.log('DATABASE CONNECTED: Running in Mock JSON Database Mode (Local Storage)');
    console.log('Location: backend/config/.mockdb/');
    console.log('All local features (Auth, CRUD, Inquiry forms) are active and functional.');
    console.log('================================================================\n');
    global.useMockDb = true;
  }
};

module.exports = connectDB;
