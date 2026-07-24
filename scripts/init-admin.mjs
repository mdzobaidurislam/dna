#!/usr/bin/env node

import mongoose from "mongoose";
import bcryptjs from "bcryptjs";
import readline from "readline";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const question = (query) =>
  new Promise((resolve) => rl.question(query, resolve));

async function initAdmin() {
  try {
    const mongoUri = 'mongodb+srv://dna:dna@cluster0.1wbmx.mongodb.net/dna?retryWrites=true&w=majority&appName=Cluster0';
    if (!mongoUri) {
      console.error(
        "Error: MONGODB_CONNECTION_STRING environment variable is not set."
      );
      console.error("Please set it in .env.local before running this script.");
      process.exit(1);
    }

    await mongoose.connect(mongoUri);
    console.log("✓ Connected to MongoDB");

    const UserSchema = new mongoose.Schema({
      email: String,
      password: String,
      name: String,
      createdAt: { type: Date, default: Date.now },
      updatedAt: { type: Date, default: Date.now },
    });

    const User =
      mongoose.models.User || mongoose.model("User", UserSchema);

    // Check if admin already exists
    const existingAdmin = await User.findOne({
      email: "admin@example.com",
    });

    if (existingAdmin) {
      console.log("✓ Admin user already exists");
      process.exit(0);
    }

    // Create initial admin
    const name = await question(
      "Enter admin name (default: Admin): "
    );
    const email = await question(
      "Enter admin email (default: admin@example.com): "
    );
    const password = await question("Enter admin password: ");

    const hashedPassword = await bcryptjs.hash(password, 10);

    const admin = new User({
      name: name || "Admin",
      email: email || "admin@example.com",
      password: hashedPassword,
    });

    await admin.save();
    console.log("✓ Admin user created successfully!");
    console.log(`Email: ${admin.email}`);
    console.log(`Name: ${admin.name}`);

    // Initialize settings
    const SettingsSchema = new mongoose.Schema({
      _id: String,
      office_name: String,
      office_address: String,
      office_phone: String,
      office_email: String,
      logo_url: String,
      updatedAt: Date,
    });

    const Settings =
      mongoose.models.Settings ||
      mongoose.model("Settings", SettingsSchema);

    const existingSettings = await Settings.findById("default");
    if (!existingSettings) {
      await Settings.create({
        _id: "default",
        office_name: "DNA Lab",
        office_address: "",
        office_phone: "",
        office_email: "",
        logo_url: "/placeholder-logo.png",
      });
      console.log("✓ Default settings initialized");
    }

    console.log("\n✓ Setup completed successfully!");
    console.log("You can now login with your credentials.");
  } catch (error) {
    console.error("Error during setup:", error);
    process.exit(1);
  } finally {
    rl.close();
    await mongoose.connection.close();
  }
}

initAdmin();
