import mongoose from "mongoose";

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URL);
    console.log("db is connected");
    console.log(`Mongodb connected: ${conn.connection.host}`);
  } catch (e) {
    console.log("Error while connecting DB", e.message);
    process.exit(1);
  }
};

  