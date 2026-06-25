'use client';

import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, UserCheck, ShieldAlert, Trash2, Ban, ShieldCheck, Check, SearchCode } from 'lucide-react';
import api from '../../../../services/api.js';

export default function ManageUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [updatingId, setUpdatingId] = useState(null);
  const [error, setError] = useState('');

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await api.get('/users');
      setUsers(response.data);
    } catch (err) {
      console.error('Failed to load users', err);
      setError('Could not retrieve user directory.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    Promise.resolve().then(() => {
      fetchUsers();
    });
  }, []);

  const handleUpdateStatus = async (userId, currentStatus) => {
    const nextStatus = currentStatus === 'active' ? 'blocked' : 'active';
    setUpdatingId(userId);
    try {
      await api.patch(`/users/${userId}/status`, { status: nextStatus });
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, status: nextStatus } : u))
      );
    } catch (err) {
      console.error(err);
      setError('Failed to update user status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleVerifySeller = async (userId, currentVerification) => {
    const nextVerify = !currentVerification;
    setUpdatingId(userId);
    try {
      await api.patch(`/users/${userId}/verify`, { isVerified: nextVerify });
      setUsers((prev) =>
        prev.map((u) => (u._id === userId ? { ...u, isVerified: nextVerify } : u))
      );
    } catch (err) {
      console.error(err);
      setError('Failed to verify seller status.');
    } finally {
      setUpdatingId(null);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!confirm('Are you sure you want to permanently delete this user?')) return;
    setUpdatingId(userId);
    try {
      await api.delete(`/users/${userId}`);
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      console.error(err);
      setError('Failed to delete user.');
    } finally {
      setUpdatingId(null);
    }
  };

  const filteredUsers = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()) ||
      u.role?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-8 w-48 bg-slate-200 dark:bg-slate-800 rounded"></div>
        <div className="h-12 w-full max-w-md bg-slate-200 dark:bg-slate-800 rounded-xl"></div>
        <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-2xl"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-black md:text-3xl">Manage Users</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold">
          Moderate accounts, verify sellers, block/unblock, and delete users.
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 text-red-800 dark:bg-red-950/20 dark:border-red-900 dark:text-red-400 rounded-xl">
          <span className="text-sm font-semibold">{error}</span>
        </div>
      )}

      {/* Search Bar */}
      <div className="relative max-w-md w-full">
        <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400">
          <Search className="h-5 w-5" />
        </span>
        <input
          type="text"
          placeholder="Search by name, email, or role..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-12 pr-4 py-3 rounded-xl border border-slate-200/80 bg-white dark:bg-slate-900 dark:border-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm font-semibold shadow-sm transition"
        />
      </div>

      {/* Desktop Table View */}
      <div className="hidden lg:block bg-white border border-slate-200/80 rounded-2xl dark:bg-slate-900 dark:border-slate-800 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 text-xs font-bold uppercase tracking-wider bg-slate-50/50 dark:bg-slate-950/20">
                <th className="py-4 px-6">User</th>
                <th className="py-4 px-6">Role</th>
                <th className="py-4 px-6">Location</th>
                <th className="py-4 px-6 text-center">Status</th>
                <th className="py-4 px-6 text-center">Seller Badge</th>
                <th className="py-4 px-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-sm font-semibold text-slate-700 dark:text-slate-300">
              <AnimatePresence>
                {filteredUsers.map((u) => (
                  <motion.tr
                    key={u._id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="hover:bg-slate-50 dark:hover:bg-slate-800/50 transition"
                  >
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <img
                          src={u.photo || 'https://i.pravatar.cc/300?img=1'}
                          alt={u.name}
                          className="w-10 h-10 rounded-full object-cover border border-slate-100 dark:border-slate-800"
                        />
                        <div>
                          <p className="font-extrabold text-slate-900 dark:text-white">{u.name}</p>
                          <p className="text-xs text-slate-400 font-mono mt-0.5">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="capitalize px-2 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-[10px] uppercase font-bold tracking-wider rounded-lg border border-slate-200/40 dark:border-slate-700">
                        {u.role}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-xs">{u.location || 'N/A'}</td>
                    <td className="py-4 px-6 text-center">
                      <span
                        className={`px-2.5 py-1 text-[10px] font-extrabold uppercase rounded-full border ${
                          u.status === 'active'
                            ? 'bg-green-50 text-green-700 border-green-200 dark:bg-green-950/20 dark:text-green-400 dark:border-green-900'
                            : 'bg-red-50 text-red-700 border-red-200 dark:bg-red-950/20 dark:text-red-400 dark:border-red-900'
                        }`}
                      >
                        {u.status}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      {u.role === 'seller' ? (
                        <button
                          onClick={() => handleVerifySeller(u._id, u.isVerified)}
                          disabled={updatingId === u._id}
                          className={`inline-flex items-center gap-1 text-xs font-bold px-3 py-1 rounded-xl transition border ${
                            u.isVerified
                              ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950/20 dark:border-blue-900 dark:text-blue-400'
                              : 'bg-slate-50 border-slate-200 text-slate-500 dark:bg-slate-800/40 dark:border-slate-700 dark:text-slate-400'
                          }`}
                        >
                          {u.isVerified ? (
                            <>
                              <ShieldCheck className="h-4 w-4 fill-blue-500/10" />
                              <span>Verified</span>
                            </>
                          ) : (
                            <span>Verify Seller</span>
                          )}
                        </button>
                      ) : (
                        <span className="text-slate-400 text-xs">-</span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex justify-end gap-3">
                        <button
                          onClick={() => handleUpdateStatus(u._id, u.status)}
                          disabled={updatingId === u._id}
                          title={u.status === 'active' ? 'Block User' : 'Activate User'}
                          className={`p-2 rounded-xl border transition ${
                            u.status === 'active'
                              ? 'border-amber-200 text-amber-600 hover:bg-amber-50 dark:border-amber-900/50 dark:text-amber-400 dark:hover:bg-amber-950/20'
                              : 'border-green-200 text-green-600 hover:bg-green-50 dark:border-green-900/50 dark:text-green-400 dark:hover:bg-green-950/20'
                          }`}
                        >
                          <Ban className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u._id)}
                          disabled={updatingId === u._id}
                          title="Delete User Account"
                          className="p-2 border border-red-200 hover:bg-red-50 text-red-600 dark:border-red-900/50 dark:hover:bg-red-950/20 dark:text-red-400 rounded-xl transition"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Card Grid View */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:hidden">
        <AnimatePresence>
          {filteredUsers.map((u) => (
            <motion.div
              key={u._id}
              layout
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              className="bg-white border border-slate-200/80 dark:bg-slate-900 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-sm space-y-4"
            >
              <div className="flex items-center space-x-3">
                <img
                  src={u.photo || 'https://i.pravatar.cc/300?img=1'}
                  alt={u.name}
                  className="w-12 h-12 rounded-full object-cover border border-slate-100 dark:border-slate-800 flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <h3 className="font-extrabold text-slate-900 dark:text-white text-base truncate">{u.name}</h3>
                  <p className="text-xs text-slate-400 font-mono mt-0.5 break-all">{u.email}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs border-t border-slate-100 dark:border-slate-800 pt-3">
                <div>
                  <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Role</p>
                  <span className="capitalize mt-1 font-semibold text-slate-700 dark:text-slate-300">{u.role}</span>
                </div>
                <div>
                  <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Status</p>
                  <span className={`capitalize mt-1 font-extrabold ${u.status === 'active' ? 'text-green-600' : 'text-red-600'}`}>
                    {u.status}
                  </span>
                </div>
                <div className="sm:col-span-2 mt-1">
                  <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Location</p>
                  <p className="font-semibold text-slate-700 dark:text-slate-300">{u.location || 'N/A'}</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="border-t border-slate-100 dark:border-slate-800 pt-4 flex flex-wrap gap-2 justify-end items-center">
                {u.role === 'seller' && (
                  <button
                    onClick={() => handleVerifySeller(u._id, u.isVerified)}
                    disabled={updatingId === u._id}
                    className={`text-xs font-bold px-3 py-1.5 rounded-xl border transition mr-auto flex-shrink-0 ${
                      u.isVerified
                        ? 'bg-blue-50 border-blue-200 text-blue-700 dark:bg-blue-950/20 dark:border-blue-900 dark:text-blue-400'
                        : 'bg-slate-50 border-slate-200 text-slate-500 dark:bg-slate-800/40 dark:border-slate-700 dark:text-slate-400'
                    }`}
                  >
                    {u.isVerified ? 'Verified' : 'Verify'}
                  </button>
                )}
                <button
                  onClick={() => handleUpdateStatus(u._id, u.status)}
                  disabled={updatingId === u._id}
                  className={`flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-xl border transition ${
                    u.status === 'active'
                      ? 'border-amber-200 text-amber-600 hover:bg-amber-50 dark:border-amber-900/50 dark:text-amber-400 dark:hover:bg-amber-950/20'
                      : 'border-green-200 text-green-600 hover:bg-green-50 dark:border-green-900/50 dark:text-green-400 dark:hover:bg-green-950/20'
                  }`}
                >
                  <Ban className="h-4 w-4" />
                  <span>{u.status === 'active' ? 'Block' : 'Unblock'}</span>
                </button>
                <button
                  onClick={() => handleDeleteUser(u._id)}
                  disabled={updatingId === u._id}
                  className="flex items-center gap-1 text-xs font-bold px-3 py-1.5 border border-red-200 hover:bg-red-50 text-red-600 dark:border-red-900/50 dark:hover:bg-red-950/20 dark:text-red-400 rounded-xl transition"
                >
                  <Trash2 className="h-4 w-4" />
                  <span>Delete</span>
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  );
}
