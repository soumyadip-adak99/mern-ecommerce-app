import mongoose from "mongoose";
import { DB_NAME } from "../utils/constance.js";

export default async function connectDB() {
    try {
        const connectionInstance = await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`);
        console.log(`\MongoDB connected: ${connectionInstance.connection.host}`);
    } catch (error) {
        console.log(`Mongodb connection failed.`);
        process.exit();
    }
}
