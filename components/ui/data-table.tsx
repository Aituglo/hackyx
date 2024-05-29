"use client";

import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  useReactTable,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "./input";
import { Button } from "./button";
import { ScrollArea, ScrollBar } from "./scroll-area";
import { indexMultipleContent, deleteMultipleContent } from "@/actions/contentActions";
import { useToast } from "../ui/use-toast";
import { useRouter } from "next/navigation";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  searchKey: string;
}

export const maxDuration = 60;

export function DataTable<TData, TValue>({
  columns,
  data,
  searchKey,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });
  const router = useRouter();
  const { toast } = useToast(); // Using destructured toast for notifications
  const selectedRows = table.getSelectedRowModel().rows.map(row => row.original);

  const handleParseAll = async () => {
    // Filter data to exclure already parsed item
    //@ts-ignore
    const filteredData = data.filter(item => !item.parsed);
    const result = await indexMultipleContent(filteredData);
    if (result.success) {
      toast({
        variant: "default",
        title: "All content indexed successfully!"
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error
      });
    }
    router.refresh();
  };

  const handleDeleteAll = async () => {
    const result = await deleteMultipleContent(data);
    if (result.success) {
      toast({
        variant: "default",
        title: "All content deleted successfully!"
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error
      });
    }
    router.refresh();
  };

  const handleParseSelected = async () => {
    // Filter data to exclure already parsed item
    //@ts-ignore
    const filteredData = selectedRows.filter(item => !item.parsed);
    const result = await indexMultipleContent(filteredData);
    if (result.success) {
      toast({
        variant: "default",
        title: "Selected content indexed successfully!"
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error
      });
    }
    router.refresh();
  };

  const handleDeleteSelected = async () => {
    const result = await deleteMultipleContent(selectedRows);
    if (result.success) {
      toast({
        variant: "default",
        title: "Selected content deleted successfully!"
      });
    } else {
      toast({
        variant: "destructive",
        title: "Error",
        description: result.error
      });
    }
    router.refresh();
  };

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <Input
          placeholder={`Search ${searchKey}...`}
          value={(table.getColumn(searchKey)?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn(searchKey)?.setFilterValue(event.target.value)
          }
          className="w-full md:max-w-sm"
        />
        <div className="space-x-2">
          <Button
            onClick={handleParseAll}
            variant="outline"
            size="sm"
          >
            Parse All
          </Button>
          <Button
            onClick={handleDeleteAll}
            variant="outline"
            size="sm"
          >
            Delete All
          </Button>
          <Button
            onClick={handleParseSelected}
            variant="outline"
            size="sm"
            disabled={selectedRows.length === 0}
          >
            Parse Selected
          </Button>
          <Button
            onClick={handleDeleteSelected}
            variant="outline"
            size="sm"
            disabled={selectedRows.length === 0}
          >
            Delete Selected
          </Button>
        </div>
      </div>
      <ScrollArea className="rounded-md border h-[calc(80vh-220px)]">
        <Table className="relative">
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </>
  );
}

