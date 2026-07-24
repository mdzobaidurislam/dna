import { connectDB } from "@/lib/db";
import Species from "@/lib/models/Species";
import { speciesSchema } from "@/lib/utils/validators";
import { NextRequest, NextResponse } from "next/server";

import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const species = await Species.find().sort({ createdAt: -1 });

    return NextResponse.json({
      success: true,
      data: species,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch species" },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const validated = speciesSchema.parse(body);

    await connectDB();

    const species = new Species(validated);
    await species.save();

    return NextResponse.json(
      {
        success: true,
        data: species,
        message: "Species created successfully",
      },
      { status: 201 }
    );
  } catch (error: any) {
    if (error.name === "ZodError") {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    if (error.code === 11000) {
      return NextResponse.json(
        { error: "Species name already exists" },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create species" },
      { status: 500 }
    );
  }
}
