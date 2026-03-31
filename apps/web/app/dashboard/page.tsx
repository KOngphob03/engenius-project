"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { LogOut, FileText, Search, Home } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem("auth_token");
    const userData = localStorage.getItem("user");

    if (!token || !userData) {
      router.push("/login");
      return;
    }

    try {
      setUser(JSON.parse(userData));
    } catch {
      router.push("/login");
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user");
    router.push("/login");
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">กำลังโหลด...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Header */}
      <header className="border-b bg-white">
        <div className="container mx-auto flex items-center justify-between px-6 py-4">
          <div className="flex items-center gap-3">
            <Home className="h-6 w-6 text-[#800000]" />
            <h1 className="text-xl font-bold text-[#800000]">Engenius</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              ยินดีต้อนรับ, {user.name || user.email}
            </span>
            <Button
              onClick={handleLogout}
              variant="outline"
              size="sm"
              className="flex items-center gap-2"
            >
              <LogOut className="h-4 w-4" />
              ออกจากระบบ
            </Button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">แดชบอร์ด</h2>
          <p className="mt-1 text-gray-600">ภาพรวมระบบจัดการใบเสร็จรับเงิน</p>
        </div>

        {/* Quick Actions */}
        <div className="grid gap-6 md:grid-cols-3">
          <button
            onClick={() => router.push("/invoice")}
            className="flex items-center gap-4 rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-[#007BFF]/30"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#007BFF]/10">
              <FileText className="h-6 w-6 text-[#007BFF]" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-800">ใบเสร็จรับเงิน</h3>
              <p className="text-sm text-gray-500">จัดการใบเสร็จทั้งหมด</p>
            </div>
          </button>

          <button
            onClick={() => router.push("/search")}
            className="flex items-center gap-4 rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-[#007BFF]/30"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#800000]/10">
              <Search className="h-6 w-6 text-[#800000]" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-800">ค้นหา</h3>
              <p className="text-sm text-gray-500">ค้นหาเอกสาร</p>
            </div>
          </button>

          <button
            onClick={() => router.push("/transactions")}
            className="flex items-center gap-4 rounded-xl border bg-white p-6 shadow-sm transition-all hover:shadow-md hover:border-[#007BFF]/30"
          >
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-[#800000]/10">
              <FileText className="h-6 w-6 text-[#800000]" />
            </div>
            <div className="text-left">
              <h3 className="font-semibold text-gray-800">ธุรกรรม</h3>
              <p className="text-sm text-gray-500">ประวัติธุรกรรมทั้งหมด</p>
            </div>
          </button>
        </div>
      </main>
    </div>
  );
}
