"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Boxes, DollarSign, Package, Tag } from "lucide-react"

export default function StatsCards() {
  // In a real application, this data would come from your database
  const stats = [
    {
      title: "Total Products",
      value: "254",
      icon: Package,
      description: "Products in database",
    },
    {
      title: "Categories",
      value: "12",
      icon: Tag,
      description: "Active categories",
    },
    {
      title: "Low Stock",
      value: "8",
      icon: Boxes,
      description: "Products need restock",
    },
    {
      title: "Inventory Value",
      value: "$45,231",
      icon: DollarSign,
      description: "Total inventory value",
    },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
            <stat.icon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground">{stat.description}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
