import mongoose from "mongoose";

export default async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log(`Connected to MongoDB at ${mongoose.connection.host}`);
  } catch (error) {
    await mongoose.disconnect();
    console.error(error);
    process.exit(1);
  }
};
