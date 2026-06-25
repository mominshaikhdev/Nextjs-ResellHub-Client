"use client";

import React, { useEffect, useState } from "react";
import {
  CreditCard,
  Search,
  Filter,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import api from "../../../../services/api.js";

const STATUS_BADGES = {
  paid: "border-green-200 text-green-600 bg-green-50/15",
  success: "border-green-200 text-green-600 bg-green-50/15",
  pending: "border-yellow-200 text-yellow-600 bg-yellow-50/15",
  failed: "border-red-200 text-red-600 bg-red-50/15",
  refunded: "border-slate-300 text-slate-500 bg-slate-50/10",
};

const ALL_STATUSES = ["all", "paid", "pending", "failed", "refunded"];

export default function AdminTransactions() {
  const [payments, setPayments] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await api.get("/payments/admin");
        setPayments(response.data.payments || []);
        setTotalRevenue(response.data.totalRevenue || 0);
      } catch (err) {
        console.error("Failed to load transactions", err);
        setError("Could not retrieve platform transactions.");
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  const filtered = payments.filter((p) => {
    const q = search.toLowerCase();
    const matchesSearch =
      !q ||
      p.transactionId?.toLowerCase().includes(q) ||
      p.productTitle?.toLowerCase().includes(q) ||
      p.buyerId?.name?.toLowerCase().includes(q) ||
      p.buyerId?.email?.toLowerCase().includes(q);
    const matchesStatus =
      filterStatus === "all" || p.paymentStatus === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded"></div>
        <div className="h-28 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
        <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black md:text-3xl">
          Transaction Monitoring
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold">
          Monitor all platform payment activity, search transactions, and track
          revenue.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 dark:bg-red-950/20 dark:border-red-900 dark:text-red-400 rounded-xl">
          <span className="text-sm font-semibold">{error}</span>
        </div>
      )}

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-6 dark:bg-slate-900 dark:border-slate-800 shadow-sm flex flex-col justify-between min-h-[110px] sm:min-h-[130px]">
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Revenue
            </span>
            <div className="rounded-xl bg-green-50 p-2 dark:bg-green-950/40 flex-shrink-0">
              <DollarSign className="h-5 w-5 text-green-500" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-4 break-words">
            BDT {totalRevenue.toLocaleString()}
          </p>
        </div>
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-6 dark:bg-slate-900 dark:border-slate-800 shadow-sm flex flex-col justify-between min-h-[110px] sm:min-h-[130px]">
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Transactions
            </span>
            <div className="rounded-xl bg-blue-50 p-2 dark:bg-blue-950/40 flex-shrink-0">
              <CreditCard className="h-5 w-5 text-blue-500" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-4 break-words">
            {payments.length}
          </p>
        </div>
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-6 dark:bg-slate-900 dark:border-slate-800 shadow-sm flex flex-col justify-between min-h-[110px] sm:min-h-[130px]">
          <div className="flex items-center justify-between w-full">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Paid
            </span>
            <div className="rounded-xl bg-indigo-50 p-2 dark:bg-indigo-950/40 flex-shrink-0">
              <TrendingUp className="h-5 w-5 text-indigo-500" />
            </div>
          </div>
          <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-4 break-words">
            {
              payments.filter(
                (p) =>
                  p.paymentStatus === "paid" || p.paymentStatus === "success",
              ).length
            }
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
            <Search className="h-5 w-5" />
          </span>
          <input
            type="text"
            placeholder="Search by transaction ID, buyer, product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200/80 bg-white dark:bg-slate-900 dark:border-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold shadow-sm transition"
          />
        </div>
        <div className="relative w-full sm:w-48 flex-shrink-0">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
            <Filter className="h-4 w-4" />
          </span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200/80 bg-white dark:bg-slate-900 dark:border-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold shadow-sm transition appearance-none cursor-pointer capitalize"
          >
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s}>
                {s === "all" ? "All Statuses" : s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Table */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-800 bg-white dark:bg-slate-900/40">
          <CreditCard className="h-10 w-10 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400">
            No transactions found.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden dark:bg-slate-900 dark:border-slate-800 shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-sm">
              <thead className="bg-slate-50 dark:bg-slate-950 font-bold text-slate-500 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4 text-left">Transaction ID</th>
                  <th className="px-6 py-4 text-left">Buyer</th>
                  <th className="px-6 py-4 text-left">Product</th>
                  <th className="px-6 py-4 text-left">Amount</th>
                  <th className="px-6 py-4 text-left">Method</th>
                  <th className="px-6 py-4 text-left">Date</th>
                  <th className="px-6 py-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filtered.map((p) => (
                  <tr
                    key={p._id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition"
                  >
                    <td className="px-6 py-4 font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                      {p.transactionId}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-700 dark:text-slate-300">
                        {p.buyerId?.name || "—"}
                      </p>
                      <p className="text-xs text-slate-400 font-mono">
                        {p.buyerId?.email}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {p.productTitle || "—"}
                    </td>
                    <td className="px-6 py-4 font-extrabold text-slate-900 dark:text-white">
                      BDT {p.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-slate-500 capitalize">
                      {p.paymentMethod || "card"}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(
                        p.paymentDate || p.createdAt,
                      ).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 text-xs font-bold rounded-full border capitalize ${STATUS_BADGES[p.paymentStatus] || STATUS_BADGES.refunded}`}
                      >
                        {p.paymentStatus}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
