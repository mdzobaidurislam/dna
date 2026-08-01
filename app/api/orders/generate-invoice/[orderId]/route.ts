import { connectDB } from "@/lib/db";
import Order from "@/lib/models/Order";
import Settings from "@/lib/models/Settings";
import { NextRequest, NextResponse } from "next/server";

import { jsPDF } from "jspdf";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { drawCertificate, loadPublicImageAsBase64, PAGE_H, PAGE_W } from "@/lib/pdf/certificatePdf";



export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ orderId: string }> }
) {
  try {
    // const session = await getServerSession(authOptions);
    // if (!session) {
    //   return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    // }

    const { orderId } = await params;
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
        const signatureBase64 = loadPublicImageAsBase64(settings?.signature_url);
        const logo_url = loadPublicImageAsBase64(settings?.logo_url);
        const doc = new jsPDF({
          orientation: "landscape",
          unit: "mm",
          format: [PAGE_W, PAGE_H],
        });
    
        for (let i = 0; i < orders.length; i++) {
          if (i > 0) doc.addPage([PAGE_W, PAGE_H], "landscape");
          await drawCertificate(doc, orders[i], settings, req, signatureBase64,logo_url);
        }

    const pdfBuffer = doc.output("arraybuffer");

    return new NextResponse(Buffer.from(pdfBuffer), {
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