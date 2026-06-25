"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  CheckCircle,
  AlertCircle,
} from "lucide-react";

export default function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setTimeout(() => {
      setSubmitting(false);
      setSubmitted(true);
      setFormData({ name: "", email: "", subject: "", message: "" });
    }, 1200);
  };

  return (
    <div className="flex-1 bg-slate-50 dark:bg-slate-950 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto grid grid-cols-1 lg:grid-cols-5 gap-8 lg:gap-12">
        {/* Left Side: Contact Information Cards */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <span className="px-3.5 py-1.5 text-xs font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 rounded-full border border-blue-200/50 dark:border-blue-900/50">
              Get in Touch
            </span>
            <h1 className="text-3xl font-black text-slate-900 dark:text-white mt-4">
              Contact Our Team
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold mt-2">
              Have questions about products, transactions, or account
              verification? Drop us a line.
            </p>
          </div>

          <div className="space-y-6">
            <div className="bg-white border border-slate-200/85 p-6 rounded-2xl dark:bg-slate-900 dark:border-slate-800 shadow-sm flex items-start space-x-4">
              <div className="rounded-xl bg-blue-50 dark:bg-blue-950/20 p-3 text-blue-500">
                <MapPin className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">
                  Headquarters
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-semibold">
                  Dhaka, Bangladesh
                </p>
              </div>
            </div>

            <div className="bg-white border border-slate-200/85 p-6 rounded-2xl dark:bg-slate-900 dark:border-slate-800 shadow-sm flex items-start space-x-4">
              <div className="rounded-xl bg-green-50 dark:bg-green-950/20 p-3 text-green-500">
                <Mail className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">
                  Email Support
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-semibold">
                  support@resellhub.com
                </p>
              </div>
            </div>

            <div className="bg-white border border-slate-200/85 p-6 rounded-2xl dark:bg-slate-900 dark:border-slate-800 shadow-sm flex items-start space-x-4">
              <div className="rounded-xl bg-purple-50 dark:bg-purple-950/20 p-3 text-purple-500">
                <Phone className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-sm">
                  Call Assistance
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-semibold">
                  +880 1712-345678
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Inquiry Form */}
        <div className="lg:col-span-3 bg-white border border-slate-200/85 dark:bg-slate-900 dark:border-slate-800 rounded-2xl p-5 sm:p-8 shadow-sm">
          <AnimatePresence mode="wait">
            {!submitted ? (
              <motion.form
                key="contact-form"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onSubmit={handleSubmit}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 dark:text-slate-400">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) =>
                        setFormData({ ...formData, name: e.target.value })
                      }
                      placeholder="Md. Rakib Hasan"
                      className="w-full px-4 py-3 text-sm font-semibold rounded-xl border border-slate-200/80 bg-white dark:bg-slate-950 dark:border-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 dark:text-slate-400">
                      Email Address
                    </label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) =>
                        setFormData({ ...formData, email: e.target.value })
                      }
                      placeholder="rakib@gmail.com"
                      className="w-full px-4 py-3 text-sm font-semibold rounded-xl border border-slate-200/80 bg-white dark:bg-slate-950 dark:border-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 dark:text-slate-400">
                    Subject
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.subject}
                    onChange={(e) =>
                      setFormData({ ...formData, subject: e.target.value })
                    }
                    placeholder="General Inquiry, Seller Verification, etc."
                    className="w-full px-4 py-3 text-sm font-semibold rounded-xl border border-slate-200/80 bg-white dark:bg-slate-950 dark:border-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 dark:text-slate-400">
                    Message Description
                  </label>
                  <textarea
                    rows="5"
                    required
                    value={formData.message}
                    onChange={(e) =>
                      setFormData({ ...formData, message: e.target.value })
                    }
                    placeholder="Type details of your request here..."
                    className="w-full px-4 py-3 text-sm font-semibold rounded-xl border border-slate-200/80 bg-white dark:bg-slate-950 dark:border-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full flex items-center justify-center space-x-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-400 text-white font-bold py-3.5 rounded-xl shadow-lg transition"
                >
                  {submitting ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white"></div>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send className="h-4 w-4" />
                    </>
                  )}
                </button>
              </motion.form>
            ) : (
              <motion.div
                key="submission-success"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-12 space-y-4"
              >
                <div className="rounded-full bg-green-50 p-4 inline-block dark:bg-green-950/20 text-green-500">
                  <CheckCircle className="h-12 w-12" />
                </div>
                <h3 className="font-extrabold text-slate-900 dark:text-white text-xl">
                  Inquiry Submitted Successfully!
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold max-w-sm mx-auto leading-relaxed">
                  Thank you for contacting us. One of our support administrators
                  will review your inquiry and reply via email within 24 hours.
                </p>
                <button
                  onClick={() => setSubmitted(false)}
                  className="px-6 py-2 border border-slate-200 dark:border-slate-800 font-bold text-xs rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 dark:text-slate-300 transition"
                >
                  Send Another Inquiry
                </button>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
