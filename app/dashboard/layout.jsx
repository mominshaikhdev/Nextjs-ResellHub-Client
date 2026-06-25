"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useAuth } from "../../context/AuthContext";
import {
  LayoutDashboard,
  ShoppingBag,
  Heart,
  CreditCard,
  User,
  PlusCircle,
  FolderKanban,
  BarChart3,
  Users,
  ShieldCheck,
  ShieldAlert,
  ChevronRight,
  LogOut,
} from "lucide-react";

const getShortName = (name) => {
  switch (name) {
    case "Manage Users":
      return "Users";
    case "Manage Products":
      return "Products";
    case "Manage Orders":
      return "Orders";
    case "Platform Analytics":
      return "Analytics";
    case "Sales Analytics":
      return "Analytics";
    case "Profile Settings":
      return "Profile";
    case "Payment History":
      return "Payments";
    case "Add Product":
      return "Add";
    case "My Products":
      return "Products";
    default:
      return name;
  }
};

export default function DashboardLayout({ children }) {
  const { user, loading, logout, isBuyer, isSeller, isAdmin } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  // Role-based access guard
  const roleSegment = pathname.split("/")[2];
  const roleMismatch =
    !!user &&
    ["buyer", "seller", "admin"].includes(roleSegment) &&
    roleSegment !== user.role;

  useEffect(() => {
    if (loading) return;
    if (!user) {
      router.replace("/login");
    } else if (roleMismatch) {
      router.replace(`/dashboard/${user.role}/overview`);
    }
  }, [loading, user, roleMismatch, router]);

  if (loading || !user || roleMismatch) {
    return (
      <div className="flex-1 flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

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

  const menuLinks = isBuyer ? buyerLinks : isSeller ? sellerLinks : adminLinks;

  return (
    <div className="flex-1 flex flex-col md:flex-row min-h-[600px] bg-slate-50 dark:bg-slate-950 relative">
      {/* SIDEBAR COMPONENT */}
      <aside className="hidden md:block w-64 flex-shrink-0 border-r border-slate-200/80 bg-white p-4 sm:p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/90 md:sticky md:top-16 md:h-[calc(100vh-64px)] md:self-start md:max-w-none md:z-auto">
        <div className="flex flex-col h-full justify-between">
          <div className="space-y-6">
            {/* Profile overview inside sidebar */}
            <div className="flex items-center space-x-3 pb-6 border-b border-slate-100 dark:border-slate-800">
              <img
                src={user.photo || "https://i.pravatar.cc/300?img=1"}
                alt="Profile"
                className="h-10 w-10 rounded-full object-cover border border-blue-500"
              />
              <div className="truncate">
                <div className="flex items-center space-x-1">
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200 truncate">
                    {user.name}
                  </p>
                  {user.isVerified && (
                    <ShieldCheck className="h-4 w-4 text-blue-500 fill-blue-500/10" />
                  )}
                </div>
                <p className="text-[10px] uppercase font-bold text-blue-500 dark:text-blue-400 mt-0.5">
                  {user.role}
                </p>
              </div>
            </div>

            {/* Menu Links */}
            <nav className="space-y-1">
              {menuLinks.map((link) => {
                const isActive = pathname === link.path;
                return (
                  <Link
                    key={link.name}
                    href={link.path}
                    className={`flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition ${
                      isActive
                        ? "bg-blue-600 text-white shadow-md shadow-blue-500/10"
                        : "text-slate-500 hover:bg-slate-50 hover:text-slate-800 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
                    }`}
                  >
                    <div className="flex items-center space-x-3 min-w-0">
                      {link.icon}
                      <span className="truncate">{link.name}</span>
                    </div>
                    {isActive && (
                      <ChevronRight className="h-4 w-4 flex-shrink-0" />
                    )}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Logout button */}
          <button
            onClick={logout}
            className="flex w-full items-center space-x-3 rounded-xl px-4 py-3.5 text-left text-sm font-bold text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/20 transition"
          >
            <LogOut className="h-5 w-5" />
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 min-w-0 p-4 sm:p-6 md:p-10 pt-4 md:pt-10 overflow-x-hidden">
        {children}
      </div>
    </div>
  );
}
