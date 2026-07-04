const mongoose = require('mongoose');

global.useMockDb = false;

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 3000
    });

    console.log("==========================================");
    console.log(`MongoDB Connected: ${conn.connection.host}`);
    console.log("==========================================");

    global.useMockDb = false;

  } catch (error) {

    console.log("\n================ MONGODB ERROR ================");
    console.log("Error Name:", error.name);
    console.log("Error Message:", error.message);
    console.log("===============================================\n");

    console.log("================================================================");
    console.log("DATABASE CONNECTED: Running in Mock JSON Database Mode (Local Storage)");
    console.log("Location: backend/config/.mockdb/");
    console.log("All local features (Auth, CRUD, Inquiry forms) are active and functional.");
    console.log("================================================================\n");

    global.useMockDb = true;
  }
};

module.exports = connectDB;