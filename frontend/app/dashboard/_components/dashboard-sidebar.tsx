"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/app/lib/utils";
import {
  LayoutDashboard,
  Table,
  UserPlus,
  HelpCircle,
  Wrench,
  FileText,
  X,
} from "lucide-react";
import { useUserStore } from "@/stores/userStore";
import { Button } from "@mantine/core";

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  userTypes: ("admin" | "contributor")[];
}

const adminNavItems: NavItem[] = [
  {
    label: "Tableau de bord",
    href: "/dashboard",
    icon: LayoutDashboard,
    userTypes: ["admin"],
  },
  {
    label: "Artisans",
    href: "/dashboard/artisans",
    icon: Table,
    userTypes: ["admin"],
  },
  {
    label: "Soumissions",
    href: "/dashboard/submissions",
    icon: FileText,
    userTypes: ["admin"],
  },
];

const contributorNavItems: NavItem[] = [
  {
    label: "Tableau de bord",
    href: "/dashboard",
    icon: LayoutDashboard,
    userTypes: ["contributor"],
  },
  {
    label: "Mes Contributions",
    href: "/dashboard/contributions",
    icon: Wrench,
    userTypes: ["contributor"],
  },
  {
    label: "Ajouter un Artisan",
    href: "/dashboard/add-artisan",
    icon: UserPlus,
    userTypes: ["contributor"],
  },
];

interface DashboardSidebarProps {
  isMobileOpen: boolean;
  onMobileClose: () => void;
}

export function DashboardSidebar({ isMobileOpen, onMobileClose }: DashboardSidebarProps) {
  const pathname = usePathname();
  const { user, getUserType, isAdmin, isContributor } = useUserStore();
  const userType = getUserType();

  // Filter nav items based on user type
  const getNavItems = (): NavItem[] => {
    if (isAdmin()) {
      return [...adminNavItems, ...contributorNavItems.filter((item) => item.userTypes.includes("admin"))];
    }
    if (isContributor()) {
      return contributorNavItems;
    }
    return [];
  };

  const navItems = getNavItems();

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onMobileClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 flex flex-col transition-transform duration-300",
          isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6  h-18 border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500">
              <Wrench className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-bold text-gray-900 dark:text-white">
              FindArtisan
            </span>
          </div>
          <button
            onClick={onMobileClose}
            className="lg:hidden cursor-pointer p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-400"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;

              // Determine if this item is active
              const isActive = (() => {
                // Exact match
                if (pathname === item.href) {
                  return true;
                }

                // For dashboard root, only highlight if we're exactly on /dashboard
                // Don't highlight if we're on a sub-route like /dashboard/submissions
                if (item.href === "/dashboard") {
                  return pathname === "/dashboard";
                }

                // For other routes, check if pathname starts with the href + "/"
                // This ensures /dashboard/submissions matches /dashboard/submissions
                // but not /dashboard
                return pathname.startsWith(item.href + "/");
              })();

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onMobileClose}
                  className={cn(
                    "cursor-pointer flex items-center gap-3 px-4 py-2 rounded-lg transition-colors",
                    isActive
                      ? "bg-teal-500/80 dark:bg-teal-700 text-white font-medium"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  )}
                >
                  <Icon className="h-5 w-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>

        {/* Profile Card */}
        {user && (
          <div className="p-4">
            <Link
              href="/dashboard/profile"
              onClick={onMobileClose}
              className="cursor-pointer block"
            >
              <div className="bg-gray-100 dark:bg-gray-800 rounded-lg p-4 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                <div className="flex items-center gap-3">
                  {user.image ? (
                    <img
                      src={user.image}
                      alt={user.name}
                      className="h-10 w-10 rounded-full"
                    />
                  ) : (
                    <div className="h-10 w-10 rounded-full bg-teal-500 flex items-center justify-center text-white text-sm font-semibold">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                      {user.name}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">
                      {user.email}
                    </p>
                  </div>
                </div>
              </div>
            </Link>
          </div>
        )}

      </aside>
    </>
  );
}

