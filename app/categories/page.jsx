"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Laptop,
  Armchair,
  Shirt,
  Sparkles,
  Car,
  Smartphone,
  BookOpen,
  ArrowRight,
  Loader2,
  FolderOpen,
} from "lucide-react";
import api from "../../services/api.js";

const getCategoryIcon = (categoryName) => {
  const name = categoryName.toLowerCase();
  if (name.includes("elect") || name.includes("lap")) {
    return <Laptop className="h-8 w-8 text-blue-500" />;
  }
  if (
    name.includes("furn") ||
    name.includes("chair") ||
    name.includes("desk")
  ) {
    return <Armchair className="h-8 w-8 text-orange-500" />;
  }
  if (
    name.includes("fash") ||
    name.includes("cloth") ||
    name.includes("jack")
  ) {
    return <Shirt className="h-8 w-8 text-pink-500" />;
  }
  if (name.includes("car") || name.includes("vehic") || name.includes("bike")) {
    return <Car className="h-8 w-8 text-emerald-500" />;
  }
  if (name.includes("phone") || name.includes("mobil")) {
    return <Smartphone className="h-8 w-8 text-purple-500" />;
  }
  if (name.includes("book") || name.includes("read")) {
    return <BookOpen className="h-8 w-8 text-amber-500" />;
  }
  return <Sparkles className="h-8 w-8 text-indigo-500" />;
};

const getCategoryBg = (categoryName) => {
  const name = categoryName.toLowerCase();
  if (name.includes("elect") || name.includes("lap"))
    return "from-blue-500/10 to-indigo-500/5 hover:border-blue-500/30";
  if (name.includes("furn") || name.includes("chair") || name.includes("desk"))
    return "from-orange-500/10 to-amber-500/5 hover:border-orange-500/30";
  if (name.includes("fash") || name.includes("cloth") || name.includes("jack"))
    return "from-pink-500/10 to-rose-500/5 hover:border-pink-500/30";
  if (name.includes("car") || name.includes("vehic") || name.includes("bike"))
    return "from-emerald-500/10 to-teal-500/5 hover:border-emerald-500/30";
  if (name.includes("phone") || name.includes("mobil"))
    return "from-purple-500/10 to-fuchsia-500/5 hover:border-purple-500/30";
  if (name.includes("book") || name.includes("read"))
    return "from-amber-500/10 to-yellow-500/5 hover:border-amber-500/30";
  return "from-indigo-500/10 to-blue-500/5 hover:border-indigo-500/30";
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("/products/categories");
        setCategories(response.data);
      } catch (error) {
        console.error("Failed to load categories", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 flex-1 w-full space-y-12">
      {/* Title Header */}
      <div className="text-center max-w-2xl mx-auto space-y-4">
        <h1 className="text-3xl font-black tracking-tight sm:text-4xl md:text-5xl">
          Browse by{" "}
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-400">
            Category
          </span>
        </h1>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
          Discover a wide range of second-hand items. Find exactly what you need
          at fraction of retail price.
        </p>
      </div>

      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[300px] space-y-4">
          <Loader2 className="h-10 w-10 text-blue-600 animate-spin" />
          <p className="text-sm font-semibold text-slate-400">
            Loading catalog categories...
          </p>
        </div>
      ) : categories.length === 0 ? (
        <div className="rounded-3xl border border-dashed border-slate-300 p-6 sm:p-12 text-center dark:border-slate-800 max-w-lg mx-auto space-y-4">
          <FolderOpen className="h-12 w-12 text-slate-400 mx-auto" />
          <h3 className="text-lg font-bold">No categories active</h3>
          <p className="text-sm text-slate-500">
            There are no approved products listed on the platform yet.
          </p>
        </div>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8"
        >
          {categories.map((cat) => (
            <motion.div
              key={cat.name}
              variants={itemVariants}
              whileHover={{ y: -6, transition: { duration: 0.2 } }}
              className={`group relative overflow-hidden rounded-3xl border border-slate-200/80 bg-gradient-to-br p-5 sm:p-8 dark:border-slate-800 dark:bg-slate-900/50 transition-all flex flex-col justify-between min-h-[180px] sm:h-56 shadow-sm hover:shadow-md ${getCategoryBg(cat.name)}`}
            >
              <div className="space-y-4">
                <div className="rounded-2xl bg-white p-4 w-fit dark:bg-slate-800 shadow-sm transition-transform group-hover:scale-110">
                  {getCategoryIcon(cat.name)}
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition">
                    {cat.name}
                  </h3>
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-wide mt-1">
                    {cat.count} Available Listings
                  </p>
                </div>
              </div>

              <div className="pt-4 flex items-center justify-between border-t border-slate-100/50 dark:border-slate-800/50">
                <span className="text-xs font-bold text-slate-500 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition flex items-center gap-1">
                  Explore Listings
                </span>
                <Link
                  href={`/products?category=${encodeURIComponent(cat.name)}`}
                  className="rounded-full bg-slate-100 p-2 text-slate-600 hover:bg-blue-600 hover:text-white dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-blue-600 transition shadow-sm"
                  aria-label={`Explore ${cat.name}`}
                >
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
