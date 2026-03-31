"use client";

import { useState, useCallback, useEffect } from "react";
import { Search, User, ChevronRight, AlertCircle, X, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
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

interface Customer {
  id: string;
  firstname: string;
  lastname: string;
  email: string;
}

export default function SearchPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [allCustomers, setAllCustomers] = useState<Customer[]>([]);
  const [filteredResults, setFilteredResults] = useState<Customer[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [toast, setToast] = useState<{ message: string; type?: "error" | "success" } | null>(null);

  const clearToast = useCallback(() => setToast(null), []);

  // Load all customers on mount
  useEffect(() => {
    const loadCustomers = async () => {
      try {
        const response = await apiService.getAllUsers(100, 0);

        if (response.error) {
          setToast({ message: response.error, type: "error" });
        } else if (response.data) {
          // Handle both array and single object response
          const users = Array.isArray(response.data) ? response.data : [response.data];
          setAllCustomers(users);
          setFilteredResults(users);
        }
      } catch (error: any) {
        setToast({ message: error.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล", type: "error" });
      } finally {
        setIsLoading(false);
      }
    };

    loadCustomers();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  // Filter customers as user types
  useEffect(() => {
    if (!query.trim()) {
      setFilteredResults(allCustomers);
      return;
    }

    const filtered = allCustomers.filter((customer) => {
      const searchLower = query.toLowerCase();
      return (
        customer.email?.toLowerCase().includes(searchLower) ||
        customer.firstname?.toLowerCase().includes(searchLower) ||
        customer.lastname?.toLowerCase().includes(searchLower)
      );
    });
    setFilteredResults(filtered);
  }, [query, allCustomers]);

  return (
    <div className="relative min-h-screen bg-[#F8FAFC]">
      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={clearToast} />}

      {/* Top Bar */}
      <header className="sticky top-0 z-10 border-b border-gray-100 bg-white/80 backdrop-blur-lg">
        <div className="mx-auto flex h-14 max-w-3xl items-center justify-between px-4">
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
      <main className="mx-auto max-w-3xl px-4 py-10">
        {/* Heading Section */}
        <div className="mb-8 animate-[fadeIn_0.5s_ease-out]">
          <h2 className="text-2xl font-bold text-gray-900">ค้นหาลูกค้า</h2>
          <p className="mt-1.5 text-sm text-gray-500">
            รายชื่อลูกค้าทั้งหมด ({filteredResults.length} คน)
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6 animate-[fadeIn_0.5s_ease-out_0.1s_both]">
          <div className="relative">
            <Search className="pointer-events-none absolute left-3.5 top-1/2 h-5 w-5 -translate-y-1/2 text-gray-400" />
            <Input
              id="search-email"
              type="text"
              placeholder="ค้นหาด้วย Email, ชื่อ หรือนามสกุล..."
              value={query}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuery(e.target.value)}
              className="h-12 rounded-xl pl-11 text-base shadow-sm transition-all duration-200 focus-visible:ring-[#007BFF]/30 focus-visible:border-[#007BFF] focus-visible:shadow-md"
            />
          </div>
        </div>

        {/* Results Section */}
        <div className="space-y-3">
          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-200 border-t-[#007BFF]" />
              <p className="mt-3 text-sm text-gray-400">กำลังโหลดข้อมูล...</p>
            </div>
          ) : filteredResults.length === 0 ? (
            <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 py-16 text-center animate-[fadeIn_0.3s_ease-out]">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gray-100">
                <Search className="h-6 w-6 text-gray-400" />
              </div>
              <p className="mt-4 text-sm font-medium text-gray-600">
                ไม่พบลูกค้า
              </p>
              <p className="mt-1 text-xs text-gray-400">
                ลองค้นหาด้วยคำอื่น
              </p>
            </div>
          ) : (
            filteredResults.map((customer, index) => (
              <Link
                key={customer.id}
                href={`/transactions/${customer.id}`}
                className="block"
              >
                <Card
                  id={`customer-card-${customer.id}`}
                  className="group cursor-pointer border-0 p-4 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 hover:border-[#007BFF]/20 active:scale-[0.995]"
                  style={{
                    animationDelay: `${Math.min(index * 0.05, 0.5)}s`,
                    animation: "fadeIn 0.4s ease-out both",
                  }}
                >
                  <div className="flex items-center gap-4">
                    {/* Avatar */}
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-linear-to-br from-[#007BFF]/15 to-[#800000]/10 transition-all duration-200 group-hover:from-[#007BFF]/25 group-hover:to-[#800000]/15">
                      <User className="h-5 w-5 text-[#007BFF]" />
                    </div>

                    {/* Info */}
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-gray-900">
                        {customer.firstname} {customer.lastname}
                      </p>
                      <p className="mt-0.5 truncate text-xs text-gray-400">
                        {customer.email}
                      </p>
                    </div>

                    {/* Arrow */}
                    <ChevronRight className="h-4 w-4 shrink-0 text-gray-300 transition-all duration-200 group-hover:text-[#007BFF] group-hover:translate-x-0.5" />
                  </div>
                </Card>
              </Link>
            ))
          )}
        </div>
      </main>
    </div>
  );
}
