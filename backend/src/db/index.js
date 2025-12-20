import mongoose from "mongoose";

const dbname = process.env.DB_NAME;

export default async function connectDB() {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${dbname}`);
        console.log(`\MongoDB connected: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log(`Mongodb connection failed.`);
        process.exit();
    }
}
