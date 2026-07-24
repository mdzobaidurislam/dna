import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: "default",
    },
    office_name: {
      type: String,
      default: "DNA Lab",
    },
    office_address: {
      type: String,
      default: "",
    },
    office_phone: {
      type: String,
      default: "",
    },
    office_email: {
      type: String,
      default: "",
    },
    logo_url: {
      type: String,
      default: "/placeholder-logo.png",
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Settings ||
  mongoose.model("Settings", SettingsSchema);
