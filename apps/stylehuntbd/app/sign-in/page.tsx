"use client";
import CoFounderBranding from "@/components/CoFounderBranding";
import { login } from "@/lib/actions/auth-actions";
import { siteConfig } from "@/lib/site-config";
import { ArrowRight, Eye, EyeOff, Loader2, Lock, User } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFormState, useFormStatus } from "react-dom";
function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-xl shadow-lg shadow-blue-600/20 text-sm font-bold text-white bg-blue-600 hover:bg-blue-700 hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:hover:scale-100 transition-all duration-200"
    >
      {pending ? (
        <Loader2 className="animate-spin w-5 h-5" />
      ) : (
        <>
          Sign In <ArrowRight size={18} />
        </>
      )}
    </button>
  );
}
export default function SignInPage() {
  const [state, dispatch] = useFormState(login, undefined);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  useEffect(() => {
    if (state?.success) {
      window.location.href = "/";
    }
  }, [state, router]);
  return (
    <div className="min-h-screen bg-neutral-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      {}
      <div className="absolute top-[-10%] right-[-5%] w-[500px] h-[500px] bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-purple-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
      <div className="max-w-md w-full space-y-8 relative z-10">
        <div className="text-center">
          <Link href="/" className="inline-block">
            <h1 className="text-4xl font-extrabold tracking-tight text-neutral-900 mb-2">
              {siteConfig.name}
            </h1>
          </Link>
          <h2 className="text-2xl font-bold text-neutral-900 mt-6">
            Welcome Back
          </h2>
          <p className="mt-2 text-neutral-600">
            Please sign in to your account
          </p>
        </div>
        <div className="bg-white py-10 px-8 shadow-xl shadow-neutral-200/50 rounded-3xl border border-neutral-100">
          <form action={dispatch} className="space-y-6">
            <div>
              <label
                htmlFor="identifier"
                className="block text-sm font-bold text-neutral-700 mb-1.5"
              >
                Email or Phone
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-blue-500 transition-colors">
                  <User size={18} />
                </div>
                <input
                  id="identifier"
                  name="identifier"
                  type="text"
                  required
                  placeholder="e.g. 01XXXXXXXXX or email"
                  className="appearance-none block w-full pl-11 pr-4 py-3.5 border border-neutral-200 rounded-xl bg-neutral-50 focus:bg-white text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                />
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label
                  htmlFor="password"
                  className="block text-sm font-bold text-neutral-700"
                >
                  Password
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm font-semibold text-blue-600 hover:text-blue-800 hover:underline"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-blue-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="appearance-none block w-full pl-11 pr-12 py-3.5 border border-neutral-200 rounded-xl bg-neutral-50 focus:bg-white text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
            {state?.error && (
              <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium flex items-center gap-2 animate-shake">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 block"></span>
                {state.error}
              </div>
            )}
            <div>
              <SubmitButton />
            </div>
          </form>
          <div className="mt-8">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-neutral-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-neutral-500 font-medium">
                  Don't have an account?
                </span>
              </div>
            </div>
            <div className="mt-6">
              <Link
                href="/sign-up"
                className="w-full flex justify-center items-center py-3.5 px-4 border border-neutral-200 rounded-xl shadow-sm text-sm font-bold text-neutral-700 bg-white hover:bg-neutral-50 hover:border-neutral-300 transition-all duration-200"
              >
                Create new account
              </Link>
            </div>
          </div>
          <div className="mt-8 border-t border-dotted border-neutral-100">
            <CoFounderBranding />
          </div>
        </div>
      </div>
    </div>
  );
}
