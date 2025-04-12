"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { BarChart3, Boxes, FolderKanban, Home, Package, Settings, Tag } from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"

interface SidebarProps {
  setOpen?: (open: boolean) => void
}

export default function Sidebar({ setOpen }: SidebarProps) {
  const pathname = usePathname()

  const routes = [
    {
      label: "Dashboard",
      icon: Home,
      href: "/",
      active: pathname === "/",
    },
    {
      label: "Products",
      icon: Package,
      href: "/products",
      active: pathname === "/products" || pathname.startsWith("/products/"),
    },
    {
      label: "Categories",
      icon: Tag,
      href: "/categories",
      active: pathname === "/categories" || pathname.startsWith("/categories/"),
    },
    {
      label: "File Explorer",
      icon: FolderKanban,
      href: "/explorer",
      active: pathname === "/explorer",
    },
    {
      label: "Inventory",
      icon: Boxes,
      href: "/inventory",
      active: pathname === "/inventory",
    },
    {
      label: "Analytics",
      icon: BarChart3,
      href: "/analytics",
      active: pathname === "/analytics",
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/settings",
      active: pathname === "/settings",
    },
  ]

  return (
    <div className="flex h-full w-[240px] flex-col border-r bg-background px-3 py-4">
      <div className="flex h-14 items-center border-b px-4 py-2">
        <Link href="/" className="flex items-center gap-2 font-semibold" onClick={() => setOpen?.(false)}>
          <Package className="h-6 w-6" />
          <span>Stock Manager</span>
        </Link>
      </div>
      <div className="flex-1 overflow-auto py-2">
        <nav className="grid items-start px-2 text-sm font-medium">
          {routes.map((route) => (
            <Link key={route.href} href={route.href} onClick={() => setOpen?.(false)}>
              <Button
                variant={route.active ? "secondary" : "ghost"}
                className={cn("w-full justify-start gap-3", {
                  "bg-secondary": route.active,
                })}
              >
                <route.icon className="h-4 w-4" />
                {route.label}
              </Button>
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}
