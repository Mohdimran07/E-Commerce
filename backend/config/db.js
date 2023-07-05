import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONG_URI);
    console.log(`MongoDB connected at: ${conn.connection.host}`.cyan.underline);
  } catch (error) {
    console.log(`Error at DB: ${error.message}`);
    process.exit(1);
  }
};

export default connectDB;
