"use client";

import React, { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle, ShoppingBag, ArrowRight, Loader2 } from "lucide-react";
import api from "../../services/api.js";

function PaymentSuccessContent() {
  const searchParams = useSearchParams();

  const txn = searchParams.get("txn") || "TXN-UNKNOWN";
  const amount = searchParams.get("amount") || "0";
  const date = searchParams.get("date")
    ? new Date(searchParams.get("date")).toLocaleDateString()
    : new Date().toLocaleDateString();
  const orderId = searchParams.get("orderId") || "";

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let active = true;
    if (orderId) {
      Promise.resolve().then(() => {
        if (!active) return;
        setLoading(true);
        api
          .get(`/orders/${orderId}`)
          .then((res) => {
            if (active) setOrder(res.data);
          })
          .catch((err) => {
            console.error("Failed to fetch order summary", err);
          })
          .finally(() => {
            if (active) setLoading(false);
          });
      });
    }
    return () => {
      active = false;
    };
  }, [orderId]);

  return (
    <div className="flex-1 flex items-center justify-center py-16 px-4 bg-slate-50 dark:bg-slate-950 transition">
      <div className="max-w-lg w-full p-6 sm:p-8 md:p-10 bg-white border border-slate-200/80 rounded-3xl dark:bg-slate-900 dark:border-slate-800 text-center shadow-xl space-y-6">
        <div className="flex justify-center">
          <CheckCircle className="h-16 w-16 text-green-500 fill-green-500/10 animate-bounce" />
        </div>

        <div className="space-y-2">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white">
            Payment Successful!
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            Thank you for your purchase. Your transaction has been verified.
          </p>
        </div>

        {/* Order Summary & Receipt Details */}
        <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 dark:bg-slate-950 dark:border-slate-800 text-left space-y-4">
          <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400">
            Receipt Details
          </h3>

          {loading ? (
            <div className="flex items-center space-x-2 text-slate-500 py-3">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm">Loading order summary...</span>
            </div>
          ) : order ? (
            <div className="mb-4 pb-4 border-b border-slate-200 dark:border-slate-800 flex items-center space-x-3">
              {order.productId?.images?.[0] && (
                <img
                  src={order.productId.images[0]}
                  alt="Product"
                  className="w-12 h-12 rounded-lg object-cover border border-slate-200 dark:border-slate-700"
                />
              )}
              <div className="text-sm flex-1">
                <p className="font-bold text-slate-800 dark:text-slate-200 line-clamp-1">
                  {order.productId?.title || "Unknown Product"}
                </p>
                <p className="text-slate-500 text-xs mt-0.5">
                  Qty: {order.quantity}
                </p>
              </div>
            </div>
          ) : null}

          <div className="divide-y divide-slate-100 dark:divide-slate-800 text-sm">
            <div className="flex justify-between py-3">
              <span className="text-slate-500">Transaction ID</span>
              <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                {txn}
              </span>
            </div>
            {orderId && (
              <div className="flex justify-between py-3">
                <span className="text-slate-500">Order ID</span>
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">
                  {orderId}
                </span>
              </div>
            )}
            <div className="flex justify-between py-3">
              <span className="text-slate-500">Amount Paid</span>
              <span className="font-extrabold text-blue-600 dark:text-blue-400">
                BDT {Number(amount).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between py-3">
              <span className="text-slate-500">Payment Date</span>
              <span className="font-semibold text-slate-800 dark:text-slate-200">
                {date}
              </span>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-4">
          <Link
            href="/dashboard/buyer/orders"
            className="flex-1 py-3 px-4 bg-blue-600 hover:bg-blue-500 text-white font-bold text-sm rounded-xl shadow-md shadow-blue-500/10 transition flex items-center justify-center space-x-2"
          >
            <ShoppingBag className="h-4 w-4" />
            <span>View Order Details</span>
          </Link>
          <Link
            href="/products"
            className="flex-1 py-3 px-4 border border-slate-200 rounded-xl font-semibold text-sm hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800 transition flex items-center justify-center space-x-2"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}

export default function PaymentSuccess() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
        </div>
      }
    >
      <PaymentSuccessContent />
    </Suspense>
  );
}
