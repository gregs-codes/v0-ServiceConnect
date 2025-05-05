"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Home, Users, Briefcase, Bell, User } from "lucide-react"

export default function MainNav() {
  const pathname = usePathname()

  const routes = [
    {
      href: "/",
      label: "Home",
      icon: Home,
      active: pathname === "/",
    },
    {
      href: "/providers",
      label: "Providers",
      icon: Users,
      active: pathname === "/providers" || pathname.startsWith("/providers/"),
    },
    {
      href: "/projects",
      label: "Projects",
      icon: Briefcase,
      active: pathname === "/projects" || pathname.startsWith("/projects/"),
    },
    {
      href: "/dashboard",
      label: "Dashboard",
      icon: Bell,
      active: pathname === "/dashboard",
    },
    {
      href: "/profile",
      label: "Profile",
      icon: User,
      active: pathname === "/profile",
    },
  ]

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "flex items-center text-sm font-medium transition-colors hover:text-primary",
            route.active ? "text-black dark:text-white" : "text-muted-foreground",
          )}
        >
          <route.icon className="h-4 w-4 mr-2" />
          {route.label}
        </Link>
      ))}
    </nav>
  )
}
