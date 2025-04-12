"use client"

import type React from "react"

import { File, Folder } from "lucide-react"
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

// Item type for the explorer (either a category or product)
type ExplorerItem = { type: "folder"; data: Category } | { type: "file"; data: Product }

interface FolderViewProps {
  items: ExplorerItem[]
  selectedItem: ExplorerItem | null
  onItemClick: (e: React.MouseEvent, item: ExplorerItem) => void
  onItemDoubleClick: (item: ExplorerItem) => void
  onItemContextMenu: (e: React.MouseEvent, item: ExplorerItem) => void
}

export default function FolderView({
  items,
  selectedItem,
  onItemClick,
  onItemDoubleClick,
  onItemContextMenu,
}: FolderViewProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
      {items.length === 0 ? (
        <div className="col-span-full text-center py-12 text-muted-foreground">This folder is empty</div>
      ) : (
        items.map((item) => {
          const isSelected =
            selectedItem &&
            selectedItem.type === item.type &&
            ((item.type === "folder" && selectedItem.data.id === item.data.id) ||
              (item.type === "file" && selectedItem.data.id === item.data.id))

          return (
            <div
              key={`${item.type}-${item.type === "folder" ? item.data.id : item.data.id}`}
              className={cn(
                "explorer-item flex flex-col items-center p-2 rounded-md cursor-pointer transition-colors",
                isSelected ? "bg-primary/10" : "hover:bg-muted",
              )}
              onClick={(e) => onItemClick(e, item)}
              onDoubleClick={() => onItemDoubleClick(item)}
              onContextMenu={(e) => onItemContextMenu(e, item)}
            >
              {item.type === "folder" ? (
                <Folder className="h-16 w-16 text-primary" />
              ) : (
                <File className="h-16 w-16 text-blue-500" />
              )}
              <div className="mt-2 text-center">
                <div className="font-medium truncate w-full max-w-[100px]">
                  {item.type === "folder" ? item.data.name : item.data.name}
                </div>
                {item.type === "file" && (
                  <div className="text-xs text-muted-foreground truncate w-full max-w-[100px]">
                    {item.data.reference}
                  </div>
                )}
              </div>
            </div>
          )
        })
      )}
    </div>
  )
}
