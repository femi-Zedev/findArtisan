"use client"

import * as React from "react"

import { cn } from "@/app/lib/utils"
import { Checkbox, CheckboxProps } from "@mantine/core"
// import { Checkbox } from "./checkbox"

/**
 * Table component for displaying tabular data
 */
const Table = React.forwardRef<
  HTMLTableElement,
  React.HTMLAttributes<HTMLTableElement>
>(({ className, ...props }, ref) => (
  <div className="relative w-full overflow-auto">
    <table
      ref={ref}
      className={cn("w-full caption-bottom text-sm bg-white dark:bg-gray-950", className)}
      {...props}
    />
  </div>
))
Table.displayName = "Table"

/**
 * TableHeader component for the table header
 */
const TableHeader = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <thead ref={ref} className={cn("[&_tr]:border-b border-gray-200 dark:border-gray-800", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

/**
 * TableBody component for the table body
 */
const TableBody = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tbody
    ref={ref}
    className={cn("[&_tr:last-child]:border-0", className)}
    {...props}
  />
))
TableBody.displayName = "TableBody"

/**
 * TableFooter component for the table footer
 */
const TableFooter = React.forwardRef<
  HTMLTableSectionElement,
  React.HTMLAttributes<HTMLTableSectionElement>
>(({ className, ...props }, ref) => (
  <tfoot
    ref={ref}
    className={cn("border-t bg-muted/50 font-medium [&>tr]:last:border-b-0", className)}
    {...props}
  />
))
TableFooter.displayName = "TableFooter"

/**
 * TableRow component for table rows
 */
const TableRow = React.forwardRef<
  HTMLTableRowElement,
  React.HTMLAttributes<HTMLTableRowElement>
>(({ className, ...props }, ref) => (
  <tr
    ref={ref}
    className={cn(
      "border-b border-gray-100 dark:border-gray-800 transition-colors hover:bg-gray-50/50 dark:hover:bg-gray-900/50 data-[state=selected]:bg-gray-50 dark:data-[state=selected]:bg-gray-900",
      className
    )}
    {...props}
  />
))
TableRow.displayName = "TableRow"

/**
 * TableHead component for table header cells
 */
const TableHead = React.forwardRef<
  HTMLTableCellElement,
  React.ThHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <th
    ref={ref}
    className={cn(
      "h-12 px-4 text-left align-middle font-medium text-sm text-gray-600 dark:text-gray-400",
      "[&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
))
TableHead.displayName = "TableHead"

/**
 * TableCell component for table data cells
 */
const TableCell = React.forwardRef<
  HTMLTableCellElement,
  React.TdHTMLAttributes<HTMLTableCellElement>
>(({ className, ...props }, ref) => (
  <td
    ref={ref}
    className={cn(
      "px-4 py-2.5 align-middle text-sm text-gray-900 dark:text-gray-100",
      "[&:has([role=checkbox])]:px-2 [&:has([role=checkbox])]:py-1.5 [&:has([role=checkbox])]:pr-0",
      className
    )}
    {...props}
  />
))
TableCell.displayName = "TableCell"

/**
 * TableCaption component for table captions
 */
const TableCaption = React.forwardRef<
  HTMLTableCaptionElement,
  React.HTMLAttributes<HTMLTableCaptionElement>
>(({ className, ...props }, ref) => (
  <caption
    ref={ref}
    className={cn("mt-4 text-sm text-muted-foreground", className)}
    {...props}
  />
))
TableCaption.displayName = "TableCaption"

const TableCheckbox = React.forwardRef<HTMLInputElement, CheckboxProps>((props, ref) => {
  return (
    <Checkbox
      ref={ref}
      size="sm"
      color="teal"
      radius={4}
      {...props}
    />
  );
});
TableCheckbox.displayName = 'TableCheckbox';

export {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
  TableCheckbox,
}
