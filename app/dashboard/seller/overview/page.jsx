"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Package, LineChart, Banknote, ShoppingBag } from "lucide-react";
import api from "../../../../services/api.js";

export default function SellerOverview() {
  const [cards, setCards] = useState({
    totalProducts: 0,
    totalSales: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSellerData = async () => {
      try {
        const response = await api.get("/payments/analytics/seller");
        if (response.data?.cards) {
          setCards(response.data.cards);
        }
      } catch (err) {
        console.error("Failed to load seller metrics", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSellerData();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="h-32 rounded-2xl bg-slate-200 dark:bg-slate-800"
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-black md:text-3xl">Seller Overview</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold">
          Monitor your sales performance and stock listings.
        </p>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* Total Products */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 dark:bg-slate-900 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Products Listed
            </span>
            <p className="text-3xl font-black text-slate-900 dark:text-white">
              {cards.totalProducts}
            </p>
          </div>
          <div className="rounded-full bg-blue-50 p-4 dark:bg-blue-950/40">
            <Package className="h-6 w-6 text-blue-500" />
          </div>
        </div>

        {/* Total Sales */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 dark:bg-slate-900 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Sales
            </span>
            <p className="text-3xl font-black text-slate-900 dark:text-white">
              {cards.totalSales}
            </p>
          </div>
          <div className="rounded-full bg-indigo-50 p-4 dark:bg-indigo-950/40">
            <LineChart className="h-6 w-6 text-indigo-500" />
          </div>
        </div>

        {/* Earnings */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 dark:bg-slate-900 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Net Revenue
            </span>
            <p className="text-2xl font-black text-slate-900 dark:text-white">
              BDT {cards.totalRevenue.toLocaleString()}
            </p>
          </div>
          <div className="rounded-full bg-green-50 p-4 dark:bg-green-950/40">
            <Banknote className="h-6 w-6 text-green-500" />
          </div>
        </div>

        {/* Pending Orders */}
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 dark:bg-slate-900 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Pending Actions
            </span>
            <p className="text-3xl font-black text-slate-900 dark:text-white">
              {cards.pendingOrders}
            </p>
          </div>
          <div className="rounded-full bg-yellow-50 p-4 dark:bg-yellow-950/40">
            <ShoppingBag className="h-6 w-6 text-yellow-500" />
          </div>
        </div>
      </div>

      {/* Seller Checklist Section */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-8 dark:bg-slate-900 dark:border-slate-800 shadow-sm space-y-4">
        <h2 className="text-lg font-extrabold text-slate-800 dark:text-slate-100">
          Quick Actions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Link
            href="/dashboard/seller/add-product"
            className="p-4 rounded-xl border border-slate-100 hover:border-blue-500 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800 transition block"
          >
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
              List New Product
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              Upload images, set categories, conditions, and publish pricing.
            </p>
          </Link>
          <Link
            href="/dashboard/seller/manage-orders"
            className="p-4 rounded-xl border border-slate-100 hover:border-blue-500 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800 transition block"
          >
            <h3 className="font-bold text-sm text-slate-800 dark:text-slate-200">
              Process Orders
            </h3>
            <p className="text-xs text-slate-400 mt-1">
              View pending orders, update shipping progress, print receipts.
            </p>
          </Link>
        </div>
      </div>
    </div>
  );
}
