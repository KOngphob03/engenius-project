"use client";

import { Printer, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const mockData = {
  date: "( ใส่วันที่ )",
  bookNo: "( เล่มที่ )",
  invoiceNo: "( เลขที่ )",
  seller: {
    name: "( ใส่ชื่อผู้ขาย / บริษัท )",
    address: "( ใส่ที่อยู่ผู้ขาย )",
    taxId: "( ใส่เลขประจำตัวผู้เสียภาษี )",
    phone: "( เบอร์โทรศัพท์ )",
  },
  buyer: {
    name: "( ใส่ชื่อผู้ซื้อ / ลูกค้า )",
    address: "( ใส่ที่อยู่ผู้ซื้อ )",
    taxId: "( ใส่เลขประจำตัวผู้เสียภาษี )",
    phone: "( เบอร์โทรศัพท์ )",
  },
  items: [
    {
      no: "(ลำดับ)",
      description: "( ใส่ชื่อรายการสินค้า / บริการ )",
      quantity: "( จำนวน )",
      unitPrice: "( ราคาต่อหน่วย )",
      amount: "( จำนวนเงิน )",
    },
  ],
  subtotal: "( มูลค่ารวม )",
  vat: "( ภาษี 7% )",
  total: "( ยอดรวมสุทธิ )",
};

export default function InvoicePage() {
  const handlePrint = () => {
    window.print();
  };

  return (
    <>
      <style jsx global>{`
        @media print {
          body {
            background: white !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .no-print {
            display: none !important;
          }
          .invoice-container {
            width: 100% !important;
            max-width: none !important;
            margin: 0 !important;
            padding: 0 !important;
            box-shadow: none !important;
            border: none !important;
          }
          @page {
            size: A4;
            margin: 10mm;
          }
        }
      `}</style>

      {/* Main Container */}
      <div className="min-h-screen bg-slate-100 font-sans text-gray-800">
        {/* Sticky Action Bar */}
        <div className="no-print sticky top-0 z-50 flex items-center justify-between border-b border-slate-200 bg-white/95 px-4 py-3 shadow-sm backdrop-blur-sm">
          <div className="mx-auto flex w-full max-w-[210mm] justify-between">
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
              className="gap-2 bg-blue-600 text-white hover:bg-blue-700"
            >
              <Printer className="h-4 w-4" />
              พิมพ์ใบกำกับภาษี
            </Button>
          </div>
        </div>

        {/* Invoice Sheet - A4 Setup */}
        <div className="invoice-container mx-auto my-8 min-h-[297mm] w-[210mm] bg-white p-[15mm] shadow-lg">
          
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <div className="flex items-center">
              <span className="text-[36px] font-black tracking-tight text-[#800000]">
                EN
              </span>
              <span className="text-[36px] font-black tracking-tight text-black">
                Genius
              </span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">
              ใบเสร็จรับเงิน / ใบกำกับภาษี
            </h1>
          </div>

          {/* Date and Document Tracking Info */}
          <div className="mb-8 mt-6 flex items-end justify-between">
            <div className="flex w-64 items-end">
              <span className="whitespace-nowrap pr-2 font-medium">วันที่</span>
              <span className="flex-1 border-b-[1.5px] border-dotted border-gray-400 px-2 pb-0.5 text-center text-gray-700">
                {mockData.date}
              </span>
            </div>
            <div className="flex gap-8">
              <div className="flex w-32 items-end">
                <span className="whitespace-nowrap pr-2 font-medium">เล่มที่</span>
                <span className="flex-1 border-b-[1.5px] border-dotted border-gray-400 px-2 pb-0.5 text-center text-gray-700">
                  {mockData.bookNo}
                </span>
              </div>
              <div className="flex w-32 items-end">
                <span className="whitespace-nowrap pr-2 font-medium">เลขที่</span>
                <span className="flex-1 border-b-[1.5px] border-dotted border-gray-400 px-2 pb-0.5 text-center text-gray-700">
                  {mockData.invoiceNo}
                </span>
              </div>
            </div>
          </div>

          {/* Seller / Buyer Details */}
          <div className="mb-6 space-y-8 text-[15px]">
            {/* Seller */}
            <div className="space-y-3">
              <div className="flex w-full items-end">
                <span className="whitespace-nowrap pr-4 font-medium">ชื่อผู้ขาย</span>
                <span className="flex-1 border-b-[1.5px] border-dotted border-gray-400 px-2 pb-0.5 text-left text-gray-700">
                  {mockData.seller.name}
                </span>
              </div>
              <div className="flex w-full items-end">
                <span className="whitespace-nowrap pr-4 font-medium">ที่อยู่</span>
                <span className="flex-1 border-b-[1.5px] border-dotted border-gray-400 px-2 pb-0.5 text-left text-gray-700">
                  {mockData.seller.address}
                </span>
              </div>
              <div className="flex w-full items-end">
                <span className="whitespace-nowrap pr-4 font-medium">เลขประจำตัวผู้เสียภาษี</span>
                <span className="flex-1 border-b-[1.5px] border-dotted border-gray-400 px-2 pb-0.5 text-left text-gray-700">
                  {mockData.seller.taxId}
                </span>
                <span className="whitespace-nowrap pl-8 pr-4 font-medium">โทรศัพท์</span>
                <span className="w-48 border-b-[1.5px] border-dotted border-gray-400 px-2 pb-0.5 text-left text-gray-700">
                  {mockData.seller.phone}
                </span>
              </div>
            </div>

            {/* Buyer */}
            <div className="space-y-3">
              <div className="flex w-full items-end">
                <span className="whitespace-nowrap pr-4 font-medium">ชื่อผู้ซื้อ</span>
                <span className="flex-1 border-b-[1.5px] border-dotted border-gray-400 px-2 pb-0.5 text-left text-gray-700">
                  {mockData.buyer.name}
                </span>
              </div>
              <div className="flex w-full items-end">
                <span className="whitespace-nowrap pr-4 font-medium">ที่อยู่</span>
                <span className="flex-1 border-b-[1.5px] border-dotted border-gray-400 px-2 pb-0.5 text-left text-gray-700">
                  {mockData.buyer.address}
                </span>
              </div>
              <div className="flex w-full items-end">
                <span className="whitespace-nowrap pr-4 font-medium">เลขประจำตัวผู้เสียภาษี</span>
                <span className="flex-1 border-b-[1.5px] border-dotted border-gray-400 px-2 pb-0.5 text-left text-gray-700">
                  {mockData.buyer.taxId}
                </span>
                <span className="whitespace-nowrap pl-8 pr-4 font-medium">โทรศัพท์</span>
                <span className="w-48 border-b-[1.5px] border-dotted border-gray-400 px-2 pb-0.5 text-left text-gray-700">
                  {mockData.buyer.phone}
                </span>
              </div>
            </div>
          </div>

          {/* Table Container */}
          <div className="flex min-h-[450px] flex-col border-[1.5px] border-gray-300">
            {/* Table Header */}
            <div className="flex border-b-[1.5px] border-gray-300 py-3 font-semibold text-gray-800">
              <div className="w-[10%] text-center border-r-[1.5px] border-gray-300">ลำดับ</div>
              <div className="w-[45%] text-center border-r-[1.5px] border-gray-300">รายการ</div>
              <div className="w-[15%] text-center border-r-[1.5px] border-gray-300">จำนวน</div>
              <div className="w-[15%] text-center border-r-[1.5px] border-gray-300">หน่วยละ</div>
              <div className="w-[15%] text-center">จำนวนเงิน</div>
            </div>

            {/* Table Body */}
            <div className="relative flex flex-1">
              {/* Background solid column lines spanning the body */}
              <div className="pointer-events-none absolute inset-0 flex">
                <div className="w-[10%] border-r-[1.5px] border-gray-300"></div>
                <div className="w-[45%] border-r-[1.5px] border-gray-300"></div>
                <div className="w-[15%] border-r-[1.5px] border-gray-300"></div>
                <div className="w-[15%] border-r-[1.5px] border-gray-300"></div>
                <div className="w-[15%]"></div>
              </div>

              {/* Data Rows */}
              <div className="z-10 w-full pt-4 text-[15px] font-medium text-gray-700">
                {mockData.items.map((item, idx) => (
                  <div key={idx} className="flex h-8 items-center">
                    <div className="w-[10%] text-center">{item.no}</div>
                    <div className="w-[45%] pl-6 pr-2">{item.description}</div>
                    <div className="w-[15%] text-center">{item.quantity}</div>
                    <div className="w-[15%] text-center">{item.unitPrice}</div>
                    <div className="w-[15%] text-center">{item.amount}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Table Footer */}
            <div className="flex w-full flex-col border-t-[1.5px] border-gray-300 pb-6 pt-4 text-[15px]">
              <div className="flex">
                <div className="w-[85%] border-r-[1.5px] border-gray-300 pr-8 py-1.5 text-right font-medium text-gray-800">
                  มูลค่ารวมก่อนเสียภาษี
                </div>
                <div className="w-[15%] py-1.5 text-center font-medium text-gray-800">
                  {mockData.subtotal}
                </div>
              </div>
              <div className="flex">
                <div className="w-[85%] border-r-[1.5px] border-gray-300 pr-8 py-1.5 text-right font-medium text-gray-800">
                  ภาษีมูลค่าเพิ่ม (VAT)
                </div>
                <div className="w-[15%] py-1.5 text-center font-medium text-gray-800">
                  {mockData.vat}
                </div>
              </div>
              <div className="mt-2 flex">
                <div className="w-[85%] border-r-[1.5px] border-gray-300 pr-8 py-2 text-right font-bold text-gray-900">
                  ยอดรวม
                </div>
                <div className="w-[15%] py-2 text-center font-bold text-gray-900">
                  {mockData.total}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
