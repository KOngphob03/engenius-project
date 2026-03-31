"use client";

import { use } from "react";
import {
  ArrowLeft,
  User,
  Building2,
  Printer,
  Calendar,
  Clock,
  Receipt,
  Phone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

// Mock customer data
const mockCustomerData: Record<
  string,
  {
    name: string;
    branch: string;
    phone: string;
  }
> = {
  "cust-001": {
    name: "นายอดุลวิทย์ ชินาภาษ",
    branch: "สำนักงานใหญ่",
    phone: "081-234-5678",
  },
  "cust-002": {
    name: "นางสมศรี มั่งมีศรีสุข",
    branch: "สาขาเชียงใหม่",
    phone: "089-876-5432",
  },
  "cust-003": {
    name: "นางสาวปราณี วิชัยดิษฐ",
    branch: "สาขาภูเก็ต",
    phone: "062-345-6789",
  },
};

// Mock transactions
const mockTransactions = [
  {
    id: "txn-001",
    date: "28 มี.ค. 2026",
    time: "14:32:00 น.",
    amount: 12500.0,
  },
  {
    id: "txn-002",
    date: "15 มี.ค. 2026",
    time: "09:15:00 น.",
    amount: 8750.5,
  },
  {
    id: "txn-003",
    date: "02 มี.ค. 2026",
    time: "16:48:00 น.",
    amount: 23100.0,
  },
  {
    id: "txn-004",
    date: "18 ก.พ. 2026",
    time: "11:20:00 น.",
    amount: 5430.75,
  },
];

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 2,
  }).format(amount);
}

export default function TransactionHistoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);

  const customer = mockCustomerData[id] ?? {
    name: "นายอดุลวิทย์ ชินาภาษ",
    branch: "สำนักงานใหญ่",
    phone: "081-234-5678",
  };

  return (
    <div className="relative min-h-screen bg-[#F8FAFC]">
      {/* Top Bar */}
      <header className="sticky top-0 z-10 border-b border-gray-100 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex h-14 max-w-4xl items-center px-4">
          <Link href="/login" className="group flex items-center gap-2">
            <h1 className="text-xl font-extrabold tracking-tight text-[#800000] transition-opacity group-hover:opacity-80">
              Engenius
            </h1>
          </Link>
          <span className="ml-3 rounded-full bg-[#007BFF]/10 px-2.5 py-0.5 text-xs font-semibold text-[#007BFF]">
            Admin
          </span>
        </div>
      </header>

      {/* Main Content */}
      <main className="mx-auto max-w-4xl px-4 py-8">
        {/* Back Navigation */}
        <Link
          href="/search"
          id="back-to-search"
          className="group mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-[#007BFF]"
        >
          <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
          กลับไปหน้าค้นหา
        </Link>

        {/* Customer Info Card */}
        <Card className="mb-8 border-0 shadow-md animate-[fadeIn_0.4s_ease-out]">
          <CardContent className="p-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:gap-6">
              {/* Avatar */}
              <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-linear-to-br from-[#007BFF]/15 to-[#800000]/10">
                <User className="h-8 w-8 text-[#007BFF]" />
              </div>

              {/* Details */}
              <div className="flex flex-col gap-2">
                <h2 className="text-xl font-bold text-gray-900">
                  {customer.name}
                </h2>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <span className="inline-flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5" />
                    {customer.branch}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Phone className="h-3.5 w-3.5" />
                    {customer.phone}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions Section */}
        <div className="animate-[fadeIn_0.4s_ease-out_0.15s_both]">
          <div className="mb-4 flex items-center gap-2">
            <Receipt className="h-5 w-5 text-gray-400" />
            <h3 className="text-lg font-bold text-gray-900">รายการชำระเงิน</h3>
            <span className="ml-1 rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-500">
              {mockTransactions.length} รายการ
            </span>
          </div>

          {/* Transaction List */}
          <div className="space-y-3">
            {mockTransactions.map((txn, index) => (
              <Card
                key={txn.id}
                id={`transaction-${txn.id}`}
                className="group border-0 p-0 shadow-sm transition-all duration-200 hover:shadow-md"
                style={{
                  animationDelay: `${0.2 + index * 0.08}s`,
                  animation: "fadeIn 0.4s ease-out both",
                }}
              >
                <CardContent className="p-0">
                  <div className="flex items-center gap-4 px-5 py-4">
                    {/* Date & Time Info */}
                    <div className="flex flex-1 flex-col gap-1.5 sm:flex-row sm:items-center sm:gap-6">
                      <div className="flex items-center gap-2 text-sm text-gray-700">
                        <Calendar className="h-4 w-4 text-gray-400" />
                        <span className="font-medium">{txn.date}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-gray-500">
                        <Clock className="h-3.5 w-3.5 text-gray-400" />
                        <span>{txn.time}</span>
                      </div>
                    </div>

                    {/* Amount */}
                    <div className="text-right">
                      <p className="text-base font-bold text-gray-900 tabular-nums">
                        {formatCurrency(txn.amount)}
                      </p>
                    </div>

                    {/* Print Button → Navigate to Invoice */}
                    <Link href={`/invoice/${txn.id}`}>
                      <Button
                        id={`print-${txn.id}`}
                        className="ml-2 h-9 gap-1.5 rounded-lg bg-[#007BFF] px-4 text-xs font-semibold text-white shadow-md shadow-[#007BFF]/20 transition-all duration-200 hover:bg-blue-700 hover:shadow-lg hover:shadow-[#007BFF]/30 active:scale-[0.97]"
                      >
                        <Printer className="h-3.5 w-3.5" />
                        พิมพ์
                      </Button>
                    </Link>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Summary */}
          <Card className="mt-6 border-0 bg-linear-to-r from-gray-50 to-gray-100/50 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">
                  ยอดรวมทั้งหมด
                </span>
                <span className="text-xl font-bold text-gray-900 tabular-nums">
                  {formatCurrency(
                    mockTransactions.reduce((sum, t) => sum + t.amount, 0),
                  )}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
