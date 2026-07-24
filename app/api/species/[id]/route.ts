import { connectDB } from "@/lib/db";
import Species from "@/lib/models/Species";
import { speciesSchema } from "@/lib/utils/validators";
import { NextRequest, NextResponse } from "next/server";

// auth config
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const species = await Species.findById(id);
    if (!species) {
      return NextResponse.json(
        { error: "Species not found" },
        { status: 404 }
      );
    }

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

export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const body = await req.json();
    const validated = speciesSchema.parse(body);

    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const species = await Species.findByIdAndUpdate(id, validated, {
      new: true,
      runValidators: true,
    });

    if (!species) {
      return NextResponse.json(
        { error: "Species not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: species,
      message: "Species updated successfully",
    });
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
      { error: "Failed to update species" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    await connectDB();

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
    }

    const species = await Species.findByIdAndDelete(id);

    if (!species) {
      return NextResponse.json(
        { error: "Species not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Species deleted successfully",
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete species" },
      { status: 500 }
    );
  }
}
