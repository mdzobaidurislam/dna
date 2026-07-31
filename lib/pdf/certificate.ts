import { jsPDF } from "jspdf";
import QRCode from "qrcode";
import fs from "fs";
import path from "path";

// ---------- Theme colors (matched to VetGene certificate design) ----------
export type RGB = [number, number, number];
const NAVY: RGB = [13, 27, 61];
const TEAL: RGB = [14, 122, 121];
const TEAL_LIGHT: RGB = [95, 191, 187];
const GRAY_TEXT: RGB = [90, 100, 110];
const DARK_TEXT: RGB = [20, 30, 45];
const PINK: RGB = [214, 51, 132];
const PAGE_W = 280; // mm
const PAGE_H = 190; // mm

function setFill(doc: jsPDF, c: RGB) {
  doc.setFillColor(c[0], c[1], c[2]);
}
function setDraw(doc: jsPDF, c: RGB) {
  doc.setDrawColor(c[0], c[1], c[2]);
}
function setText(doc: jsPDF, c: RGB) {
  doc.setTextColor(c[0], c[1], c[2]);
}

// ---------- Logo image (real asset, replaces hand-drawn VG + text) ----------
// Put the logo file at: /public/vetgene-logo.png
const LOGO_ASPECT_RATIO = 598 / 197; // width / height of vetgene-logo.png

let cachedLogoBase64: string | null = null;
function getLogoBase64(): string | null {
  if (cachedLogoBase64) return cachedLogoBase64;
  try {
    const logoPath = path.join(process.cwd(), "public", "vetgene-logo.png");
    const buf = fs.readFileSync(logoPath);
    cachedLogoBase64 = `data:image/png;base64,${buf.toString("base64")}`;
    return cachedLogoBase64;
  } catch (err) {
    console.error("Logo image not found at /public/vetgene-logo.png:", err);
    return null;
  }
}

type IconType =
  | "dna"
  | "bird"
  | "leaf"
  | "person"
  | "house"
  | "clipboard"
  | "calendar"
  | "document";

function drawDnaHelix(doc: jsPDF, cx: number, cy: number, size: number, color: RGB = TEAL) {
  const s = size;
  const pts1: [number, number][] = [];
  const pts2: [number, number][] = [];
  for (let i = 0; i <= 8; i++) {
    const t = i / 8;
    const yy = cy - s * 0.32 + t * s * 0.64;
    const xx = Math.sin(t * Math.PI * 2) * s * 0.16;
    pts1.push([cx + xx, yy]);
    pts2.push([cx - xx, yy]);
  }
  setDraw(doc, color);
  doc.setLineWidth(0.3);
  for (let i = 0; i < pts1.length - 1; i++) {
    doc.line(pts1[i][0], pts1[i][1], pts1[i + 1][0], pts1[i + 1][1]);
    doc.line(pts2[i][0], pts2[i][1], pts2[i + 1][0], pts2[i + 1][1]);
  }
  for (let i = 0; i < pts1.length; i += 2) {
    doc.line(pts1[i][0], pts1[i][1], pts2[i][0], pts2[i][1]);
  }
}

function drawIconGlyph(
  doc: jsPDF,
  type: IconType,
  cx: number,
  cy: number,
  size: number,
  color: RGB = TEAL
) {
  const s = size;
  setDraw(doc, color);
  setFill(doc, color);
  doc.setLineWidth(0.3);

  switch (type) {
    case "dna":
      drawDnaHelix(doc, cx, cy, s, color);
      break;
    case "bird":
      doc.circle(cx - s * 0.05, cy - s * 0.1, s * 0.16, "S");
      doc.triangle(
        cx - s * 0.22, cy - s * 0.1,
        cx - s * 0.36, cy - s * 0.04,
        cx - s * 0.22, cy - s * 0.02,
        "S"
      );
      doc.lines(
        [
          [s * 0.28, s * 0.06],
          [s * 0.16, s * 0.16],
        ],
        cx - s * 0.05, cy + s * 0.04, [1, 1], "S"
      );
      break;
    case "leaf":
      doc.ellipse(cx, cy, s * 0.24, s * 0.34, "S");
      doc.line(cx, cy - s * 0.3, cx, cy + s * 0.3);
      break;
    case "person":
      doc.circle(cx, cy - s * 0.18, s * 0.15, "S");
      doc.ellipse(cx, cy + s * 0.2, s * 0.24, s * 0.16, "S");
      break;
    case "house":
      doc.triangle(
        cx - s * 0.28, cy - s * 0.02,
        cx, cy - s * 0.32,
        cx + s * 0.28, cy - s * 0.02,
        "S"
      );
      doc.rect(cx - s * 0.2, cy - s * 0.02, s * 0.4, s * 0.32, "S");
      break;
    case "clipboard":
      doc.rect(cx - s * 0.22, cy - s * 0.28, s * 0.44, s * 0.56, "S");
      doc.rect(cx - s * 0.09, cy - s * 0.33, s * 0.18, s * 0.09, "S");
      doc.line(cx - s * 0.13, cy - s * 0.05, cx + s * 0.13, cy - s * 0.05);
      doc.line(cx - s * 0.13, cy + s * 0.08, cx + s * 0.13, cy + s * 0.08);
      break;
    case "calendar":
      doc.rect(cx - s * 0.26, cy - s * 0.24, s * 0.52, s * 0.48, "S");
      doc.line(cx - s * 0.26, cy - s * 0.1, cx + s * 0.26, cy - s * 0.1);
      doc.line(cx - s * 0.13, cy - s * 0.3, cx - s * 0.13, cy - s * 0.18);
      doc.line(cx + s * 0.13, cy - s * 0.3, cx + s * 0.13, cy - s * 0.18);
      break;
    case "document":
      doc.rect(cx - s * 0.2, cy - s * 0.28, s * 0.4, s * 0.56, "S");
      doc.line(cx - s * 0.1, cy - s * 0.12, cx + s * 0.1, cy - s * 0.12);
      doc.line(cx - s * 0.1, cy, cx + s * 0.1, cy);
      doc.line(cx - s * 0.1, cy + s * 0.12, cx + s * 0.05, cy + s * 0.12);
      break;
  }
}

function drawFieldIcon(
  doc: jsPDF,
  type: IconType,
  cx: number,
  cy: number,
  size: number,
  color: RGB = TEAL
) {
  setDraw(doc, color);
  doc.setLineWidth(0.35);
  doc.roundedRect(cx - size / 2, cy - size / 2, size, size, 1, 1, "S");
  drawIconGlyph(doc, type, cx, cy, size * 0.8, color);
}

interface Point {
  x: number;
  y: number;
}

function polygonFromPoints(doc: jsPDF, points: Point[], style: string) {
  const deltas: [number, number][] = [];
  for (let i = 1; i < points.length; i++) {
    deltas.push([points[i].x - points[i - 1].x, points[i].y - points[i - 1].y]);
  }
  doc.lines(deltas, points[0].x, points[0].y, [1, 1], style, true);
}

function quadraticBezier(p0: Point, p1: Point, p2: Point, segments: number): Point[] {
  const pts: Point[] = [];
  for (let i = 0; i <= segments; i++) {
    const t = i / segments;
    const x = (1 - t) ** 2 * p0.x + 2 * (1 - t) * t * p1.x + t ** 2 * p2.x;
    const y = (1 - t) ** 2 * p0.y + 2 * (1 - t) * t * p1.y + t ** 2 * p2.y;
    pts.push({ x, y });
  }
  return pts;
}

function drawHeaderBanner(doc: jsPDF, cardX: number, cardY: number, cardW: number) {
  const bannerH = 34;
  const topX = cardX + cardW * 0.6;
  const bottomX = cardX + cardW * 0.5;
  const p0: Point = { x: topX, y: cardY };
  const p2: Point = { x: bottomX, y: cardY + bannerH };
  const p1: Point = { x: topX - 48, y: cardY + bannerH * 0.5 };
  const curvePts = quadraticBezier(p0, p1, p2, 24);

  setFill(doc, NAVY);
  const poly: Point[] = [
    ...curvePts,
    { x: cardX + cardW, y: cardY + bannerH },
    { x: cardX + cardW, y: cardY },
  ];
  polygonFromPoints(doc, poly, "F");

  setFill(doc, TEAL_LIGHT);
  doc.rect(cardX, cardY + bannerH, cardW, 1.4, "F");
}

async function getQrDataUrl(text: string): Promise<string> {
  return QRCode.toDataURL(text, {
    margin: 0,
    color: { dark: "#0D1B3D", light: "#00000000" },
    errorCorrectionLevel: "M",
  });
}

/**
 * Base URL used to build the QR "scan to download" link.
 * Set NEXT_PUBLIC_SITE_URL (or SITE_URL) in your .env, e.g.
 *   NEXT_PUBLIC_SITE_URL=https://vetgenelab.com
 * Falls back to settings.verify_base_url, then a placeholder.
 */
function resolveBaseUrl(settings: any): string {
  return (
    process.env.NEXT_PUBLIC_SITE_URL ||
    process.env.SITE_URL ||
    settings?.verify_base_url ||
    "https://vetgenelab.example.com"
  ).replace(/\/+$/, "");
}

async function drawCertificate(doc: jsPDF, order: any, settings: any) {
  const cardX = 8;
  const cardY = 8;
  const cardW = PAGE_W - cardX * 2;
  const cardH = PAGE_H - cardY * 2;

  setDraw(doc, [210, 213, 218]);
  doc.setLineWidth(0.6);
  doc.roundedRect(cardX, cardY, cardW, cardH, 4, 4, "S");

  drawHeaderBanner(doc, cardX, cardY, cardW);

  const logoBase64 = getLogoBase64();
  if (logoBase64) {
    const logoH = 24;
    const logoW = logoH * LOGO_ASPECT_RATIO;
    doc.addImage(logoBase64, "PNG", cardX + 10, cardY + 8, logoW, logoH);
  } else {
    setText(doc, NAVY);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("VetGene", cardX + 12, cardY + 20);
  }

  setText(doc, [255, 255, 255]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.text("DNA SEXING REPORT", cardX + cardW - 15, cardY + 20, { align: "right" });
  setDraw(doc, TEAL_LIGHT);
  doc.setLineWidth(0.5);
  doc.circle(cardX + cardW - 68, cardY + 17, 6.5, "S");
  drawDnaHelix(doc, cardX + cardW - 68, cardY + 17, 9, TEAL_LIGHT);

  const splitX = cardX + cardW * 0.63;
  const contentTop = cardY + 44;
  const contentBottom = cardY + cardH - 24;

  setDraw(doc, [220, 222, 226]);
  doc.setLineWidth(0.3);
  doc.line(splitX, contentTop - 6, splitX, contentBottom);

  const fields: [string, string, IconType][] = [
    ["DNA ID", order.dna_id ? String(order.dna_id) : "-", "dna"],
    ["Bird ID", order.name ? String(order.name) : "-", "bird"],
    ["Species", order.species_id?.name || "N/A", "leaf"],
    ["Owner Name", order.customer_id?.name || "N/A", "person"],
    ["Farm Name", order.customer_id?.farm_name || "N/A", "house"],
    ["Sample Type", order.sample_type || "Feather", "leaf"],
    ["DNA Result", order.sex || "N/A", "clipboard"],
    [
      "Received Date",
      order.received_date
        ? new Date(order.received_date).toLocaleDateString("en-GB")
        : "-",
      "calendar",
    ],
    [
      "Reported Date",
      order.reported_date
        ? new Date(order.reported_date).toLocaleDateString("en-GB")
        : new Date(order.entry_date || Date.now()).toLocaleDateString("en-GB"),
      "document",
    ],
  ];

  let rowY = contentTop;
  const rowGap = 8.4;
  const labelX = cardX + 20;
  const valueX = cardX + 58;

  fields.forEach(([label, value, icon], idx) => {
    drawFieldIcon(doc, icon, cardX + 11, rowY - 2, 7, TEAL);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10.5);
    setText(doc, DARK_TEXT);
    doc.text(label, labelX, rowY);

    doc.setFont("helvetica", "normal");
    setText(doc, GRAY_TEXT);
    doc.text(":", valueX - 6, rowY);

    doc.setFont("helvetica", "bold");
    if (label === "DNA Result") {
      setText(doc, /female/i.test(value) ? PINK : TEAL);
    } else {
      setText(doc, [40, 45, 55]);
    }
    doc.text(value, valueX, rowY);

    if (idx < fields.length - 1) {
      setDraw(doc, [225, 227, 230]);
      doc.setLineWidth(0.15);
      doc.line(labelX - 8, rowY + 2.6, splitX - 6, rowY + 2.6);
    }
    rowY += rowGap;
  });

  const rightCenterX = splitX + (cardX + cardW - splitX) / 2;
  const isFemale = /female/i.test(order.sex || "");
  const resultColor = isFemale ? PINK : TEAL;

  setFill(doc, TEAL);
  doc.roundedRect(rightCenterX - 16, contentTop - 6, 32, 8, 4, 4, "F");
  setText(doc, [255, 255, 255]);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text("RESULT", rightCenterX, contentTop - 0.5, { align: "center" });

  const boxY = contentTop + 6;
  const boxH = 26;
  const boxW = cardX + cardW - splitX - 16;
  const boxX = splitX + 8;
  setDraw(doc, resultColor);
  doc.setLineWidth(0.5);
  doc.roundedRect(boxX, boxY, boxW, boxH, 3, 3, "S");

  setFill(doc, resultColor);
  doc.circle(boxX + 16, boxY + boxH / 2, 10, "F");
  setText(doc, [255, 255, 255]);
  doc.setFontSize(14);
  doc.text(isFemale ? "\u2640" : "\u2642", boxX + 16, boxY + boxH / 2 + 4, {
    align: "center",
  });

  setText(doc, resultColor);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(24);
  doc.text((order.sex || "N/A").toUpperCase(), boxX + 32, boxY + boxH / 2 + 5);

  const divY = boxY + boxH + 10;
  setDraw(doc, [210, 213, 218]);
  doc.setLineWidth(0.3);
  doc.line(splitX + 8, divY, cardX + cardW - 8, divY);
  setFill(doc, TEAL);
  doc.circle(rightCenterX, divY, 1, "F");

  // ---- QR: points to the PUBLIC download route, no login needed ----
  const baseUrl = resolveBaseUrl(settings);
  const qrText = `${baseUrl}/api/verify/${order.dna_id || order._id}`;
  try {
    const qrDataUrl = await getQrDataUrl(qrText);
    const qrSize = 26;
    doc.addImage(qrDataUrl, "PNG", splitX + 8, divY + 4, qrSize, qrSize);

    setText(doc, DARK_TEXT);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(8.5);
    doc.text("Scan to", splitX + 8 + qrSize + 10, divY + 14);
    doc.text("Download", splitX + 8 + qrSize + 10, divY + 19);
  } catch (qrErr) {
    console.error("QR generation failed:", qrErr);
  }

  const footerH = 16;
  const footerY = cardY + cardH - footerH;
  setFill(doc, NAVY);
  doc.rect(cardX, footerY, cardW, footerH, "F");

  const footerCols: { label: string; value: string; icon: IconType }[] = [
    { label: "TEST METHOD", value: order.test_method || "PCR Based DNA Sexing", icon: "clipboard" },
    {
      label: "REPORT DATE",
      value: order.reported_date
        ? new Date(order.reported_date).toLocaleDateString("en-GB")
        : new Date().toLocaleDateString("en-GB"),
      icon: "calendar",
    },
    { label: "PHONE", value: settings?.office_phone || "-", icon: "person" },
  ];
  const colW = cardW / 3.4;
  footerCols.forEach((col, i) => {
    const cx = cardX + 16 + i * colW;
    setDraw(doc, TEAL_LIGHT);
    doc.setLineWidth(0.4);
    doc.circle(cx, footerY + 8, 4, "S");
    drawIconGlyph(doc, col.icon, cx, footerY + 8, 4.8, TEAL_LIGHT);

    setText(doc, TEAL_LIGHT);
    doc.setFont("helvetica", "bold");
    doc.setFontSize(7.5);
    doc.text(col.label, cx + 8, footerY + 6.5);
    setText(doc, [255, 255, 255]);
    doc.setFontSize(9.5);
    doc.text(String(col.value), cx + 8, footerY + 11.5);
  });

  setText(doc, GRAY_TEXT);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7.5);
  doc.text(
    "Confidential   |   Accurate   |   Reliable",
    cardX + cardW / 2,
    cardY + cardH + 5,
    { align: "center" }
  );
}

/**
 * Generates a certificate PDF for one or more orders and returns it as a Buffer.
 * Used by both the protected admin export route and the public verify/download route.
 */
export async function generateCertificatePdf(orders: any[], settings: any): Promise<Buffer> {
  const doc = new jsPDF({
    orientation: "landscape",
    unit: "mm",
    format: [PAGE_W, PAGE_H],
  });

  for (let i = 0; i < orders.length; i++) {
    if (i > 0) doc.addPage([PAGE_W, PAGE_H], "landscape");
    await drawCertificate(doc, orders[i], settings);
  }

  return Buffer.from(doc.output("arraybuffer"));
}