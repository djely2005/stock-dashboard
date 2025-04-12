"use client"

import { useState } from "react"
import Link from "next/link"
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
  type SortingState,
  getSortedRowModel,
  type ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table"
import { Edit, MoreHorizontal, Trash } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"

// This would come from your database in a real application
interface Product {
  id: string
  name: string
  reference: string
  category: string
  createdAt: Date
}

const data: Product[] = [
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
  {
    id: "6",
    name: "Wireless Mouse",
    reference: "WM-ERGO",
    category: "Electronics",
    createdAt: new Date(2023, 3, 10),
  },
  {
    id: "7",
    name: "Desk Organizer",
    reference: "DO-WOOD",
    category: "Office Supplies",
    createdAt: new Date(2023, 3, 9),
  },
  {
    id: "8",
    name: "Monitor Stand",
    reference: "MS-ALUM",
    category: "Furniture",
    createdAt: new Date(2023, 3, 8),
  },
  {
    id: "9",
    name: "USB-C Hub",
    reference: "UCH-7PORT",
    category: "Electronics",
    createdAt: new Date(2023, 3, 7),
  },
  {
    id: "10",
    name: "Desk Mat",
    reference: "DM-LEATHER",
    category: "Office Supplies",
    createdAt: new Date(2023, 3, 6),
  },
]

export default function ProductsTable() {
  const [sorting, setSorting] = useState<SortingState>([])
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([])

  const columns: ColumnDef<Product>[] = [
    {
      accessorKey: "name",
      header: "Name",
      cell: ({ row }) => <div className="font-medium">{row.getValue("name")}</div>,
    },
    {
      accessorKey: "reference",
      header: "Reference",
      cell: ({ row }) => <div className="text-muted-foreground">{row.getValue("reference")}</div>,
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => <Badge variant="outline">{row.getValue("category")}</Badge>,
    },
    {
      accessorKey: "createdAt",
      header: "Created At",
      cell: ({ row }) => {
        const date = row.original.createdAt
        return <div>{date.toLocaleDateString()}</div>
      },
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const product = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem>
                <Link href={`/products/${product.id}`} className="flex w-full items-center">
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive">
                <Trash className="mr-2 h-4 w-4" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
    },
  })

  return (
    <div>
      <div className="flex items-center py-4">
        <Input
          placeholder="Filter products..."
          value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
          onChange={(event) => table.getColumn("name")?.setFilterValue(event.target.value)}
          className="max-w-sm"
        />
      </div>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </TableHead>
                  )
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} data-state={row.getIsSelected() && "selected"}>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  No products found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 py-4">
        <Button variant="outline" size="sm" onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
          Previous
        </Button>
        <Button variant="outline" size="sm" onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
          Next
        </Button>
      </div>
    </div>
  )
}
