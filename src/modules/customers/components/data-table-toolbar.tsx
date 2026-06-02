"use client"

import type { Table } from "@tanstack/react-table"
import { Database, RefreshCcw } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DataTableViewOptions } from "./data-table-view-options"
import { AddCustomerModal } from "./add-customer-modal"

import type { Customer } from "@/modules/customers/services/types/customer-types"

interface DataTableToolbarProps<TData> {
  table: Table<TData>
  onAddCustomer?: (customer: Customer) => void | Promise<void>
  onSeedCustomers?: () => void | Promise<void>
  isSeedingCustomers?: boolean
}

export function DataTableToolbar<TData>({
  table,
  onAddCustomer,
  onSeedCustomers,
  isSeedingCustomers,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const globalFilter = table.getState().globalFilter ?? ""

  return (
    <div className="flex items-center justify-between">
      <div className="flex flex-1 items-center space-x-2">
        <Input
          placeholder="Tìm kiếm khách hàng..."
          value={globalFilter}
          onChange={(event) => table.setGlobalFilter(event.target.value)}
          className="w-[200px] lg:w-[300px] cursor-text"
        />
        <Button
          variant="outline"
          onClick={() => {
            table.resetColumnFilters()
            table.setGlobalFilter("")
          }}
          className="px-3 cursor-pointer"
          disabled={!isFiltered && !globalFilter}
        >
          <RefreshCcw className="h-4 w-4" />
          <span className="hidden lg:block">Đặt lại</span>
        </Button>
      </div>
      <div className="flex items-center space-x-2">
        <Button
          variant="outline"
          size="sm"
          className="cursor-pointer"
          onClick={onSeedCustomers}
          disabled={!onSeedCustomers || isSeedingCustomers}
        >
          <Database className="h-4 w-4" />
          <span className="hidden lg:block">
            {isSeedingCustomers ? "Đang tải..." : "Seed Data"}
          </span>
        </Button>
        <DataTableViewOptions table={table} />
        <AddCustomerModal onAddCustomer={onAddCustomer} />
      </div>
    </div>
  )
}
