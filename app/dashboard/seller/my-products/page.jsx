"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  Package,
  Trash2,
  Edit,
  Search,
  CheckCircle2,
  ShieldAlert,
} from "lucide-react";
import api from "../../../../services/api.js";

export default function MyProducts() {
  const [products, setProducts] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [loading, setLoading] = useState(true);

  const [editingProduct, setEditingProduct] = useState(null);
  const [editTitle, setEditTitle] = useState("");
  const [editPrice, setEditPrice] = useState("");
  const [editStock, setEditStock] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [editStatus, setEditStatus] = useState("available");

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const fetchProducts = async () => {
    try {
      const response = await api.get("/products/my-listings");
      setProducts(response.data);
    } catch (err) {
      console.error("Failed to load listings", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Promise.resolve().then(() => {
      fetchProducts();
    });
  }, []);

  const filteredProducts = products.filter(
    (prod) =>
      prod.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prod.category.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this listing?")) return;
    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter((p) => p._id !== id));
      setMessage("Listing deleted successfully.");
    } catch (err) {
      alert(err.response?.data?.message || "Deletion failed.");
    }
  };

  const openEditModal = (product) => {
    setEditingProduct(product);
    setEditTitle(product.title);
    setEditPrice(product.price.toString());
    setEditStock(product.stockQuantity.toString());
    setEditDescription(product.description);
    setEditStatus(product.status);
    setMessage("");
    setError("");
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.patch(`/products/${editingProduct._id}`, {
        title: editTitle,
        price: Number(editPrice),
        stockQuantity: Number(editStock),
        description: editDescription,
        status: editStatus,
      });

      setMessage(
        "Listing updated successfully. Resubmitted for Admin moderation if fields were modified.",
      );
      setEditingProduct(null);
      fetchProducts();
    } catch (err) {
      setError(err.response?.data?.message || "Update failed.");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-12 rounded-xl bg-slate-200 dark:bg-slate-800" />
        <div className="h-64 rounded-xl bg-slate-200 dark:bg-slate-800" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black md:text-3xl">My Products</h1>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold">
            Track and edit your listed items.
          </p>
        </div>
        <Link
          href="/dashboard/seller/add-product"
          className="rounded-xl bg-blue-600 px-5 py-3 text-xs font-bold text-white hover:bg-blue-500 shadow-md shadow-blue-500/10 transition text-center"
        >
          Add Product
        </Link>
      </div>

      {message && (
        <div className="flex items-center space-x-2 rounded-xl bg-green-50 p-4 text-sm text-green-600 dark:bg-green-950/20 dark:text-green-400 border border-green-200/50">
          <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
          <span>{message}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative max-w-md bg-white border border-slate-200/80 rounded-xl dark:bg-slate-900 dark:border-slate-800 shadow-sm">
        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
          <Search className="h-5 w-5" />
        </span>
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="block w-full rounded-xl border border-transparent py-3 pl-10 pr-4 text-xs text-slate-800 focus:outline-none dark:text-slate-200 bg-transparent"
          placeholder="Search listings by title or category..."
        />
      </div>

      {/* Listings Table */}
      {filteredProducts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-800 bg-white dark:bg-slate-900/40">
          <Package className="h-10 w-10 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400">
            No matching product listings found.
          </p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden dark:bg-slate-900 dark:border-slate-800 shadow-sm">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 dark:divide-slate-800 text-sm">
              <thead className="bg-slate-50 dark:bg-slate-950 font-bold text-slate-500 uppercase text-xs">
                <tr>
                  <th className="px-6 py-4 text-left">Product</th>
                  <th className="px-6 py-4 text-left">Category</th>
                  <th className="px-6 py-4 text-left">Price</th>
                  <th className="px-6 py-4 text-left">Stock</th>
                  <th className="px-6 py-4 text-left">Moderation</th>
                  <th className="px-6 py-4 text-left">Status</th>
                  <th className="px-6 py-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {filteredProducts.map((prod) => (
                  <tr
                    key={prod._id}
                    className="hover:bg-slate-50/50 dark:hover:bg-slate-900/40 transition"
                  >
                    <td className="px-6 py-4 flex items-center space-x-3">
                      {prod.images && (
                        <img
                          src={prod.images[0]}
                          className="h-10 w-10 object-cover rounded-lg border"
                        />
                      )}
                      <span className="font-bold text-slate-800 dark:text-slate-200 truncate max-w-[150px]">
                        {prod.title}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {prod.category}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-800 dark:text-slate-200">
                      BDT {prod.price.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {prod.stockQuantity}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 text-xs font-bold rounded-full border ${
                          prod.approvalStatus === "approved"
                            ? "border-green-200 text-green-600 bg-green-50/15"
                            : prod.approvalStatus === "pending"
                              ? "border-yellow-200 text-yellow-600 bg-yellow-50/15"
                              : "border-red-200 text-red-600 bg-red-50/15"
                        }`}
                      >
                        {prod.approvalStatus}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 text-xs font-semibold rounded-full border ${
                          prod.status === "available"
                            ? "border-blue-200 text-blue-600 bg-blue-50/15"
                            : "border-slate-300 text-slate-500 bg-slate-50/10"
                        }`}
                      >
                        {prod.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <button
                        onClick={() => openEditModal(prod)}
                        className="p-2 border border-slate-200 hover:text-blue-500 hover:border-blue-500/20 dark:border-slate-800 rounded-xl transition inline-flex items-center"
                        title="Edit Listing"
                      >
                        <Edit className="h-4 w-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(prod._id)}
                        className="p-2 border border-slate-200 hover:text-red-500 hover:border-red-500/20 dark:border-slate-800 rounded-xl transition inline-flex items-center"
                        title="Delete Listing"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Listing Modal */}
      {editingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 backdrop-blur-sm p-4">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 dark:bg-slate-900 dark:border-slate-800 w-full max-w-md relative shadow-2xl space-y-4">
            <h3 className="text-lg font-black">Edit Listing</h3>
            {error && (
              <p className="text-xs text-red-600 bg-red-50/20 p-2.5 rounded-lg border border-red-200/50">
                {error}
              </p>
            )}

            <form onSubmit={handleUpdate} className="space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Title
                </label>
                <input
                  type="text"
                  required
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs text-slate-800 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Price (BDT)
                  </label>
                  <input
                    type="number"
                    required
                    value={editPrice}
                    onChange={(e) => setEditPrice(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs text-slate-800 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Stock
                  </label>
                  <input
                    type="number"
                    required
                    value={editStock}
                    onChange={(e) => setEditStock(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs text-slate-800 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                    Availability Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs text-slate-800 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                  >
                    <option value="available">available</option>
                    <option value="sold">sold</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1">
                  Description
                </label>
                <textarea
                  required
                  rows={3}
                  value={editDescription}
                  onChange={(e) => setEditDescription(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 px-3 text-xs text-slate-800 focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                />
              </div>

              <div className="flex gap-4 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingProduct(null)}
                  className="w-1/2 py-3 border border-slate-200 rounded-xl font-semibold text-xs hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-3 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl transition"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
