"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { Mail, Lock, LogIn, Eye, EyeOff, AlertCircle, X, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { apiService } from "@/lib/api-client";

/* ── Inline error label ── */
function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-500 animate-[fieldErrorIn_0.25s_ease-out]">
      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
      {message}
    </p>
  );
}

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
    const t = setTimeout(onClose, 4000);
    return () => clearTimeout(t);
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

/* ── Main page ── */
export default function LoginPage() {
  const router = useRouter();
  const [step, setStep] = useState<"email" | "otp">("email");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [requestedEmail, setRequestedEmail] = useState("");

  const [errors, setErrors] = useState<{ email?: string; otp?: string }>({});
  const [toast, setToast] = useState<{ message: string; type?: "error" | "success" } | null>(null);

  const clearToast = useCallback(() => setToast(null), []);

  /* Request OTP */
  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email.trim()) {
      setErrors({ email: "กรุณากรอกอีเมล" });
      setToast({ message: "กรุณากรอกอีเมล", type: "error" });
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setErrors({ email: "รูปแบบอีเมลไม่ถูกต้อง" });
      setToast({ message: "รูปแบบอีเมลไม่ถูกต้อง", type: "error" });
      return;
    }

    setErrors({});
    setToast(null);
    setIsLoading(true);

    try {
      const response = await apiService.requestOTP(email);

      if (response.error) {
        setToast({ message: response.error, type: "error" });
      } else if (response.data) {
        setRequestedEmail(email);
        setStep("otp");
        setToast({
          message: `OTP ถูกส่งไปยัง ${email}${response.data.otp ? ` (OTP: ${response.data.otp})` : ""}`,
          type: "success",
        });
      }
    } catch (error: any) {
      setToast({ message: error.message || "เกิดข้อผิดพลาด", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  /* Login with OTP */
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!otp.trim()) {
      setErrors({ otp: "กรุณากรอกรหัส OTP" });
      setToast({ message: "กรุณากรอกรหัส OTP", type: "error" });
      return;
    }

    if (otp.length !== 6) {
      setErrors({ otp: "OTP ต้องมี 6 ตัวอักษร" });
      setToast({ message: "OTP ต้องมี 6 ตัวอักษร", type: "error" });
      return;
    }

    setErrors({});
    setToast(null);
    setIsLoading(true);

    try {
      const response = await apiService.loginWithOTP(requestedEmail, otp);

      if (response.error) {
        setToast({ message: response.error, type: "error" });
      } else if (response.data) {
        // Store token in localStorage (in production, use httpOnly cookies)
        localStorage.setItem("auth_token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));

        setToast({ message: "เข้าสู่ระบบสำเร็จ!", type: "success" });

        // Redirect to dashboard after successful login
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      }
    } catch (error: any) {
      setToast({ message: error.message || "เกิดข้อผิดพลาดในการเข้าสู่ระบบ", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  /* Go back to email step */
  const handleBackToEmail = () => {
    setStep("email");
    setOtp("");
    setErrors({});
  };

  /* Resend OTP */
  const handleResendOTP = async () => {
    setIsLoading(true);
    try {
      const response = await apiService.requestOTP(requestedEmail);

      if (response.error) {
        setToast({ message: response.error, type: "error" });
      } else if (response.data) {
        setToast({
          message: `ส่ง OTP ใหม่แล้ว${response.data.otp ? ` (OTP: ${response.data.otp})` : ""}`,
          type: "success",
        });
      }
    } catch (error: any) {
      setToast({ message: error.message || "เกิดข้อผิดพลาด", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center bg-[#F8FAFC] px-4 overflow-hidden">
      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} onClose={clearToast} />}

      {/* Background decoration */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 h-[500px] w-[500px] rounded-full bg-linear-to-br from-[#007BFF]/10 to-[#800000]/5 blur-3xl" />
        <div className="absolute -bottom-40 -left-40 h-[500px] w-[500px] rounded-full bg-linear-to-tr from-[#800000]/8 to-[#007BFF]/5 blur-3xl" />
      </div>

      {/* Login Card */}
      <div className="relative w-full max-w-md animate-[fadeIn_0.6s_ease-out]">
        <Card className="border-0 shadow-xl shadow-black/5 backdrop-blur-sm">
          <CardHeader className="items-center gap-3 pb-2 pt-10">
            {/* Logo */}
            <div className="flex flex-col items-center gap-1">
              <h1 className="text-4xl font-extrabold tracking-tight text-[#800000] drop-shadow-sm">
                Engenius
              </h1>
              <div className="h-1 w-12 rounded-full bg-linear-to-r from-[#800000] to-[#007BFF]" />
            </div>

            <div className="mt-4 text-center">
              <CardTitle className="text-xl font-bold text-gray-800">
                {step === "email" ? "เข้าสู่ระบบ (Admin)" : "กรอกรหัส OTP"}
              </CardTitle>
              <CardDescription className="mt-1.5 text-sm text-gray-500">
                {step === "email"
                  ? "กรุณากรอกอีเมลเพื่อรับรหัส OTP"
                  : `กรอกรหัส OTP ที่ส่งไปยัง ${requestedEmail}`}
              </CardDescription>
            </div>
          </CardHeader>

          <CardContent className="pt-4 pb-10">
            {/* Step 1: Email Input */}
            {step === "email" && (
              <form onSubmit={handleRequestOTP} noValidate className="flex flex-col gap-5">
                {/* Email Field */}
                <div className="group relative">
                  <label
                    htmlFor="login-email"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    อีเมล
                  </label>
                  <div className="relative">
                    <Mail
                      className={`pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors ${
                        errors.email
                          ? "text-red-400"
                          : "text-gray-400 group-focus-within:text-[#007BFF]"
                      }`}
                    />
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="admin@engenius.co.th"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (errors.email) setErrors((prev) => ({ ...prev, email: undefined }));
                      }}
                      className={`h-11 pl-10 text-sm transition-all duration-200 ${
                        errors.email
                          ? "border-red-300 focus-visible:ring-red-200 focus-visible:border-red-400"
                          : "focus-visible:ring-[#007BFF]/30 focus-visible:border-[#007BFF]"
                      }`}
                    />
                  </div>
                  <FieldError message={errors.email} />
                </div>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="mt-2 h-11 w-full bg-[#007BFF] text-white text-sm font-semibold shadow-lg shadow-[#007BFF]/25 transition-all duration-200 hover:bg-blue-700 hover:shadow-xl hover:shadow-[#007BFF]/30 active:scale-[0.98] disabled:opacity-70"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="h-4 w-4 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      กำลังส่ง OTP...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <LogIn className="h-4 w-4" />
                      ขอรหัส OTP
                    </span>
                  )}
                </Button>
              </form>
            )}

            {/* Step 2: OTP Input */}
            {step === "otp" && (
              <form onSubmit={handleLogin} noValidate className="flex flex-col gap-5">
                {/* OTP Field */}
                <div className="group relative">
                  <label
                    htmlFor="login-otp"
                    className="mb-1.5 block text-sm font-medium text-gray-700"
                  >
                    รหัส OTP (6 ตัว)
                  </label>
                  <div className="relative">
                    <Lock
                      className={`pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 transition-colors ${
                        errors.otp
                          ? "text-red-400"
                          : "text-gray-400 group-focus-within:text-[#007BFF]"
                      }`}
                    />
                    <Input
                      id="login-otp"
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      placeholder="123456"
                      maxLength={6}
                      value={otp}
                      onChange={(e) => {
                        const value = e.target.value.replace(/\D/g, "");
                        setOtp(value);
                        if (errors.otp) setErrors((prev) => ({ ...prev, otp: undefined }));
                      }}
                      className={`h-11 pl-10 text-sm tracking-widest transition-all duration-200 ${
                        errors.otp
                          ? "border-red-300 focus-visible:ring-red-200 focus-visible:border-red-400"
                          : "focus-visible:ring-[#007BFF]/30 focus-visible:border-[#007BFF]"
                      }`}
                    />
                  </div>
                  <FieldError message={errors.otp} />
                </div>

                {/* Resend OTP Link */}
                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={isLoading}
                    className="text-sm text-[#007BFF] hover:text-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    ส่งรหัส OTP ใหม่
                  </button>
                </div>

                {/* Back Button */}
                <Button
                  type="button"
                  onClick={handleBackToEmail}
                  variant="outline"
                  className="h-11 w-full"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  กลับไปกรอกอีเมล
                </Button>

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="mt-2 h-11 w-full bg-[#007BFF] text-white text-sm font-semibold shadow-lg shadow-[#007BFF]/25 transition-all duration-200 hover:bg-blue-700 hover:shadow-xl hover:shadow-[#007BFF]/30 active:scale-[0.98] disabled:opacity-70"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg
                        className="h-4 w-4 animate-spin"
                        viewBox="0 0 24 24"
                        fill="none"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        />
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                        />
                      </svg>
                      กำลังตรวจสอบ...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <LogIn className="h-4 w-4" />
                      เข้าสู่ระบบ
                    </span>
                  )}
                </Button>
              </form>
            )}
          </CardContent>
        </Card>

        {/* Footer text */}
        <p className="mt-6 text-center text-xs text-gray-400">
          © 2026 Engenius — Tax Invoice Management System
        </p>
      </div>
    </div>
  );
}
