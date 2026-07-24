import { connectDB } from "@/lib/db";
import Order from "@/lib/models/Order";
import Settings from "@/lib/models/Settings";
import { NextRequest, NextResponse } from "next/server";

// auth config
import { jsPDF } from "jspdf";
import mongoose from "mongoose";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();
    const { orderIds } = body;

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

    // Create PDF
    const doc = new jsPDF();
    let yPos = 20;

    // Header
    doc.setFontSize(16);
    doc.text("DNA Lab Report", 20, yPos);
    yPos += 10;

    if (settings) {
      doc.setFontSize(10);
      doc.text(`${settings.office_name}`, 20, yPos);
      yPos += 5;
      doc.text(`${settings.office_address}`, 20, yPos);
      yPos += 5;
      doc.text(`Phone: ${settings.office_phone}`, 20, yPos);
      yPos += 10;
    }

    // Orders table
    doc.setFontSize(10);
    const tableData = orders.map((order) => [
      order.dna_id.toString(),
      order.name,
      order.species_id?.name || "N/A",
      order.customer_id?.name || "N/A",
      new Date(order.entry_date).toLocaleDateString(),
      order.status,
      order.sex,
    ]);

    // Simple table rendering
    const headers = ["DNA ID", "Name", "Species", "Customer", "Date", "Status", "Sex"];
    const columnWidths = [15, 25, 20, 25, 20, 20, 15];
    let x = 20;

    doc.setFontSize(9);
    doc.setFont("helvetica", "bold");

    // Headers
    headers.forEach((header, i) => {
      doc.text(header, x, yPos);
      x += columnWidths[i];
    });

    yPos += 7;
    doc.setFont("helvetica", "normal");

    // Rows
    tableData.forEach((row) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }
      x = 20;
      row.forEach((cell, i) => {
        doc.text(String(cell), x, yPos);
        x += columnWidths[i];
      });
      yPos += 7;
    });

    const pdfBuffer = doc.output("arraybuffer");

    return new NextResponse(Buffer.from(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="orders-report-${Date.now()}.pdf"`,
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
