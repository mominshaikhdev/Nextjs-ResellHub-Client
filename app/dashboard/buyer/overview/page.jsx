"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  Heart,
  CreditCard,
  ChevronRight,
  Clock,
} from "lucide-react";
import api from "../../../../services/api.js";

export default function BuyerOverview() {
  const [orders, setOrders] = useState([]);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOverviewData = async () => {
      try {
        const orderRes = await api.get("/orders/buyer");
        setOrders(orderRes.data);

        const wishlistRes = await api.get("/users/wishlist");
        setWishlistCount(wishlistRes.data.length);
      } catch (err) {
        console.error("Failed to load overview data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchOverviewData();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 rounded-2xl bg-slate-200 dark:bg-slate-800"
            />
          ))}
        </div>
        <div className="h-64 rounded-2xl bg-slate-200 dark:bg-slate-800" />
      </div>
    );
  }

  const paidOrders = orders.filter((o) => o.paymentStatus === "paid");
  const spentMoney = paidOrders.reduce((sum, o) => sum + o.totalAmount, 0);

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-black md:text-3xl">Dashboard Overview</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Quick summary of your shopping activities.
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Total Orders Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 dark:bg-slate-900 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Orders
            </span>
            <p className="text-3xl font-black text-slate-900 dark:text-white">
              {orders.length}
            </p>
          </div>
          <div className="rounded-full bg-blue-50 p-4 dark:bg-blue-950/40">
            <ShoppingBag className="h-6 w-6 text-blue-500" />
          </div>
        </div>

        {/* Wishlist Count Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 dark:bg-slate-900 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Wishlisted Items
            </span>
            <p className="text-3xl font-black text-slate-900 dark:text-white">
              {wishlistCount}
            </p>
          </div>
          <div className="rounded-full bg-pink-50 p-4 dark:bg-pink-950/40">
            <Heart className="h-6 w-6 text-pink-500" />
          </div>
        </div>

        {/* Spent Money Card */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 dark:bg-slate-900 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Expenses
            </span>
            <p className="text-2xl font-black text-slate-900 dark:text-white">
              BDT {spentMoney.toLocaleString()}
            </p>
          </div>
          <div className="rounded-full bg-green-50 p-4 dark:bg-green-950/40">
            <CreditCard className="h-6 w-6 text-green-500" />
          </div>
        </div>
      </div>

      {/* Recent Purchases */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 dark:bg-slate-900 dark:border-slate-800 shadow-sm space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="font-extrabold text-lg flex items-center space-x-2">
            <Clock className="h-5 w-5 text-indigo-500" />
            <span>Recent Orders</span>
          </h2>
          <Link
            href="/dashboard/buyer/orders"
            className="text-xs font-bold text-blue-600 hover:underline dark:text-blue-400"
          >
            View All
          </Link>
        </div>

        {orders.length === 0 ? (
          <p className="text-sm text-slate-500 py-4 text-center">
            You have not placed any orders yet.
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-slate-200 dark:border-slate-800">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-sm">
              <thead className="bg-slate-50 dark:bg-slate-950 font-bold text-slate-500 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4 text-left">Product</th>
                  <th className="px-6 py-4 text-left">Order Date</th>
                  <th className="px-6 py-4 text-left">Amount</th>
                  <th className="px-6 py-4 text-left">Payment</th>
                  <th className="px-6 py-4 text-left">Order Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {orders.slice(0, 3).map((order) => (
                  <tr
                    key={order._id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition"
                  >
                    <td className="px-6 py-4 font-bold text-slate-800 dark:text-slate-200">
                      {order.productId?.title || "Unknown Product"}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {new Date(order.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-800 dark:text-slate-200">
                      BDT {order.totalAmount.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-3 py-1 text-xs font-bold rounded-full border ${
                          order.paymentStatus === "paid"
                            ? "border-green-200 text-green-600 bg-green-50/15"
                            : order.paymentStatus === "pending"
                              ? "border-yellow-200 text-yellow-600 bg-yellow-50/15"
                              : "border-red-200 text-red-600 bg-red-50/15"
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4 uppercase text-xs font-black text-slate-600 dark:text-slate-400">
                      {order.orderStatus}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
