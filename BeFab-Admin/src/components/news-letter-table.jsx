"use client";

import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useMemo } from "react";

export default function NewsletterTable({ data = [] }) {
  const [currentPage, setCurrentPage] = useState(1);
  const rowsPerPage = 5;

  const totalPages = Math.ceil(data.length / rowsPerPage);

  // slice data for current page
  const currentData = useMemo(() => {
    const start = (currentPage - 1) * rowsPerPage;
    return data.slice(start, start + rowsPerPage);
  }, [data, currentPage]);

  // change page
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  return (
    <div className="rounded-md border bg-white p-4">
      <Table>
        <TableHeader>
          <TableRow className="text-muted-foreground text-xs">
            <TableHead className="w-10">
              <input type="checkbox" />
            </TableHead>
            <TableHead className="text-left">Title</TableHead>
            <TableHead className="text-left">Created</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {currentData.map((item, i) => (
            <TableRow key={i} className="text-sm">
              <TableCell className="w-10">
                <input type="checkbox" />
              </TableCell>
              <TableCell>
                <div className="font-medium">{item.title}</div>
                <div className="text-muted-foreground text-sm truncate text-wrap">
                  {item.description}
                </div>
              </TableCell>
              <TableCell>
                <div>
                  {new Date(item.date).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })}
                </div>
                <div className="text-xs text-muted-foreground">
                  {new Date(item.date).toLocaleTimeString("en-US", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex justify-between items-center px-2 mt-4 text-sm text-muted-foreground">
        <span>
          Showing{" "}
          {(currentPage - 1) * rowsPerPage + 1} to{" "}
          {Math.min(currentPage * rowsPerPage, data.length)} of{" "}
          {data.length} results
        </span>
        <div className="flex items-center gap-1">
          <Button
            size="icon"
            variant="ghost"
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
          >
            <ChevronLeft className="w-4 h-4" />
          </Button>

          {/* Dynamic page numbers */}
          {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
            <Button
              key={page}
              variant={page === currentPage ? "custom" : "outline"}
              className="px-3 text-sm"
              onClick={() => goToPage(page)}
            >
              {page}
            </Button>
          ))}

          <Button
            size="icon"
            variant="ghost"
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
