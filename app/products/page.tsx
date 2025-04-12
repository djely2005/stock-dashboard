import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import ProductsTable from "@/components/products-table"

export default function ProductsPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Products</h2>
        <Link href="/products/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Product
          </Button>
        </Link>
      </div>

      <ProductsTable />
    </div>
  )
}
