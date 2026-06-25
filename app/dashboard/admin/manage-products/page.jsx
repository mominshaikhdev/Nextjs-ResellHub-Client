"use client";

import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ShieldAlert,
  Check,
  X,
  Trash2,
  Eye,
  ShoppingBag,
  MessageSquare,
  ListFilter,
  AlertCircle,
  AlertTriangle,
} from "lucide-react";
import api from "../../../../services/api.js";

export default function ManageProducts() {
  const [activeTab, setActiveTab] = useState("reports");
  const [reports, setReports] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionId, setActionId] = useState(null);
  const [error, setError] = useState("");

  const fetchData = async () => {
    try {
      setLoading(true);
      setError("");
      if (activeTab === "reports") {
        const response = await api.get("/reports");
        setReports(response.data);
      } else {
        const response = await api.get("/products?limit=100");
        setProducts(response.data.products || response.data);
      }
    } catch (err) {
      console.error("Failed to load moderation data", err);
      setError("Could not retrieve items. Make sure backend is running.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Promise.resolve().then(() => {
      fetchData();
    });
  }, [activeTab]);

  const handleDismissReport = async (reportId) => {
    setActionId(reportId);
    try {
      await api.patch(`/reports/${reportId}/status`, { status: "reviewed" });
      setReports((prev) =>
        prev.map((r) =>
          r._id === reportId ? { ...r, status: "reviewed" } : r,
        ),
      );
    } catch (err) {
      console.error(err);
      setError("Failed to update report status.");
    } finally {
      setActionId(null);
    }
  };

  const handleDeleteReportedProduct = async (productId) => {
    if (
      !confirm(
        "Are you sure you want to permanently delete this listing and clear its reports?",
      )
    )
      return;
    setActionId(productId);
    try {
      await api.delete(`/reports/product/${productId}`);
      setReports((prev) => prev.filter((r) => r.productId?._id !== productId));
      setProducts((prev) => prev.filter((p) => p._id !== productId));
    } catch (err) {
      console.error(err);
      setError("Failed to delete product.");
    } finally {
      setActionId(null);
    }
  };

  // General Listing Moderations
  const handleModerateApproval = async (productId, status) => {
    setActionId(productId);
    try {
      await api.patch(`/reports/product/${productId}/approve`, {
        approvalStatus: status,
      });
      setProducts((prev) =>
        prev.map((p) =>
          p._id === productId ? { ...p, approvalStatus: status } : p,
        ),
      );
    } catch (err) {
      console.error(err);
      setError("Failed to update product approval status.");
    } finally {
      setActionId(null);
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;
    setActionId(productId);
    try {
      await api.delete(`/products/${productId}`);
      setProducts((prev) => prev.filter((p) => p._id !== productId));
    } catch (err) {
      console.error(err);
      setError("Failed to delete product.");
    } finally {
      setActionId(null);
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black md:text-3xl">Moderate Listings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold">
          Review reported listings or approve/reject pending uploads from
          sellers.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 dark:bg-red-950/20 dark:border-red-900 dark:text-red-400 rounded-xl flex items-center space-x-2">
          <AlertCircle className="h-5 w-5" />
          <span className="text-sm font-semibold">{error}</span>
        </div>
      )}

      {/* Tabs Menu */}
      <div className="flex border-b border-slate-200 dark:border-slate-800">
        <button
          onClick={() => {
            setActiveTab("reports");
            setLoading(true);
          }}
          className={`pb-4 px-6 font-bold text-sm transition relative ${
            activeTab === "reports"
              ? "text-blue-600 dark:text-blue-400"
              : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          }`}
        >
          <span>Flagged Reports</span>
          {activeTab === "reports" && (
            <motion.div
              layoutId="activeTabUnderline"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"
            />
          )}
        </button>
        <button
          onClick={() => {
            setActiveTab("all");
            setLoading(true);
          }}
          className={`pb-4 px-6 font-bold text-sm transition relative ${
            activeTab === "all"
              ? "text-blue-600 dark:text-blue-400"
              : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          }`}
        >
          <span>All Products Catalog</span>
          {activeTab === "all" && (
            <motion.div
              layoutId="activeTabUnderline"
              className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-400"
            />
          )}
        </button>
      </div>

      {loading ? (
        <div className="animate-pulse space-y-6">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl"
            ></div>
          ))}
        </div>
      ) : activeTab === "reports" ? (
        /* REPORTS TAB */
        reports.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
            <div className="rounded-full bg-slate-100 dark:bg-slate-800 p-4 inline-block text-slate-400">
              <Check className="h-8 w-8 text-green-500" />
            </div>
            <p className="text-slate-500 dark:text-slate-400 font-medium">
              All clear! No pending reported products.
            </p>
          </div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence>
              {reports.map((report) => {
                const prod = report.productId;
                if (!prod) return null;

                return (
                  <motion.div
                    key={report._id}
                    layout
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-6 dark:bg-slate-900 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
                  >
                    <div className="flex flex-col sm:flex-row items-start gap-4">
                      {prod.images && prod.images[0] ? (
                        <img
                          src={prod.images[0]}
                          alt={prod.title}
                          className="w-20 h-20 rounded-xl object-cover border border-slate-100 dark:border-slate-800 flex-shrink-0"
                        />
                      ) : (
                        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 flex-shrink-0">
                          <ShoppingBag className="h-6 w-6" />
                        </div>
                      )}
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
                            {prod.title}
                          </h3>
                          <span className="px-2 py-0.5 bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-300 text-[10px] font-bold rounded">
                            {prod.category}
                          </span>
                        </div>
                        <div className="flex items-start gap-1.5 p-3 rounded-xl bg-amber-50/50 border border-amber-200/40 text-amber-900 dark:bg-amber-950/10 dark:border-amber-900/30 dark:text-amber-400 text-xs font-semibold">
                          <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0 text-amber-500" />
                          <div>
                            <p className="font-extrabold text-[10px] uppercase text-amber-500">
                              Reason for Flag
                            </p>
                            <p className="mt-0.5">{report.reason}</p>
                          </div>
                        </div>
                        <p className="text-[10px] text-slate-400 font-bold">
                          Reported:{" "}
                          {new Date(report.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex flex-wrap gap-2 w-full md:w-auto justify-end border-t border-slate-100 dark:border-slate-800 md:border-t-0 pt-4 md:pt-0">
                      {report.status === "pending" && (
                        <button
                          onClick={() => handleDismissReport(report._id)}
                          disabled={actionId === report._id}
                          className="flex items-center gap-1.5 px-4 py-2 border border-slate-200 hover:bg-slate-50 text-slate-600 dark:border-slate-700 dark:hover:bg-slate-800 dark:text-slate-300 text-xs font-bold rounded-xl transition"
                        >
                          <Check className="h-4 w-4 text-green-500" />
                          <span>Dismiss Report</span>
                        </button>
                      )}
                      <button
                        onClick={() => handleDeleteReportedProduct(prod._id)}
                        disabled={actionId === prod._id}
                        className="flex items-center gap-1.5 px-4 py-2 border border-red-200 hover:bg-red-50 text-red-600 dark:border-red-900/50 dark:hover:bg-red-950/20 dark:text-red-400 text-xs font-bold rounded-xl transition"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Delete Listing</span>
                      </button>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )
      ) : /* ALL PRODUCTS TAB */
      products.length === 0 ? (
        <div className="text-center py-16 bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-2xl shadow-sm space-y-4">
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            No listings found in catalogue.
          </p>
        </div>
      ) : (
        <div className="space-y-6">
          <AnimatePresence>
            {products.map((prod) => (
              <motion.div
                key={prod._id}
                layout
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-6 dark:bg-slate-900 dark:border-slate-800 shadow-sm flex flex-col md:flex-row items-start md:items-center justify-between gap-6"
              >
                <div className="flex flex-col sm:flex-row items-start gap-4">
                  {prod.images && prod.images[0] ? (
                    <img
                      src={prod.images[0]}
                      alt={prod.title}
                      className="w-16 h-16 rounded-xl object-cover border border-slate-100 dark:border-slate-800 flex-shrink-0"
                    />
                  ) : (
                    <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-xl flex items-center justify-center text-slate-400 flex-shrink-0">
                      <ShoppingBag className="h-6 w-6" />
                    </div>
                  )}
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <h3 className="font-extrabold text-slate-900 dark:text-white hover:text-blue-500">
                        {prod.title}
                      </h3>
                      <span
                        className={`text-[9px] uppercase tracking-wider font-extrabold px-2 py-0.5 rounded-full border ${
                          prod.approvalStatus === "approved"
                            ? "bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900"
                            : prod.approvalStatus === "rejected"
                              ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900"
                              : "bg-yellow-50 text-yellow-700 border-yellow-200 dark:bg-yellow-950/20 dark:text-yellow-400 dark:border-yellow-900"
                        }`}
                      >
                        {prod.approvalStatus}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                      Seller: {prod.sellerInfo?.name} • Category:{" "}
                      {prod.category} • Condition: {prod.condition}
                    </p>
                    <p className="text-sm font-black text-slate-900 dark:text-slate-200">
                      BDT {prod.price?.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2 w-full md:w-auto justify-end border-t border-slate-100 dark:border-slate-800 md:border-t-0 pt-4 md:pt-0">
                  {prod.approvalStatus !== "approved" && (
                    <button
                      onClick={() =>
                        handleModerateApproval(prod._id, "approved")
                      }
                      disabled={actionId === prod._id}
                      className="flex items-center justify-center p-2 bg-green-50 border border-green-200 text-green-700 hover:bg-green-100 dark:bg-green-950/20 dark:border-green-900 dark:text-green-400 rounded-xl transition"
                      title="Approve Listing"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  )}
                  {prod.approvalStatus !== "rejected" && (
                    <button
                      onClick={() =>
                        handleModerateApproval(prod._id, "rejected")
                      }
                      disabled={actionId === prod._id}
                      className="flex items-center justify-center p-2 bg-red-50 border border-red-200 text-red-700 hover:bg-red-100 dark:bg-red-950/20 dark:border-red-900 dark:text-red-400 rounded-xl transition"
                      title="Reject Listing"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}
                  <button
                    onClick={() => handleDeleteProduct(prod._id)}
                    disabled={actionId === prod._id}
                    className="flex items-center justify-center p-2 border border-red-200 hover:bg-red-50 text-red-600 dark:border-red-900/50 dark:hover:bg-red-950/20 dark:text-red-400 rounded-xl transition"
                    title="Delete Listing"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
