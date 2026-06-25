'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Package, Image as ImageIcon, Sparkles, CheckCircle, ShieldAlert } from 'lucide-react';
import api from '../../../../services/api.js';

export default function AddProduct() {
  const router = useRouter();

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [condition, setCondition] = useState('Used');
  const [price, setPrice] = useState('');
  const [stockQuantity, setStockQuantity] = useState('1');
  const [description, setDescription] = useState('');
  const [imageUrls, setImageUrls] = useState('https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=600&auto=format&fit=crop');
  
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccess('');
    setError('');
    setLoading(true);

    // Parse image URLs into array
    const images = imageUrls
      .split('\n')
      .map((url) => url.trim())
      .filter((url) => url.length > 0);

    try {
      const response = await api.post('/products', {
        title,
        category,
        condition,
        price: Number(price),
        stockQuantity: Number(stockQuantity),
        images,
        description,
      });

      setSuccess('Product listing created successfully. Sent for Admin moderation.');
      setTimeout(() => {
        router.push('/dashboard/seller/my-products');
      }, 2500);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to list product.');
    } finally {
      setLoading(false);
    }
  };

  const categories = ['Electronics', 'Furniture', 'Vehicles', 'Fashion', 'Mobile Phones', 'Books', 'Others'];

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-black md:text-3xl">List New Product</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Add detailed specs to publish your product on the catalog.</p>
      </div>

      {success && (
        <div className="flex items-center space-x-2 rounded-xl bg-green-50 p-4 text-sm text-green-600 dark:bg-green-950/20 dark:text-green-400 border border-green-200/50">
          <CheckCircle className="h-5 w-5 flex-shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {error && (
        <div className="flex items-center space-x-2 rounded-xl bg-red-50 p-4 text-sm text-red-600 dark:bg-red-950/20 dark:text-red-400 border border-red-200/50">
          <ShieldAlert className="h-5 w-5 flex-shrink-0" />
          <span>{error}</span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="bg-white border border-slate-200/80 rounded-2xl p-6 dark:bg-slate-900 dark:border-slate-800 shadow-sm space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Title */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Listing Title
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Package className="h-5 w-5" />
              </span>
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-10 pr-4 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                placeholder="e.g. Dell Inspiron 15 Laptop"
              />
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 px-4 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 appearance-none font-semibold"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>

          {/* Condition */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Condition
            </label>
            <select
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 px-4 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 appearance-none font-semibold"
            >
              <option value="Used">Used</option>
              <option value="Like New">Like New</option>
              <option value="Refurbished">Refurbished</option>
            </select>
          </div>

          {/* Price */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Price (BDT)
            </label>
            <input
              type="number"
              required
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 px-4 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
              placeholder="35000"
            />
          </div>

          {/* Stock */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Stock Quantity
            </label>
            <input
              type="number"
              required
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
              className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 px-4 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
              placeholder="1"
            />
          </div>

          {/* Image URLs */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Product Image URLs (One URL per line)
            </label>
            <div className="relative">
              <span className="absolute top-3.5 left-3 text-slate-400">
                <ImageIcon className="h-5 w-5" />
              </span>
              <textarea
                required
                rows={3}
                value={imageUrls}
                onChange={(e) => setImageUrls(e.target.value)}
                className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-10 pr-4 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 font-mono text-xs"
              />
            </div>
          </div>

          {/* Description */}
          <div className="sm:col-span-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Detailed Description
            </label>
            <textarea
              required
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 px-4 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
              placeholder="Provide key details, age, specs, and any issues..."
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/10 transition disabled:opacity-50"
        >
          {loading ? 'Publishing Product...' : 'List Product'}
        </button>
      </form>
    </div>
  );
}
