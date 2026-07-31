import { connectDB } from "@/lib/db";
import Order from "@/lib/models/Order";
import Settings from "@/lib/models/Settings";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { generateCertificatePdf } from "@/lib/pdf/certificate";

// Public route — intentionally NOT behind getServerSession, since this is what
// the printed certificate's QR code links to. Anyone who scans it (no login)
// should get the PDF straight away.
export async function GET(
  req: NextRequest,
  { params }: { params: { dna_id: string } }
) {
  try {
    const { dna_id } = params;
    if (!dna_id) {
      return NextResponse.json({ error: "Missing DNA ID" }, { status: 400 });
    }

    await connectDB();

    // Try matching by dna_id first; fall back to _id if a valid ObjectId was passed.
    const query: any = mongoose.isValidObjectId(dna_id)
      ? { $or: [{ dna_id }, { _id: new mongoose.Types.ObjectId(dna_id) }] }
      : { dna_id };

    const order = await Order.findOne(query)
      .populate("species_id", "name")
      .populate("customer_id", "name phone farm_name address");

    if (!order) {
      return NextResponse.json({ error: "Report not found" }, { status: 404 });
    }

    const settings = await Settings.findById("default");
    const pdfBuffer = await generateCertificatePdf([order], settings);

    return new NextResponse(pdfBuffer, {
      headers: {
        "Content-Type": "application/pdf",
        // "inline" opens it in the browser tab first (nicer on mobile after a QR
        // scan); switch to "attachment" if you want it to force-download instead.
        "Content-Disposition": `inline; filename="dna-sexing-report-${order.dna_id || order._id}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Verify/download PDF error:", error);
    return NextResponse.json(
      { error: "Failed to generate PDF" },
      { status: 500 }
    );
  }
}