import mongoose from "mongoose";

const SpeciesSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please provide species name"],
      unique: true,
      minlength: 2,
      maxlength: 100,
    },
    description: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Species ||
  mongoose.model("Species", SpeciesSchema);
