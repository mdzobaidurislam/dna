import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide customer name"],
      minlength: 2,
    },
    phone: {
      type: String,
      default: "",
    },
    address: {
      type: String,
      default: "",
    },
    farm_name: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);
if (process.env.NODE_ENV !== "production" && mongoose.models.Customer) {
  delete mongoose.models.Customer;
}
export default mongoose.models.Customer ||
  mongoose.model("Customer", CustomerSchema);
