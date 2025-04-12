import Link from "next/link"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import CategoriesTable from "@/components/categories-table"

export default function CategoriesPage() {
  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
        <Link href="/categories/new">
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            Add Category
          </Button>
        </Link>
      </div>

      <CategoriesTable />
    </div>
  )
}
