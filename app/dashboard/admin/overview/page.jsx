"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Users,
  Package,
  ShoppingCart,
  DollarSign,
  ShieldAlert,
  BarChart3,
  Settings,
} from "lucide-react";
import api from "../../../../services/api.js";

export default function AdminOverview() {
  const [metrics, setMetrics] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAdminMetrics = async () => {
      try {
        const response = await api.get("/payments/analytics/admin");
        if (response.data?.cards) {
          setMetrics(response.data.cards);
        }
      } catch (err) {
        console.error("Failed to load admin metrics", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAdminMetrics();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded"></div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-10"
    >
      <div>
        <h1 className="text-2xl font-black md:text-3xl">Admin Console</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold">
          Platform-wide controls, moderations, statistics, and user policies.
        </p>
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-6 dark:bg-slate-900 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Users
            </span>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {metrics.totalUsers}
            </p>
          </div>
          <div className="rounded-full bg-blue-50 p-3 sm:p-4 dark:bg-blue-950/40 flex-shrink-0">
            <Users className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-6 dark:bg-slate-900 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Products
            </span>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {metrics.totalProducts}
            </p>
          </div>
          <div className="rounded-full bg-purple-50 p-3 sm:p-4 dark:bg-purple-950/40 flex-shrink-0">
            <Package className="h-5 w-5 sm:h-6 sm:w-6 text-purple-500" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-6 dark:bg-slate-900 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Orders
            </span>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
              {metrics.totalOrders}
            </p>
          </div>
          <div className="rounded-full bg-amber-50 p-3 sm:p-4 dark:bg-amber-950/40 flex-shrink-0">
            <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 text-amber-500" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-6 dark:bg-slate-900 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Gross Sales
            </span>
            <p className="text-lg sm:text-2xl font-black text-slate-900 dark:text-white break-all">
              BDT {metrics.totalRevenue.toLocaleString()}
            </p>
          </div>
          <div className="rounded-full bg-green-50 p-3 sm:p-4 dark:bg-green-950/40 flex-shrink-0">
            <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />
          </div>
        </div>
      </div>

      {/* Admin Modules Grid */}
      <div className="space-y-4">
        <h2 className="text-lg font-extrabold text-slate-800 dark:text-slate-100">
          Management Portals
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Link
            href="/dashboard/admin/manage-users"
            className="p-4 sm:p-6 rounded-2xl border border-slate-200/80 bg-white hover:border-blue-500 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:hover:bg-slate-800 transition block space-y-4"
          >
            <div className="rounded-xl bg-blue-50 p-3 w-fit dark:bg-blue-950/30">
              <Users className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white">
                Manage Users
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Review accounts, block/unblock, verify seller badges, or remove
                users.
              </p>
            </div>
          </Link>

          <Link
            href="/dashboard/admin/manage-products"
            className="p-4 sm:p-6 rounded-2xl border border-slate-200/80 bg-white hover:border-purple-500 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:hover:bg-slate-800 transition block space-y-4"
          >
            <div className="rounded-xl bg-purple-50 p-3 w-fit dark:bg-purple-950/30">
              <Package className="h-6 w-6 text-purple-500" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white">
                Manage Products
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Approve or reject listing uploads, review reports, and handle
                moderation.
              </p>
            </div>
          </Link>

          <Link
            href="/dashboard/admin/manage-orders"
            className="p-4 sm:p-6 rounded-2xl border border-slate-200/80 bg-white hover:border-amber-500 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:hover:bg-slate-800 transition block space-y-4"
          >
            <div className="rounded-xl bg-amber-50 p-3 w-fit dark:bg-amber-950/30">
              <ShoppingCart className="h-6 w-6 text-amber-500" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white">
                Manage Orders
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                View entire marketplace order history, resolve disputes, and
                track status flow.
              </p>
            </div>
          </Link>

          <Link
            href="/dashboard/admin/analytics"
            className="p-4 sm:p-6 rounded-2xl border border-slate-200/80 bg-white hover:border-green-500 hover:bg-slate-50 dark:bg-slate-900 dark:border-slate-800 dark:hover:bg-slate-800 transition block space-y-4"
          >
            <div className="rounded-xl bg-green-50 p-3 w-fit dark:bg-green-950/30">
              <BarChart3 className="h-6 w-6 text-green-500" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 dark:text-white">
                Platform Analytics
              </h3>
              <p className="text-xs text-slate-400 mt-1">
                Monitor user registrations, categories growth, and platform
                revenue charts.
              </p>
            </div>
          </Link>
        </div>
      </div>
    </motion.div>
  );
}
