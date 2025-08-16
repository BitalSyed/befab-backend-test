import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChevronLeft, ChevronRight, Filter, Download } from "lucide-react";

const logs = [
  {
    src: 'https://placehold.co/400',
    name: "John Smith",
    action: "Created",
    actionType: "success",
    event: "Nutrition Workshop",
    date: "Nov 15, 2023 10:23 AM",
    ip: "192.168.1.1",
  },
  {
    src: 'https://placehold.co/400',
    name: "Sarah Johnson",
    action: "Updated",
    actionType: "warning",
    event: "Team Meeting",
    date: "Nov 14, 2023 3:45 PM",
    ip: "192.168.1.2",
  },
  {
    src: 'https://placehold.co/400',
    name: "John Smith",
    action: "Deleted",
    actionType: "destructive",
    event: "Monthly Review",
    date: "Nov 12, 2023 9:17 AM",
    ip: "192.168.1.1",
  },
  {
    src: 'https://placehold.co/400',
    name: "Michael Brown",
    action: "Created",
    actionType: "success",
    event: "Weekend Challenge",
    date: "Nov 10, 2023 2:30 PM",
    ip: "192.168.1.3",
  },
  {
    src: 'https://placehold.co/400',
    name: "Sarah Johnson",
    action: "Synced",
    actionType: "secondary",
    event: "All Calendars",
    date: "Nov 9, 2023 10:00 AM",
    ip: "192.168.1.2",
  },
];

const getBadgeVariant = (type) => {
  switch (type) {
    case "success":
      return "bg-green-100 text-green-700";
    case "warning":
      return "bg-yellow-100 text-yellow-700";
    case "destructive":
      return "bg-red-100 text-red-700";
    case "secondary":
    default:
      return "bg-purple-100 text-purple-700";
  }
};

export default function CalendarAuditLog() {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Calendar Audit Log</h2>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" className="gap-1">
            <Filter className="h-4 w-4" /> Filter
          </Button>
          <Button variant="outline" size="sm" className="gap-1">
            <Download className="h-4 w-4" /> Export
          </Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="text-muted-foreground">ADMIN</TableHead>
            <TableHead className="text-muted-foreground">ACTION</TableHead>
            <TableHead className="text-muted-foreground">EVENT</TableHead>
            <TableHead className="text-muted-foreground">DATE</TableHead>
            <TableHead className="text-muted-foreground">IP ADDRESS</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {logs.map((log, index) => (
            <TableRow key={index}>
              <TableCell className="flex items-center gap-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={`${log.src}`} />
                  <AvatarFallback>{log.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span>{log.name}</span>
              </TableCell>
              <TableCell>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${getBadgeVariant(log.actionType)}`}>
                  {log.action}
                </span>
              </TableCell>
              <TableCell>{log.event}</TableCell>
              <TableCell>{log.date}</TableCell>
              <TableCell>{log.ip}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <div className="flex items-center justify-between mt-4">
        <p className="text-sm text-muted-foreground">Showing 5 of 24 entries</p>
        <div className="flex gap-1">
          <Button variant="outline" size="icon" className="h-7 w-7">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="custom" size="icon" className="h-7 w-7">1</Button>
          <Button variant="outline" size="icon" className="h-7 w-7">2</Button>
          <Button variant="outline" size="icon" className="h-7 w-7">3</Button>
          <Button variant="outline" size="icon" className="h-7 w-7">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}