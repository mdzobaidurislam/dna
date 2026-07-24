import { connectDB } from "@/lib/db";
import Settings from "@/lib/models/Settings";
import { settingsSchema } from "@/lib/utils/validators";
import { NextRequest, NextResponse } from "next/server";

import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
// auth config

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    await connectDB();
    let settings = await Settings.findById("default");
    if (!settings) {
      settings = new Settings({ _id: "default" });
      await settings.save();
    }

    return NextResponse.json({
      success: true,
      data: settings,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch settings"},
      { status: 500 }
    );
  }
}

export async function PUT(req: NextRequest) {
  try {
     const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validated = settingsSchema.parse(body);

    await connectDB();

    let settings = await Settings.findByIdAndUpdate("default", validated, {
      new: true,
      upsert: true,
      runValidators: true,
    });

    return NextResponse.json({
      success: true,
      data: settings,
      message: "Settings updated successfully",
    });
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to update settings" },
      { status: 500 }
    );
  }
}
