import { connectDB } from "@/lib/db";
import Order from "@/lib/models/Order";
import Settings from "@/lib/models/Settings";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { generateCertificatePdf } from "@/lib/pdf/certificate";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { orderId } = body;
    let orderIds = [orderId];
    if (!orderIds || !Array.isArray(orderIds) || orderIds.length === 0) {
      return NextResponse.json(
        { error: "No orders selected" },
        { status: 400 }
      );
    }

    await connectDB();

    const orders = await Order.find({
      _id: { $in: orderIds.map((id) => new mongoose.Types.ObjectId(id)) },
    })
      .populate("species_id", "name")
      .populate("customer_id", "name phone farm_name address");

    const settings = await Settings.findById("default");

    const pdfBuffer = await generateCertificatePdf(orders, settings);

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="dna-sexing-report-${Date.now()}.pdf"`,
      },
    });
  } catch (error) {
    console.error("PDF export error:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}