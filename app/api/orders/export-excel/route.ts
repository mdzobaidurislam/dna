import { connectDB } from "@/lib/db";
import Order from "@/lib/models/Order";
import { NextRequest, NextResponse } from "next/server";

// auth config
import * as XLSX from "xlsx";
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

    // Prepare data for Excel
    const excelData = orders.map((order) => ({
      "DNA ID": order.dna_id,
      Name: order.name,
      Species: order.species_id?.name || "N/A",
      Customer: order.customer_id?.name || "N/A",
      Phone: order.customer_id?.phone || "",
      "Farm Name": order.customer_id?.farm_name || "",
      Address: order.customer_id?.address || "",
      "Entry Date": new Date(order.entry_date).toLocaleDateString(),
      Status: order.status,
      Sex: order.sex,
      Notes: order.notes || "",
      "Created At": new Date(order.createdAt).toLocaleString(),
    }));

    // Create workbook
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Orders");

    // Set column widths
    const columnWidths = [
      { wch: 12 }, // DNA ID
      { wch: 20 }, // Name
      { wch: 15 }, // Species
      { wch: 18 }, // Customer
      { wch: 15 }, // Phone
      { wch: 15 }, // Farm Name
      { wch: 20 }, // Address
      { wch: 15 }, // Entry Date
      { wch: 12 }, // Status
      { wch: 10 }, // Sex
      { wch: 20 }, // Notes
      { wch: 18 }, // Created At
    ];
    ws["!cols"] = columnWidths;

    // Generate Excel file
    const excelBuffer = XLSX.write(wb, { bookType: "xlsx", type: "buffer" });

    return new NextResponse(excelBuffer, {
      headers: {
        "Content-Type":
          "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "Content-Disposition": `attachment; filename="orders-${Date.now()}.xlsx"`,
      },
    });
  } catch (error) {
    console.error("Excel export error:", error);
    return NextResponse.json(
      { error: "Failed to generate Excel file" },
      { status: 500 }
    );
  }
}
