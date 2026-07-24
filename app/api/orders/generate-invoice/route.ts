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
    const { orderId } = body;

    if (!orderId || !mongoose.Types.ObjectId.isValid(orderId)) {
      return NextResponse.json({ error: "Invalid order ID" }, { status: 400 });
    }

    await connectDB();

    const order = await Order.findById(orderId)
      .populate("species_id", "name")
      .populate("customer_id", "name phone farm_name address");

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const settings = await Settings.findById("default");

    // Create PDF
    const doc = new jsPDF();
    let yPos = 15;

    // Header with office info
    doc.setFontSize(14);
    doc.setFont("helvetica", "bold");
    doc.text(settings?.office_name || "DNA Lab", 20, yPos);
    yPos += 8;

    doc.setFontSize(9);
    doc.setFont("helvetica", "normal");
    if (settings?.office_address) {
      doc.text(`Address: ${settings.office_address}`, 20, yPos);
      yPos += 5;
    }
    if (settings?.office_phone) {
      doc.text(`Phone: ${settings.office_phone}`, 20, yPos);
      yPos += 5;
    }
    if (settings?.office_email) {
      doc.text(`Email: ${settings.office_email}`, 20, yPos);
      yPos += 5;
    }

    yPos += 5;

    // Invoice title
    doc.setFontSize(12);
    doc.setFont("helvetica", "bold");
    doc.text("DNA ORDER INVOICE", 20, yPos);
    yPos += 10;

    // Order details
    doc.setFontSize(10);
    doc.setFont("helvetica", "bold");
    doc.text("Order Information", 20, yPos);
    yPos += 7;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`DNA ID: ${order.dna_id}`, 20, yPos);
    yPos += 5;
    doc.text(
      `Order Date: ${new Date(order.entry_date).toLocaleDateString()}`,
      20,
      yPos
    );
    yPos += 5;
    doc.text(`Order Name: ${order.name}`, 20, yPos);
    yPos += 5;
    doc.text(`Status: ${order.status.toUpperCase()}`, 20, yPos);
    yPos += 5;
    doc.text(`Sex: ${order.sex}`, 20, yPos);
    yPos += 7;

    // Species information
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Species Information", 20, yPos);
    yPos += 7;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.text(`Species: ${order.species_id?.name || "N/A"}`, 20, yPos);
    yPos += 7;

    // Customer information
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.text("Customer Information", 20, yPos);
    yPos += 7;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    const customer = order.customer_id;
    doc.text(`Name: ${customer?.name || "N/A"}`, 20, yPos);
    yPos += 5;
    doc.text(`Phone: ${customer?.phone || "N/A"}`, 20, yPos);
    yPos += 5;
    doc.text(`Farm Name: ${customer?.farm_name || "N/A"}`, 20, yPos);
    yPos += 5;
    doc.text(`Address: ${customer?.address || "N/A"}`, 20, yPos);
    yPos += 7;

    // Notes
    if (order.notes) {
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.text("Notes", 20, yPos);
      yPos += 7;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      const noteLines = doc.splitTextToSize(order.notes, 170);
      doc.text(noteLines, 20, yPos);
      yPos += (noteLines as string[]).length * 5 + 5;
    }

    // Footer
    yPos = 270;
    doc.setFontSize(8);
    doc.text(
      `Generated: ${new Date().toLocaleString()}`,
      20,
      yPos
    );

    const pdfBuffer = doc.output("arraybuffer");

    return new NextResponse(Buffer.from(pdfBuffer), {
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="invoice-${order.dna_id}.pdf"`,
      },
    });
  } catch (error) {
    console.error("Invoice generation error:", error);
    return NextResponse.json(
      { error: "Failed to generate invoice" },
      { status: 500 }
    );
  }
}
