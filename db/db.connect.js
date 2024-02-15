import mongoose from "mongoose";

const dbConnect = async () => {
  try {
    const conn = await mongoose.connect(process.env.DB_URL)
    // const collections = await conn.connection.db.listCollections().toArray();
    console.log(`MongoDB Connected to: ${conn.connection.host}`);  
    // return collections.map(collection => collection.name);
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
}

export default dbConnect;