"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Laptop,
  Armchair,
  Shirt,
  Flame,
  CheckCircle,
  TrendingUp,
  Users,
  ShoppingBag,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Leaf,
  Scale,
} from "lucide-react";
import api from "../services/api.js";

const getCategoryIcon = (category) => {
  const name = category.toLowerCase();
  if (
    name.includes("elect") ||
    name.includes("phone") ||
    name.includes("lap")
  ) {
    return <Laptop className="h-6 w-6 text-blue-500" />;
  }
  if (
    name.includes("furn") ||
    name.includes("chair") ||
    name.includes("desk")
  ) {
    return <Armchair className="h-6 w-6 text-orange-500" />;
  }
  if (
    name.includes("fash") ||
    name.includes("cloth") ||
    name.includes("jack")
  ) {
    return <Shirt className="h-6 w-6 text-pink-500" />;
  }
  return <Sparkles className="h-6 w-6 text-indigo-500" />;
};

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [recentlyViewed, setRecentlyViewed] = useState([]);
  const [stats, setStats] = useState({
    totalProducts: 452,
    totalSellers: 84,
    totalBuyers: 368,
    completedOrders: 195,
  });
  const [loading, setLoading] = useState(true);

  const [compareList, setCompareList] = useState([]);

  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (!active) return;
      try {
        const stored = localStorage.getItem("resell_compare_list");
        setCompareList(stored ? JSON.parse(stored) : []);
      } catch (err) {
        console.error(err);
      }

      try {
        const rvStored = localStorage.getItem("recentlyViewed");
        if (rvStored) setRecentlyViewed(JSON.parse(rvStored).slice(0, 4));
      } catch (err) {
        console.error(err);
      }
    });

    const handleStorageChange = () => {
      if (!active) return;
      const stored = localStorage.getItem("resell_compare_list");
      setCompareList(stored ? JSON.parse(stored) : []);
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      active = false;
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const handleToggleCompare = (id, e) => {
    if (e) e.preventDefault();
    try {
      const stored = localStorage.getItem("resell_compare_list");
      let list = stored ? JSON.parse(stored) : [];
      if (list.includes(id)) {
        list = list.filter((item) => item !== id);
      } else {
        if (list.length >= 3) {
          alert("You can compare up to 3 products side-by-side.");
          return;
        }
        list.push(id);
      }
      localStorage.setItem("resell_compare_list", JSON.stringify(list));
      setCompareList(list);
      window.dispatchEvent(new Event("storage"));
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const prodResponse = await api.get("/products/featured");
        setFeaturedProducts(prodResponse.data);

        const catResponse = await api.get("/products/categories");
        setCategories(catResponse.data);

        try {
          const statsResponse = await api.get("/products/stats");
          const { totalProducts, totalSellers, totalBuyers, completedOrders } =
            statsResponse.data || {};
          setStats({
            totalProducts: totalProducts ?? 452,
            totalSellers: totalSellers ?? 84,
            totalBuyers: totalBuyers ?? 368,
            completedOrders: completedOrders ?? 195,
          });
        } catch (err) {
          console.log("Using default marketplace stats.");
        }
      } catch (error) {
        console.error("Error fetching landing page data:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <div className="w-full space-y-20 pb-20">
      {/* SECTION 1: HERO BANNER */}
      <section className="relative overflow-hidden py-24 md:py-32 bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-white">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-[0.06] dark:opacity-35" />
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-12 items-center">
            {/* Left Column Text */}
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ duration: 0.8, type: "spring" }}
              className="space-y-6"
            >
              <div className="inline-flex items-center space-x-2 rounded-full bg-blue-500/10 px-4 py-1.5 text-sm font-semibold text-blue-600 dark:text-blue-400 border border-blue-500/20">
                <Flame className="h-4 w-4" />
                <span>Re-think, Re-use, Re-sell</span>
              </div>
              <h1 className="text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                Buy and Sell Pre-Owned Items{" "}
                <span className="bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400 bg-clip-text text-transparent">
                  Safely & Sustainably
                </span>
              </h1>
              <p className="text-lg text-slate-600 dark:text-slate-300 max-w-lg">
                ReSell Hub is the leading digital marketplace where buyers
                connect directly with verified local sellers to trade quality
                pre-owned goods at incredible prices.
              </p>
              <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                <Link
                  href="/products"
                  className="w-full sm:w-auto text-center rounded-full bg-blue-600 text-white px-8 py-4 font-semibold hover:bg-blue-500 shadow-lg shadow-blue-500/20 transition flex items-center justify-center space-x-2"
                >
                  <span>Browse Catalog</span>
                  <ArrowRight className="h-5 w-5" />
                </Link>
                <Link
                  href="/dashboard"
                  className="w-full sm:w-auto text-center rounded-full border border-slate-300 bg-white text-slate-700 px-8 py-4 font-semibold hover:bg-slate-100 hover:border-slate-400 dark:border-slate-700 dark:bg-slate-800/40 dark:text-white dark:hover:bg-slate-800 dark:hover:border-slate-600 transition"
                >
                  List a Product
                </Link>
              </div>
            </motion.div>

            {/* Right Column Visual Mock */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative flex justify-center"
            >
              <div className="relative w-full max-w-md h-[400px] rounded-3xl bg-gradient-to-br from-blue-500/10 to-indigo-500/10 dark:from-blue-500/20 dark:to-indigo-500/20 border border-slate-200 dark:border-slate-800 p-6 flex flex-col justify-between shadow-2xl shadow-slate-300/40 dark:shadow-black/40 backdrop-blur-sm overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="h-3 w-3 rounded-full bg-red-500" />
                    <div className="h-3 w-3 rounded-full bg-yellow-500" />
                    <div className="h-3 w-3 rounded-full bg-green-500" />
                  </div>
                  <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 bg-slate-200/70 dark:text-slate-400 dark:bg-slate-900 px-3 py-1 rounded-full">
                    Trending Right Now
                  </span>
                </div>

                <div className="my-auto space-y-6">
                  <img
                    src="https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=500&auto=format&fit=crop"
                    alt="Dell Laptop"
                    className="w-full h-44 object-cover rounded-2xl border border-slate-200 dark:border-slate-700/80 shadow-md"
                  />
                  <div>
                    <h3 className="text-lg font-bold">
                      Dell Inspiron 15 Laptop
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      Electronics • Condition: Good
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 pt-4">
                  <span className="text-2xl font-black text-blue-600 dark:text-blue-400">
                    BDT 35,000
                  </span>
                  <Link
                    href="/products"
                    className="rounded-full bg-slate-200 text-slate-700 hover:bg-slate-300 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700 p-2.5 transition"
                  >
                    <ArrowRight className="h-5 w-5" />
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* SECTION 2: FEATURED PRODUCTS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10">
          <div>
            <h2 className="text-3xl font-black tracking-tight">
              Featured Listings
            </h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2">
              Explore some of our recently added top-quality items.
            </p>
          </div>
          <Link
            href="/products"
            className="mt-4 md:mt-0 inline-flex items-center space-x-1 text-sm font-bold text-blue-600 hover:text-blue-500 dark:text-blue-400"
          >
            <span>See All Products</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((idx) => (
              <div
                key={idx}
                className="h-96 rounded-2xl border border-slate-200 animate-pulse dark:border-slate-800 bg-slate-100 dark:bg-slate-900"
              />
            ))}
          </div>
        ) : featuredProducts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-800">
            <p className="text-slate-500">
              No products listed yet. Be the first to add one!
            </p>
          </div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {featuredProducts.map((product) => (
              <motion.div
                key={product._id}
                variants={itemVariants}
                whileHover={{ y: -6, transition: { duration: 0.2 } }}
                className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm hover:shadow-lg dark:border-slate-800 dark:bg-slate-900 transition flex flex-col justify-between"
              >
                <div className="relative">
                  <img
                    src={
                      product.images[0] ||
                      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop"
                    }
                    alt={product.title}
                    className="h-48 w-full object-cover group-hover:scale-[1.02] transition duration-300"
                  />
                  {/* Compare button */}
                  <button
                    onClick={(e) => handleToggleCompare(product._id, e)}
                    className={`absolute top-3 left-3 p-2 rounded-xl backdrop-blur-md transition shadow-md hover:scale-105 z-10 ${
                      compareList.includes(product._id)
                        ? "bg-blue-600 text-white hover:bg-blue-500"
                        : "bg-white/85 text-slate-700 hover:bg-white hover:text-blue-600 dark:bg-slate-900/85 dark:text-slate-300 dark:hover:bg-slate-900"
                    }`}
                    title={
                      compareList.includes(product._id)
                        ? "Remove from comparison"
                        : "Add to comparison"
                    }
                  >
                    <Scale className="h-4 w-4" />
                  </button>
                  <span className="absolute bottom-3 right-3 rounded-full bg-slate-900/80 backdrop-blur-md px-3.5 py-1 text-xs font-bold text-white uppercase">
                    {product.condition}
                  </span>
                </div>
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wide">
                        {product.category}
                      </span>
                      {/* Seller Verification row */}
                      {product.sellerInfo?.isVerified && (
                        <span className="flex items-center text-[10px] text-blue-500 font-bold bg-blue-50 dark:bg-blue-950/30 dark:text-blue-400 px-2 py-0.5 rounded-full border border-blue-100 dark:border-blue-900/40">
                          <ShieldCheck className="h-3 w-3 mr-0.5" /> Verified
                        </span>
                      )}
                    </div>
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mt-1.5 line-clamp-1">
                      {product.title}
                    </h3>
                    <p className="text-xs text-slate-400 font-medium">
                      By {product.sellerInfo?.name}
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400 mt-2.5 line-clamp-2">
                      {product.description}
                    </p>
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-4">
                    <span className="text-xl font-black text-slate-900 dark:text-white">
                      BDT {product.price.toLocaleString()}
                    </span>
                    <Link
                      href={`/products/${product._id}`}
                      className="rounded-full bg-blue-50 px-4 py-2 text-xs font-bold text-blue-600 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-400 dark:hover:bg-blue-900/40 transition"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </section>

      {/* SECTION 3: POPULAR CATEGORIES */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-md mx-auto mb-12">
          <h2 className="text-3xl font-black tracking-tight">
            Popular Categories
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Find exactly what you need quickly through our dynamic catalog.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {categories.slice(0, 4).map((cat) => (
            <Link
              key={cat.name}
              href={`/products?category=${encodeURIComponent(cat.name)}`}
              className="flex flex-col items-center justify-center p-5 sm:p-8 rounded-2xl border border-slate-200/80 bg-white hover:border-blue-500 hover:shadow-md dark:border-slate-800 dark:bg-slate-900 transition text-center min-w-0"
            >
              <div className="rounded-full bg-slate-100 p-4 dark:bg-slate-800 mb-4 transition group-hover:scale-110">
                {getCategoryIcon(cat.name)}
              </div>
              <span className="font-bold text-slate-800 dark:text-slate-200">
                {cat.name}
              </span>
              <span className="text-xs text-slate-400 mt-1">
                {cat.count} Available Listings
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* EXTRA SECTION 1: SUSTAINABILITY IMPACT */}
      <section className="bg-gradient-to-r from-blue-50 to-indigo-50 text-slate-900 dark:from-blue-950 dark:to-slate-950 dark:text-white py-16 border-y border-blue-200/60 dark:border-blue-500/20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center space-x-2 rounded-full bg-white px-3.5 py-1.5 text-xs font-semibold mb-4 border border-blue-100 text-blue-700 shadow-sm dark:bg-white/10 dark:border-white/10 dark:text-white">
                <Leaf className="h-4 w-4 text-green-600 dark:text-green-300" />
                <span>Go Green with ReSell Hub</span>
              </div>
              <h2 className="text-xl sm:text-3xl md:text-4xl font-extrabold tracking-tight leading-snug">
                Second-Hand Buying Helps{" "}
                <span className="text-green-600 dark:text-green-300">
                  Reduce Environmental Waste
                </span>
              </h2>
              <p className="text-slate-600 dark:text-slate-200 mt-4 leading-relaxed">
                Every pre-owned product you purchase avoids the raw resources,
                manufacturing processes, and shipping emissions generated by a
                new item. Together we promote a circular product economy.
              </p>
              <div className="grid grid-cols-2 gap-6 pt-6">
                <div>
                  <h4 className="text-3xl font-black text-green-600 dark:text-green-300">
                    95%
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-300 mt-1">
                    Water saved compared to new clothes production
                  </p>
                </div>
                <div>
                  <h4 className="text-3xl font-black text-green-600 dark:text-green-300">
                    80 kg
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-300 mt-1">
                    Average CO2 emissions prevented per laptop reused
                  </p>
                </div>
              </div>
            </div>
            <div className="flex justify-center">
              <div className="rounded-2xl bg-white border border-slate-200 shadow-sm dark:bg-white/5 dark:border-white/10 p-8 max-w-sm space-y-6">
                <h3 className="font-bold text-lg">Our Environmental Pledge</h3>
                <blockquote className="italic text-slate-600 dark:text-slate-200 text-sm">
                  {`"Buying second-hand isn't just a cost-saving choice. It is a
                  commitment to reducing global landfills and fostering a green
                  economy for our children."`}
                </blockquote>
                <div className="flex items-center space-x-3">
                  <div className="h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-700 flex items-center justify-center font-bold">
                    ♻️
                  </div>
                  <div>
                    <p className="text-sm font-bold">Gulshan Green Society</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      Dhaka Ecology Partner
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 4: SUCCESS STORIES */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-md mx-auto mb-16">
          <h2 className="text-3xl font-black tracking-tight">
            Success Stories
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Hear from community members who successfully traded on ReSell Hub.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="rounded-2xl border border-slate-200/80 bg-white p-8 dark:border-slate-800 dark:bg-slate-900 shadow-sm flex flex-col justify-between">
            <p className="italic text-slate-600 dark:text-slate-300">
              {`"I needed an affordable laptop for my college studies. I found a
              great Dell laptop listed by Nusrat, paid securely through Stripe,
              and picked it up the next day. The condition was exactly as
              described!"`}
            </p>
            <div className="flex items-center space-x-3 pt-6 border-t border-slate-100 dark:border-slate-800 mt-6">
              <img
                src="https://i.pravatar.cc/300?img=1"
                className="h-10 w-10 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-bold">Md. Rakib Hasan</p>
                <p className="text-xs text-slate-400">Buyer since 2026</p>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200/80 bg-white p-8 dark:border-slate-800 dark:bg-slate-900 shadow-sm flex flex-col justify-between">
            <p className="italic text-slate-600 dark:text-slate-300">
              {`"I wanted to sell items after upgrading my workstation. Listing on
              ReSell Hub was quick, and since my seller badge got verified,
              buyers trusted me. Completed 5 sales within a week!"`}
            </p>
            <div className="flex items-center space-x-3 pt-6 border-t border-slate-100 dark:border-slate-800 mt-6">
              <img
                src="https://i.pravatar.cc/300?img=2"
                className="h-10 w-10 rounded-full object-cover"
              />
              <div>
                <p className="text-sm font-bold">Nusrat Jahan</p>
                <p className="text-xs text-slate-400">Verified Seller</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 5: MARKETPLACE STATISTICS */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          className="rounded-3xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/80 dark:border-slate-800 px-4 sm:px-8 py-10 md:py-16 grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 text-center"
        >
          <div className="space-y-2">
            <div className="flex justify-center mb-2">
              <ShoppingBag className="h-7 w-7 sm:h-8 sm:w-8 text-blue-500" />
            </div>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              {stats.totalProducts}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-semibold">
              Total Products
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-center mb-2">
              <ShieldCheck className="h-7 w-7 sm:h-8 sm:w-8 text-indigo-500" />
            </div>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              {stats.totalSellers}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-semibold">
              Total Sellers
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-center mb-2">
              <Users className="h-7 w-7 sm:h-8 sm:w-8 text-pink-500" />
            </div>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              {stats.totalBuyers}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-semibold">
              Total Buyers
            </p>
          </div>
          <div className="space-y-2">
            <div className="flex justify-center mb-2">
              <CheckCircle className="h-7 w-7 sm:h-8 sm:w-8 text-green-500" />
            </div>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
              {stats.completedOrders}
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 font-semibold">
              Completed Orders
            </p>
          </div>
        </motion.div>
      </section>

      {/* EXTRA SECTION 2: TRUSTED SELLERS SHOWCASE */}
      <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-md mx-auto mb-12">
          <h2 className="text-3xl font-black tracking-tight">
            Trusted Sellers
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-2">
            Trade with confidence from our highest-rated verified sellers.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-8">
          {[
            { img: "2", name: "Nusrat Jahan", rating: "5.0", sales: 32 },
            { img: "5", name: "Rafiqul Islam", rating: "4.9", sales: 24 },
            { img: "8", name: "Tahmina Akter", rating: "4.8", sales: 19 },
            { img: "12", name: "Sabbir Ahmed", rating: "4.7", sales: 15 },
          ].map((seller) => (
            <div
              key={seller.name}
              className="flex flex-col items-center bg-white border border-slate-200/80 rounded-2xl p-6 dark:bg-slate-900 dark:border-slate-800 w-44 shadow-sm hover:shadow-md transition"
            >
              <div className="relative">
                <img
                  src={`https://i.pravatar.cc/300?img=${seller.img}`}
                  className="h-16 w-16 rounded-full object-cover border-2 border-blue-100 dark:border-blue-900"
                  alt={seller.name}
                />
                <span className="absolute bottom-0 right-0 bg-blue-500 rounded-full p-1 text-white border-2 border-white">
                  <ShieldCheck className="h-3 w-3" />
                </span>
              </div>
              <h4 className="font-bold text-sm text-slate-800 dark:text-slate-200 mt-3 text-center">
                {seller.name}
              </h4>
              <div className="flex items-center space-x-1 text-xs text-yellow-500 mt-1">
                <span>★ {seller.rating}</span>
              </div>
              <p className="text-[10px] text-slate-400 mt-1">
                {seller.sales} sales
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* RECENTLY VIEWED SECTION */}
      {recentlyViewed.length > 0 && (
        <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-end justify-between mb-8">
            <div>
              <h2 className="text-2xl font-black tracking-tight">
                Recently Viewed
              </h2>
              <p className="text-slate-500 dark:text-slate-400 mt-1 text-sm">
                Pick up where you left off.
              </p>
            </div>
            <Link
              href="/products"
              className="text-sm font-bold text-blue-600 hover:text-blue-500 dark:text-blue-400 flex items-center space-x-1"
            >
              <span>Browse All</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {recentlyViewed.map((item) => (
              <Link
                key={item._id}
                href={`/products/${item._id}`}
                className="group overflow-hidden rounded-2xl border border-slate-200/80 bg-white dark:border-slate-800 dark:bg-slate-900 shadow-sm hover:shadow-md transition flex flex-col"
              >
                <img
                  src={
                    item.image ||
                    "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=300&auto=format&fit=crop"
                  }
                  alt={item.title}
                  className="h-32 w-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="p-3 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wide">
                      {item.category}
                    </span>
                    <h3 className="text-xs font-bold text-slate-800 dark:text-slate-100 mt-0.5 line-clamp-1">
                      {item.title}
                    </h3>
                  </div>
                  <p className="text-sm font-extrabold text-slate-900 dark:text-white mt-2">
                    BDT {item.price?.toLocaleString()}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}
      {/* Floating comparison drawer */}
      {compareList.length > 0 && (
        <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900/90 dark:bg-slate-950/90 text-white backdrop-blur-md rounded-2xl px-4 sm:px-6 py-3.5 sm:py-4 flex items-center justify-between gap-4 sm:gap-8 shadow-2xl border border-slate-800/80 w-[calc(100%-2rem)] max-w-md animate-slide-up">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600/20 p-2 rounded-xl text-blue-400">
              <Scale className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold">
                {compareList.length} items selected
              </p>
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
