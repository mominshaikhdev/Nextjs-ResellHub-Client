"use client";

import React, { useEffect, useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  BarChart3,
  TrendingUp,
  Users,
  ShoppingCart,
  DollarSign,
  PieChart as PieIcon,
} from "lucide-react";
import api from "../../../../services/api.js";

const DUMMY_USER_GROWTH = [
  { month: "Jan", users: 15 },
  { month: "Feb", users: 24 },
  { month: "Mar", users: 38 },
  { month: "Apr", users: 50 },
  { month: "May", users: 65 },
  { month: "Jun", users: 84 },
];

const DUMMY_MONTHLY_ORDERS = [
  { month: "Jan", ordersCount: 22 },
  { month: "Feb", ordersCount: 30 },
  { month: "Mar", ordersCount: 25 },
  { month: "Apr", ordersCount: 45 },
  { month: "May", ordersCount: 38 },
  { month: "Jun", ordersCount: 52 },
];

const DUMMY_CATEGORY_PERF = [
  { category: "Electronics", count: 32 },
  { category: "Furniture", count: 18 },
  { category: "Fashion", count: 25 },
  { category: "Vehicles", count: 12 },
  { category: "Mobiles", count: 45 },
];

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];

function useContainerDimensions() {
  const ref = useRef(null);
  const [width, setWidth] = useState(0);
  const [height, setHeight] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const { inlineSize, blockSize } = entry.borderBoxSize?.[0] || {};
        const w = inlineSize ?? entry.contentRect.width;
        const h = blockSize ?? entry.contentRect.height;
        if (w > 0) setWidth(w);
        if (h > 0) setHeight(h);
      }
    });

    const rect = el.getBoundingClientRect();
    if (rect.width > 0) setWidth(rect.width);
    if (rect.height > 0) setHeight(rect.height);

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return [ref, width, height];
}

function ChartContainer({ children, className = "" }) {
  const [ref, width, height] = useContainerDimensions();

  return (
    <div ref={ref} className={`relative ${className}`}>
      {width > 0 && height > 0 ? (
        <ResponsiveContainer width={width} height={height}>
          {children}
        </ResponsiveContainer>
      ) : (
        <div className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm font-semibold">
          Loading chart...
        </div>
      )}
    </div>
  );
}

export default function AdminAnalytics() {
  const [data, setData] = useState({
    userGrowth: [],
    monthlyOrders: [],
    categoryPerf: [],
    metrics: {
      totalUsers: 0,
      totalProducts: 0,
      totalOrders: 0,
      totalRevenue: 0,
    },
  });
  const [loading, setLoading] = useState(true);
  const [isDummy, setIsDummy] = useState(false);

  useEffect(() => {
    const fetchAdminAnalytics = async () => {
      try {
        const response = await api.get("/payments/analytics/admin");
        const { cards, charts } = response.data;
        if (!charts || !charts.userGrowth) {
          throw new Error("Invalid analytics data structure from API");
        }
        setData({
          userGrowth: charts.userGrowth,
          monthlyOrders: charts.monthlyOrders || [],
          categoryPerf: (charts.categoryPerformance || []).map((c) => ({
            category: c.category || "Unassigned",
            count: c.count,
          })),
          metrics: cards || {
            totalUsers: 0,
            totalProducts: 0,
            totalOrders: 0,
            totalRevenue: 0,
          },
        });
        setIsDummy(false);
      } catch (err) {
        console.error(
          "Failed to load admin analytics, using dummy fallbacks:",
          err,
        );
        // Fallback on error
        setData({
          userGrowth: DUMMY_USER_GROWTH,
          monthlyOrders: DUMMY_MONTHLY_ORDERS,
          categoryPerf: DUMMY_CATEGORY_PERF,
          metrics: {
            totalUsers: 124,
            totalProducts: 245,
            totalOrders: 98,
            totalRevenue: 320000,
          },
        });
        setIsDummy(true);
      } finally {
        setLoading(false);
      }
    };

    fetchAdminAnalytics();
  }, []);

  if (loading) {
    return (
      <div className="animate-pulse space-y-8">
        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
          <div className="h-80 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black md:text-3xl flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-blue-500" /> Platform Insights
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold">
            Overview of total user acquisitions, transaction levels, and
            category counts.
          </p>
        </div>
        {isDummy && (
          <span className="px-3 py-1.5 text-xs font-bold bg-amber-50 text-amber-800 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-200 dark:border-amber-900 rounded-xl">
            Simulated Global Analytics (No Platform Data)
          </span>
        )}
      </div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-6 dark:bg-slate-900 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Platform Users
            </span>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
              {data.metrics.totalUsers}
            </p>
          </div>
          <div className="rounded-full bg-blue-50 p-3 sm:p-4 dark:bg-blue-950/40">
            <Users className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-6 dark:bg-slate-900 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Listings
            </span>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
              {data.metrics.totalProducts}
            </p>
          </div>
          <div className="rounded-full bg-purple-50 p-3 sm:p-4 dark:bg-purple-950/40">
            <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-purple-500" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-6 dark:bg-slate-900 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Orders Processed
            </span>
            <p className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white mt-1">
              {data.metrics.totalOrders}
            </p>
          </div>
          <div className="rounded-full bg-amber-50 p-3 sm:p-4 dark:bg-amber-950/40">
            <ShoppingCart className="h-5 w-5 sm:h-6 sm:w-6 text-amber-500" />
          </div>
        </div>

        <div className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-6 dark:bg-slate-900 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div className="min-w-0 flex-1">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Volume
            </span>
            <p className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1 break-all">
              BDT {data.metrics.totalRevenue.toLocaleString()}
            </p>
          </div>
          <div className="rounded-full bg-green-50 p-3 sm:p-4 dark:bg-green-950/40 flex-shrink-0">
            <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Growth Chart */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-6 dark:bg-slate-900 dark:border-slate-800 shadow-sm space-y-4"
        >
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
              User Registrations Trend
            </h2>
          </div>
          <ChartContainer className="h-72 w-full text-xs font-semibold">
            <AreaChart data={data.userGrowth}>
              <defs>
                <linearGradient id="colorUsers" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-slate-100 dark:stroke-slate-800"
              />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  borderColor: "#475569",
                  borderRadius: "12px",
                  color: "#fff",
                }}
              />
              <Area
                type="monotone"
                dataKey="users"
                name="New Users"
                stroke="#3b82f6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorUsers)"
              />
            </AreaChart>
          </ChartContainer>
        </motion.div>

        {/* Monthly Orders Chart */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-6 dark:bg-slate-900 dark:border-slate-800 shadow-sm space-y-4"
        >
          <div className="flex items-center space-x-2">
            <ShoppingCart className="h-5 w-5 text-indigo-500" />
            <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
              Monthly Orders Count
            </h2>
          </div>
          <ChartContainer className="h-72 w-full text-xs font-semibold">
            <BarChart data={data.monthlyOrders}>
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-slate-100 dark:stroke-slate-800"
              />
              <XAxis dataKey="month" stroke="#94a3b8" />
              <YAxis stroke="#94a3b8" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1e293b",
                  borderColor: "#475569",
                  borderRadius: "12px",
                  color: "#fff",
                }}
              />
              <Bar
                dataKey="ordersCount"
                name="Orders Placed"
                fill="#6366f1"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        </motion.div>

        {/* Category Performance Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-6 dark:bg-slate-900 dark:border-slate-800 shadow-sm space-y-4"
        >
          <div className="flex items-center space-x-2">
            <PieIcon className="h-5 w-5 text-emerald-500" />
            <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
              Category Performance
            </h2>
          </div>
          <div className="min-h-[18rem] sm:h-72 h-auto py-4 sm:py-0 w-full text-xs font-semibold flex flex-col sm:flex-row items-center justify-center">
            {data.categoryPerf.length === 0 ? (
              <p className="text-slate-400">
                No category listing data available
              </p>
            ) : (
              <>
                <ChartContainer className="h-48 w-48 sm:h-60 sm:w-60 shrink-0">
                  <PieChart>
                    <Pie
                      data={data.categoryPerf}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="count"
                      nameKey="category"
                    >
                      {data.categoryPerf.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        backgroundColor: "#1e293b",
                        borderColor: "#475569",
                        borderRadius: "12px",
                        color: "#fff",
                      }}
                    />
                  </PieChart>
                </ChartContainer>
                <div className="space-y-2.5 mt-4 sm:mt-0 sm:ml-8 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 w-full max-w-xs">
                  {data.categoryPerf.map((entry, index) => (
                    <div
                      key={entry.category}
                      className="flex items-start space-x-2 text-xs"
                    >
                      <span
                        className="w-2.5 h-2.5 rounded-full mt-1 shrink-0"
                        style={{
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      ></span>
                      <div className="flex-1 min-w-0 flex flex-wrap items-baseline gap-x-1.5">
                        <span className="font-bold text-slate-700 dark:text-slate-300 break-words">
                          {entry.category}:
                        </span>
                        <span className="text-slate-400 font-medium shrink-0">
                          {entry.count} {entry.count === 1 ? "item" : "items"}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </motion.div>

        {/* Top Categories Chart */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-6 dark:bg-slate-900 dark:border-slate-800 shadow-sm space-y-4"
        >
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-blue-500" />
            <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
              Top Categories
            </h2>
          </div>
          {data.categoryPerf.length === 0 ? (
            <div className="h-72 w-full flex items-center justify-center text-slate-400 text-sm font-semibold">
              <p>No category data available</p>
            </div>
          ) : (
            <ChartContainer className="h-72 w-full text-xs font-semibold">
              <BarChart
                data={[...data.categoryPerf]
                  .sort((a, b) => b.count - a.count)
                  .slice(0, 6)}
                layout="vertical"
                margin={{ left: 20 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  className="stroke-slate-100 dark:stroke-slate-800"
                />
                <XAxis type="number" stroke="#94a3b8" allowDecimals={false} />
                <YAxis
                  type="category"
                  dataKey="category"
                  stroke="#94a3b8"
                  width={90}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "#1e293b",
                    borderColor: "#475569",
                    borderRadius: "12px",
                    color: "#fff",
                  }}
                />
                <Bar dataKey="count" name="Listings" radius={[0, 4, 4, 0]}>
                  {[...data.categoryPerf]
                    .sort((a, b) => b.count - a.count)
                    .slice(0, 6)
                    .map((entry, index) => (
                      <Cell
                        key={`top-cat-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                </Bar>
              </BarChart>
            </ChartContainer>
          )}
        </motion.div>
      </div>
    </div>
  );
}