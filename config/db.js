const mongoose = require("mongoose");

if (process.env.NODE_ENV !== 'productions') {
    require('dotenv').config();
}

const connectDB = async () => {

    try {

        const conn = await mongoose.connect(process.env.MONGO_LOCAL);

        console.log(`MongoDB connected: ${conn.connection.host}`);
    }
    catch (error) {

        console.log(`Error: ${error.message}`);
        // process code 1 means exit with failure, 0 means success
        process.exit(1);
    }

}
const connectMySql = async () => {

    // Create a pool of connections
    const pool = await mysql.createPool({
        host: 'localhost',
        user: 'root',
        password: '1234567890',
        database: 'eLerningPlatform',
        port: 3306,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });

    return pool;
}


module.exports = {
    connectDB
}