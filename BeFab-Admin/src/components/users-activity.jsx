import React, { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

const recentUsers = [
  {
    name: "Sarah Johnson",
    avatar: "https://randomuser.me/api/portraits/women/1.jpg",
    action: "Updated profile information and changed profile picture",
    time: "10 minutes ago",
  },
  {
    name: "Michael Brown",
    avatar: "https://randomuser.me/api/portraits/men/2.jpg",
    action: "Created a new workout plan for 5 users",
    time: "2 hours ago",
  },
  {
    name: "Jessica Taylor",
    avatar: "https://randomuser.me/api/portraits/women/3.jpg",
    action: "Uploaded 3 new training videos to the platform",
    time: "5 hours ago",
  },
  {
    name: "Emily Wilson",
    avatar: "https://randomuser.me/api/portraits/women/4.jpg",
    action: 'Completed the "Summer Challenge" and earned a gold badge',
    time: "1 day ago",
  },
];

const roles = {
  Admins: 15,
  Trainers: 243,
  Users: 24263,
};

const userStatus = {
  Active: 18432,
  Inactive: 5124,
  Locked: 845,
  Pending: 120,
};

export default function Dashboard({data}) {
  function RelativeTime({ dateString }) {
    const formatRelativeTime = (dateString) => {
      const date = new Date(dateString);
      const now = new Date();
      const seconds = Math.floor((now - date) / 1000);
      
      const intervals = {
        year: 31536000,
        month: 2592000,
        week: 604800,
        day: 86400,
        hour: 3600,
        minute: 60,
        second: 1
      };
      
      for (const [unit, secondsInUnit] of Object.entries(intervals)) {
        const interval = Math.floor(seconds / secondsInUnit);
        if (interval >= 1) {
          return interval === 1 ? `1 ${unit} ago` : `${interval} ${unit}s ago`;
        }
      }
      
      return "just now";
    };

    return <span>{formatRelativeTime(dateString)}</span>;
  }
  const [recentUsers, setRecentUsers] = useState([]);

  useEffect(() => {
    if (data && data.logs) {
      const mapped = data.logs.map((log) => ({
        name: `${log.user.firstName} ${log.user.lastName}`,
        avatar: log.user.profilePicture,
        action: log.description,
        time: RelativeTime(log.timestamp),
      }));
      setRecentUsers(mapped);
    }
  }, [data]);
  return (
    <div className="flex flex-wrap lg:flex-nowrap gap-6">
      <Card className="w-full lg:w-[75%]">
        <CardHeader>
          <CardTitle>Recent User Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[260px]">
            <div className="space-y-4">
              {recentUsers.map((user, i) => (
                <div key={i} className="flex items-start gap-4">
                  <Avatar>
                    <AvatarImage src={user.avatar} />
                    <AvatarFallback>{user.name[0]}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm">{user.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {user.action}
                    </p>
                  </div>
                  <span className="ml-auto text-xs text-muted-foreground whitespace-nowrap">
                    {user.time}
                  </span>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card className="w-full lg:w-[25%]">
        <CardHeader>
          <CardTitle>User Roles Distribution</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(roles).map(([role, count], index) => (
            <div
              key={index}
              className="flex flex-col items-center justify-between"
            >
              <div className="flex justify-between w-full">
                <span className="text-sm font-medium text-muted-foreground">
                  {role}
                </span>
                <span className="text-sm font-medium">{count}</span>
              </div>
              <div className="w-full mx-4 h-1.5 bg-gray-200 rounded overflow-hidden">
                <div
                  className={`h-full ${
                    role === "Users"
                      ? "bg-blue-600"
                      : role === "Trainers"
                      ? "bg-green-500"
                      : "bg-sky-400"
                  }`}
                  style={{ width: `${(count / roles.Users) * 100}%` }}
                ></div>
              </div>
            </div>
          ))}

          <span className="mt-12 block text-sm">User Status</span>
          <div className="grid grid-cols-2 gap-4 pt-2">
            {Object.entries(userStatus).map(([status, count], index) => (
              <div
                key={index}
                className={`rounded-xl p-4 text-center font-bold text-lg shadow ${
                  status === "Active"
                    ? "bg-green-100 text-green-600"
                    : status === "Inactive"
                    ? "bg-red-100 text-red-600"
                    : status === "Locked"
                    ? "bg-yellow-100 text-yellow-600"
                    : "bg-purple-100 text-purple-600"
                }`}
              >
                <div className="text-2xl font-bold">{count}</div>
                <div className="text-sm font-medium">{status}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
