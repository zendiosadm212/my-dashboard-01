"use client"

import * as React from "react"
import type { Row } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { genders } from "@/modules/customers/services/customer-mock-data"
import {
  customerSchema,
  type Customer,
} from "@/modules/customers/services/types/customer-types"

interface DataTableRowActionsProps<TData> {
  row: Row<TData>
  onUpdateCustomer?: (customer: Customer) => void | Promise<void>
  onDeleteCustomer?: (customerId: string) => void | Promise<void>
}

export function DataTableRowActions<TData>({
  row,
  onUpdateCustomer,
  onDeleteCustomer,
}: DataTableRowActionsProps<TData>) {
  const parsed = customerSchema.safeParse(row.original)
  const [editOpen, setEditOpen] = React.useState(false)
  const [deleteOpen, setDeleteOpen] = React.useState(false)
  const [draft, setDraft] = React.useState<Customer | null>(null)
  const [isSaving, setIsSaving] = React.useState(false)
  const [isDeleting, setIsDeleting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  if (!parsed.success) {
    return null
  }

  const customer = parsed.data

  function openEditDialog() {
    setDraft(customer)
    setError(null)
    setEditOpen(true)
  }

  function openDeleteDialog() {
    setDeleteOpen(true)
  }

  async function handleSaveEdit() {
    if (!draft?.name.trim()) {
      setError("Tên là bắt buộc")
      return
    }
    if (!draft?.phone.trim()) {
      setError("Số điện thoại là bắt buộc")
      return
    }
    if (!draft?.email.trim()) {
      setError("Email là bắt buộc")
      return
    }

    try {
      setIsSaving(true)
      setError(null)
      await onUpdateCustomer?.({
        ...draft,
        name: draft.name.trim(),
        phone: draft.phone.trim(),
        email: draft.email.trim(),
        address: draft.address?.trim() || "",
        occupation: draft.occupation?.trim() || "",
        notes: draft.notes?.trim() || "",
      })
      setEditOpen(false)
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : "Không thể cập nhật khách hàng"
      )
    } finally {
      setIsSaving(false)
    }
  }

  async function handleConfirmDelete() {
    try {
      setIsDeleting(true)
      await onDeleteCustomer?.(customer.id)
      setDeleteOpen(false)
    } catch (deleteError) {
      console.error("Failed to delete customer:", deleteError)
    } finally {
      setIsDeleting(false)
    }
  }

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            className="flex h-8 w-8 p-0 data-[state=open]:bg-muted cursor-pointer"
          >
            <MoreHorizontal />
            <span className="sr-only">Open menu</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-[160px]">
          <DropdownMenuItem className="cursor-pointer" onClick={openEditDialog}>
            Chỉnh sửa
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="cursor-pointer"
            variant="destructive"
            onClick={openDeleteDialog}
          >
            Xóa
            <DropdownMenuShortcut className="text-destructive">
              ⌘⌫
            </DropdownMenuShortcut>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa khách hàng</DialogTitle>
            <DialogDescription>
              Cập nhật thông tin khách hàng và lưu vào Firestore.
            </DialogDescription>
          </DialogHeader>

          {draft ? (
            <div className="space-y-5">
              {error ? (
                <p className="text-sm text-destructive">{error}</p>
              ) : null}

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor={`customer-name-${customer.id}`}>
                    Tên <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id={`customer-name-${customer.id}`}
                    value={draft.name}
                    onChange={(event) =>
                      setDraft((current) =>
                        current
                          ? { ...current, name: event.target.value }
                          : current
                      )
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`customer-phone-${customer.id}`}>
                    Số điện thoại <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id={`customer-phone-${customer.id}`}
                    value={draft.phone}
                    onChange={(event) =>
                      setDraft((current) =>
                        current
                          ? { ...current, phone: event.target.value }
                          : current
                      )
                    }
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor={`customer-email-${customer.id}`}>
                    Email <span className="text-destructive">*</span>
                  </Label>
                  <Input
                    id={`customer-email-${customer.id}`}
                    type="email"
                    value={draft.email}
                    onChange={(event) =>
                      setDraft((current) =>
                        current
                          ? { ...current, email: event.target.value }
                          : current
                      )
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label>
                    Giới tính <span className="text-destructive">*</span>
                  </Label>
                  <Select
                    value={draft.gender}
                    onValueChange={(value) =>
                      setDraft((current) =>
                        current ? { ...current, gender: value } : current
                      )
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {genders.map((gender) => (
                        <SelectItem key={gender.value} value={gender.value}>
                          {gender.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor={`customer-occupation-${customer.id}`}>
                    Nghề nghiệp
                  </Label>
                  <Input
                    id={`customer-occupation-${customer.id}`}
                    value={draft.occupation || ""}
                    onChange={(event) =>
                      setDraft((current) =>
                        current
                          ? { ...current, occupation: event.target.value }
                          : current
                      )
                    }
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`customer-address-${customer.id}`}>
                    Địa chỉ
                  </Label>
                  <Input
                    id={`customer-address-${customer.id}`}
                    value={draft.address || ""}
                    onChange={(event) =>
                      setDraft((current) =>
                        current
                          ? { ...current, address: event.target.value }
                          : current
                      )
                    }
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor={`customer-notes-${customer.id}`}>
                  Ghi chú
                </Label>
                <Textarea
                  id={`customer-notes-${customer.id}`}
                  value={draft.notes || ""}
                  onChange={(event) =>
                    setDraft((current) =>
                      current
                        ? { ...current, notes: event.target.value }
                        : current
                    )
                  }
                  rows={3}
                />
              </div>
            </div>
          ) : null}

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setEditOpen(false)}
              disabled={isSaving}
            >
              Hủy
            </Button>
            <Button onClick={handleSaveEdit} disabled={isSaving}>
              {isSaving ? "Đang lưu..." : "Lưu thay đổi"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa khách hàng</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa khách hàng{" "}
              <span className="font-semibold text-foreground">
                {customer.name}
              </span>
              ? Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Hủy</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              {isDeleting ? "Đang xóa..." : "Xóa"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
