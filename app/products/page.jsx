"use client";

import React, { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import {
  Search,
  SlidersHorizontal,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  ShieldCheck,
  Scale,
  X,
  Filter,
} from "lucide-react";
import api from "../../services/api.js";

function ProductsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const [filterOpen, setFilterOpen] = useState(false);

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
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

  const [searchTerm, setSearchTerm] = useState(
    searchParams.get("search") || "",
  );
  const [selectedCategory, setSelectedCategory] = useState(
    searchParams.get("category") || "all",
  );
  const [condition, setCondition] = useState(
    searchParams.get("condition") || "all",
  );
  const [location, setLocation] = useState(searchParams.get("location") || "");
  const [minPrice, setMinPrice] = useState(searchParams.get("minPrice") || "");
  const [maxPrice, setMaxPrice] = useState(searchParams.get("maxPrice") || "");
  const [sortBy, setSortBy] = useState(searchParams.get("sortBy") || "newest");

  // Trigger search execution
  const handleApplyFilters = (e) => {
    if (e) e.preventDefault();
    const params = new URLSearchParams();
    if (searchTerm) params.set("search", searchTerm);
    if (selectedCategory && selectedCategory !== "all")
      params.set("category", selectedCategory);
    if (condition && condition !== "all") params.set("condition", condition);
    if (location) params.set("location", location);
    if (minPrice) params.set("minPrice", minPrice);
    if (maxPrice) params.set("maxPrice", maxPrice);
    if (sortBy) params.set("sortBy", sortBy);
    params.set("page", "1");
    router.push(`/products?${params.toString()}`);
    setFilterOpen(false);
  };

  const handleResetFilters = () => {
    setSearchTerm("");
    setSelectedCategory("all");
    setCondition("all");
    setLocation("");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("newest");
    router.push("/products");
    setFilterOpen(false);
  };

  const handlePageChange = (newPage) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", newPage.toString());
    router.push(`/products?${params.toString()}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Fetch Categories & Products when URL query parameters change
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const catRes = await api.get("/products/categories");
        setCategories(catRes.data);
      } catch (err) {
        console.error("Failed to load categories", err);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const queryParams = {};
        const qSearch = searchParams.get("search");
        const qCat = searchParams.get("category");
        const qCond = searchParams.get("condition");
        const qLoc = searchParams.get("location");
        const qMin = searchParams.get("minPrice");
        const qMax = searchParams.get("maxPrice");
        const qSort = searchParams.get("sortBy");
        const qPage = searchParams.get("page") || 1;

        if (qSearch) queryParams.search = qSearch;
        if (qCat && qCat !== "all") queryParams.category = qCat;
        if (qCond && qCond !== "all") queryParams.condition = qCond;
        if (qLoc) queryParams.location = qLoc;
        if (qMin) queryParams.minPrice = qMin;
        if (qMax) queryParams.maxPrice = qMax;
        if (qSort) queryParams.sortBy = qSort;
        queryParams.page = qPage;
        queryParams.limit = 9;

        const response = await api.get("/products", { params: queryParams });
        setProducts(response.data.products);
        setPage(response.data.page);
        setTotalPages(response.data.pages);
        setTotalProducts(response.data.totalProducts);
      } catch (error) {
        console.error("Failed to load products", error);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchParams]);

  const FilterPanel = (
    <form onSubmit={handleApplyFilters} className="space-y-6">
      {/* Search Input */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
          Keywords
        </label>
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-3 pr-8 text-xs text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
            placeholder="Search laptop, chair..."
          />
          <button
            type="submit"
            className="absolute right-2.5 top-3 text-slate-400"
          >
            <Search className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Category Filter */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
          Category
        </label>
        <select
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 appearance-none"
        >
          <option value="all">All Categories</option>
          {categories.map((cat) => (
            <option key={cat.name} value={cat.name}>
              {cat.name} ({cat.count})
            </option>
          ))}
        </select>
      </div>

      {/* Condition Filter */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
          Item Condition
        </label>
        <select
          value={condition}
          onChange={(e) => setCondition(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs text-slate-800 focus:border-blue-500 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 appearance-none"
        >
          <option value="all">All Conditions</option>
          <option value="Used">Used</option>
          <option value="Like New">Like New</option>
          <option value="Refurbished">Refurbished</option>
        </select>
      </div>

      {/* Location Filter */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
          Location / City
        </label>
        <input
          type="text"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
          placeholder="e.g. Dhaka"
        />
      </div>

      {/* Price Range */}
      <div>
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
          Price Range (BDT)
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-1/2 rounded-xl border border-slate-200 bg-slate-50 py-2 px-2.5 text-xs text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
            placeholder="Min"
          />
          <span className="text-slate-400 text-xs">—</span>
          <input
            type="number"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-1/2 rounded-xl border border-slate-200 bg-slate-50 py-2 px-2.5 text-xs text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
            placeholder="Max"
          />
        </div>
      </div>

      <div className="flex gap-3">
        <button
          type="button"
          onClick={handleResetFilters}
          className="flex-1 py-3 border border-slate-200 text-slate-500 font-bold text-xs rounded-xl hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800 transition"
        >
          Reset
        </button>
        <button
          type="submit"
          className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/10 transition"
        >
          Apply
        </button>
      </div>
    </form>
  );

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 flex-1 w-full">
      {/* Mobile Filter Toggle Button */}
      <div className="md:hidden mb-4 flex items-center justify-between">
        <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
          <span className="font-extrabold text-slate-800 dark:text-white">
            {totalProducts}
          </span>{" "}
          listings
        </p>
        <button
          onClick={() => setFilterOpen(true)}
          className="flex items-center space-x-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-300 shadow-sm"
        >
          <Filter className="h-4 w-4" />
          <span>Filters</span>
        </button>
      </div>

      {/* Mobile Filter Drawer Overlay */}
      {filterOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
            onClick={() => setFilterOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 w-80 max-w-full bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 p-6 shadow-2xl overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800 mb-6">
              <h2 className="font-extrabold text-lg flex items-center space-x-2">
                <SlidersHorizontal className="h-5 w-5 text-blue-500" />
                <span>Filters</span>
              </h2>
              <button
                onClick={() => setFilterOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            {FilterPanel}
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row gap-8">
        {/* LEFT COLUMN: FILTERS PANEL */}
        <aside className="hidden md:block w-64 flex-shrink-0 bg-white border border-slate-200/80 rounded-2xl p-6 dark:bg-slate-900 dark:border-slate-800 h-fit space-y-6 shadow-sm">
          <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
            <h2 className="font-extrabold text-lg flex items-center space-x-2">
              <SlidersHorizontal className="h-5 w-5 text-blue-500" />
              <span>Filters</span>
            </h2>
          </div>
          {FilterPanel}
        </aside>

        {/* RIGHT COLUMN: SEARCH RESULTS */}
        <section className="flex-1 space-y-6 min-w-0">
          {/* Results Header / Sorting */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 sm:p-4 bg-white border border-slate-200/80 rounded-2xl dark:bg-slate-900 dark:border-slate-800 shadow-sm gap-2 sm:gap-3">
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              Showing{" "}
              <span className="font-extrabold text-slate-800 dark:text-white">
                {totalProducts}
              </span>{" "}
              available listings
            </p>
            <div className="flex items-center space-x-2">
              <ArrowUpDown className="h-4 w-4 text-slate-400 flex-shrink-0" />
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value);
                  const params = new URLSearchParams(searchParams.toString());
                  params.set("sortBy", e.target.value);
                  params.set("page", "1");
                  router.push(`/products?${params.toString()}`);
                }}
                className="rounded-xl border border-slate-200 bg-slate-50 py-2 px-3 text-xs text-slate-800 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 appearance-none font-semibold"
              >
                <option value="newest">Newest Listings</option>
                <option value="priceLowToHigh">Price: Low to High</option>
                <option value="priceHighToLow">Price: High to Low</option>
                <option value="oldest">Oldest Listings</option>
              </select>
            </div>
          </div>

          {/* Catalog Listing */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((idx) => (
                <div
                  key={idx}
                  className="flex flex-col overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm dark:border-slate-800 dark:bg-slate-900 animate-pulse"
                >
                  <div className="h-44 w-full bg-slate-200 dark:bg-slate-800" />
                  <div className="p-5 flex-1 flex flex-col space-y-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <div className="h-3 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
                        <div className="h-3 w-16 bg-slate-200 dark:bg-slate-800 rounded" />
                      </div>
                      <div className="h-5 w-3/4 bg-slate-200 dark:bg-slate-800 rounded" />
                      <div className="h-3 w-full bg-slate-200 dark:bg-slate-800 rounded" />
                      <div className="h-3 w-5/6 bg-slate-200 dark:bg-slate-800 rounded" />
                    </div>
                    <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3.5">
                      <div className="h-6 w-24 bg-slate-200 dark:bg-slate-800 rounded" />
                      <div className="h-8 w-20 bg-slate-200 dark:bg-slate-800 rounded-xl" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-300 p-6 sm:p-16 text-center dark:border-slate-800">
              <SlidersHorizontal className="h-10 w-10 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-bold">No products found</h3>
              <p className="text-sm text-slate-500 mt-2">
                Try adjusting your filters or search terms.
              </p>
              <button
                onClick={handleResetFilters}
                className="mt-4 text-sm font-bold text-blue-600 hover:underline dark:text-blue-400"
              >
                Clear all filters
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((product) => (
                  <div
                    key={product._id}
                    className="flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-sm hover:shadow-md dark:border-slate-800 dark:bg-slate-900 transition-shadow"
                  >
                    <div className="relative">
                      <img
                        src={
                          product.images?.[0] ||
                          "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=500&auto=format&fit=crop"
                        }
                        alt={product.title}
                        className="h-48 w-full object-cover"
                        loading="lazy"
                      />
                      {/* Compare toggle */}
                      <button
                        onClick={(e) => handleToggleCompare(product._id, e)}
                        className={`absolute top-2.5 left-2.5 p-2 rounded-xl backdrop-blur-md transition shadow-md z-10 ${
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
                      <span className="absolute bottom-2.5 right-2.5 rounded-full bg-slate-900/80 backdrop-blur-md px-3 py-1 text-[10px] font-bold text-white uppercase">
                        {product.condition}
                      </span>
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">
                            {product.category}
                          </span>
                          <span className="text-[10px] text-slate-400">
                            📍 {product.location?.split(",")[0]}
                          </span>
                        </div>
                        <h3 className="text-base font-bold text-slate-800 dark:text-slate-100 mt-1 line-clamp-1">
                          {product.title}
                        </h3>
                        {/* Seller verification row */}
                        <div className="flex items-center space-x-1.5 mt-1">
                          <span className="text-[11px] font-semibold text-slate-400">
                            By {product.sellerInfo?.name}
                          </span>
                          {product.sellerInfo?.isVerified && (
                            <ShieldCheck
                              className="h-3.5 w-3.5 text-blue-500 fill-blue-500/10"
                              title="Verified Seller"
                            />
                          )}
                        </div>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-2">
                          {product.description}
                        </p>
                      </div>

                      <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3.5">
                        <span className="text-lg font-extrabold text-slate-900 dark:text-white">
                          BDT {product.price?.toLocaleString()}
                        </span>
                        <Link
                          href={`/products/${product._id}`}
                          className="rounded-xl bg-blue-50 px-3.5 py-2 text-xs font-bold text-blue-600 hover:bg-blue-100 dark:bg-blue-950/40 dark:text-blue-400 dark:hover:bg-blue-900/40 transition"
                        >
                          Details
                        </Link>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-center space-x-4 pt-6">
                  <button
                    onClick={() => handlePageChange(page - 1)}
                    disabled={page === 1}
                    className="rounded-xl border border-slate-200 p-2.5 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800 transition disabled:opacity-40"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </button>
                  <span className="text-sm font-bold text-slate-600 dark:text-slate-400">
                    Page {page} of {totalPages}
                  </span>
                  <button
                    onClick={() => handlePageChange(page + 1)}
                    disabled={page === totalPages}
                    className="rounded-xl border border-slate-200 p-2.5 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800 transition disabled:opacity-40"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>
              )}
            </>
          )}
        </section>
      </div>

      {/* Floating comparison drawer */}
      {compareList.length > 0 && (
        <div className="fixed bottom-4 sm:bottom-6 left-1/2 -translate-x-1/2 z-40 bg-slate-900/90 dark:bg-slate-950/90 text-white backdrop-blur-md rounded-2xl px-4 sm:px-5 py-3 sm:py-3.5 flex items-center justify-between gap-4 sm:gap-6 shadow-2xl border border-slate-800/80 w-[calc(100%-2rem)] max-w-md animate-slide-up">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-600/20 p-2 rounded-xl text-blue-400 flex-shrink-0">
              <Scale className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm font-bold">
                {compareList.length} items selected
              </p>
              <p className="text-[10px] text-slate-400 font-semibold hidden sm:block">
                Compare side-by-side
              </p>
            </div>
          </div>
          <Link
            href="/compare"
            className="rounded-xl bg-blue-600 hover:bg-blue-500 px-4 py-2 text-xs font-bold text-white transition flex-shrink-0"
          >
            Compare
          </Link>
        </div>
      )}
    </div>
  );
}

export default function Products() {
  return (
    <Suspense
      fallback={
        <div className="flex-1 flex items-center justify-center min-h-[400px]">
          <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500" />
        </div>
      }
    >
      <ProductsContent />
    </Suspense>
  );
}
