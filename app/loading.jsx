"use client";

import React from "react";

export default function Loading() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center space-y-4 px-4 bg-slate-50 dark:bg-slate-900 transition">
      <div className="relative h-16 w-16">
        <div className="absolute inset-0 rounded-full border-4 border-blue-100 dark:border-blue-950" />
        <div className="absolute inset-0 rounded-full border-4 border-blue-600 border-t-transparent animate-spin" />
      </div>
      <div className="text-center space-y-2">
        <h3 className="text-lg font-bold text-slate-700 dark:text-slate-200">
          Loading ReSell Hub...
        </h3>
        <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">
          Please wait while we gather the latest listings and statistics.
        </p>
      </div>
    </div>
  );
}
