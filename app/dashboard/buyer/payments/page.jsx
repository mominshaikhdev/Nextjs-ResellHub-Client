"use client";

import React, { useEffect, useState } from "react";
import { CreditCard, Calendar, Clock, DollarSign } from "lucide-react";
import api from "../../../../services/api.js";

export default function BuyerPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await api.get("/payments/history");
        setPayments(response.data);
      } catch (error) {
        console.error("Failed to load payment history", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPayments();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="h-28 rounded-2xl bg-slate-200 dark:bg-slate-800"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black md:text-3xl">Payment History</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          View all your secure payment transaction receipts.
        </p>
      </div>

      {payments.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-800 bg-white dark:bg-slate-900/40">
          <CreditCard className="h-10 w-10 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400">
            No payment transaction records found.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden dark:bg-slate-900 dark:border-slate-800 shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-sm">
              <thead className="bg-slate-50 dark:bg-slate-950 font-bold text-slate-500 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4 text-left">Transaction ID</th>
                  <th className="px-6 py-4 text-left">Date</th>
                  <th className="px-6 py-4 text-left">Amount</th>
                  <th className="px-6 py-4 text-left">Payment Method</th>
                  <th className="px-6 py-4 text-left">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {payments.map((txn) => (
                  <tr
                    key={txn._id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition"
                  >
                    <td className="px-6 py-4 font-mono text-xs font-bold text-slate-800 dark:text-slate-200">
                      {txn.transactionId}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(
                        txn.paymentDate || txn.createdAt,
                      ).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-extrabold text-slate-900 dark:text-white">
                      BDT {txn.amount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-slate-500 capitalize">
                      {txn.paymentMethod || "card"}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 text-xs font-bold rounded-full border ${
                          txn.paymentStatus === "success" ||
                          txn.paymentStatus === "paid"
                            ? "border-green-200 text-green-600 bg-green-50/15"
                            : "border-red-200 text-red-600 bg-red-50/15"
                        }`}
                      >
                        {txn.paymentStatus}
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
