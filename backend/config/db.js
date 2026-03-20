import mongoose from "mongoose"

export const connectDB = async() => {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("Mongodb conntected succfully.");
    } catch (error) {
        console.log("Error from DataBase connection", error);
    }
}