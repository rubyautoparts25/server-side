const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);

        console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.error(`❌ Error connecting to MongoDB: ${error.message}`);
        console.error(`\n💡 Fix: Whitelist your IP in MongoDB Atlas`);
        console.error(`   1. Go to: https://cloud.mongodb.com/`);
        console.error(`   2. Click "Network Access" → "Add IP Address"`);
        console.error(`   3. Enter: 0.0.0.0/0 (allows all IPs for development)`);
        console.error(`   4. Click "Confirm" and wait 1-2 minutes\n`);
        process.exit(1);
    }
};

module.exports = connectDB;

