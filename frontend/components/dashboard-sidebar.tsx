"use client"

import type React from "react"

import { Home, TrendingUp, MessageSquare, BarChart3, Settings } from "lucide-react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

interface SidebarItem {
  icon: React.ElementType
  label: string
  href: string
}

const professionalNavItems: SidebarItem[] = [
  { icon: Home, label: "Dashboard", href: "/dashboard/professional" },
  { icon: TrendingUp, label: "Malaria Forecast", href: "/dashboard/professional/forecast" },
  { icon: MessageSquare, label: "Triage Assistant", href: "/dashboard/professional/triage" },
  { icon: BarChart3, label: "Health Analytics", href: "/dashboard/professional/analytics" },
  { icon: Settings, label: "Settings", href: "/settings" },
]

const patientNavItems: SidebarItem[] = [
  { icon: Home, label: "Home", href: "/dashboard/patient" },
  { icon: MessageSquare, label: "Symptom Checker", href: "/dashboard/patient/triage" },
  { icon: BarChart3, label: "Health History", href: "/dashboard/patient/history" },
  { icon: Settings, label: "Settings", href: "/settings" },
]

interface DashboardSidebarProps {
  userType: "professional" | "patient"
}

export function DashboardSidebar({ userType }: DashboardSidebarProps) {
  const pathname = usePathname()
  const navItems = userType === "professional" ? professionalNavItems : patientNavItems

  return (
    <aside className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0 md:pt-16 border-r border-border bg-background">
      <nav className="flex-1 px-4 py-6 space-y-1">
        {navItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary text-primary-foreground"
                  : "text-muted-foreground hover:bg-accent hover:text-accent-foreground",
              )}
            >
              <Icon className="w-5 h-5" />
              {item.label}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}
