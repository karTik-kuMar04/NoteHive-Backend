import mongoose from "mongoose";
import { DB_NAME } from "../constant";


const connectDB = async (): Promise<void> => {
    try {

        if (!process.env.MONGODB_URI) {
            throw new Error("MongoDB_URI is not defined in .env file")
        }
        const conn = await mongoose.connect( `${process.env.MONGODB_URI}/${DB_NAME}` )
        console.log(`MongoDB connected ${conn.connection.host}`)
    } catch (err) {
        console.error(" MongoDB connection error:", err);
        process.exit(1);
    }
}

export default connectDB