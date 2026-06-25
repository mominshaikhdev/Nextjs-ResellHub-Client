'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { CreditCard, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import api from '../../../../services/api.js';

export default function BuyerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const response = await api.get('/orders/buyer');
      setOrders(response.data);
    } catch (error) {
      console.error('Failed to fetch orders', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Promise.resolve().then(() => {
      fetchOrders();
    });
  }, []);

  const handleCancelOrder = async (orderId) => {
    if (!confirm('Are you sure you want to cancel this order?')) return;
    try {
      await api.patch(`/orders/${orderId}/cancel`);
      alert('Order cancelled successfully.');
      fetchOrders(); 
    } catch (err) {
      alert(err.response?.data?.message || 'Cancellation failed.');
    }
  };

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        {[1, 2].map((i) => (
          <div key={i} className="h-44 rounded-2xl bg-slate-200 dark:bg-slate-800" />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black md:text-3xl">My Orders</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">Track and manage all your purchased listings.</p>
      </div>

      {orders.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 p-12 text-center dark:border-slate-800 bg-white dark:bg-slate-900/40">
          <ShoppingBag className="h-10 w-10 text-slate-400 mx-auto mb-4" />
          <p className="text-slate-500 dark:text-slate-400">{"You haven't placed any orders yet."}</p>
          <Link href="/products" className="text-blue-500 underline text-sm mt-2 inline-block">Browse Products</Link>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => {
            const canCancel = ['pending', 'accepted'].includes(order.orderStatus);
            const canPay = order.paymentStatus === 'pending' && order.orderStatus !== 'cancelled';

            return (
              <div
                key={order._id}
                className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-6 dark:bg-slate-900 dark:border-slate-800 shadow-sm space-y-6"
              >
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-4 border-b border-slate-100 dark:border-slate-800 gap-2">
                  <div className="min-w-0">
                    <span className="text-xs font-mono text-slate-400 block truncate">Order ID: {order._id}</span>
                    <p className="text-xs text-slate-400 mt-0.5">Placed on {new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${
                      order.paymentStatus === 'paid'
                        ? 'border-green-200 text-green-600 bg-green-50/15'
                        : order.paymentStatus === 'pending'
                        ? 'border-yellow-200 text-yellow-600 bg-yellow-50/15'
                        : 'border-red-200 text-red-600 bg-red-50/15'
                    }`}>
                      Payment: {order.paymentStatus}
                    </span>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase ${
                      order.orderStatus === 'cancelled'
                        ? 'bg-red-50/10 text-red-500 border border-red-500/20'
                        : order.orderStatus === 'delivered'
                        ? 'bg-green-50/10 text-green-500 border border-green-500/20'
                        : 'bg-blue-50/10 text-blue-500 border border-blue-500/20'
                    }`}>
                      Status: {order.orderStatus}
                    </span>
                  </div>
                </div>

                {/* Details */}
                <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
                  <div className="flex items-start space-x-3 min-w-0 w-full sm:w-auto">
                    {order.productId?.images && (
                      <img
                        src={order.productId.images[0]}
                        className="h-16 w-16 object-cover rounded-xl border border-slate-200 dark:border-slate-800 flex-shrink-0"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      <h3 className="font-bold text-sm text-slate-800 dark:text-slate-100 truncate">
                        {order.productId?.title || 'Unknown Product'}
                      </h3>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-1 truncate">
                        Seller: {order.sellerInfo.name} ({order.sellerInfo.email})
                      </p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5 truncate">
                        Address: {order.deliveryAddress}
                      </p>
                    </div>
                  </div>

                  <div className="text-left sm:text-right w-full sm:w-auto">
                    <p className="text-xs text-slate-400">Total Paid</p>
                    <p className="text-lg font-extrabold text-slate-900 dark:text-white mt-0.5">
                      BDT {order.totalAmount.toLocaleString()}
                    </p>
                  </div>
                </div>

                {/* Action footer */}
                {(canPay || canCancel) && (
                  <div className="flex flex-col sm:flex-row justify-end gap-2 sm:gap-4 pt-4 border-t border-slate-100 dark:border-slate-800 w-full">
                    {canCancel && (
                      <button
                        onClick={() => handleCancelOrder(order._id)}
                        className="flex items-center justify-center space-x-1.5 px-4 py-2 border border-red-200 rounded-xl text-xs font-bold text-red-600 hover:bg-red-50 dark:border-red-950/40 dark:hover:bg-red-950/20 transition w-full sm:w-auto"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span>Cancel Order</span>
                      </button>
                    )}
                    {canPay && (
                      <Link
                        href={`/checkout/${order._id}`}
                        className="flex items-center justify-center space-x-1.5 px-5 py-2.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl text-xs font-bold shadow-md shadow-blue-500/10 transition w-full sm:w-auto"
                      >
                        <CreditCard className="h-4 w-4" />
                        <span>Proceed to Pay</span>
                      </Link>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
