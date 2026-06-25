"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../context/ThemeContext";
import {
  Menu,
  X,
  Sun,
  Moon,
  User,
  LogOut,
  LayoutDashboard,
  ShoppingBag,
  ChevronDown,
  Heart,
  CreditCard,
  PlusCircle,
  FolderKanban,
  BarChart3,
  Users,
} from "lucide-react";

const getShortName = (name) => {
  switch (name) {
    case "Manage Users": return "Users";
    case "Manage Products": return "Products";
    case "Manage Orders": return "Orders";
    case "Platform Analytics": return "Analytics";
    case "Sales Analytics": return "Analytics";
    case "Profile Settings": return "Profile";
    case "Payment History": return "Payments";
    case "Add Product": return "Add";
    case "My Products": return "Products";
    default: return name;
  }
};

const Navbar = () => {
  const { user, logout, isAuthenticated } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (active) {
        setMobileMenuOpen(false);
        setProfileDropdownOpen(false);
      }
    });
    return () => {
      active = false;
    };
  }, [pathname]);

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileMenuOpen]);

  const closeMenus = () => {
    setMobileMenuOpen(false);
    setProfileDropdownOpen(false);
  };

  const handleLogout = async () => {
    closeMenus();
    await logout();
  };

  const links = [
    { name: "Home", path: "/" },
    { name: "Products", path: "/products" },
    { name: "Categories", path: "/categories" },
  ];

  const isActive = (path) => {
    if (path === "/") return pathname === "/";
    return pathname.startsWith(path);
  };

  const ordersPath =
    user?.role === "buyer"
      ? "/dashboard/buyer/orders"
      : user?.role === "seller"
        ? "/dashboard/seller/manage-orders"
        : "/dashboard/admin/manage-orders";

  const isBuyer = user?.role === "buyer";
  const isSeller = user?.role === "seller";
  const isAdmin = user?.role === "admin";

  const buyerLinks = [
    {
      name: "Overview",
      path: "/dashboard/buyer/overview",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: "My Orders",
      path: "/dashboard/buyer/orders",
      icon: <ShoppingBag className="h-5 w-5" />,
    },
    {
      name: "Wishlist",
      path: "/dashboard/buyer/wishlist",
      icon: <Heart className="h-5 w-5" />,
    },
    {
      name: "Payment History",
      path: "/dashboard/buyer/payments",
      icon: <CreditCard className="h-5 w-5" />,
    },
    {
      name: "Profile Settings",
      path: "/dashboard/profile",
      icon: <User className="h-5 w-5" />,
    },
  ];

  const sellerLinks = [
    {
      name: "Overview",
      path: "/dashboard/seller/overview",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: "Add Product",
      path: "/dashboard/seller/add-product",
      icon: <PlusCircle className="h-5 w-5" />,
    },
    {
      name: "My Products",
      path: "/dashboard/seller/my-products",
      icon: <FolderKanban className="h-5 w-5" />,
    },
    {
      name: "Manage Orders",
      path: "/dashboard/seller/manage-orders",
      icon: <ShoppingBag className="h-5 w-5" />,
    },
    {
      name: "Sales Analytics",
      path: "/dashboard/seller/analytics",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      name: "Profile Settings",
      path: "/dashboard/profile",
      icon: <User className="h-5 w-5" />,
    },
  ];

  const adminLinks = [
    {
      name: "Overview",
      path: "/dashboard/admin/overview",
      icon: <LayoutDashboard className="h-5 w-5" />,
    },
    {
      name: "Manage Users",
      path: "/dashboard/admin/manage-users",
      icon: <Users className="h-5 w-5" />,
    },
    {
      name: "Manage Products",
      path: "/dashboard/admin/manage-products",
      icon: <FolderKanban className="h-5 w-5" />,
    },
    {
      name: "Manage Orders",
      path: "/dashboard/admin/manage-orders",
      icon: <ShoppingBag className="h-5 w-5" />,
    },
    {
      name: "Transactions",
      path: "/dashboard/admin/transactions",
      icon: <CreditCard className="h-5 w-5" />,
    },
    {
      name: "Platform Analytics",
      path: "/dashboard/admin/analytics",
      icon: <BarChart3 className="h-5 w-5" />,
    },
    {
      name: "Profile Settings",
      path: "/dashboard/profile",
      icon: <User className="h-5 w-5" />,
    },
  ];

  const dashboardLinks = isBuyer ? buyerLinks : isSeller ? sellerLinks : adminLinks;

  return (
    <nav className={`${
      mobileMenuOpen ? "fixed" : "sticky"
    } top-0 z-50 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-md dark:border-slate-800/50 dark:bg-slate-950/80`}>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center space-x-2 flex-shrink-0"
            onClick={closeMenus}
          >
            <span className="text-xl sm:text-2xl font-extrabold tracking-tight bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent dark:from-blue-400 dark:to-indigo-300">
              ReSell Hub
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-6 lg:space-x-8">
            {links.map((link) => (
              <Link
                key={link.name}
                href={link.path}
                className={`text-sm font-semibold transition ${
                  isActive(link.path)
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400"
                }`}
              >
                {link.name}
              </Link>
            ))}
            {isAuthenticated && (
              <Link
                href="/dashboard"
                className={`text-sm font-semibold transition ${
                  isActive("/dashboard")
                    ? "text-blue-600 dark:text-blue-400"
                    : "text-slate-600 hover:text-blue-600 dark:text-slate-300 dark:hover:text-blue-400"
                }`}
              >
                Dashboard
              </Link>
            )}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="rounded-full p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>

            {isAuthenticated ? (
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setProfileDropdownOpen((prev) => !prev)}
                  className="flex items-center space-x-2 rounded-full pr-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition pl-1 py-1"
                >
                  <img
                    src={
                      user.photo || `https://i.pravatar.cc/300?u=${user.email}`
                    }
                    alt={user.name}
                    className="h-8 w-8 rounded-full border-2 border-blue-500 object-cover flex-shrink-0"
                  />
                  <span className="text-sm font-semibold text-slate-700 dark:text-slate-300 max-w-[100px] truncate">
                    {user.name?.split(" ")[0]}
                  </span>
                  <ChevronDown
                    className={`h-4 w-4 text-slate-400 transition-transform ${
                      profileDropdownOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-52 rounded-2xl border border-slate-200 bg-white p-1.5 shadow-xl dark:border-slate-800 dark:bg-slate-900 animate-fade-in">
                    <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-800 mb-1">
                      <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider">
                        Signed in as
                      </p>
                      <p className="truncate text-sm font-bold text-slate-700 dark:text-slate-200 mt-0.5">
                        {user.email}
                      </p>
                      <span className="inline-block mt-1 text-[9px] uppercase font-extrabold tracking-widest text-blue-500 bg-blue-50 dark:bg-blue-950/30 dark:text-blue-400 px-2 py-0.5 rounded-full">
                        {user.role}
                      </span>
                    </div>
                    <Link
                      href="/dashboard/profile"
                      className="flex items-center space-x-2.5 rounded-xl px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 transition"
                      onClick={closeMenus}
                    >
                      <User className="h-4 w-4 text-slate-400" />
                      <span>My Profile</span>
                    </Link>
                    <Link
                      href="/dashboard"
                      className="flex items-center space-x-2.5 rounded-xl px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 transition"
                      onClick={closeMenus}
                    >
                      <LayoutDashboard className="h-4 w-4 text-slate-400" />
                      <span>Dashboard</span>
                    </Link>
                    <Link
                      href={ordersPath}
                      className="flex items-center space-x-2.5 rounded-xl px-3 py-2.5 text-sm text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 transition"
                      onClick={closeMenus}
                    >
                      <ShoppingBag className="h-4 w-4 text-slate-400" />
                      <span>My Orders</span>
                    </Link>
                    <div className="border-t border-slate-100 dark:border-slate-800 mt-1 pt-1">
                      <button
                        onClick={handleLogout}
                        className="flex w-full items-center space-x-2.5 rounded-xl px-3 py-2.5 text-left text-sm text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20 transition"
                      >
                        <LogOut className="h-4 w-4" />
                        <span>Logout</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                href="/login"
                className="rounded-full bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-500 shadow-md shadow-blue-500/20 transition"
              >
                Login / Register
              </Link>
            )}
          </div>

          {/* Mobile: Theme toggle + Hamburger */}
          <div className="flex md:hidden items-center space-x-2">
            <button
              onClick={toggleTheme}
              className="rounded-full p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition"
              aria-label="Toggle Theme"
            >
              {theme === "dark" ? (
                <Sun className="h-5 w-5" />
              ) : (
                <Moon className="h-5 w-5" />
              )}
            </button>
            <button
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800 transition"
              aria-label="Toggle Mobile Menu"
            >
              {mobileMenuOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Slide Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 px-4 py-4 space-y-1 animate-fade-in shadow-lg max-h-[calc(100vh-64px)] overflow-y-auto">
          {links.map((link) => (
            <Link
              key={link.name}
              href={link.path}
              className={`flex items-center rounded-xl px-4 py-3 text-base font-semibold transition ${
                isActive(link.path)
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400"
                  : "text-slate-600 hover:bg-slate-50 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-blue-400"
              }`}
              onClick={closeMenus}
            >
              {link.name}
            </Link>
          ))}

          {isAuthenticated ? (
            <>
              {/* User mini-card in mobile */}
              <div className="flex items-center space-x-3 px-4 py-3 border-y border-slate-100 dark:border-slate-800 my-2">
                <img
                  src={
                    user.photo || `https://i.pravatar.cc/300?u=${user.email}`
                  }
                  alt={user.name}
                  className="h-9 w-9 rounded-full border-2 border-blue-500 object-cover"
                />
                <div>
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {user.name}
                  </p>
                  <p className="text-[10px] uppercase font-extrabold text-blue-500">
                    {user.role}
                  </p>
                </div>
              </div>
              {/* Conditionally show full dashboard menu or generic links */}
              {pathname.startsWith("/dashboard") ? (
                <>
                  <p className="px-4 py-1.5 text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                    Dashboard Menu
                  </p>
                  {dashboardLinks.map((link) => {
                    const isActiveLink = pathname === link.path;
                    return (
                      <Link
                        key={link.name}
                        href={link.path}
                        className={`flex items-center space-x-3 rounded-xl px-4 py-2.5 text-base font-semibold transition ${
                          isActiveLink
                            ? "bg-blue-50 text-blue-600 dark:bg-blue-950/30 dark:text-blue-400"
                            : "text-slate-600 hover:bg-slate-50 hover:text-blue-600 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-blue-400"
                        }`}
                        onClick={closeMenus}
                      >
                        {React.cloneElement(link.icon, { className: "h-5 w-5 text-slate-400" })}
                        <span>{getShortName(link.name)}</span>
                      </Link>
                    );
                  })}
                </>
              ) : (
                <>
                  <Link
                    href="/dashboard"
                    className="flex items-center space-x-3 rounded-xl px-4 py-3 text-base font-semibold text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 transition"
                    onClick={closeMenus}
                  >
                    <LayoutDashboard className="h-5 w-5 text-slate-400" />
                    <span>Dashboard</span>
                  </Link>
                  <Link
                    href="/dashboard/profile"
                    className="flex items-center space-x-3 rounded-xl px-4 py-3 text-base font-semibold text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 transition"
                    onClick={closeMenus}
                  >
                    <User className="h-5 w-5 text-slate-400" />
                    <span>My Profile</span>
                  </Link>
                  <Link
                    href={ordersPath}
                    className="flex items-center space-x-3 rounded-xl px-4 py-3 text-base font-semibold text-slate-600 hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800 transition"
                    onClick={closeMenus}
                  >
                    <ShoppingBag className="h-5 w-5 text-slate-400" />
                    <span>My Orders</span>
                  </Link>
                </>
              )}

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 mt-2">
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center space-x-3 rounded-xl px-4 py-3 text-left text-base font-bold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20 transition"
                >
                  <LogOut className="h-5 w-5" />
                  <span>Logout</span>
                </button>
              </div>
            </>
          ) : (
            <div className="pt-2">
              <Link
                href="/login"
                className="flex w-full items-center justify-center rounded-xl bg-blue-600 py-3 text-base font-semibold text-white hover:bg-blue-500 shadow-md shadow-blue-500/10 transition"
                onClick={closeMenus}
              >
                Login / Register
              </Link>
            </div>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;
