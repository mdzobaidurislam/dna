import { connectDB } from "@/lib/db";
import Order from "@/lib/models/Order";
import { orderSchema } from "@/lib/utils/validators";
import { getNextDnaId } from "@/lib/utils/counter";
import { NextRequest, NextResponse } from "next/server";

// auth config
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status");
    const customer_id = searchParams.get("customer_id");
    const species_id = searchParams.get("species_id");
    const startDate = searchParams.get("startDate");
    const endDate = searchParams.get("endDate");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");

    let query: any = {};

    if (status && status !== "all") {
      query.status = status;
    }

    if (customer_id && mongoose.Types.ObjectId.isValid(customer_id)) {
      query.customer_id = new mongoose.Types.ObjectId(customer_id);
    }

    if (species_id && mongoose.Types.ObjectId.isValid(species_id)) {
      query.species_id = new mongoose.Types.ObjectId(species_id);
    }

    if (startDate || endDate) {
      query.entry_date = {};
      if (startDate) {
        query.entry_date.$gte = new Date(startDate);
      }
      if (endDate) {
        const end = new Date(endDate);
        end.setHours(23, 59, 59, 999);
        query.entry_date.$lte = end;
      }
    }

    const skip = (page - 1) * limit;
    const orders = await Order.find(query)
      .populate("species_id", "name")
      .populate("customer_id", "name phone farm_name")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Order.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      success: true,
      data: orders,
      pagination: {
        page,
        limit,
        total,
        totalPages,
      },
    });
  } catch (error) {
    console.error("Error fetching orders:", error);
    return NextResponse.json(
      { error: "Failed to fetch orders" },
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
    const validated = orderSchema.parse(body);
    console.log(validated);
    console.log(body);

    await connectDB();

    // Get next DNA ID
    const dna_id = await getNextDnaId();

    const order = new Order({
      ...validated,
      dna_id,
        entry_date: new Date(validated.entry_date),
          delivery_date: validated.delivery_date
            ? new Date(validated.delivery_date)
            : null,
        });
  
    

    await order.save();

    // Populate references
    await order.populate("species_id", "name");
    await order.populate("customer_id", "name phone farm_name");

    return NextResponse.json(
      {
        success: true,
        data: order,
        message: "Order created successfully",
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
    console.error("Error creating order:", error);
    return NextResponse.json(
      { error: "Failed to create order" },
      { status: 500 }
    );
  }
}
