import Link from "next/link"
import { ArrowUpRight, Package, Tag } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import StatsCards from "@/components/stats-cards"
import RecentProducts from "@/components/recent-products"
import CategoryTree from "@/components/category-tree"

export default function Dashboard() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
        <div className="flex items-center gap-2">
          <Link href="/products/new">
            <Button>
              <Package className="mr-2 h-4 w-4" />
              Add Product
            </Button>
          </Link>
          <Link href="/categories/new">
            <Button variant="outline">
              <Tag className="mr-2 h-4 w-4" />
              Add Category
            </Button>
          </Link>
        </div>
      </div>

      <StatsCards />

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-1 md:col-span-1 lg:col-span-4">
          <CardHeader>
            <CardTitle>Recent Products</CardTitle>
            <CardDescription>Recently added products to your inventory</CardDescription>
          </CardHeader>
          <CardContent>
            <RecentProducts />
          </CardContent>
        </Card>

        <Card className="col-span-1 md:col-span-1 lg:col-span-3">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle>Category Structure</CardTitle>
            <Link href="/categories" className="text-sm text-muted-foreground flex items-center">
              View all
              <ArrowUpRight className="ml-1 h-3 w-3" />
            </Link>
          </CardHeader>
          <CardContent>
            <CategoryTree />
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
