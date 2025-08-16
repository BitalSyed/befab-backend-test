"use client";

import {
  Table,
  TableHeader,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

const data = [
  {
    title: "July Fitness Challenge Newsletter",
    desc: "Get ready for our summer fitness challenge with exclusive worko...",
    created: "Jul 2, 2023",
    time: "10:35 AM",
    status: "Published",
    metrics: { sent: "18,432", open: "68%", click: "42%" },
  },
  {
    title: "August Nutrition Guide",
    desc: "Discover the best seasonal foods and recipes for optimal health t...",
    created: "Jul 28, 2023",
    time: "2:15 PM",
    status: "Scheduled",
    metrics: { sent: "~18,500", open: null, click: null, date: "Aug 1, 9:00 AM" },
  },
  {
    title: "New Workout Series Announcement",
    desc: "Exciting new HIIT and strength training workouts coming next mo...",
    created: "Jul 25, 2023",
    time: "11:20 AM",
    status: "Draft",
    metrics: { sent: "Not sent yet", open: null, click: null },
  },
  {
    title: "June Fitness Recap",
    desc: "Looking back at our community achievements and progress from ...",
    created: "Jun 30, 2023",
    time: "9:00 AM",
    status: "Published",
    metrics: { sent: "18,245", open: "72%", click: "48%" },
  },
  {
    title: "Summer Hydration Tips",
    desc: "Stay properly hydrated during hot summer workouts with these e...",
    created: "Jun 15, 2023",
    time: "11:45 AM",
    status: "Published",
    metrics: { sent: "18,102", open: "65%", click: "38%" },
  },
];

const statusColor = {
  Published: "bg-green-100 text-green-800 border border-green-300",
  Scheduled: "bg-yellow-100 text-yellow-800 border border-yellow-300",
  Draft: "bg-gray-100 text-gray-800 border border-gray-300",
};

export default function NewsletterTable() {
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
            <TableHead>Status</TableHead>
            <TableHead>Metrics</TableHead>
          </TableRow>
        </TableHeader>

        <TableBody>
          {data.map((item, i) => (
            <TableRow key={i} className="text-sm">
              <TableCell className="w-10">
                <input type="checkbox" />
              </TableCell>
              <TableCell>
                <div className="font-medium">{item.title}</div>
                <div className="text-muted-foreground text-sm truncate">
                  {item.desc}
                </div>
              </TableCell>
              <TableCell>
                <div>{item.created}</div>
                <div className="text-xs text-muted-foreground">{item.time}</div>
              </TableCell>
              <TableCell>
                <Badge className={`text-xs ${statusColor[item.status]}`}>
                  {item.status}
                </Badge>
              </TableCell>
              <TableCell>
                {item.metrics.open ? (
                  <div className="text-sm">
                    Sent to: {item.metrics.sent} <br />
                    Open rate: {item.metrics.open} • Click rate: {item.metrics.click}
                  </div>
                ) : item.status === "Scheduled" ? (
                  <div className="text-sm text-muted-foreground">
                    Will be sent to: {item.metrics.sent} <br />
                    {item.metrics.date}
                  </div>
                ) : (
                  <div className="text-sm text-muted-foreground">{item.metrics.sent}</div>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex justify-between items-center px-2 mt-4 text-sm text-muted-foreground">
        <span>Showing 1 to 5 of 24 results</span>
        <div className="flex items-center gap-1">
          <Button size="icon" variant="ghost">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          {[1, 2, 3, "...", 5].map((page, idx) => (
            <Button
              key={idx}
              variant={page === 1 ? "custom" : "outline"}
              className="px-3 text-sm"
            >
              {page}
            </Button>
          ))}
          <Button size="icon" variant="ghost">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
