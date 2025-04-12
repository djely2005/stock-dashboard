"use client"

import type React from "react"

import { useEffect, useRef } from "react"
import { Edit, Trash, Copy, Clipboard, FolderPlus, FilePlus, RefreshCw, Info, MoveRight } from "lucide-react"

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

interface ContextMenuProps {
  x: number
  y: number
  item: ExplorerItem | null
  onClose: () => void
}

export default function ContextMenu({ x, y, item, onClose }: ContextMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null)

  // Adjust position if menu would go off screen
  const adjustedPosition = () => {
    if (!menuRef.current) return { x, y }

    const menuRect = menuRef.current.getBoundingClientRect()
    const parentRect = menuRef.current.parentElement?.getBoundingClientRect() || {
      width: window.innerWidth,
      height: window.innerHeight,
    }

    let adjustedX = x
    let adjustedY = y

    // Adjust X if menu would go off right edge
    if (x + menuRect.width > parentRect.width) {
      adjustedX = parentRect.width - menuRect.width - 10
    }

    // Adjust Y if menu would go off bottom edge
    if (y + menuRect.height > parentRect.height) {
      adjustedY = parentRect.height - menuRect.height - 10
    }

    return { x: adjustedX, y: adjustedY }
  }

  // Handle menu item click
  const handleMenuItemClick = (action: string) => {
    console.log(`Action: ${action}`, item)
    onClose()

    // In a real app, you'd implement these actions
    switch (action) {
      case "open":
        // Open the item
        break
      case "edit":
        // Edit the item
        break
      case "delete":
        // Delete the item
        break
      case "copy":
        // Copy the item
        break
      case "newFolder":
        // Create a new folder
        break
      case "newFile":
        // Create a new file
        break
      case "refresh":
        // Refresh the view
        break
      case "properties":
        // Show properties
        break
      default:
        break
    }
  }

  // Prevent clicks inside the menu from closing it
  const handleMenuClick = (e: React.MouseEvent) => {
    e.stopPropagation()
  }

  // Adjust position when menu ref is available
  useEffect(() => {
    if (menuRef.current) {
      const { x: adjustedX, y: adjustedY } = adjustedPosition()
      menuRef.current.style.left = `${adjustedX}px`
      menuRef.current.style.top = `${adjustedY}px`
    }
  }, [menuRef.current])

  return (
    <div
      ref={menuRef}
      className="absolute bg-popover border rounded-md shadow-md py-1 z-50 min-w-[180px]"
      style={{ left: x, top: y }}
      onClick={handleMenuClick}
    >
      {/* Menu items based on context */}
      {item ? (
        // Context menu for a selected item
        <>
          <MenuItem
            icon={item.type === "folder" ? <FolderPlus className="h-4 w-4" /> : <FilePlus className="h-4 w-4" />}
            label={item.type === "folder" ? "Open" : "Open"}
            onClick={() => handleMenuItemClick("open")}
          />
          <MenuDivider />
          <MenuItem icon={<Edit className="h-4 w-4" />} label="Edit" onClick={() => handleMenuItemClick("edit")} />
          <MenuItem
            icon={<Trash className="h-4 w-4" />}
            label="Delete"
            onClick={() => handleMenuItemClick("delete")}
            className="text-destructive"
          />
          <MenuDivider />
          <MenuItem icon={<Copy className="h-4 w-4" />} label="Copy" onClick={() => handleMenuItemClick("copy")} />
          {item.type === "file" && (
            <MenuItem
              icon={<MoveRight className="h-4 w-4" />}
              label="Move to..."
              onClick={() => handleMenuItemClick("moveTo")}
            />
          )}
          <MenuDivider />
          <MenuItem
            icon={<Info className="h-4 w-4" />}
            label="Properties"
            onClick={() => handleMenuItemClick("properties")}
          />
        </>
      ) : (
        // Context menu for the explorer background
        <>
          <MenuItem
            icon={<RefreshCw className="h-4 w-4" />}
            label="Refresh"
            onClick={() => handleMenuItemClick("refresh")}
          />
          <MenuDivider />
          <MenuItem
            icon={<FolderPlus className="h-4 w-4" />}
            label="New Folder"
            onClick={() => handleMenuItemClick("newFolder")}
          />
          <MenuItem
            icon={<FilePlus className="h-4 w-4" />}
            label="New Product"
            onClick={() => handleMenuItemClick("newFile")}
          />
          <MenuDivider />
          <MenuItem
            icon={<Clipboard className="h-4 w-4" />}
            label="Paste"
            onClick={() => handleMenuItemClick("paste")}
          />
        </>
      )}
    </div>
  )
}

// Helper components for menu items
function MenuItem({
  icon,
  label,
  onClick,
  className,
}: {
  icon: React.ReactNode
  label: string
  onClick: () => void
  className?: string
}) {
  return (
    <div className={`flex items-center px-3 py-1.5 hover:bg-muted cursor-pointer ${className || ""}`} onClick={onClick}>
      <span className="mr-2">{icon}</span>
      <span>{label}</span>
    </div>
  )
}

function MenuDivider() {
  return <div className="border-t my-1" />
}
