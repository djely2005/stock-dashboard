"use client"

import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"

export default function RecentProducts() {
  // In a real application, this data would come from your database
  const products = [
    {
      id: "1",
      name: "Wireless Headphones",
      reference: "WH-1000XM4",
      category: "Electronics",
      createdAt: new Date(2023, 3, 15),
    },
    {
      id: "2",
      name: "Ergonomic Office Chair",
      reference: "EOC-2023",
      category: "Furniture",
      createdAt: new Date(2023, 3, 14),
    },
    {
      id: "3",
      name: "Mechanical Keyboard",
      reference: "MK-CHERRY",
      category: "Electronics",
      createdAt: new Date(2023, 3, 13),
    },
    {
      id: "4",
      name: "Desk Lamp",
      reference: "DL-LED-2023",
      category: "Lighting",
      createdAt: new Date(2023, 3, 12),
    },
    {
      id: "5",
      name: "Notebook Set",
      reference: "NS-PREMIUM",
      category: "Stationery",
      createdAt: new Date(2023, 3, 11),
    },
  ]

  return (
    <div className="space-y-8">
      {products.map((product) => (
        <div key={product.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary/10 text-primary">
              {product.name.substring(0, 2).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">{product.name}</p>
            <div className="flex items-center gap-2">
              <p className="text-sm text-muted-foreground">{product.reference}</p>
              <Badge variant="outline" className="text-xs">
                {product.category}
              </Badge>
            </div>
          </div>
          <div className="ml-auto text-sm text-muted-foreground">
            {formatDistanceToNow(product.createdAt, { addSuffix: true })}
          </div>
        </div>
      ))}
    </div>
  )
}
