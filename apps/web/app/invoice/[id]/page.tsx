"use client";

import { useParams } from "next/navigation";
import { Printer, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

// Mock Invoice Data
interface InvoiceItem {
  no: number;
  description: string;
  quantity: number;
  unitPrice: number;
  amount: number;
}

interface InvoiceData {
  invoiceNo: string;
  invoiceDate: string;
  dueDate: string;
  referenceNo: string;
  seller: {
    name: string;
    address: string;
    taxId: string;
    branch: string;
  };
  buyer: {
    name: string;
    address: string;
    taxId: string;
    branch: string;
  };
  items: InvoiceItem[];
  subtotal: number;
  vatRate: number;
  vatAmount: number;
  total: number;
}

const mockInvoiceData: InvoiceData = {
  invoiceNo: "INV-2026-001",
  invoiceDate: "30 มีนาคม 2026",
  dueDate: "30 เมษายน 2026",
  referenceNo: "REF-2026-001",
  seller: {
    name: "Engenius Tax Solutions",
    address: "123 ถนนสุขุมวิท แขวงคลองตันเหนือ เขตวัฒนา กรุงเทพมหานคร 10110",
    taxId: "1234567890123",
    branch: "สำนักงานใหญ่",
  },
  buyer: {
    name: "บริษัท ไทย เทรด จำกัด",
    address: "456 ถนนสีลม แขวงสีลม เขตบางรัก กรุงเทพมหานคร 10500",
    taxId: "9876543210123",
    branch: "สาขาที่ 1",
  },
  items: [
    {
      no: 1,
      description: "ค่าบริการจัดทำภาษีเงินได้นิติบุคคล ประจำปี 2565",
      quantity: 1,
      unitPrice: 15000,
      amount: 15000,
    },
    {
      no: 2,
      description: "ค่าบริการวางแผนภาษีประจำไตรมาสที่ 1/2566",
      quantity: 1,
      unitPrice: 5000,
      amount: 5000,
    },
    {
      no: 3,
      description: "ค่าธรรมเนียมการแนะนำกฎหมายภาษี",
      quantity: 2,
      unitPrice: 2500,
      amount: 5000,
    },
    {
      no: 4,
      description: "ค่าบริการตรวจสอบบัญชีรายเดือน",
      quantity: 3,
      unitPrice: 3000,
      amount: 9000,
    },
  ],
  subtotal: 34000,
  vatRate: 7,
  vatAmount: 2380,
  total: 36380,
};

// Format number with commas
const formatNumber = (num: number): string => {
  return new Intl.NumberFormat("th-TH").format(num);
};

// Convert number to Thai text
const bahtText = (num: number): string => {
  const ThaiNum = ["ศูนย์", "หนึ่ง", "สอง", "สาม", "สี่", "ห้า", "หก", "เจ็ด", "แปด", "เก้า"];
  const OneToTen = ["", "สิบ", "ร้อย", "พัน", "หมื่น", "แสน", "ล้าน"];
  const IsOne = ["", "เอ็ด"];

  const numString = num.toFixed(2);
  const integerPart = numString.split(".")[0];
  const decimalPart = numString.split(".")[1];

  if (parseInt(integerPart) === 0 && decimalPart === "00") return "ศูนย์บาทถ้วน";

  const result: string[] = [];

  // Integer part
  for (let i = 0; i < integerPart.length; i++) {
    const digit = parseInt(integerPart[i]);
    const pos = integerPart.length - i - 1;

    if (digit !== 0) {
      if (pos === 0 && digit === 1 && integerPart.length > 1) {
        result.push(IsOne[1]);
      } else if (pos === 1 && digit === 2) {
        result.push("ยี่" + OneToTen[pos]);
      } else if (pos === 1 && digit === 1) {
        // Skip "หนึ่งสิบ"
      } else {
        result.push(ThaiNum[digit] + OneToTen[pos]);
      }
    }
  }

  result.push("บาท");

  // Decimal part
  if (decimalPart !== "00") {
    for (let i = 0; i < decimalPart.length; i++) {
      const digit = parseInt(decimalPart[i]);
      const pos = decimalPart.length - i - 1;

      if (digit !== 0) {
        if (pos === 0 && digit === 1 && decimalPart.length > 1) {
          result.push(IsOne[1]);
        } else if (pos === 1 && digit === 2) {
          result.push("ยี่" + OneToTen[pos]);
        } else if (pos === 1 && digit === 1) {
          // Skip "หนึ่งสิบ"
        } else {
          result.push(ThaiNum[digit] + OneToTen[pos]);
        }
      }
    }
    result.push("สตางค์ถ้วน");
  } else {
    result.push("ถ้วน");
  }

  return result.join("");
};

export default function InvoicePage() {
  const params = useParams();
  const transactionId = params.id as string || mockInvoiceData.referenceNo;

  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      {/* Print Styles */}
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
          }

          /* Hide navigation, sidebar, and other UI elements */
          nav,
          aside,
          header,
          footer,
          .no-print {
            display: none !important;
          }

          /* Invoice container for print */
          .invoice-container {
            width: 100% !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 16mm !important;
            box-shadow: none !important;
          }

          /* Ensure A4 size */
          @page {
            size: A4;
            margin: 10mm 10mm 10mm 10mm;
          }

          /* Text colors for print */
          .text-brand {
            color: #800000 !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          .text-highlight {
            color: #007BFF !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          /* Table borders for print */
          table {
            border-collapse: collapse !important;
          }

          th,
          td {
            border: 1px solid #e2e8f0 !important;
          }

          /* Table header print styles */
          .table-header-row th {
            background-color: #475569 !important;
            color: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          /* Grand total print styles */
          .grand-total-row {
            background-color: #eff6ff !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }

          /* Baht text print styles */
          .baht-text-box {
            background-color: #eff6ff !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>

      {/* Main Container - Light Gray Background */}
      <div className="min-h-screen bg-slate-100">
        {/* Sticky Action Bar - Hidden on Print */}
        <div className="no-print sticky top-0 z-50 bg-white/95 backdrop-blur-sm border-b border-slate-200 shadow-sm">
          <div className="max-w-[210mm] mx-auto px-4 py-3 flex justify-between items-center">
            <Button
              variant="outline"
              size="sm"
              onClick={() => window.history.back()}
              className="gap-2"
            >
              <ArrowLeft className="h-4 w-4" />
              ย้อนกลับ
            </Button>
            <Button
              onClick={handlePrint}
              size="sm"
              className="gap-2 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Printer className="h-4 w-4" />
              พิมพ์ใบกำกับภาษี
            </Button>
          </div>
        </div>

        {/* Invoice Sheet - A4 Paper Simulation */}
        <div className="invoice-container max-w-[210mm] min-h-[297mm] mx-auto bg-white shadow-lg my-8">
          {/* ========== A4 Paper Content with Enhanced Padding ========== */}
          <div className="p-16">
            {/* ========== Header Section ========== */}
            <div className="flex justify-between items-start mb-8 pb-6 border-b border-slate-200">
              {/* Brand - Left */}
              <div className="flex flex-col">
                <h1 className="text-4xl font-bold text-brand tracking-tight">
                  Engenius
                </h1>
                <p className="text-sm text-slate-500 mt-1">Tax Solutions</p>
              </div>

              {/* Title - Right */}
              <div className="text-right">
                <h2 className="text-2xl font-bold text-slate-800">
                  ใบกำกับภาษี / ใบเสร็จรับเงิน
                </h2>
                <p className="text-sm text-slate-500 mt-1">
                  (Tax Invoice / Receipt)
                </p>
                <div className="mt-3 inline-block px-4 py-1.5 bg-slate-800 text-white rounded text-sm font-medium">
                  ต้นฉบับ (Original)
                </div>
              </div>
            </div>

            {/* ========== Invoice Metadata Grid ========== */}
            <div className="mb-8">
              <div className="grid grid-cols-4 gap-6">
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 mb-1">
                    เลขที่ใบกำกับ
                  </p>
                  <p className="text-base font-semibold text-slate-800">
                    {mockInvoiceData.invoiceNo}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 mb-1">
                    วันที่ออก
                  </p>
                  <p className="text-base font-semibold text-slate-800">
                    {mockInvoiceData.invoiceDate}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 mb-1">
                    วันครบกำหนด
                  </p>
                  <p className="text-base font-semibold text-slate-800">
                    {mockInvoiceData.dueDate}
                  </p>
                </div>
                <div>
                  <p className="text-[10px] uppercase tracking-wider font-semibold text-slate-500 mb-1">
                    เลขที่อ้างอิง
                  </p>
                  <p className="text-base font-semibold text-slate-800">
                    {transactionId}
                  </p>
                </div>
              </div>
            </div>

            {/* ========== Parties Section with Vertical Divider ========== */}
            <div className="flex gap-0 mb-10">
              {/* Seller (ผู้ขาย) - Left */}
              <div className="flex-1 pr-8">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-brand rounded-full"></span>
                  ผู้ขาย (Seller)
                </h3>
                <p className="text-lg font-bold text-slate-800">
                  {mockInvoiceData.seller.name}
                </p>
                <p className="text-sm text-slate-600 mt-2 whitespace-pre-line leading-relaxed">
                  {mockInvoiceData.seller.address}
                </p>
                <p className="text-sm text-slate-600 mt-3">
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                    เลขประจำตัวผู้เสียภาษี:
                  </span>{" "}
                  <span className="font-mono font-semibold text-slate-700">
                    {mockInvoiceData.seller.taxId}
                  </span>
                </p>
                <p className="text-sm text-slate-600 mt-1">
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                    สาขา:
                  </span>{" "}
                  {mockInvoiceData.seller.branch}
                </p>
              </div>

              {/* Vertical Divider */}
              <div className="w-px bg-slate-200"></div>

              {/* Buyer (ผู้ซื้อ) - Right */}
              <div className="flex-1 pl-8">
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-3 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                  ผู้ซื้อ (Buyer)
                </h3>
                <p className="text-lg font-bold text-slate-800">
                  {mockInvoiceData.buyer.name}
                </p>
                <p className="text-sm text-slate-600 mt-2 whitespace-pre-line leading-relaxed">
                  {mockInvoiceData.buyer.address}
                </p>
                <p className="text-sm text-slate-600 mt-3">
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                    เลขประจำตัวผู้เสียภาษี:
                  </span>{" "}
                  <span className="font-mono font-semibold text-slate-700">
                    {mockInvoiceData.buyer.taxId}
                  </span>
                </p>
                <p className="text-sm text-slate-600 mt-1">
                  <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                    สาขา:
                  </span>{" "}
                  {mockInvoiceData.buyer.branch}
                </p>
              </div>
            </div>

            {/* ========== Professional Items Table ========== */}
            <div className="mb-8">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="table-header-row bg-slate-700 border-y-2 border-slate-300">
                    <th className="w-16 py-4 px-4 text-left font-bold text-white text-sm">
                      ลำดับ
                    </th>
                    <th className="py-4 px-4 text-left font-bold text-white text-sm">
                      รายการ (Description)
                    </th>
                    <th className="w-24 py-4 px-4 text-center font-bold text-white text-sm">
                      จำนวน
                    </th>
                    <th className="w-36 py-4 px-4 text-center font-bold text-white text-sm">
                      ราคาต่อหน่วย
                    </th>
                    <th className="w-36 py-4 px-4 text-right font-bold text-white text-sm">
                      จำนวนเงิน
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {mockInvoiceData.items.map((item, index) => (
                    <tr
                      key={item.no}
                      className={`border-b border-slate-100 ${
                        index % 2 === 0 ? "bg-white" : "bg-slate-50/50"
                      }`}
                    >
                      <td className="py-4 px-4 text-left text-slate-600 font-medium">
                        {item.no}
                      </td>
                      <td className="py-4 px-4 text-left text-slate-700">
                        {item.description}
                      </td>
                      <td className="py-4 px-4 text-center text-slate-600">
                        {item.quantity}
                      </td>
                      <td className="py-4 px-4 text-center font-mono text-slate-600">
                        {formatNumber(item.unitPrice)}
                      </td>
                      <td className="py-4 px-4 text-right font-mono font-semibold text-slate-700">
                        {formatNumber(item.amount)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* ========== Summary Section ========== */}
            <div className="flex justify-end mb-12">
              <div className="w-80">
                {/* Baht Text */}
                <div className="baht-text-box bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                  <p className="text-[10px] uppercase tracking-wider font-semibold text-blue-600 mb-2">
                    จำนวนเงินตัวอักษร (Baht Text)
                  </p>
                  <p className="text-sm font-semibold text-blue-800">
                    {bahtText(mockInvoiceData.total)}
                  </p>
                </div>

                {/* Summary Table - Aligned with Amount Column */}
                <table className="w-full border-collapse">
                  <tbody>
                    <tr className="border-b border-slate-100">
                      <td className="py-3 text-slate-600 text-sm">
                        ยอดรวมก่อนภาษี (Subtotal)
                      </td>
                      <td className="py-3 text-right font-mono text-slate-700 font-semibold">
                        {formatNumber(mockInvoiceData.subtotal)}
                      </td>
                    </tr>
                    <tr className="border-b border-slate-100">
                      <td className="py-3 text-slate-600 text-sm">
                        ภาษีมูลค่าเพิ่ม {mockInvoiceData.vatRate}%
                      </td>
                      <td className="py-3 text-right font-mono text-slate-700 font-semibold">
                        {formatNumber(mockInvoiceData.vatAmount)}
                      </td>
                    </tr>
                    <tr className="grand-total-row bg-blue-50 border-2 border-blue-200">
                      <td className="py-4 px-4 font-bold text-slate-800 text-sm">
                        ยอดรวมสุทธิ (Grand Total)
                      </td>
                      <td className="py-4 px-4 text-right font-mono font-bold text-xl text-blue-700">
                        {formatNumber(mockInvoiceData.total)}{" "}
                        <span className="text-base">บาท</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* ========== Footer with Signature Section ========== */}
            <div className="flex justify-around mt-16 pt-8 border-t-2 border-slate-200">
              {/* Receiver Signature */}
              <div className="text-center flex-1">
                <p className="text-sm text-slate-600 mb-20 font-medium">
                  ผู้รับเงิน
                </p>
                <div className="border-b-2 border-dashed border-slate-300 w-56 mx-auto mb-3"></div>
                <p className="text-[10px] text-slate-400">
                  (
                  {new Date().toLocaleDateString("th-TH", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                  )
                </p>
                <p className="text-sm font-semibold text-slate-700 mt-2">
                  ผู้รับเงิน / Cashier
                </p>
              </div>

              {/* Payer Signature */}
              <div className="text-center flex-1">
                <p className="text-sm text-slate-600 mb-20 font-medium">
                  ผู้จ่ายเงิน
                </p>
                <div className="border-b-2 border-dashed border-slate-300 w-56 mx-auto mb-3"></div>
                <p className="text-[10px] text-slate-400">
                  (
                  {new Date().toLocaleDateString("th-TH", {
                    day: "2-digit",
                    month: "long",
                    year: "numeric",
                  })}
                  )
                </p>
                <p className="text-sm font-semibold text-slate-700 mt-2">
                  ผู้จ่ายเงิน / Payer
                </p>
              </div>
            </div>

            {/* ========== Fine Print ========== */}
            <div className="mt-12 pt-4 border-t border-slate-100 text-center">
              <p className="text-[10px] text-slate-400 leading-relaxed">
                ใบกำกับภาษีฉบับนี้ได้รับการออกโดยระบบคอมพิวเตอร์
                <br />
                This invoice is computer-generated.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
