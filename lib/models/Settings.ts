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
    whatsapp_number: {
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
    signature_url: {
      type: String,
      default: "",
    },
    doctor_name: {
      type: String,
      default: "",
    },
    doctor_designation: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

// In dev, Next.js hot-reloads route files but the mongoose model registry
// is a singleton that persists across reloads. If the schema is edited
// (fields added/removed) after the model was already compiled once,
// `mongoose.models.Settings` still points to the OLD schema and new
// fields get silently stripped on save/update.
//
// Deleting the cached model in development forces it to recompile with
// the latest schema on every reload. In production this file is only
// ever required once per process, so it has no real cost there.
if (process.env.NODE_ENV !== "production" && mongoose.models.Settings) {
  delete mongoose.models.Settings;
}

export default mongoose.models.Settings ||
  mongoose.model("Settings", SettingsSchema);