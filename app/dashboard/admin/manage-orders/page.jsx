"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  Search,
  Filter,
  RefreshCw,
  User,
  ShieldAlert,
  CheckCircle,
  Truck,
  Package,
  ArrowRight,
} from "lucide-react";
import api from "../../../../services/api.js";

const STATUS_BADGES = {
  pending:
    "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/20 dark:text-yellow-400 dark:border-yellow-900",
  accepted:
    "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/20 dark:text-blue-400 dark:border-blue-900",
  processing:
    "bg-indigo-50 text-indigo-700 border-indigo-200 dark:bg-indigo-950/20 dark:text-indigo-400 dark:border-indigo-900",
  shipped:
    "bg-purple-50 text-purple-700 border-purple-200 dark:bg-purple-950/20 dark:text-purple-400 dark:border-purple-900",
  delivered:
    "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900",
  cancelled:
    "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900",
};

const ALL_STATUSES = [
  "all",
  "pending",
  "accepted",
  "processing",
  "shipped",
  "delivered",
  "cancelled",
];

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      setError("");
      const response = await api.get("/orders/admin");
      setOrders(response.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch platform orders.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Promise.resolve().then(() => {
      fetchOrders();
    });
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    setUpdatingId(orderId);
    setError("");
    try {
      await api.patch(`/orders/${orderId}/status`, { status: newStatus });
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, orderStatus: newStatus } : order,
        ),
      );
    } catch (err) {
      console.error(err);
      setError("Failed to update order status.");
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      order._id.toLowerCase().includes(search.toLowerCase()) ||
      order.buyerInfo?.name?.toLowerCase().includes(search.toLowerCase()) ||
      order.sellerInfo?.name?.toLowerCase().includes(search.toLowerCase()) ||
      order.productId?.title?.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filterStatus === "all" || order.orderStatus === filterStatus;

    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded"></div>
        <div className="flex gap-4">
          <div className="h-12 w-64 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
          <div className="h-12 w-40 bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-44 bg-slate-200 dark:bg-slate-800 rounded-2xl"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black md:text-3xl">Manage Orders</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold">
          Track global orders, resolve seller-buyer disputes, and override order
          delivery states.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 dark:bg-red-950/20 dark:border-red-900 dark:text-red-400 rounded-xl">
          <span className="text-sm font-semibold">{error}</span>
        </div>
      )}

      {/* Filters & Search Row */}
      <div className="flex flex-col sm:flex-row gap-4 items-center">
        {/* Search */}
        <div className="relative flex-1 w-full">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
            <Search className="h-5 w-5" />
          </span>
          <input
            type="text"
            placeholder="Search by order ID, buyer, seller, product..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200/80 bg-white dark:bg-slate-900 dark:border-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold shadow-sm transition"
          />
        </div>

        {/* Filter */}
        <div className="relative w-full sm:w-48 flex-shrink-0">
          <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
            <Filter className="h-4 w-4" />
          </span>
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200/80 bg-white dark:bg-slate-900 dark:border-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold shadow-sm transition appearance-none cursor-pointer"
          >
            {ALL_STATUSES.map((status) => (
              <option key={status} value={status} className="capitalize">
                {status === "all" ? "All Statuses" : status}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            No transactions found matching criteria.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <AnimatePresence>
            {filteredOrders.map((order) => {
              const product = order.productId;
              const status = order.orderStatus;

              return (
                <motion.div
                  key={order._id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-6 dark:bg-slate-900 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6"
                >
                  {/* Left Column: Product Info & Override Status */}
                  <div className="flex flex-col gap-4 flex-1 w-full lg:w-auto">
                    {/* Product Row */}
                    <div className="flex flex-row items-start gap-4 w-full min-w-0">
                      {product?.images && product.images[0] ? (
                        <img
                          src={product.images[0]}
                          alt={product.title || "Product image"}
                          className="w-12 h-12 rounded-xl object-cover border border-slate-100 dark:border-slate-800 flex-shrink-0"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 flex-shrink-0">
                          <ShoppingBag className="h-6 w-6 text-blue-500" />
                        </div>
                      )}
                      <div className="space-y-1 min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-extrabold text-slate-900 dark:text-white hover:text-blue-500 text-base break-words">
                            {product?.title || "Unknown Product"}
                          </h3>
                          <span
                            className={`text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full border ${STATUS_BADGES[status]}`}
                          >
                            {status}
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">
                          Order: <span className="font-mono break-all">{order._id}</span>
                        </p>
                        <p className="text-sm font-black text-slate-900 dark:text-slate-200">
                          Amount: BDT{" "}
                          {order.totalAmount?.toLocaleString() ||
                            order.amount?.toLocaleString() ||
                            product?.price?.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    {/* Override Status Selector */}
                    <div className="flex flex-col gap-1.5 max-w-[240px] w-full pt-1">
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        Override Status
                      </p>
                      <div className="relative w-full">
                        <select
                          value={status}
                          disabled={updatingId === order._id}
                          onChange={(e) =>
                            handleUpdateStatus(order._id, e.target.value)
                          }
                          className="w-full text-xs font-bold border border-slate-200 dark:border-slate-800 rounded-xl py-2 px-3 bg-slate-50 dark:bg-slate-800 dark:text-white cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                        >
                          <option value="pending">Pending Approval</option>
                          <option value="accepted">Accepted</option>
                          <option value="processing">Processing</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled (Refunded)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Right Column: Buyer & Seller Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-800 lg:border-t-0 lg:border-l lg:pl-6 pt-4 lg:pt-0 flex-grow max-w-xl w-full">
                    <div className="space-y-1 min-w-0">
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        Buyer Info
                      </p>
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300 break-words">
                        {order.buyerInfo?.name}
                      </p>
                      <p className="text-xs text-slate-400 font-mono break-all">
                        {order.buyerInfo?.email}
                      </p>
                    </div>
                    <div className="space-y-1 min-w-0">
                      <p className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                        Seller Info
                      </p>
                      <p className="text-xs font-bold text-slate-700 dark:text-slate-300 break-words">
                        {order.sellerInfo?.name}
                      </p>
                      <p className="text-xs text-slate-400 font-mono break-all">
                        {order.sellerInfo?.email}
                      </p>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
