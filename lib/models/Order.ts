import mongoose from "mongoose";

const OrderSchema = new mongoose.Schema(
  {
    dna_id: {
      type: Number,
      unique: true,
      required: true,
    },
    name: {
      type: String,
      required: [true, "Please provide order name"],
    },
    species_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Species",
      required: [true, "Please select a species"],
    },
    customer_id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: [true, "Please select a customer"],
    },
    entry_date: {
      type: Date,
      required: [true, "Please provide entry date"],
    },
    delivery_date: {
      type: Date,
      required: false,
    },
    status: {
      type: String,
      enum: ["pending", "processing", "completed", "rejected"],
      default: "pending",
    },
    sex: {
      type: String,
      enum: ["male", "female", "unknown"],
      default: "unknown",
    },
    notes: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
