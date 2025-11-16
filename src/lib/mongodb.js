import mongoose from "mongoose";

const MONGODB_URI = process.env.MONGODB_URI;

if (!MONGODB_URI) {
    throw new Error("Check the .env if MONGODB_URI is definned!");
}

let isConnected = false;

export const connectDB = async() => {
    if (isConnected) return;
    try {
        await mongoose.connect(MONGODB_URI);
        isConnected = true;
        console.log("DB connected successfully");
    } catch (error) {
        console.error("Error:", error);
    }
};