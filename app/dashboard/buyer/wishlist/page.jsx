"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Heart, Trash2, ArrowRight } from "lucide-react";
import api from "../../../../services/api.js";

export default function BuyerWishlist() {
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchWishlist = async () => {
    try {
      const response = await api.get("/users/wishlist");
      setWishlist(response.data);
    } catch (error) {
      console.error("Failed to load wishlist", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Promise.resolve().then(() => {
      fetchWishlist();
    });
  }, []);

  const handleRemove = async (productId) => {
    try {
      await api.delete(`/users/wishlist/${productId}`);
      setWishlist(wishlist.filter((item) => item._id !== productId));
    } catch (error) {
      console.error("Failed to remove item", error);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse grid grid-cols-1 sm:grid-cols-2 gap-6">
        {[1, 2].map((i) => (
          <div
            key={i}
            className="h-44 rounded-2xl bg-slate-200 dark:bg-slate-800"
          />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black md:text-3xl">My Wishlist</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold">
          Keep track of products you want to buy later.
        </p>
      </div>

      {wishlist.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-800 bg-white dark:bg-slate-900/40">
          <Heart className="h-10 w-10 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400">
            Your wishlist is currently empty.
          </p>
          <Link
            href="/products"
            className="text-blue-500 underline text-sm mt-2 inline-block"
          >
            Browse Products
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((product) => (
            <div
              key={product._id}
              className="flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 h-full"
            >
              <div className="relative">
                <img
                  src={
                    product.images[0] ||
                    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop"
                  }
                  alt={product.title}
                  className="h-40 w-full object-cover"
                />
                <span className="absolute bottom-2 right-2 rounded-full bg-slate-900/80 backdrop-blur-md px-2.5 py-1 text-[10px] font-bold text-white uppercase">
                  {product.condition}
                </span>
              </div>
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                    {product.category}
                  </span>
                  <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100 mt-0.5 line-clamp-1">
                    {product.title}
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {product.description}
                  </p>
                </div>

                <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3">
                  <span className="text-base font-extrabold text-slate-900 dark:text-white">
                    BDT {product.price.toLocaleString()}
                  </span>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleRemove(product._id)}
                      className="p-2 border border-slate-200 hover:text-red-500 hover:border-red-500/20 dark:border-slate-800 rounded-xl transition"
                      title="Remove from Wishlist"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                    <Link
                      href={`/products/${product._id}`}
                      className="rounded-xl bg-blue-50 px-3 py-2 text-xs font-bold text-blue-600 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-400 dark:hover:bg-blue-900/40 transition flex items-center space-x-1"
                    >
                      <span>View</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
