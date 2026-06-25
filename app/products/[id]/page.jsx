"use client";

import React, { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "../../../context/AuthContext";
import {
  Heart,
  ShoppingBag,
  Bell,
  Flag,
  ShieldCheck,
  Star,
  MapPin,
  Calendar,
  ChevronLeft,
  AlertCircle,
  Scale,
} from "lucide-react";
import api from "../../../services/api.js";

export default function ProductDetails({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const { id } = params;

  const { user, isAuthenticated, isBuyer } = useAuth();
  const router = useRouter();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [inWishlist, setWishlistStatus] = useState(false);
  const [isAlertSubscribed, setAlertSubscribed] = useState(false);

  const [relatedProducts, setRelatedProducts] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);

  const [loading, setLoading] = useState(true);
  const [orderLoading, setOrderLoading] = useState(false);

  const [inCompareList, setInCompareList] = useState(false);
  const [compareCount, setCompareCount] = useState(0);

  useEffect(() => {
    const syncCompareStatus = () => {
      try {
        const stored = localStorage.getItem("resell_compare_list");
        const list = stored ? JSON.parse(stored) : [];
        setInCompareList(list.includes(id));
        setCompareCount(list.length);
      } catch (err) {
        console.error(err);
      }
    };
    syncCompareStatus();

    window.addEventListener("storage", syncCompareStatus);
    return () => window.removeEventListener("storage", syncCompareStatus);
  }, [id]);

  const handleCompareToggle = () => {
    try {
      const stored = localStorage.getItem("resell_compare_list");
      let list = stored ? JSON.parse(stored) : [];
      if (list.includes(id)) {
        list = list.filter((item) => item !== id);
        setInCompareList(false);
      } else {
        if (list.length >= 3) {
          alert("You can compare up to 3 products side-by-side.");
          return;
        }
        list.push(id);
        setInCompareList(true);
      }
      localStorage.setItem("resell_compare_list", JSON.stringify(list));
      setCompareCount(list.length);
      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      console.error(err);
    }
  };

  const [reportModalOpen, setReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState(
    "Incorrect category placement.",
  );
  const [reportSuccess, setReportSuccess] = useState("");
  const [reportError, setReportError] = useState("");

  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewError, setReviewError] = useState("");
  const [reviewSuccess, setReviewSuccess] = useState("");

  // Wishlist, Alert check
  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const response = await api.get(`/products/${id}`);
        setProduct(response.data.product);
        setReviews(response.data.reviews || []);

        if (isAuthenticated && isBuyer) {
          try {
            const wishlistRes = await api.get("/users/wishlist");
            const wishlistIds = wishlistRes.data.map((p) => p._id);
            setWishlistStatus(wishlistIds.includes(id));

            const alertRes = await api.get("/alerts/my-alerts");
            const alertIds = alertRes.data.map((a) => a.productId?._id);
            setAlertSubscribed(alertIds.includes(id));
          } catch (err) {
            console.log("Skipping wishlist/alert loading check");
          }
        }
      } catch (error) {
        console.error("Failed to load product details", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id, isAuthenticated, isBuyer]);

  // Fetch related products
  useEffect(() => {
    if (!product) return;
    const fetchRelatedProducts = async () => {
      try {
        const response = await api.get("/products", {
          params: { category: product.category, limit: 4 },
        });
        const items = (response.data.products || response.data).filter(
          (p) => p._id !== product._id,
        );
        setRelatedProducts(items.slice(0, 3));
      } catch (err) {
        console.error("Failed to load related products", err);
      }
    };
    fetchRelatedProducts();
  }, [product]);

  useEffect(() => {
    if (!product) return;
    try {
      const stored = localStorage.getItem("recentlyViewed");
      let list = stored ? JSON.parse(stored) : [];
      list = list.filter((item) => item._id !== product._id);
      list.unshift({
        _id: product._id,
        title: product.title,
        price: product.price,
        category: product.category,
        condition: product.condition,
        image:
          product.images[0] ||
          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop",
      });
      list = list.slice(0, 4);
      localStorage.setItem("recentlyViewed", JSON.stringify(list));
    } catch (err) {
      console.error("Failed to save recently viewed product", err);
    }
  }, [product]);

  // Load recently viewed listings
  useEffect(() => {
    Promise.resolve().then(() => {
      try {
        const stored = localStorage.getItem("recentlyViewed");
        if (stored) {
          const list = JSON.parse(stored);
          setRecentlyViewed(list.filter((item) => item._id !== id));
        }
      } catch (err) {
        console.error("Failed to load recently viewed products", err);
      }
    });
  }, [id]);

  const handleWishlistToggle = async () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    try {
      if (inWishlist) {
        await api.delete(`/users/wishlist/${id}`);
        setWishlistStatus(false);
      } else {
        await api.post(`/users/wishlist/${id}`);
        setWishlistStatus(true);
      }
    } catch (err) {
      console.error("Wishlist action failed", err.message);
    }
  };

  const handleAlertSubscriptionToggle = async () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    try {
      if (isAlertSubscribed) {
        await api.delete(`/alerts/unsubscribe/${id}`);
        setAlertSubscribed(false);
      } else {
        await api.post(`/alerts/subscribe/${id}`);
        setAlertSubscribed(true);
      }
    } catch (err) {
      console.error("Alert action failed", err.message);
    }
  };

  const handleCreateOrder = async () => {
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    setOrderLoading(true);
    try {
      const response = await api.post("/orders", {
        productId: id,
        quantity: 1,
        deliveryAddress: user.location || "Dhaka, Bangladesh",
      });

      router.push(`/checkout/${response.data._id}`);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to place order");
    } finally {
      setOrderLoading(false);
    }
  };

  const handleReportSubmit = async (e) => {
    e.preventDefault();
    setReportError("");
    setReportSuccess("");

    try {
      await api.post(`/products/${id}/report`, { reason: reportReason });
      setReportSuccess(
        "Listing reported successfully. Admin will review it shortly.",
      );
      setTimeout(() => {
        setReportModalOpen(false);
        setReportSuccess("");
      }, 3000);
    } catch (err) {
      setReportError(err.response?.data?.message || "Reporting failed.");
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    setReviewError("");
    setReviewSuccess("");
    if (!isAuthenticated) {
      router.push("/login");
      return;
    }
    setReviewSubmitting(true);
    try {
      const res = await api.post("/reviews", {
        productId: id,
        rating: Number(reviewRating),
        comment: reviewComment,
      });
      setReviews((prev) => [res.data, ...prev]);
      setReviewComment("");
      setReviewRating(5);
      setReviewSuccess("Thank you! Your review has been posted.");
    } catch (err) {
      setReviewError(err.response?.data?.message || "Failed to submit review.");
    } finally {
      setReviewSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-slate-50 dark:bg-slate-950">
        <AlertCircle className="h-12 w-12 text-slate-400 mb-4" />
        <h2 className="text-xl font-bold">Listing not found</h2>
        <Link href="/products" className="text-blue-500 underline text-sm mt-2">
          Back to Catalog
        </Link>
      </div>
    );
  }

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, rev) => sum + rev.rating, 0) / reviews.length
        ).toFixed(1)
      : "No ratings";

  return (
    <div className="mx-auto max-w-7xl px-3 py-8 sm:px-6 lg:px-8 flex-1 w-full space-y-12">
      {/* Back button */}
      <Link
        href="/products"
        className="inline-flex items-center space-x-1 text-sm font-bold text-slate-500 hover:text-slate-700 dark:hover:text-white"
      >
        <ChevronLeft className="h-4 w-4" />
        <span>Back to browse</span>
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        {/* Left Column: Product Image Gallery */}
        <div className="space-y-4">
          <img
            src={
              product.images[0] ||
              "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800&auto=format&fit=crop"
            }
            alt={product.title}
            className="w-full h-64 sm:h-80 lg:h-[400px] object-cover rounded-3xl border border-slate-200 dark:border-slate-800"
          />
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1 no-scrollbar">
              {product.images.map((img, idx) => (
                <img
                  key={idx}
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  className="h-16 w-16 sm:h-20 sm:w-20 flex-shrink-0 object-cover rounded-xl border border-slate-200 dark:border-slate-800 cursor-pointer hover:border-blue-500 transition"
                />
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Listing Details & Actions */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-extrabold text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/40 px-3 py-1 rounded-full uppercase tracking-wider">
                {product.category}
              </span>
              <span className="text-xs font-extrabold text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full uppercase tracking-wider">
                {product.condition}
              </span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black text-slate-900 dark:text-white mt-4 leading-tight">
              {product.title}
            </h1>
            <p className="text-sm text-slate-400 dark:text-slate-500 flex items-center space-x-1 mt-2">
              <MapPin className="h-4 w-4 text-slate-400" />
              <span>{product.location}</span>
            </p>
          </div>

          <div className="flex items-center justify-between border-y border-slate-200/60 dark:border-slate-800 py-4">
            <span className="text-3xl font-black text-blue-600 dark:text-blue-400">
              BDT {product.price.toLocaleString()}
            </span>
            <span className="text-sm font-semibold px-3 py-1.5 rounded-full border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/60">
              {product.status === "available" ? "✓ In Stock" : "✗ Sold Out"}
            </span>
          </div>

          <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
            {product.description}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
            {product.status === "available" ? (
              <button
                onClick={handleCreateOrder}
                disabled={orderLoading || (isAuthenticated && !isBuyer)}
                className="w-full sm:flex-1 py-4 bg-blue-600 hover:bg-blue-500 text-white font-extrabold text-sm rounded-2xl shadow-lg shadow-blue-500/10 transition flex items-center justify-center space-x-2 disabled:opacity-50"
              >
                <ShoppingBag className="h-5 w-5" />
                <span>{orderLoading ? "Processing..." : "Buy Now"}</span>
              </button>
            ) : (
              <button
                onClick={handleAlertSubscriptionToggle}
                disabled={isAuthenticated && !isBuyer}
                className={`w-full sm:flex-1 py-4 font-extrabold text-xs sm:text-sm rounded-2xl transition flex items-center justify-center space-x-2 border disabled:opacity-50 ${
                  isAlertSubscribed
                    ? "border-green-600 text-green-600 bg-green-50/10 dark:border-green-400 dark:text-green-400"
                    : "border-slate-200 text-slate-700 bg-slate-50 hover:bg-slate-100 dark:border-slate-800 dark:text-slate-300 dark:bg-slate-900 dark:hover:bg-slate-800"
                }`}
              >
                <Bell className="h-5 w-5 flex-shrink-0" />
                <span className="truncate">
                  {isAlertSubscribed
                    ? "Alerts On (Tap to Unsub)"
                    : "Get Availability Alert"}
                </span>
              </button>
            )}

            <div className="flex gap-3 sm:gap-4 w-full sm:w-auto min-w-0">
              {/* Wishlist Button */}
              <button
                onClick={handleWishlistToggle}
                disabled={isAuthenticated && !isBuyer}
                className={`p-4 border rounded-2xl transition flex-1 sm:flex-initial flex justify-center items-center ${
                  inWishlist
                    ? "border-pink-500 text-pink-500 bg-pink-50/10"
                    : "border-slate-200 text-slate-400 hover:text-pink-500 dark:border-slate-800"
                }`}
              >
                <Heart
                  className={`h-5 w-5 ${inWishlist ? "fill-current" : ""}`}
                />
              </button>

              {/* Compare Button */}
              <button
                onClick={handleCompareToggle}
                className={`p-4 border rounded-2xl transition flex-1 sm:flex-initial flex justify-center items-center ${
                  inCompareList
                    ? "border-blue-500 text-blue-500 bg-blue-50/10"
                    : "border-slate-200 text-slate-400 hover:text-blue-500 dark:border-slate-800"
                }`}
                title={
                  inCompareList ? "Remove from comparison" : "Add to comparison"
                }
              >
                <Scale className="h-5 w-5" />
              </button>

              {/* Report Button */}
              <button
                onClick={() => setReportModalOpen(true)}
                className="p-4 border border-slate-200 rounded-2xl text-slate-400 hover:text-red-500 hover:border-red-500/30 dark:border-slate-800 transition flex-1 sm:flex-initial flex justify-center items-center"
              >
                <Flag className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Seller Card */}
          <div className="border border-slate-200 rounded-2xl p-4 sm:p-6 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/40">
            <div className="flex items-center gap-3 sm:gap-4">
              <img
                src={
                  product.sellerInfo.photo || "https://i.pravatar.cc/300?img=2"
                }
                className="h-12 w-12 rounded-full object-cover border border-slate-200 dark:border-slate-800 flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center space-x-1.5">
                  <span className="font-bold text-sm text-slate-800 dark:text-slate-200 truncate">
                    {product.sellerInfo.name}
                  </span>
                  {product.sellerInfo.isVerified && (
                    <ShieldCheck
                      className="h-5 w-5 text-blue-500 fill-blue-500/10 flex-shrink-0"
                      title="Verified Seller"
                    />
                  )}
                </div>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                  Seller rating:{" "}
                  <span className="font-semibold text-yellow-500">
                    ★ {averageRating}
                  </span>
                </p>
              </div>
              <Link
                href={`/users/seller/${product.sellerInfo.userId}`}
                className="text-xs font-bold text-blue-600 hover:underline dark:text-blue-400 flex-shrink-0"
              >
                View Profile
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Report Listing Modal Popup */}
      {reportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 dark:bg-slate-900 dark:border-slate-800 w-full max-w-sm relative shadow-2xl">
            <h3 className="text-lg font-bold">Report Listing</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Please select the violation category for this post.
            </p>

            {reportSuccess && (
              <p className="text-xs text-green-600 mt-2 bg-green-50/20 p-2.5 rounded-lg border border-green-200/50">
                {reportSuccess}
              </p>
            )}
            {reportError && (
              <p className="text-xs text-red-600 mt-2 bg-red-50/20 p-2.5 rounded-lg border border-red-200/50">
                {reportError}
              </p>
            )}

            <form onSubmit={handleReportSubmit} className="space-y-4 mt-4">
              <select
                value={reportReason}
                onChange={(e) => setReportReason(e.target.value)}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 px-3 text-xs text-slate-800 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
              >
                <option value="Incorrect category placement.">
                  Incorrect category placement
                </option>
                <option value="Suspicious listing details.">
                  Suspicious listing details
                </option>
                <option value="Misleading price.">Misleading price</option>
                <option value="Inappropriate product description.">
                  Inappropriate description
                </option>
              </select>

              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setReportModalOpen(false)}
                  className="w-1/2 py-3 border border-slate-200 rounded-xl font-semibold text-xs hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-3 bg-red-600 hover:bg-red-500 text-white font-bold text-xs rounded-xl transition"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Related Products
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <div
                key={p._id}
                className="flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm hover:shadow-md dark:border-slate-800 dark:bg-slate-900 transition h-full"
              >
                <div className="relative">
                  <img
                    src={
                      p.images?.[0] ||
                      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop"
                    }
                    alt={p.title}
                    className="h-40 w-full object-cover"
                  />
                  <span className="absolute bottom-2 right-2 rounded-full bg-slate-900/80 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-white uppercase">
                    {p.condition}
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                      {p.category}
                    </span>
                    <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-0.5 line-clamp-1">
                      {p.title}
                    </h3>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
                    <span className="text-base font-extrabold text-slate-900 dark:text-white">
                      BDT {p.price.toLocaleString()}
                    </span>
                    <Link
                      href={`/products/${p._id}`}
                      className="rounded-xl bg-blue-50 px-3 py-2 text-xs font-bold text-blue-600 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-400 dark:hover:bg-blue-900/40 transition"
                    >
                      Details
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Recently Viewed Products */}
      {recentlyViewed.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Recently Viewed Products
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {recentlyViewed.map((p) => (
              <div
                key={p._id}
                className="flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm hover:shadow-md dark:border-slate-800 dark:bg-slate-900 transition h-full"
              >
                <div className="relative">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="h-28 w-full object-cover"
                  />
                  <span className="absolute bottom-1.5 right-1.5 rounded-full bg-slate-900/80 backdrop-blur-md px-2 py-0.5 text-[8px] font-bold text-white uppercase">
                    {p.condition}
                  </span>
                </div>
                <div className="p-3 flex-1 flex flex-col justify-between space-y-2">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                      {p.category}
                    </span>
                    <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 mt-0.5 line-clamp-1">
                      {p.title}
                    </h3>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-2">
                    <span className="text-xs font-extrabold text-slate-900 dark:text-white">
                      BDT {p.price.toLocaleString()}
                    </span>
                    <Link
                      href={`/products/${p._id}`}
                      className="rounded-lg bg-slate-50 border border-slate-200 px-2 py-1 text-[9px] font-bold text-slate-700 hover:bg-slate-100 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 transition"
                    >
                      View
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Reviews & Feedback Section */}
      <section className="space-y-6">
        <h2 className="text-2xl font-black">Reviews & Ratings</h2>

        {/* Review submission form (buyers only) */}
        {isAuthenticated && isBuyer && (
          <form
            onSubmit={handleReviewSubmit}
            className="border border-slate-200/80 rounded-2xl p-6 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-4"
          >
            <h3 className="font-bold text-slate-800 dark:text-slate-200">
              Write a Review
            </h3>

            {reviewSuccess && (
              <p className="text-xs text-green-600 bg-green-50/20 p-2.5 rounded-lg border border-green-200/50">
                {reviewSuccess}
              </p>
            )}
            {reviewError && (
              <p className="text-xs text-red-600 bg-red-50/20 p-2.5 rounded-lg border border-red-200/50">
                {reviewError}
              </p>
            )}

            {/* Star rating selector */}
            <div className="flex items-center space-x-1">
              {Array(5)
                .fill(0)
                .map((_, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => setReviewRating(i + 1)}
                    className="p-0.5 text-yellow-500"
                    aria-label={`Rate ${i + 1} stars`}
                  >
                    <Star
                      className={`h-6 w-6 ${i < reviewRating ? "fill-current" : "text-slate-300 dark:text-slate-600"}`}
                    />
                  </button>
                ))}
              <span className="text-xs text-slate-400 ml-2">
                {reviewRating} / 5
              </span>
            </div>

            <textarea
              required
              rows={3}
              value={reviewComment}
              onChange={(e) => setReviewComment(e.target.value)}
              placeholder="Share your experience with this product..."
              className="w-full rounded-xl border border-slate-200 bg-slate-50 py-3 px-3 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
            />

            <button
              type="submit"
              disabled={reviewSubmitting}
              className="px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/10 transition disabled:opacity-50"
            >
              {reviewSubmitting ? "Posting..." : "Submit Review"}
            </button>
          </form>
        )}

        {reviews.length === 0 ? (
          <div className="p-8 border border-slate-200/80 rounded-2xl bg-white text-center dark:border-slate-800 dark:bg-slate-900/40">
            <p className="text-slate-500 dark:text-slate-400">
              No customer reviews yet. Buy this product to submit the first
              review!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {reviews.map((rev) => (
              <div
                key={rev._id}
                className="border border-slate-200/80 rounded-2xl p-6 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-sm text-slate-800 dark:text-slate-200">
                    {rev.reviewerInfo.name}
                  </span>
                  <div className="flex items-center space-x-0.5 text-yellow-500">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${
                            i < rev.rating ? "fill-current" : "text-slate-300"
                          }`}
                        />
                      ))}
                  </div>
                </div>
                <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                  {rev.comment}
                </p>
                <span className="text-[10px] text-slate-400 block pt-1">
                  Posted on {new Date(rev.createdAt).toLocaleDateString()}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Floating comparison drawer */}
      {compareCount > 0 && (
        <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900/90 dark:bg-slate-950/90 text-white backdrop-blur-md rounded-2xl px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between gap-4 sm:gap-8 shadow-2xl border border-slate-800/80 w-[calc(100%-2rem)] max-w-md animate-slide-up">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600/20 p-2 rounded-xl text-blue-400">
              <Scale className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold">{compareCount} items selected</p>
              <p className="text-[10px] text-slate-400 font-semibold">
                Compare specifications side-by-side
              </p>
            </div>
          </div>
          <Link
            href="/compare"
            className="rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2 text-xs font-bold text-white transition flex items-center gap-1"
          >
            <span>Compare Now</span>
          </Link>
        </div>
      )}
    </div>
  );
}
