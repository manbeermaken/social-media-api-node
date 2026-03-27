import mongoose from "mongoose";

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.DATABASE_URL)
        console.log("Connected to MongoDB")
    }catch (e) {
        console.error(e)
        process.exit(1)
    }
}

export default connectDB