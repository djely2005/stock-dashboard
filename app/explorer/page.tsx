import type { Metadata } from "next"
import FileExplorer from "@/components/file-explorer/file-explorer"

export const metadata: Metadata = {
  title: "File Explorer - Stock Manager",
  description: "Browse your products and categories in a desktop-like interface",
}

export default function ExplorerPage() {
  return (
    <div className="flex-1 h-[calc(100vh-4rem)] overflow-hidden bg-background">
      <FileExplorer />
    </div>
  )
}
