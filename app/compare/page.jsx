"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Scale,
  Trash2,
  ShoppingBag,
  Star,
  ShieldCheck,
  ChevronLeft,
  Loader2,
  AlertCircle,
  HelpCircle,
} from "lucide-react";
import api from "../../services/api.js";

export default function ComparePage() {
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadCompareProducts = async () => {
    setLoading(true);
    setError("");
    try {
      const stored = localStorage.getItem("resell_compare_list");
      const ids = stored ? JSON.parse(stored) : [];

      if (ids.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      // Fetch all products details
      const fetched = await Promise.all(
        ids.slice(0, 3).map(async (id) => {
          try {
            const response = await api.get(`/products/${id}`);
            return response.data;
          } catch (err) {
            console.error(`Failed to load product ${id} for comparison`, err);
            return null;
          }
        }),
      );

      const validProducts = fetched
        .filter((p) => p !== null)
        .map((p) => ({
          ...p.product,
          reviews: p.reviews || [],
        }));

      setProducts(validProducts);
    } catch (err) {
      console.error("Failed to load comparison list", err);
      setError("An error occurred while loading the comparison parameters.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Promise.resolve().then(() => {
      loadCompareProducts();
    });
  }, []);

  const handleRemove = (id) => {
    try {
      const stored = localStorage.getItem("resell_compare_list");
      let ids = stored ? JSON.parse(stored) : [];
      ids = ids.filter((item) => item !== id);
      localStorage.setItem("resell_compare_list", JSON.stringify(ids));
      setProducts(products.filter((p) => p._id !== id));

      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      console.error("Failed to remove product from comparison list", err);
    }
  };

  const handleClearAll = () => {
    localStorage.removeItem("resell_compare_list");
    setProducts([]);
    window.dispatchEvent(new Event("storage"));
  };

  const handleBuyNow = async (productId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      // Fetch user role
      const userRes = await api.get("/auth/me");
      if (userRes.data?.role !== "buyer") {
        alert("Only buyer accounts can purchase items.");
        return;
      }

      // Create order
      const response = await api.post("/orders", {
        productId,
        quantity: 1,
        deliveryAddress: userRes.data.location || "Dhaka, Bangladesh",
      });
      router.push(`/checkout/${response.data._id}`);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to initialize checkout.");
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="mx-auto max-w-7xl px-4 py-8 sm:py-12 sm:px-6 lg:px-8 flex-1 w-full space-y-10 min-w-0"
    >
      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div className="space-y-1">
          <Link
            href="/products"
            className="inline-flex items-center space-x-1 text-xs font-bold text-slate-500 hover:text-slate-800 dark:hover:text-white mb-2"
          >
            <ChevronLeft className="h-4 w-4" />
            <span>Continue Shopping</span>
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2">
            <Scale className="h-7 w-7 text-blue-500" />
            <span>Compare Listings</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-semibold">
            Compare up to 3 second-hand items side-by-side to make the best
            purchase decision.
          </p>
        </div>

        {products.length > 0 && (
          <button
            onClick={handleClearAll}
            className="text-xs font-bold text-red-500 border border-red-200 hover:bg-red-50 dark:border-red-950 dark:hover:bg-red-950/20 px-4 py-2.5 rounded-xl transition"
          >
            Clear Comparison
          </button>
        )}
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] space-y-4">
          <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
          <p className="text-sm font-semibold text-slate-400">
            Fetching comparison data...
          </p>
        </div>
      ) : error ? (
        <div className="p-5 bg-red-50 border border-red-200 text-red-800 dark:bg-red-950/20 dark:border-red-900 dark:text-red-400 rounded-2xl flex items-center space-x-2">
          <AlertCircle className="h-5 w-5" />
          <span className="text-sm font-semibold">{error}</span>
        </div>
      ) : products.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 p-4 sm:p-12 text-center dark:border-slate-800 w-full max-w-lg mx-auto space-y-4">
          <HelpCircle className="h-12 w-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold">Comparison list is empty</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed break-words-safe">
            Go to the products catalog and tap the comparison icon (scale) on
            any product card to start comparing specs.
          </p>
          <Link
            href="/products"
            className="inline-block rounded-xl bg-blue-600 px-6 py-3 font-bold text-xs text-white hover:bg-blue-500 transition shadow-md shadow-blue-500/10"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-slate-200/80 rounded-3xl dark:bg-slate-900 dark:border-slate-800 shadow-sm overflow-hidden w-full">
          {/* Main comparison matrix - Desktop Table View */}
          <div className="hidden md:block overflow-x-auto">
            <table className="w-full text-left border-collapse table-fixed">
              <thead>
                <tr className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-950/50">
                  <th className="w-1/4 p-6 font-black text-slate-400 text-xs uppercase tracking-wider">
                    Specifications
                  </th>
                  {products.map((p) => (
                    <th key={p._id} className="w-1/4 p-6 align-top">
                      <div className="space-y-4">
                        <div className="relative h-40 w-full rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 bg-slate-50">
                          <img
                            src={
                              p.images?.[0] ||
                              "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop"
                            }
                            alt={p.title}
                            className="h-full w-full object-cover"
                          />
                          <button
                            onClick={() => handleRemove(p._id)}
                            className="absolute top-2.5 right-2.5 p-2 bg-white/95 text-slate-600 hover:text-red-600 rounded-xl transition shadow-md hover:scale-105"
                            title="Remove from comparison"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                        <div className="space-y-1">
                          <h3 className="font-extrabold text-sm text-slate-900 dark:text-white line-clamp-1">
                            {p.title}
                          </h3>
                          <p className="text-lg font-black text-blue-600 dark:text-blue-400">
                            BDT {p.price?.toLocaleString()}
                          </p>
                        </div>
                        {p.status === "available" ? (
                          <button
                            onClick={() => handleBuyNow(p._id)}
                            className="w-full py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-xs rounded-xl shadow-md shadow-blue-500/10 transition flex items-center justify-center space-x-1.5"
                          >
                            <ShoppingBag className="h-4 w-4" />
                            <span>Buy Now</span>
                          </button>
                        ) : (
                          <div className="w-full py-2.5 text-center text-xs font-bold bg-slate-100 border text-slate-400 rounded-xl">
                            Sold Out
                          </div>
                        )}
                      </div>
                    </th>
                  ))}

                  {Array(3 - products.length)
                    .fill(0)
                    .map((_, idx) => (
                      <th
                        key={`empty-col-${idx}`}
                        className="w-1/4 p-6 text-center text-slate-400 font-semibold text-xs border-l border-slate-100 dark:border-slate-800 align-middle bg-slate-50/10"
                      >
                        Empty Slot
                      </th>
                    ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm font-semibold text-slate-700 dark:text-slate-300">
                {/* Category Row */}
                <tr className="hover:bg-slate-50/30 dark:hover:bg-slate-800/10">
                  <td className="p-6 text-slate-400 font-bold uppercase text-xs tracking-wider">
                    Category
                  </td>
                  {products.map((p) => (
                    <td key={p._id} className="p-6">
                      {p.category}
                    </td>
                  ))}
                  {Array(3 - products.length)
                    .fill(0)
                    .map((_, idx) => (
                      <td
                        key={`empty-cat-${idx}`}
                        className="p-6 bg-slate-50/10"
                      ></td>
                    ))}
                </tr>

                {/* Condition Row */}
                <tr className="hover:bg-slate-50/30 dark:hover:bg-slate-800/10">
                  <td className="p-6 text-slate-400 font-bold uppercase text-xs tracking-wider">
                    Condition
                  </td>
                  {products.map((p) => (
                    <td key={p._id}>
                      <div className="p-6">
                        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-bold dark:bg-slate-800 dark:text-slate-200">
                          {p.condition}
                        </span>
                      </div>
                    </td>
                  ))}
                  {Array(3 - products.length)
                    .fill(0)
                    .map((_, idx) => (
                      <td
                        key={`empty-cond-${idx}`}
                        className="p-6 bg-slate-50/10"
                      ></td>
                    ))}
                </tr>

                {/* Location Row */}
                <tr className="hover:bg-slate-50/30 dark:hover:bg-slate-800/10">
                  <td className="p-6 text-slate-400 font-bold uppercase text-xs tracking-wider">
                    Location
                  </td>
                  {products.map((p) => (
                    <td key={p._id} className="p-6">
                      {p.location}
                    </td>
                  ))}
                  {Array(3 - products.length)
                    .fill(0)
                    .map((_, idx) => (
                      <td
                        key={`empty-loc-${idx}`}
                        className="p-6 bg-slate-50/10"
                      ></td>
                    ))}
                </tr>

                {/* Seller Info Row */}
                <tr className="hover:bg-slate-50/30 dark:hover:bg-slate-800/10">
                  <td className="p-6 text-slate-400 font-bold uppercase text-xs tracking-wider">
                    Seller
                  </td>
                  {products.map((p) => (
                    <td key={p._id} className="p-6">
                      <div className="flex items-center space-x-2">
                        <span className="font-bold text-slate-900 dark:text-white">
                          {p.sellerInfo?.name}
                        </span>
                        {p.sellerInfo?.isVerified && (
                          <ShieldCheck
                            className="h-4 w-4 text-blue-500 fill-blue-500/10"
                            title="Verified Seller"
                          />
                        )}
                      </div>
                    </td>
                  ))}
                  {Array(3 - products.length)
                    .fill(0)
                    .map((_, idx) => (
                      <td
                        key={`empty-seller-${idx}`}
                        className="p-6 bg-slate-50/10"
                      ></td>
                    ))}
                </tr>

                {/* Seller Rating Row */}
                <tr className="hover:bg-slate-50/30 dark:hover:bg-slate-800/10">
                  <td className="p-6 text-slate-400 font-bold uppercase text-xs tracking-wider">
                    Seller Rating
                  </td>
                  {products.map((p) => {
                    const avg =
                      p.reviews?.length > 0
                        ? (
                            p.reviews.reduce((sum, r) => sum + r.rating, 0) /
                            p.reviews.length
                          ).toFixed(1)
                        : null;
                    return (
                      <td key={p._id} className="p-6">
                        {avg ? (
                          <div className="flex items-center text-yellow-500 space-x-1">
                            <Star className="h-4 w-4 fill-current" />
                            <span className="font-bold text-slate-800 dark:text-slate-200">
                              {avg}
                            </span>
                            <span className="text-xs text-slate-400 font-normal">
                              ({p.reviews.length} reviews)
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-400">
                            No ratings yet
                          </span>
                        )}
                      </td>
                    );
                  })}
                  {Array(3 - products.length)
                    .fill(0)
                    .map((_, idx) => (
                      <td
                        key={`empty-rating-${idx}`}
                        className="p-6 bg-slate-50/10"
                      ></td>
                    ))}
                </tr>

                {/* Description Row */}
                <tr className="hover:bg-slate-50/30 dark:hover:bg-slate-800/10">
                  <td className="p-6 text-slate-400 font-bold uppercase text-xs tracking-wider">
                    Description
                  </td>
                  {products.map((p) => (
                    <td key={p._id} className="p-6">
                      <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-3 leading-relaxed font-semibold">
                        {p.description}
                      </p>
                    </td>
                  ))}
                  {Array(3 - products.length)
                    .fill(0)
                    .map((_, idx) => (
                      <td
                        key={`empty-desc-${idx}`}
                        className="p-6 bg-slate-50/10"
                      ></td>
                    ))}
                </tr>
              </tbody>
            </table>
          </div>

          {/* Mobile Stack View */}
          <div className="md:hidden divide-y divide-slate-100 dark:divide-slate-800">
            <AnimatePresence initial={false}>
              {products.map((p) => {
                const avg =
                  p.reviews?.length > 0
                    ? (
                        p.reviews.reduce((sum, r) => sum + r.rating, 0) /
                        p.reviews.length
                      ).toFixed(1)
                    : null;
                return (
                  <motion.div
                    key={p._id}
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    transition={{ type: "spring", stiffness: 100, damping: 15 }}
                    className="p-3 sm:p-6 space-y-5 overflow-hidden"
                  >
                    {/* Image and Header */}
                    <div className="flex gap-3 sm:gap-4">
                      <img
                        src={
                          p.images?.[0] ||
                          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop"
                        }
                        alt={p.title}
                        className="h-16 w-16 sm:h-20 sm:w-20 object-cover rounded-xl border border-slate-100 dark:border-slate-800 flex-shrink-0"
                      />
                      <div className="space-y-1 flex-1 min-w-0">
                        <h3 className="font-extrabold text-sm text-slate-900 dark:text-white line-clamp-2 break-words-safe">
                          {p.title}
                        </h3>
                        <p className="text-base font-black text-blue-600 dark:text-blue-400">
                          BDT {p.price?.toLocaleString()}
                        </p>
                      </div>
                      <button
                        onClick={() => handleRemove(p._id)}
                        className="icon-btn p-2 border border-slate-200 hover:text-red-600 dark:border-slate-800 rounded-xl h-fit flex-shrink-0 shadow-sm"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    {/* Spec List */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 text-xs bg-slate-50 dark:bg-slate-950/40 p-4 rounded-2xl border border-slate-100 dark:border-slate-900">
                      <div>
                        <span className="block text-slate-400 font-bold uppercase tracking-wider mb-0.5">
                          Category
                        </span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {p.category}
                        </span>
                      </div>
                      <div>
                        <span className="block text-slate-400 font-bold uppercase tracking-wider mb-0.5">
                          Condition
                        </span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {p.condition}
                        </span>
                      </div>
                      <div>
                        <span className="block text-slate-400 font-bold uppercase tracking-wider mb-0.5">
                          Location
                        </span>
                        <span className="font-bold text-slate-800 dark:text-slate-200">
                          {p.location}
                        </span>
                      </div>
                      <div>
                        <span className="block text-slate-400 font-bold uppercase tracking-wider mb-0.5">
                          Seller
                        </span>
                        <span className="font-bold text-slate-800 dark:text-slate-200 flex items-center gap-1">
                          {p.sellerInfo?.name}
                          {p.sellerInfo?.isVerified && (
                            <ShieldCheck className="h-3.5 w-3.5 text-blue-500 fill-blue-500/10" />
                          )}
                        </span>
                      </div>
                      <div className="col-span-2">
                        <span className="block text-slate-400 font-bold uppercase tracking-wider mb-0.5">
                          Seller Rating
                        </span>
                        {avg ? (
                          <div className="flex items-center text-yellow-500 space-x-1 font-bold">
                            <Star className="h-3.5 w-3.5 fill-current" />
                            <span className="text-slate-800 dark:text-slate-200">
                              {avg} ({p.reviews.length} reviews)
                            </span>
                          </div>
                        ) : (
                          <span className="text-slate-400">No ratings yet</span>
                        )}
                      </div>
                    </div>

                    {/* Actions */}
                    {p.status === "available" ? (
                      <button
                        onClick={() => handleBuyNow(p._id)}
                        className="w-full py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-blue-500/10 transition flex items-center justify-center space-x-2"
                      >
                        <ShoppingBag className="h-5 w-5" />
                        <span>Buy Now</span>
                      </button>
                    ) : (
                      <div className="w-full py-3.5 text-center text-sm font-bold bg-slate-100 border text-slate-400 rounded-2xl">
                        Sold Out
                      </div>
                    )}
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        </div>
      )}
    </motion.div>
  );
}
