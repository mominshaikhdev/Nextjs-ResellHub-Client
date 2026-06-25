"use client";

import React from "react";
import Link from "next/link";

export default function NotFound() {
  return (
    <div className="flex min-h-[80vh] flex-col items-center justify-center space-y-6 px-4 py-16 text-center bg-slate-50 dark:bg-slate-900 transition">
      <div className="relative w-72 h-72 mx-auto text-blue-600/10 dark:text-blue-500/5">
        <svg
          className="absolute inset-0 w-full h-full text-blue-600 dark:text-blue-500"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="1.5"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center select-none pointer-events-none">
          <span className="text-8xl font-black tracking-tighter text-slate-800 dark:text-slate-100 opacity-90 drop-shadow-md">
            404
          </span>
        </div>
      </div>

      <div className="space-y-3 max-w-md mx-auto">
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
          Page Not Found
        </h1>
        <p className="text-base text-slate-500 dark:text-slate-400">
          Sorry, we couldn’t find the page you’re looking for. It might have
          been moved, deleted, or the link might be broken.
        </p>
      </div>

      <div>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full bg-blue-600 px-8 py-3.5 text-base font-semibold text-white shadow-lg hover:bg-blue-500 hover:shadow-blue-500/25 transition duration-150 ease-in-out"
        >
          Back to Home
        </Link>
      </div>
    </div>
  );
}
