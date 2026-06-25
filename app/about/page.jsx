"use client";

import React from "react";
import { motion } from "framer-motion";
import { Leaf, Users, ShieldCheck, Heart, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function AboutUs() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 },
    },
  };

  const itemVariants = {
    hidden: { y: 25, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: "spring", stiffness: 100 },
    },
  };

  return (
    <div className="flex-1 bg-slate-50 dark:bg-slate-950 py-12 sm:py-16 px-4 sm:px-6 lg:px-8">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="max-w-4xl mx-auto space-y-16"
      >
        {/* Hero Section */}
        <motion.div variants={itemVariants} className="text-center space-y-4">
          <span className="px-3.5 py-1.5 text-xs font-bold bg-blue-50 text-blue-700 dark:bg-blue-950/30 dark:text-blue-400 rounded-full border border-blue-200/50 dark:border-blue-900/50">
            Our Story
          </span>
          <h1 className="text-3xl font-black sm:text-5xl tracking-tight text-slate-900 dark:text-white mt-4">
            Reimagining Consumption for a{" "}
            <span className="bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
              Greener Future
            </span>
          </h1>
          <p className="text-slate-500 dark:text-slate-400 font-semibold max-w-xl mx-auto text-sm sm:text-base leading-relaxed">
            ReSell Hub is a circular marketplace dedicated to reducing e-waste,
            promoting recycling, and helping community members discover
            affordable pre-owned products safely.
          </p>
        </motion.div>

        {/* Core Features */}
        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 sm:grid-cols-3 gap-6"
        >
          <div className="bg-white border border-slate-200/85 p-6 rounded-2xl dark:bg-slate-900 dark:border-slate-800 shadow-sm space-y-3">
            <div className="rounded-xl bg-green-50 dark:bg-green-950/20 p-3 w-fit text-green-500">
              <Leaf className="h-6 w-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
              Circular Eco-System
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
              Keeping functional items out of landfills by providing a
              frictionless mechanism to sell and re-own them.
            </p>
          </div>

          <div className="bg-white border border-slate-200/85 p-6 rounded-2xl dark:bg-slate-900 dark:border-slate-800 shadow-sm space-y-3">
            <div className="rounded-xl bg-blue-50 dark:bg-blue-950/20 p-3 w-fit text-blue-500">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
              Secured Trade
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
              Integrating Stripe card tokenisation, seller verifications, and
              reporting structures for safe local commerce.
            </p>
          </div>

          <div className="bg-white border border-slate-200/85 p-6 rounded-2xl dark:bg-slate-900 dark:border-slate-800 shadow-sm space-y-3">
            <div className="rounded-xl bg-purple-50 dark:bg-purple-950/20 p-3 w-fit text-purple-500">
              <Users className="h-6 w-6" />
            </div>
            <h3 className="font-extrabold text-slate-900 dark:text-white text-base">
              Local Growth
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
              Empowering individuals to run micro-commerce stores and purchase
              high-quality second-hand goods at discount rates.
            </p>
          </div>
        </motion.div>

        {/* Sustainability Section */}
        <motion.div
          variants={itemVariants}
          className="bg-white border border-slate-200/85 dark:bg-slate-900 dark:border-slate-800 rounded-2xl p-8 shadow-sm flex flex-col md:flex-row items-center justify-between gap-8"
        >
          <div className="space-y-4 max-w-lg">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white">
              The Environmental Impact
            </h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
              Did you know that manufacturing a single laptop generates
              approximately 330kg of carbon emissions and consumes thousands of
              gallons of clean water? By buying a verified refurbished model on
              ReSell Hub instead, you prevent raw materials extraction and keep
              electronic wastes out of our soil.
            </p>
            <div className="flex items-center space-x-2 text-xs font-bold text-green-600">
              <Heart className="h-4 w-4 fill-green-500/10" />
              <span>
                Together, we have saved 4.2 Tons of CO2 emissions this year!
              </span>
            </div>
          </div>
          <div className="rounded-2xl bg-emerald-50 dark:bg-emerald-950/20 p-6 flex flex-col items-center justify-center border border-emerald-200/40 text-center w-full md:w-fit flex-shrink-0">
            <span className="text-4xl font-black text-emerald-600 dark:text-emerald-400">
              -45%
            </span>
            <span className="text-xs font-bold text-slate-600 dark:text-slate-300 mt-1 max-w-[120px]">
              Average carbon footprint reduction
            </span>
          </div>
        </motion.div>

        {/* Call to Action */}
        <motion.div variants={itemVariants} className="text-center pt-8">
          <Link
            href="/products"
            className="inline-flex items-center space-x-2 bg-blue-600 hover:bg-blue-500 text-white font-bold px-6 py-3.5 rounded-xl shadow-lg transition"
          >
            <span>Browse Products</span>
            <ArrowRight className="h-5 w-5" />
          </Link>
        </motion.div>
      </motion.div>
    </div>
  );
}
