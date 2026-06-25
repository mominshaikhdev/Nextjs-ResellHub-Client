"use client";

import React, { useEffect, useState, use } from "react";
import Link from "next/link";
import {
  ShieldCheck,
  Star,
  Package,
  Calendar,
  MapPin,
  ChevronLeft,
  AlertCircle,
  Mail,
  Phone,
} from "lucide-react";
import api from "../../../../services/api.js";

export default function SellerPublicProfile({ params: paramsPromise }) {
  const params = use(paramsPromise);
  const { id } = params;

  const [seller, setSeller] = useState(null);
  const [listings, setListings] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchSellerProfile = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await api.get(`/users/seller/${id}`);
        setSeller(response.data.seller);
        setListings(response.data.listings || []);
        setReviews(response.data.reviews || []);
      } catch (err) {
        console.error("Failed to load seller profile", err.message);
        setError("Could not load this seller profile.");
      } finally {
        setLoading(false);
      }
    };

    fetchSellerProfile();
  }, [id]);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error || !seller) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center text-center p-8 bg-slate-50 dark:bg-slate-950 min-h-[400px]">
        <AlertCircle className="h-12 w-12 text-slate-400 mb-4" />
        <h2 className="text-xl font-bold">Seller profile not found</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1 max-w-xs">
          This seller may have been removed or the link is incorrect.
        </p>
        <Link href="/products" className="text-blue-500 underline text-sm mt-3">
          Back to Catalog
        </Link>
      </div>
    );
  }

  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length
        ).toFixed(1)
      : null;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 flex-1 w-full space-y-10">
      {/* Back button */}
      <Link
        href="/products"
        className="inline-flex items-center space-x-1 text-sm font-bold text-slate-500 hover:text-slate-700 dark:hover:text-white"
      >
        <ChevronLeft className="h-4 w-4" />
        <span>Back to browse</span>
      </Link>

      {/* Seller Header Card */}
      <div className="bg-white border border-slate-200/80 rounded-3xl p-6 sm:p-8 dark:bg-slate-900 dark:border-slate-800 shadow-sm">
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          <img
            src={seller.photo || "https://i.pravatar.cc/300?img=2"}
            alt={seller.name}
            className="h-24 w-24 sm:h-28 sm:w-28 rounded-full object-cover border border-slate-200 dark:border-slate-800 flex-shrink-0"
          />
          <div className="flex-1 space-y-3 w-full">
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 justify-center sm:justify-start">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white">
                {seller.name}
              </h1>
              {seller.isVerified && (
                <span className="inline-flex items-center justify-center gap-1 self-center sm:self-auto px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-600 border border-blue-200 dark:bg-blue-950/30 dark:text-blue-400 dark:border-blue-900 w-fit mx-auto sm:mx-0">
                  <ShieldCheck className="h-3.5 w-3.5" />
                  <span>Verified Seller</span>
                </span>
              )}
            </div>

            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-x-5 gap-y-2 text-sm text-slate-500 dark:text-slate-400 font-semibold">
              {seller.location && (
                <span className="flex items-center gap-1.5">
                  <MapPin className="h-4 w-4 text-slate-400" />
                  {seller.location}
                </span>
              )}
              <span className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4 text-slate-400" />
                Joined{" "}
                {seller.createdAt
                  ? new Date(seller.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      year: "numeric",
                    })
                  : "N/A"}
              </span>
              {seller.phone && (
                <span className="flex items-center gap-1.5">
                  <Phone className="h-4 w-4 text-slate-400" />
                  {seller.phone}
                </span>
              )}
              {seller.email && (
                <span className="flex items-center gap-1.5">
                  <Mail className="h-4 w-4 text-slate-400" />
                  {seller.email}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-100 dark:border-slate-800">
          <div className="text-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40">
            <div className="flex justify-center mb-1">
              <Package className="h-5 w-5 text-blue-500" />
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">
              {listings.length}
            </p>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wide mt-0.5">
              Total Listings
            </p>
          </div>
          <div className="text-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40">
            <div className="flex justify-center mb-1">
              <Star className="h-5 w-5 text-yellow-500" />
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">
              {averageRating ?? "N/A"}
            </p>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wide mt-0.5">
              Avg Rating ({reviews.length})
            </p>
          </div>
          <div className="text-center p-4 rounded-2xl bg-slate-50 dark:bg-slate-950/40 col-span-2 sm:col-span-1">
            <div className="flex justify-center mb-1">
              <ShieldCheck className="h-5 w-5 text-green-500" />
            </div>
            <p className="text-2xl font-black text-slate-900 dark:text-white">
              {seller.isVerified ? "Verified" : "Standard"}
            </p>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-wide mt-0.5">
              Account Status
            </p>
          </div>
        </div>
      </div>

      {/* Seller's Listings */}
      <section className="space-y-6">
        <h2 className="text-2xl font-black">Listings by {seller.name}</h2>

        {listings.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-800">
            <p className="text-slate-500 dark:text-slate-400">
              This seller has no active listings right now.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((product) => (
              <Link
                key={product._id}
                href={`/products/${product._id}`}
                className="flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm hover:shadow-md dark:border-slate-800 dark:bg-slate-900 transition h-full"
              >
                <div className="relative">
                  <img
                    src={
                      product.images?.[0] ||
                      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop"
                    }
                    alt={product.title}
                    className="h-40 w-full object-cover"
                  />
                  <span className="absolute bottom-2.5 right-2.5 rounded-full bg-slate-900/80 backdrop-blur-md px-3 py-1 text-[10px] font-bold text-white uppercase">
                    {product.condition}
                  </span>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 line-clamp-1">
                    {product.title}
                  </h3>
                  <span className="text-base font-extrabold text-slate-900 dark:text-white">
                    BDT {product.price?.toLocaleString()}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </section>

      {/* Seller Reviews */}
      <section className="space-y-6">
        <h2 className="text-2xl font-black">Ratings &amp; Reviews</h2>

        {reviews.length === 0 ? (
          <div className="p-8 border border-slate-200/80 rounded-2xl bg-white text-center dark:border-slate-800 dark:bg-slate-900/40">
            <p className="text-slate-500 dark:text-slate-400">
              No reviews yet for this seller.
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
                    {rev.reviewerInfo?.name}
                  </span>
                  <div className="flex items-center space-x-0.5 text-yellow-500">
                    {Array(5)
                      .fill(0)
                      .map((_, i) => (
                        <Star
                          key={i}
                          className={`h-3.5 w-3.5 ${i < rev.rating ? "fill-current" : "text-slate-300"}`}
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
    </div>
  );
}
