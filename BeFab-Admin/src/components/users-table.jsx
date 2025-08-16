import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight, ChevronLeft } from "lucide-react";
import { RiBarChart2Line, RiBarChartLine, RiEdit2Line, RiEditLine, RiMore2Line, RiMoreLine } from "react-icons/ri";

const data = [
  {
    thumbnail: "https://placehold.co/600x400",
    title: "10-Minute Morning Energizer",
    duration: "2:45",
    uploader: { name: "Sarah Johnson", role: "Admin", avatar: "https://placehold.co/400" },
    date: "June 28, 2023",
    status: "Published",
    views: "8,452",
  },
  {
    thumbnail: "https://placehold.co/600x400",
    title: "Full Body Strength Workout",
    duration: "18:30",
    uploader: { name: "John Smith", role: "Admin", avatar: "https://placehold.co/400" },
    date: "June 25, 2023",
    status: "Published",
    views: "7,189",
  },
  {
    thumbnail: "https://placehold.co/600x400",
    title: "Yoga for Flexibility",
    duration: "22:15",
    uploader: { name: "Emily Parker", role: "Admin", avatar: "https://placehold.co/400" },
    date: "June 22, 2023",
    status: "Published",
    views: "6,245",
  },
  {
    thumbnail: "https://placehold.co/600x400",
    title: "HIIT Cardio Blast",
    duration: "15:45",
    uploader: { name: "John Smith", role: "Admin", avatar: "https://placehold.co/400" },
    date: "June 20, 2023",
    status: "Draft",
    views: "-",
  },
  {
    thumbnail: "https://placehold.co/600x400",
    title: "Healthy Meal Prep Guide",
    duration: "12:20",
    uploader: { name: "Sarah Johnson", role: "Admin", avatar: "https://placehold.co/400" },
    date: "June 18, 2023",
    status: "Published",
    views: "5,732",
  },
];

export default function VideoTable() {
  return (
    <div className="border rounded-md bg-white p-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Video</TableHead>
            <TableHead>Uploader</TableHead>
            <TableHead>Date Posted</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Views</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((item, i) => (
            <TableRow key={i}>
              <TableCell>
                <div className="flex flex-col lg:flex-row lg:items-center gap-4">
                  <img
                    src={item.thumbnail}
                    alt="Thumbnail"
                    className="w-20 h-12 rounded object-cover"
                  />
                  <div>
                    <div className="font-medium text-sm">{item.title}</div>
                    <div className="text-xs text-muted-foreground">Befab • {item.duration}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <AvatarImage src={item.uploader.avatar} />
                    <AvatarFallback>{item.uploader.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="text-sm font-medium">{item.uploader.name}</div>
                    <div className="text-xs text-muted-foreground">{item.uploader.role}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-sm">{item.date}</TableCell>
              <TableCell>
                <Badge
                  variant={item.status === "Published" ? "success" : "secondary"}
                  className={
                    item.status === "Draft"
                      ? "bg-yellow-100 text-yellow-700 border border-yellow-400"
                      : "bg-green-100 text-green-700 border border-green-400"
                  }
                >
                  {item.status}
                </Badge>
              </TableCell>
              <TableCell className="text-sm">{item.views}</TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end text-muted-foreground">
                  <Button size="icon" variant="ghost">
                    <RiBarChart2Line/>
                  </Button>
                  <Button size="icon" variant="ghost">
                    <RiEdit2Line/>
                  </Button>
                  <Button size="icon" variant="ghost">
                    <RiMore2Line/>
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex justify-between items-center px-2 mt-4 text-sm text-muted-foreground">
        <span>Showing 1 to 5 of 124 videos</span>
        <div className="flex items-center gap-1">
          <Button size="icon" variant="ghost">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          {[1, 2, 3].map((page) => (
            <Button
              key={page}
              variant={page === 1 ? "custom" : "outline"}
              size="sm"
              className="px-3"
            >
              {page}
            </Button>
          ))}
          <span className="px-2">…</span>
          <Button variant="outline" size="sm" className="px-3">
            25
          </Button>
          <Button size="icon" variant="ghost">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}
