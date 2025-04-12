"use client"

import { ChevronDown, ChevronRight, FolderTree } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

interface Category {
  id: string
  name: string
  children?: Category[]
}

export default function CategoryTree() {
  // In a real application, this data would come from your database
  const categories: Category[] = [
    {
      id: "1",
      name: "Electronics",
      children: [
        { id: "1-1", name: "Computers" },
        { id: "1-2", name: "Phones" },
        { id: "1-3", name: "Accessories" },
      ],
    },
    {
      id: "2",
      name: "Furniture",
      children: [
        { id: "2-1", name: "Office" },
        { id: "2-2", name: "Home" },
      ],
    },
    {
      id: "3",
      name: "Stationery",
    },
    {
      id: "4",
      name: "Lighting",
    },
  ]

  return (
    <div className="space-y-4">
      {categories.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-8 text-center">
          <FolderTree className="h-10 w-10 text-muted-foreground" />
          <h3 className="mt-4 text-lg font-semibold">No categories yet</h3>
          <p className="text-sm text-muted-foreground">Create categories to organize your products</p>
        </div>
      ) : (
        <div className="space-y-2">
          {categories.map((category) => (
            <CategoryItem key={category.id} category={category} />
          ))}
        </div>
      )}
    </div>
  )
}

function CategoryItem({ category }: { category: Category }) {
  const [isOpen, setIsOpen] = useState(false)
  const hasChildren = category.children && category.children.length > 0

  return (
    <div>
      <div
        className={cn(
          "flex cursor-pointer items-center rounded-md px-2 py-1 hover:bg-muted",
          hasChildren && "font-medium",
        )}
        onClick={() => hasChildren && setIsOpen(!isOpen)}
      >
        {hasChildren ? (
          isOpen ? (
            <ChevronDown className="mr-1 h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="mr-1 h-4 w-4 text-muted-foreground" />
          )
        ) : (
          <div className="ml-5" />
        )}
        <span>{category.name}</span>
      </div>
      {isOpen && hasChildren && (
        <div className="ml-4 mt-1 border-l pl-4">
          {category.children!.map((child) => (
            <CategoryItem key={child.id} category={child} />
          ))}
        </div>
      )}
    </div>
  )
}
