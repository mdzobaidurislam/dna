import mongoose from "mongoose";

const MONGODB_CONNECTION_STRING: string = process.env.MONGODB_CONNECTION_STRING || "";

if (!MONGODB_CONNECTION_STRING) {
  throw new Error(
    "Please define the MONGODB_CONNECTION_STRING environment variable inside .env.local"
  );
}

// Ensure the database name is 'dna'
const MONGODB_URI = MONGODB_CONNECTION_STRING.includes("?") 
  ? `${MONGODB_CONNECTION_STRING}&authSource=admin` 
  : `${MONGODB_CONNECTION_STRING}?authSource=admin`;

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

export async function connectDB() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    cached.promise = mongoose
      .connect(MONGODB_URI, opts)
      .then((mongoose) => {
        return mongoose;
      });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

declare global {
  var mongoose: any;
}
