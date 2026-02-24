"use client";
import CoFounderBranding from "@/components/CoFounderBranding";
import { signUp } from "@/lib/actions/auth-actions";
import { siteConfig } from "@/lib/site-config";
import {
  ArrowRight,
  Eye,
  EyeOff,
  Loader2,
  Lock,
  Mail,
  Phone,
  User,
} from "lucide-react";
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
          Create Account <ArrowRight size={18} />
        </>
      )}
    </button>
  );
}
export default function SignUpPage() {
  const [state, dispatch] = useFormState(signUp, undefined);
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
            Create an Account
          </h2>
          <p className="mt-2 text-neutral-600">
            Join us for exclusive deals and faster checkout
          </p>
        </div>
        <div className="bg-white py-10 px-8 shadow-xl shadow-neutral-200/50 rounded-3xl border border-neutral-100">
          <form action={dispatch} className="space-y-5">
            {state?.error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-600 font-medium animate-shake">
                {state.error}
              </div>
            )}
            <div>
              <label
                htmlFor="name"
                className="block text-sm font-bold text-neutral-700 mb-1.5"
              >
                Full Name
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-blue-500 transition-colors">
                  <User size={18} />
                </div>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  placeholder="e.g. John Doe"
                  className="appearance-none block w-full pl-11 pr-4 py-3.5 border border-neutral-200 rounded-xl bg-neutral-50 focus:bg-white text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-bold text-neutral-700 mb-1.5"
              >
                Email address
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-blue-500 transition-colors">
                  <Mail size={18} />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  placeholder="you@example.com"
                  className="appearance-none block w-full pl-11 pr-4 py-3.5 border border-neutral-200 rounded-xl bg-neutral-50 focus:bg-white text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-bold text-neutral-700 mb-1.5"
              >
                Phone Number (Required)
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-blue-500 transition-colors">
                  <Phone size={18} />
                </div>
                <input
                  id="phoneNumber"
                  name="phoneNumber"
                  type="tel"
                  required
                  placeholder="01XXXXXXXXX"
                  className="appearance-none block w-full pl-11 pr-4 py-3.5 border border-neutral-200 rounded-xl bg-neutral-50 focus:bg-white text-neutral-900 placeholder-neutral-400 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all font-medium"
                />
              </div>
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-bold text-neutral-700 mb-1.5"
              >
                Password
              </label>
              <div className="relative group">
                <div className="absolute left-4 top-1/2 -translate-y-1/2 text-neutral-400 group-focus-within:text-blue-500 transition-colors">
                  <Lock size={18} />
                </div>
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={6}
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
            <div className="pt-2">
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
                  Already have an account?
                </span>
              </div>
            </div>
            <div className="mt-6">
              <Link
                href="/sign-in"
                className="w-full flex justify-center items-center py-3.5 px-4 border border-neutral-200 rounded-xl shadow-sm text-sm font-bold text-neutral-700 bg-white hover:bg-neutral-50 hover:border-neutral-300 transition-all duration-200"
              >
                Sign in
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
