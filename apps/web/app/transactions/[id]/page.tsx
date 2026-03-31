"use client";

import { useState, useEffect, useCallback, use } from "react";
import {
  ArrowLeft,
  User,
  Building2,
  Printer,
  Calendar,
  Clock,
  Receipt,
  Phone,
  AlertCircle,
  X,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { apiService } from "@/lib/api-client";

/* ── Toast notification ── */
function Toast({
  message,
  type = "error",
  onClose,
}: {
  message: string;
  type?: "error" | "success";
  onClose: () => void;
}) {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const bgColor = type === "error" ? "bg-red-50" : "bg-green-50";
  const textColor = type === "error" ? "text-red-500" : "text-green-500";
  const borderColor = type === "error" ? "border-red-100" : "border-green-100";

  return (
    <div className="fixed top-6 left-1/2 z-50 -translate-x-1/2 animate-[toastIn_0.35s_cubic-bezier(.21,1.02,.73,1)]">
      <div className={`flex items-center gap-3 rounded-xl border ${borderColor} bg-white px-5 py-3 shadow-lg`}>
        <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${bgColor}`}>
          <AlertCircle className={`h-4 w-4 ${textColor}`} />
        </div>
        <span className="text-sm font-medium text-gray-700">{message}</span>
        <button
          onClick={onClose}
          className="ml-2 rounded-md p-0.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
    </div>
  );
}

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("th-TH", {
    style: "currency",
    currency: "THB",
    minimumFractionDigits: 2,
  }).format(amount);
}

function formatDate(dateString: string | Date) {
  const date = new Date(dateString);
  const thaiDay = date.getDate();
  const thaiMonth = date.toLocaleString("th-TH", { month: "short" });
  const thaiYear = date.getFullYear() + 543; // Convert to Buddhist year
  return `${thaiDay} ${thaiMonth} ${thaiYear}`;
}

function formatTime(dateString: string | Date) {
  const date = new Date(dateString);
  return date.toLocaleTimeString("th-TH", { hour: "2-digit", minute: "2-digit" });
}

interface Payment {
  id: number;
  amount: number;
  status: boolean;
  activateCode: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export default function TransactionHistoryPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { id } = use(params);

  const [user, setUser] = useState<User>(null);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type?: "error" | "success" } | null>(null);

  const clearToast = useCallback(() => setToast(null), []);

  // Load user and payments data
  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);

      try {
        // Load user data by email/id (id is email from search page)
        const userResponse = await apiService.get(`/users/email/${id}`);
        if (userResponse.error || !userResponse.data) {
          setToast({ message: "ไม่พบข้อมูลลูกค้า", type: "error" });
          setIsLoading(false);
          return;
        }

        setUser(userResponse.data);

        // Load payments data
        const paymentsResponse = await apiService.getUserPayments(userResponse.data.id);
        if (paymentsResponse.data) {
          const paymentData = Array.isArray(paymentsResponse.data) ? paymentsResponse.data : [paymentsResponse.data];
          setPayments(paymentData);
        }
      } catch (error: unknown) {
        setToast({ message: (error as Error).message || "เกิดข้อผิดพลาดในการโหลดข้อมูล", type: "error" });
      } finally {
        setIsLoading(false);
      }
    };

    loadData();
  }, [id]);

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (isLoading) {
    return (
      <div className="relative min-h-screen bg-[#F8FAFC]">
        <header className="sticky top-0 z-10 border-b border-gray-100 bg-white/80 backdrop-blur-lg">
          <div className="mx-auto flex h-14 max-w-4xl items-center px-4">
            <Link href="/dashboard" className="group flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight text-[#800000]">Engenius</h1>
            </Link>
          </div>
        </header>
        <div className="flex flex-col items-center justify-center py-32">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-[#007BFF]" />
          <p className="mt-3 text-sm text-gray-400">กำลังโหลดข้อมูล...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="relative min-h-screen bg-[#F8FAFC]">
        {toast && <Toast message={toast.message} type={toast.type} onClose={clearToast} />}
        <header className="sticky top-0 z-10 border-b border-gray-100 bg-white/80 backdrop-blur-lg">
          <div className="mx-auto flex h-14 max-w-4xl items-center px-4">
            <Link href="/search" className="group flex items-center gap-2">
              <h1 className="text-xl font-extrabold tracking-tight text-[#800000]">Engenius</h1>
            </Link>
          </div>
        </header>
        <div className="flex flex-col items-center justify-center py-32">
          <p className="text-gray-500">ไม่พบข้อมูลลูกค้า</p>
          <Link href="/search">
            <Button className="mt-4">กลับไปหน้าค้นหา</Button>
          </Link>
        </div>
      </div>
    );
  }

  const totalAmount = payments.reduce((sum, p) => sum + (p.amount || 0), 0);

  return (
    <div className="relative min-h-screen bg-[#F8FAFC]">
      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={clearToast} />}

      {/* Top Bar */}
      <header className="sticky top-0 z-10 border-b border-gray-100 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex h-14 max-w-4xl items-center justify-between px-4">
          <Link href="/dashboard" className="group flex items-center gap-2">
            <h1 className="text-xl font-extrabold tracking-tight text-[#800000] transition-opacity group-hover:opacity-80">
              Engenius
            </h1>
          </Link>
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-[#007BFF]/10 px-2.5 py-0.5 text-xs font-semibold text-[#007BFF]">
              Admin
            </span>
            <Button
              onClick={handleLogout}
              variant="ghost"
              size="sm"
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900"
            >
              <LogOut className="h-4 w-4" />
            </Button>
          </div>
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
                  {user.firstname} {user.lastname}
                </h2>
                <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                  <span className="inline-flex items-center gap-1.5">
                    <Building2 className="h-3.5 w-3.5" />
                    {user.department || user.university || "-"}
                  </span>
                  {user.phone && (
                    <span className="inline-flex items-center gap-1.5">
                      <Phone className="h-3.5 w-3.5" />
                      {user.phone}
                    </span>
                  )}
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
              {payments.length} รายการ
            </span>
          </div>

          {/* Transaction List */}
          <div className="space-y-3">
            {payments.length === 0 ? (
              <Card className="border-0 p-8 text-center shadow-sm">
                <p className="text-gray-500">ไม่มีรายการชำระเงิน</p>
              </Card>
            ) : (
              payments.map((payment, index) => (
                <Card
                  key={payment.id}
                  id={`transaction-${payment.id}`}
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
                          <span className="font-medium">{formatDate(payment.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <Clock className="h-3.5 w-3.5 text-gray-400" />
                          <span>{formatTime(payment.createdAt)} น.</span>
                        </div>
                      </div>

                      {/* Amount */}
                      <div className="text-right">
                        <p className="text-base font-bold text-gray-900 tabular-nums">
                          {formatCurrency(payment.amount)}
                        </p>
                      </div>

                      {/* Print Button → Navigate to Invoice */}
                      <Link href={`/invoice/${payment.id}`}>
                        <Button
                          id={`print-${payment.id}`}
                          className="ml-2 h-9 gap-1.5 rounded-lg bg-[#007BFF] px-4 text-xs font-semibold text-white shadow-md shadow-[#007BFF]/20 transition-all duration-200 hover:bg-blue-700 hover:shadow-lg hover:shadow-[#007BFF]/30 active:scale-[0.97]"
                        >
                          <Printer className="h-3.5 w-3.5" />
                          พิมพ์
                        </Button>
                      </Link>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>

          {/* Summary */}
          <Card className="mt-6 border-0 bg-linear-to-r from-gray-50 to-gray-100/50 shadow-sm">
            <CardContent className="p-5">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-500">
                  ยอดรวมทั้งหมด
                </span>
                <span className="text-xl font-bold text-gray-900 tabular-nums">
                  {formatCurrency(totalAmount)}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
