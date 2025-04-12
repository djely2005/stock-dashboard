"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { ChevronRight, Home, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { ScrollArea } from "@/components/ui/scroll-area"
import ContextMenu from "./context-menu"
import FolderView from "./folder-view"
import { cn } from "@/lib/utils"

// Types based on your PostgreSQL schema
interface Category {
  id: string
  name: string
  parent_id: string | null
  children?: Category[]
}

interface Product {
  id: string
  name: string
  reference: string
  category_id: string
}

// Mock data - in a real app, this would come from your database
const mockCategories: Category[] = [
  {
    id: "root",
    name: "All Categories",
    parent_id: null,
    children: [
      {
        id: "1",
        name: "Electronics",
        parent_id: "root",
        children: [
          { id: "1-1", name: "Computers", parent_id: "1" },
          { id: "1-2", name: "Phones", parent_id: "1" },
          {
            id: "1-3",
            name: "Accessories",
            parent_id: "1",
            children: [
              { id: "1-3-1", name: "Cables", parent_id: "1-3" },
              { id: "1-3-2", name: "Chargers", parent_id: "1-3" },
            ],
          },
        ],
      },
      {
        id: "2",
        name: "Furniture",
        parent_id: "root",
        children: [
          { id: "2-1", name: "Office", parent_id: "2" },
          { id: "2-2", name: "Home", parent_id: "2" },
        ],
      },
      { id: "3", name: "Stationery", parent_id: "root" },
      { id: "4", name: "Lighting", parent_id: "root" },
    ],
  },
]

const mockProducts: Product[] = [
  { id: "p1", name: "Laptop", reference: "LAP-001", category_id: "1-1" },
  { id: "p2", name: "Desktop PC", reference: "PC-001", category_id: "1-1" },
  { id: "p3", name: "iPhone", reference: "PHN-001", category_id: "1-2" },
  { id: "p4", name: "Android Phone", reference: "PHN-002", category_id: "1-2" },
  { id: "p5", name: "USB Cable", reference: "CBL-001", category_id: "1-3-1" },
  { id: "p6", name: "HDMI Cable", reference: "CBL-002", category_id: "1-3-1" },
  { id: "p7", name: "Phone Charger", reference: "CHG-001", category_id: "1-3-2" },
  { id: "p8", name: "Office Chair", reference: "CHR-001", category_id: "2-1" },
  { id: "p9", name: "Office Desk", reference: "DSK-001", category_id: "2-1" },
  { id: "p10", name: "Sofa", reference: "SOF-001", category_id: "2-2" },
  { id: "p11", name: "Coffee Table", reference: "TBL-001", category_id: "2-2" },
  { id: "p12", name: "Notebook", reference: "NB-001", category_id: "3" },
  { id: "p13", name: "Pen Set", reference: "PEN-001", category_id: "3" },
  { id: "p14", name: "Desk Lamp", reference: "LMP-001", category_id: "4" },
  { id: "p15", name: "Ceiling Light", reference: "LMP-002", category_id: "4" },
]

// Item type for the explorer (either a category or product)
type ExplorerItem = { type: "folder"; data: Category } | { type: "file"; data: Product }

export default function FileExplorer() {
  const [path, setPath] = useState<Category[]>([mockCategories[0]])
  const [currentItems, setCurrentItems] = useState<ExplorerItem[]>([])
  const [contextMenu, setContextMenu] = useState<{
    show: boolean
    x: number
    y: number
    item: ExplorerItem | null
  }>({
    show: false,
    x: 0,
    y: 0,
    item: null,
  })
  const [selectedItem, setSelectedItem] = useState<ExplorerItem | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const explorerRef = useRef<HTMLDivElement>(null)

  // Find a category by ID in the nested structure
  const findCategory = (id: string, categories: Category[] = mockCategories): Category | null => {
    for (const category of categories) {
      if (category.id === id) return category
      if (category.children) {
        const found = findCategory(id, category.children)
        if (found) return found
      }
    }
    return null
  }

  // Get breadcrumb path
  const getBreadcrumbPath = (): Category[] => {
    return path
  }

  // Navigate to a specific category
  const navigateTo = (categoryId: string) => {
    setIsLoading(true)

    // Find the category
    const category = findCategory(categoryId)
    if (!category) {
      setIsLoading(false)
      return
    }

    // Build the new path
    const newPath: Category[] = []
    let current: Category | null = category

    // Add the current category and all its parents to the path
    while (current) {
      newPath.unshift(current)
      if (current.parent_id) {
        current = findCategory(current.parent_id)
      } else {
        break
      }
    }

    setPath(newPath)
    setIsLoading(false)
  }

  // Navigate to parent folder
  const navigateUp = () => {
    if (path.length > 1) {
      const newPath = [...path]
      newPath.pop()
      setPath(newPath)
    }
  }

  // Load items for the current category
  useEffect(() => {
    setIsLoading(true)

    // Get the current category
    const currentCategory = path[path.length - 1]

    // Get subcategories (folders)
    const folders: ExplorerItem[] = (currentCategory.children || []).map((category) => ({
      type: "folder",
      data: category,
    }))

    // Get products (files) for this category
    const files: ExplorerItem[] = mockProducts
      .filter((product) => product.category_id === currentCategory.id)
      .map((product) => ({
        type: "file",
        data: product,
      }))

    // Combine and set
    setCurrentItems([...folders, ...files])
    setIsLoading(false)
  }, [path])

  // Handle document click to close context menu
  useEffect(() => {
    const handleDocumentClick = () => {
      if (contextMenu.show) {
        setContextMenu({ ...contextMenu, show: false })
      }
    }

    document.addEventListener("click", handleDocumentClick)
    return () => {
      document.removeEventListener("click", handleDocumentClick)
    }
  }, [contextMenu])

  // Handle right click on an item
  const handleContextMenu = (e: React.MouseEvent, item: ExplorerItem) => {
    e.preventDefault()
    e.stopPropagation()

    // Calculate position relative to the explorer container
    const rect = explorerRef.current?.getBoundingClientRect()
    const x = e.clientX - (rect?.left || 0)
    const y = e.clientY - (rect?.top || 0)

    setContextMenu({
      show: true,
      x,
      y,
      item,
    })

    setSelectedItem(item)
  }

  // Handle right click on empty space
  const handleExplorerContextMenu = (e: React.MouseEvent) => {
    e.preventDefault()

    // Only show context menu if clicking on the background (not on an item)
    if ((e.target as HTMLElement).closest(".explorer-item")) {
      return
    }

    const rect = explorerRef.current?.getBoundingClientRect()
    const x = e.clientX - (rect?.left || 0)
    const y = e.clientY - (rect?.top || 0)

    setContextMenu({
      show: true,
      x,
      y,
      item: null, // No item selected, this is for the explorer background
    })

    setSelectedItem(null)
  }

  // Handle double click on an item
  const handleDoubleClick = (item: ExplorerItem) => {
    if (item.type === "folder") {
      // Navigate to the folder
      const newPath = [...path, item.data]
      setPath(newPath)
    } else {
      // Open product details (in a real app, you'd navigate to the product page)
      console.log("Opening product:", item.data)
      // You could implement a modal or navigate to a product detail page
    }
  }

  // Handle click on an item
  const handleItemClick = (e: React.MouseEvent, item: ExplorerItem) => {
    e.stopPropagation()
    setSelectedItem(item)
  }

  // Handle refresh
  const handleRefresh = () => {
    setIsLoading(true)
    // In a real app, you'd refetch data from the database
    setTimeout(() => {
      setIsLoading(false)
    }, 500)
  }

  return (
    <div
      className="flex flex-col h-full relative"
      ref={explorerRef}
      onContextMenu={handleExplorerContextMenu}
      onClick={() => setSelectedItem(null)}
    >
      {/* Explorer toolbar */}
      <div className="flex items-center gap-2 p-2 border-b">
        <Button variant="outline" size="icon" onClick={navigateUp} disabled={path.length <= 1}>
          <ChevronRight className="h-4 w-4 rotate-180" />
        </Button>

        <Button variant="outline" size="icon" onClick={() => navigateTo("root")}>
          <Home className="h-4 w-4" />
        </Button>

        <Button variant="outline" size="icon" onClick={handleRefresh} className={cn(isLoading && "animate-spin")}>
          <RefreshCw className="h-4 w-4" />
        </Button>

        <div className="flex-1 ml-2">
          <Breadcrumb>
            <BreadcrumbList>
              {getBreadcrumbPath().map((item, index) => (
                <BreadcrumbItem key={item.id}>
                  {index < getBreadcrumbPath().length - 1 ? (
                    <BreadcrumbLink
                      onClick={() => {
                        const newPath = [...path]
                        newPath.splice(index + 1)
                        setPath(newPath)
                      }}
                    >
                      {item.name}
                    </BreadcrumbLink>
                  ) : (
                    <span>{item.name}</span>
                  )}
                  {index < getBreadcrumbPath().length - 1 && <BreadcrumbSeparator />}
                </BreadcrumbItem>
              ))}
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </div>

      {/* Main explorer area */}
      <ScrollArea className="flex-1">
        <div className="p-4">
          {isLoading ? (
            <div className="flex items-center justify-center h-full min-h-[200px]">
              <div className="animate-spin">
                <RefreshCw className="h-8 w-8 text-muted-foreground" />
              </div>
            </div>
          ) : (
            <FolderView
              items={currentItems}
              selectedItem={selectedItem}
              onItemClick={handleItemClick}
              onItemDoubleClick={handleDoubleClick}
              onItemContextMenu={handleContextMenu}
            />
          )}
        </div>
      </ScrollArea>

      {/* Context menu */}
      {contextMenu.show && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          item={contextMenu.item}
          onClose={() => setContextMenu({ ...contextMenu, show: false })}
        />
      )}
    </div>
  )
}
