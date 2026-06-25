"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
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
  DollarSign,
  ShoppingBag,
  PieChart as PieIcon,
} from "lucide-react";
import api from "../../../../services/api.js";

const DUMMY_MONTHLY_TREND = [
  { month: "Jan", sales: 12000 },
  { month: "Feb", sales: 19000 },
  { month: "Mar", sales: 15000 },
  { month: "Apr", sales: 28000 },
  { month: "May", sales: 22000 },
  { month: "Jun", sales: 34000 },
];

const DUMMY_TOP_PRODUCTS = [
  {
    title: "iPhone 13 Pro",
    category: "Electronics",
    quantitySold: 4,
    totalRevenue: 240000,
  },
  {
    title: "Gaming Chair",
    category: "Furniture",
    quantitySold: 3,
    totalRevenue: 45000,
  },
  {
    title: "Leather Jacket",
    category: "Fashion",
    quantitySold: 5,
    totalRevenue: 25000,
  },
  {
    title: 'Dell Monitor 24"',
    category: "Electronics",
    quantitySold: 2,
    totalRevenue: 30000,
  },
];

const COLORS = ["#3b82f6", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];

function useContainerWidth() {
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
  const [ref, width, height] = useContainerWidth();

  return (
    <div ref={ref} className={`relative ${className}`}>
      {width > 0 && height > 0 ? (
        <ResponsiveContainer width={width} height={height}>
          {children}
        </ResponsiveContainer>
      ) : (
        <div
          className="absolute inset-0 flex items-center justify-center text-slate-400 text-sm font-semibold"
          style={{ minHeight: "inherit" }}
        >
          Loading chart...
        </div>
      )}
    </div>
  );
}

export default function SellerAnalytics() {
  const [data, setData] = useState({
    monthlyTrend: [],
    topProducts: [],
    totalRevenue: 0,
    totalSales: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isDummy, setIsDummy] = useState(false);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        const response = await api.get("/payments/analytics/seller");
        const { cards, charts } = response.data;
        if (!charts || !charts.monthlySalesTrend) {
          throw new Error("Invalid analytics data structure from API");
        }
        setData({
          monthlyTrend: charts.monthlySalesTrend,
          topProducts: charts.topSellingProducts || [],
          totalRevenue: cards?.totalRevenue || 0,
          totalSales: cards?.totalSales || 0,
        });
        setIsDummy(false);
      } catch (err) {
        console.error(
          "Failed to load seller analytics, using dummy fallbacks:",
          err,
        );

        setData({
          monthlyTrend: DUMMY_MONTHLY_TREND,
          topProducts: DUMMY_TOP_PRODUCTS,
          totalRevenue: 354000,
          totalSales: 14,
        });
        setIsDummy(true);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
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

  // Categories distribution for Pie Chart
  const categoryDataMap = {};
  data.topProducts.forEach((p) => {
    categoryDataMap[p.category] =
      (categoryDataMap[p.category] || 0) + p.totalRevenue;
  });
  const categoryPieData = Object.entries(categoryDataMap).map(
    ([name, value]) => ({
      name,
      value,
    }),
  );

  return (
    <div className="space-y-10">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black md:text-3xl flex items-center gap-2">
            <BarChart3 className="h-8 w-8 text-blue-500" /> Sales Analytics
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold">
            Track your performance, popular categories, and monthly revenue
            trends.
          </p>
        </div>
        {isDummy && (
          <span className="px-3 py-1.5 text-xs font-bold bg-amber-50 text-amber-800 dark:bg-amber-950/20 dark:text-amber-400 border border-amber-200 dark:border-amber-900 rounded-xl">
            Showing Simulated Analytics (No Transactions Yet)
          </span>
        )}
      </div>

      {/* Summary Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 dark:bg-slate-900 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Total Net Revenue
            </span>
            <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">
              BDT {data.totalRevenue.toLocaleString()}
            </p>
          </div>
          <div className="rounded-full bg-green-50 p-4 dark:bg-green-950/40">
            <DollarSign className="h-6 w-6 text-green-500" />
          </div>
        </div>
        <div className="bg-white border border-slate-200/80 rounded-2xl p-6 dark:bg-slate-900 dark:border-slate-800 shadow-sm flex items-center justify-between">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Items Sold
            </span>
            <p className="text-3xl font-black text-slate-900 dark:text-white mt-1">
              {data.totalSales} units
            </p>
          </div>
          <div className="rounded-full bg-blue-50 p-4 dark:bg-blue-950/40">
            <ShoppingBag className="h-6 w-6 text-blue-500" />
          </div>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Sales Trend Line Chart */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white border border-slate-200/80 rounded-2xl p-6 dark:bg-slate-900 dark:border-slate-800 shadow-sm space-y-4"
        >
          <div className="flex items-center space-x-2">
            <TrendingUp className="h-5 w-5 text-blue-500" />
            <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
              Monthly Sales Trend
            </h2>
          </div>
          <ChartContainer className="h-72 w-full text-xs font-semibold">
            <AreaChart data={data.monthlyTrend}>
              <defs>
                <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
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
                dataKey="sales"
                name="Sales (BDT)"
                stroke="#3b82f6"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorSales)"
              />
            </AreaChart>
          </ChartContainer>
        </motion.div>

        {/* Category Performance Pie Chart */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white border border-slate-200/80 rounded-2xl p-6 dark:bg-slate-900 dark:border-slate-800 shadow-sm space-y-4"
        >
          <div className="flex items-center space-x-2">
            <PieIcon className="h-5 w-5 text-emerald-500" />
            <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
              Revenue by Category
            </h2>
          </div>
          <div className="min-h-[18rem] sm:h-72 h-auto py-4 sm:py-0 w-full text-xs font-semibold flex flex-col sm:flex-row items-center justify-center">
            {categoryPieData.length === 0 ? (
              <p className="text-slate-400">No category data available</p>
            ) : (
              <>
                <ChartContainer className="h-48 w-48 sm:h-60 sm:w-60 shrink-0">
                  <PieChart>
                    <Pie
                      data={categoryPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {categoryPieData.map((entry, index) => (
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
                <div className="space-y-2 mt-4 sm:mt-0 sm:ml-6 flex-shrink-0">
                  {categoryPieData.map((entry, index) => (
                    <div
                      key={entry.name}
                      className="flex items-center space-x-2"
                    >
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{
                          backgroundColor: COLORS[index % COLORS.length],
                        }}
                      ></span>
                      <span className="font-bold text-slate-700 dark:text-slate-300">
                        {entry.name}:
                      </span>
                      <span className="text-slate-400">
                        BDT {entry.value.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </div>
        </motion.div>

        {/* Top Products Table / Bar Chart */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white border border-slate-200/80 rounded-2xl p-6 dark:bg-slate-900 dark:border-slate-800 shadow-sm space-y-4 lg:col-span-2"
        >
          <div className="flex items-center space-x-2">
            <BarChart3 className="h-5 w-5 text-indigo-500" />
            <h2 className="text-base font-extrabold text-slate-900 dark:text-slate-100">
              Top Performing Listings
            </h2>
          </div>
          <div className="overflow-x-auto w-full">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 text-xs font-bold uppercase tracking-wider">
                  <th className="py-3 px-4">Product Name</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4 text-center">Qty Sold</th>
                  <th className="py-3 px-4 text-right">Total Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm font-semibold text-slate-700 dark:text-slate-300">
                {data.topProducts.map((p, idx) => (
                  <tr
                    key={idx}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
                  >
                    <td className="py-4 px-4 font-extrabold text-slate-900 dark:text-white">
                      {p.title}
                    </td>
                    <td className="py-4 px-4">{p.category}</td>
                    <td className="py-4 px-4">
                      BDT {p.price?.toLocaleString()}
                    </td>
                    <td className="py-4 px-4 text-center">{p.quantitySold}</td>
                    <td className="py-4 px-4 text-right text-emerald-600 dark:text-emerald-400 font-bold">
                      BDT {p.totalRevenue?.toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    </div>
  );
}