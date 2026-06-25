"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShoppingBag,
  ArrowRight,
  Phone,
  MapPin,
  User,
  CheckCircle,
  XCircle,
  Truck,
  PackageCheck,
  AlertCircle,
} from "lucide-react";
import api from "../../../../services/api.js";

const STATUS_FLOW = [
  "pending",
  "accepted",
  "processing",
  "shipped",
  "delivered",
];

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

export default function ManageOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const response = await api.get("/orders/seller");
      setOrders(response.data);
    } catch (err) {
      console.error("Failed to load orders", err);
      setError("Could not retrieve orders. Please try again.");
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
      // Update local state
      setOrders((prev) =>
        prev.map((order) =>
          order._id === orderId ? { ...order, orderStatus: newStatus } : order,
        ),
      );
    } catch (err) {
      console.error("Failed to update order status", err);
      setError(err.response?.data?.message || "Failed to update order status");
    } finally {
      setUpdatingId(null);
    }
  };

  const getNextStatusAction = (status) => {
    switch (status) {
      case "pending":
        return {
          label: "Accept Order",
          next: "accepted",
          color: "bg-blue-600 hover:bg-blue-500",
        };
      case "accepted":
        return {
          label: "Start Processing",
          next: "processing",
          color: "bg-indigo-600 hover:bg-indigo-500",
        };
      case "processing":
        return {
          label: "Ship Order",
          next: "shipped",
          color: "bg-purple-600 hover:bg-purple-500",
        };
      case "shipped":
        return {
          label: "Mark Delivered",
          next: "delivered",
          color: "bg-green-600 hover:bg-green-500",
        };
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded"></div>
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
    <div className="space-y-10">
      <div>
        <h1 className="text-2xl font-black md:text-3xl">
          Manage Incoming Orders
        </h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold">
          Review, approve, and track orders placed by buyers for your products.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 dark:bg-red-950/20 dark:border-red-900 dark:text-red-400 rounded-xl flex items-center space-x-2">
          <AlertCircle className="h-5 w-5" />
          <span className="text-sm font-semibold">{error}</span>
        </div>
      )}

      {orders.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
          <div className="rounded-full bg-slate-100 dark:bg-slate-800 p-4 inline-block text-slate-400">
            <ShoppingBag className="h-8 w-8" />
          </div>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            No orders received yet.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <AnimatePresence>
            {orders.map((order) => {
              const product = order.productId;
              const buyer = order.buyerInfo;
              const status = order.orderStatus;
              const action = getNextStatusAction(status);

              return (
                <motion.div
                  key={order._id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-6 dark:bg-slate-900 dark:border-slate-800 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6"
                >
                  {/* Left Side: Product and Order info */}
                  <div className="flex items-start gap-4">
                    {product?.images && product.images[0] ? (
                      <img
                        src={product.images[0]}
                        alt={product.title}
                        className="w-20 h-20 rounded-xl object-cover border border-slate-100 dark:border-slate-800 flex-shrink-0"
                      />
                    ) : (
                      <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 flex-shrink-0">
                        <ShoppingBag className="h-6 w-6" />
                      </div>
                    )}
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-2">
                        <h3 className="font-extrabold text-slate-900 dark:text-white">
                          {product?.title || "Unknown Product"}
                        </h3>
                        <span
                          className={`text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded-full border ${STATUS_BADGES[status]}`}
                        >
                          {status}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400">
                        Order ID: <span className="font-mono">{order._id}</span>
                      </p>
                      <p className="text-sm font-black text-slate-900 dark:text-slate-200">
                        Price: BDT{" "}
                        {order.amount?.toLocaleString() ||
                          product?.price?.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  {/* Middle Side: Buyer Details */}
                  <div className="border-t border-slate-100 dark:border-slate-800 lg:border-t-0 lg:border-l lg:pl-6 pt-4 lg:pt-0 flex flex-col space-y-2 flex-grow max-w-md">
                    <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 gap-2 font-semibold">
                      <User className="h-4 w-4 text-slate-400" />
                      <span>
                        {buyer?.name} ({buyer?.email})
                      </span>
                    </div>
                    <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 gap-2 font-semibold">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      <span className="truncate">
                        {order.deliveryAddress || "Address not provided"}
                      </span>
                    </div>
                    {buyer?.phone && (
                      <div className="flex items-center text-xs text-slate-500 dark:text-slate-400 gap-2 font-semibold">
                        <Phone className="h-4 w-4 text-slate-400" />
                        <span>{buyer.phone}</span>
                      </div>
                    )}
                  </div>

                  {/* Right Side: Order Action buttons */}
                  <div className="border-t border-slate-100 dark:border-slate-800 lg:border-t-0 lg:border-l lg:pl-6 pt-4 lg:pt-0 flex flex-wrap gap-3 items-center justify-start sm:justify-end flex-shrink-0 min-w-[180px]">
                    {status === "pending" && (
                      <button
                        onClick={() =>
                          handleUpdateStatus(order._id, "cancelled")
                        }
                        disabled={updatingId === order._id}
                        className="flex items-center space-x-1.5 px-4 py-2 border border-red-200 hover:bg-red-50 text-red-700 dark:border-red-900/50 dark:hover:bg-red-950/20 dark:text-red-400 text-xs font-bold rounded-xl transition"
                      >
                        <XCircle className="h-4 w-4" />
                        <span>Reject</span>
                      </button>
                    )}

                    {action ? (
                      <button
                        onClick={() =>
                          handleUpdateStatus(order._id, action.next)
                        }
                        disabled={updatingId === order._id}
                        className={`flex items-center space-x-1.5 px-5 py-2.5 text-xs font-bold text-white rounded-xl shadow-md transition ${action.color} disabled:opacity-50`}
                      >
                        {updatingId === order._id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-t-2 border-b-2 border-white"></div>
                        ) : (
                          <>
                            {status === "pending" && (
                              <CheckCircle className="h-4 w-4" />
                            )}
                            {status === "accepted" && (
                              <PackageCheck className="h-4 w-4" />
                            )}
                            {status === "processing" && (
                              <Truck className="h-4 w-4" />
                            )}
                            {status === "shipped" && (
                              <CheckCircle className="h-4 w-4" />
                            )}
                            <span>{action.label}</span>
                          </>
                        )}
                      </button>
                    ) : status === "delivered" ? (
                      <div className="flex items-center text-green-600 dark:text-green-400 text-xs font-bold gap-1">
                        <CheckCircle className="h-5 w-5 fill-green-500/10" />
                        <span>Order Completed</span>
                      </div>
                    ) : (
                      <span className="text-slate-400 text-xs font-bold">
                        No further actions
                      </span>
                    )}
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
