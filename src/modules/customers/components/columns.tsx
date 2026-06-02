"use client"

import type { ColumnDef } from "@tanstack/react-table"

import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"

import { genders } from "@/modules/customers/services/customer-mock-data"
import type { Customer } from "@/modules/customers/services/types/customer-types"
import { DataTableColumnHeader } from "./data-table-column-header"
import { DataTableRowActions } from "./data-table-row-actions"

interface CustomerColumnActions {
  onUpdateCustomer?: (customer: Customer) => void | Promise<void>
  onDeleteCustomer?: (customerId: string) => void | Promise<void>
}

export function getCustomerColumns({
  onUpdateCustomer,
  onDeleteCustomer,
}: CustomerColumnActions = {}): ColumnDef<Customer>[] {
  return [
    {
      id: "select",
      header: ({ table }) => (
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && "indeterminate")
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
          className="translate-y-[2px] cursor-pointer"
        />
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
          className="translate-y-[2px] cursor-pointer"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Tên" />
      ),
      cell: ({ row }) => {
        return (
          <div className="flex space-x-2">
            <span className="max-w-[200px] truncate font-medium">
              {row.getValue("name")}
            </span>
          </div>
        )
      },
      enableHiding: false,
    },
    {
      accessorKey: "phone",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Số điện thoại" />
      ),
      cell: ({ row }) => (
        <div className="w-[120px] font-mono text-sm">
          {row.getValue("phone")}
        </div>
      ),
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Email" />
      ),
      cell: ({ row }) => (
        <div className="max-w-[220px] truncate text-sm">
          {row.getValue("email")}
        </div>
      ),
    },
    {
      accessorKey: "gender",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Giới tính" />
      ),
      cell: ({ row }) => {
        const gender = genders.find(
          (g) => g.value === row.getValue("gender")
        )

        if (!gender) {
          return null
        }

        const genderColors = {
          male: "border-blue-500 text-blue-700 dark:text-blue-400",
          female: "border-pink-500 text-pink-700 dark:text-pink-400",
        }

        return (
          <div className="flex items-center">
            <Badge
              variant="outline"
              className={
                genderColors[gender.value as keyof typeof genderColors]
              }
            >
              {gender.icon && (
                <gender.icon className="mr-1 h-3 w-3" />
              )}
              <span className="text-sm">{gender.label}</span>
            </Badge>
          </div>
        )
      },
      filterFn: (row, id, value) => {
        return value.includes(row.getValue(id))
      },
    },
    {
      accessorKey: "occupation",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Nghề nghiệp" />
      ),
      cell: ({ row }) => {
        const occupation = row.getValue("occupation") as string
        return (
          <div className="max-w-[150px] truncate text-sm">
            {occupation || <span className="text-muted-foreground italic">—</span>}
          </div>
        )
      },
    },
    {
      accessorKey: "address",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Địa chỉ" />
      ),
      cell: ({ row }) => {
        const address = row.getValue("address") as string
        return (
          <div className="max-w-[200px] truncate text-sm">
            {address || <span className="text-muted-foreground italic">—</span>}
          </div>
        )
      },
    },
    {
      accessorKey: "notes",
      header: ({ column }) => (
        <DataTableColumnHeader column={column} title="Ghi chú" />
      ),
      cell: ({ row }) => {
        const notes = row.getValue("notes") as string
        return (
          <div className="max-w-[200px] truncate text-sm" title={notes || ""}>
            {notes || <span className="text-muted-foreground italic">—</span>}
          </div>
        )
      },
    },
    {
      id: "actions",
      cell: ({ row }) => (
        <DataTableRowActions
          row={row}
          onUpdateCustomer={onUpdateCustomer}
          onDeleteCustomer={onDeleteCustomer}
        />
      ),
    },
  ]
}

export const columns = getCustomerColumns()
