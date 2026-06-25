"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import {
  User,
  Mail,
  Lock,
  Phone,
  MapPin,
  Briefcase,
  ShieldAlert,
} from "lucide-react";

export default function Register() {
  const { register, isAuthenticated } = useAuth();
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("Dhaka, Bangladesh");
  const [role, setRole] = useState("buyer");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  React.useEffect(() => {
    if (isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(name, email, password, role, phone, location);
      router.push("/dashboard");
    } catch (err) {
      setError(err.message || "Registration failed. Try using another email.");
    } finally {
      setLoading(false);
    }
  };

  const locationsList = [
    "Dhaka, Bangladesh",
    "Chittagong, Bangladesh",
    "Sylhet, Bangladesh",
    "Rajshahi, Bangladesh",
    "Khulna, Bangladesh",
    "Barisal, Bangladesh",
    "Rangpur, Bangladesh",
  ];

  return (
    <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-slate-50 dark:bg-slate-950 transition">
      <div className="max-w-md w-full space-y-8 p-4 sm:p-8 bg-white border border-slate-200/80 rounded-3xl dark:bg-slate-900 dark:border-slate-800 shadow-xl">
        <div className="text-center">
          <h2 className="text-3xl font-black tracking-tight bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-300">
            Create Account
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Join the ReSell Hub community and trade pre-owned goods.
          </p>
        </div>

        {error && (
          <div className="flex items-center space-x-2 rounded-xl bg-red-50 p-4 text-sm text-red-600 dark:bg-red-950/20 dark:text-red-400 border border-red-200/50 dark:border-red-950/50">
            <ShieldAlert className="h-5 w-5 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          {/* Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <User className="h-5 w-5" />
              </span>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:focus:bg-slate-950"
                placeholder="Md. Rakib Hasan"
              />
            </div>
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Email Address
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Mail className="h-5 w-5" />
              </span>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:focus:bg-slate-950"
                placeholder="rakib.hasan@gmail.com"
              />
            </div>
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Password
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Lock className="h-5 w-5" />
              </span>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:focus:bg-slate-950"
                placeholder="Min 6 characters"
              />
            </div>
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Phone Number
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Phone className="h-5 w-5" />
              </span>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:focus:bg-slate-950"
                placeholder="+8801712345678"
              />
            </div>
          </div>

          {/* Location Selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5">
              Location
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <MapPin className="h-5 w-5" />
              </span>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-3 pl-10 pr-4 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-900 dark:text-slate-200 dark:focus:bg-slate-950 appearance-none"
              >
                {locationsList.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Role selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Select Account Role
            </label>
            <div className="grid grid-cols-2 gap-4">
              <label
                className={`flex items-center justify-center space-x-2 border rounded-xl py-3 cursor-pointer text-sm font-semibold transition ${
                  role === "buyer"
                    ? "border-blue-600 bg-blue-50/20 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                    : "border-slate-200 bg-slate-50/10 text-slate-600 dark:border-slate-800 dark:text-slate-400"
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="buyer"
                  checked={role === "buyer"}
                  onChange={() => setRole("buyer")}
                  className="sr-only"
                />
                <span>Buyer</span>
              </label>

              <label
                className={`flex items-center justify-center space-x-2 border rounded-xl py-3 cursor-pointer text-sm font-semibold transition ${
                  role === "seller"
                    ? "border-blue-600 bg-blue-50/20 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                    : "border-slate-200 bg-slate-50/10 text-slate-600 dark:border-slate-800 dark:text-slate-400"
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="seller"
                  checked={role === "seller"}
                  onChange={() => setRole("seller")}
                  className="sr-only"
                />
                <span>Seller</span>
              </label>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex justify-center py-3 sm:py-3.5 px-4 border border-transparent text-xs sm:text-sm font-bold rounded-xl text-white bg-blue-600 hover:bg-blue-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-lg shadow-blue-500/10 transition disabled:opacity-50 pt-2"
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-slate-500 dark:text-slate-400">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-bold text-blue-600 hover:underline dark:text-blue-400"
          >
            Sign In Here
          </Link>
        </p>
      </div>
    </div>
  );
}
