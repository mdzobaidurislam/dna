// scripts/migrate-orders.ts — একবার চালিয়ে delete করে দিন
import { connectDB } from "@/lib/db";
import Order from "@/lib/models/Order";

async function migrate() {
  await connectDB();
  const result = await Order.updateMany(
    { isDeleted: { $exists: false } },
    { $set: { isDeleted: false, deletedAt: null } }
  );
  console.log(`Updated ${result.modifiedCount} orders`);
  process.exit(0);
}

migrate();