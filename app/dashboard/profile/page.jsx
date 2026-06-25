"use client";

import React, { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import {
  User,
  Phone,
  MapPin,
  Key,
  ShieldCheck,
  ShieldAlert,
  CheckCircle,
} from "lucide-react";
import api from "../../../services/api.js";

export default function ProfileSettings() {
  const { user, refreshUser } = useAuth();

  const [name, setName] = useState(user?.name || "");
  const [photo, setPhoto] = useState(user?.photo || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [location, setLocation] = useState(
    user?.location || "Dhaka, Bangladesh",
  );

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");

  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSuccess("");
    setError("");
    setLoading(true);

    try {
      const updateData = { name, photo, phone, location };
      if (newPassword) {
        updateData.currentPassword = currentPassword;
        updateData.newPassword = newPassword;
      }

      await api.patch("/users/profile", updateData);
      await refreshUser();
      setSuccess("Profile updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile.");
    } finally {
      setLoading(false);
    }
  };

  const locationsList = [
    "Dhaka, Bangladesh",
    "Chittagong, Bangladesh",
    "Sylhet, Bangladesh",
    "Rajshahi, Bangladesh",
    "Khulna, Bangladesh",
    "Barisal, Bangladesh",
    "Rangpur, Bangladesh",
  ];

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-black md:text-3xl">Profile Settings</h1>
        <p className="text-sm text-slate-500 dark:text-slate-400">
          Manage your account credentials and personal details.
        </p>
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

      <form
        onSubmit={handleUpdateProfile}
        className="bg-white border border-slate-200/80 rounded-2xl p-4 sm:p-6 dark:bg-slate-900 dark:border-slate-800 shadow-sm space-y-6"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {/* Full Name */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Full Name
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <User className="h-5 w-5" />
              </span>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-10 pr-4 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
              />
            </div>
          </div>

          {/* Profile Photo URL */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Avatar Image URL
            </label>
            <input
              type="text"
              value={photo}
              onChange={(e) => setPhoto(e.target.value)}
              className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 px-4 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
              placeholder="https://..."
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Phone Number
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <Phone className="h-5 w-5" />
              </span>
              <input
                type="text"
                required
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-10 pr-4 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
              />
            </div>
          </div>

          {/* Location */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-2">
              Location
            </label>
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400">
                <MapPin className="h-5 w-5" />
              </span>
              <select
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 pl-10 pr-4 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200 appearance-none"
              >
                {locationsList.map((loc) => (
                  <option key={loc} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Change Password Block */}
        <div className="border-t border-slate-200 dark:border-slate-800 pt-6 space-y-4">
          <h3 className="font-extrabold text-sm flex items-center space-x-2 text-slate-800 dark:text-slate-200">
            <Key className="h-5 w-5 text-indigo-500" />
            <span>Change Password (Optional)</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                Current Password
              </label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 px-4 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                placeholder="Required for password change"
              />
            </div>
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
                New Password
              </label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="block w-full rounded-xl border border-slate-200 bg-slate-50 py-3.5 px-4 text-sm text-slate-800 focus:border-blue-500 focus:bg-white focus:outline-none dark:border-slate-800 dark:bg-slate-950 dark:text-slate-200"
                placeholder="Min 6 characters"
              />
            </div>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="px-6 py-3.5 bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs rounded-xl shadow-md shadow-blue-500/10 transition disabled:opacity-50"
        >
          {loading ? "Saving Changes..." : "Save Settings"}
        </button>
      </form>
    </div>
  );
}
