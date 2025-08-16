import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const events = [
  { date: 6, time: "9:00 AM", title: "Team Meeting", color: "bg-blue-200" },
  { date: 8, time: "10:00 AM", title: "Fitness", color: "bg-green-200" },
  { date: 8, time: "2:00 PM", title: "Goal Review", color: "bg-purple-200" },
  { date: 11, title: "Weekend Camping", allDay: true, color: "bg-yellow-200" },
  { date: 12, title: "Weekend Camping", allDay: true, color: "bg-yellow-200" },
  { date: 15, time: "10:00 AM", title: "Fitness", color: "bg-green-200" },
  { date: 16, time: "11:00 AM", title: "Nutrition", color: "bg-red-200" },
  { date: 20, time: "9:00 AM", title: "Team Meeting", color: "bg-blue-200" },
  { date: 22, time: "10:00 AM", title: "Fitness", color: "bg-green-200" },
  { date: 23, title: "Thanksgiving", allDay: true, color: "bg-orange-200" },
  { date: 27, time: "9:00 AM", title: "Team Meeting", color: "bg-blue-200" },
  { date: 29, time: "10:00 AM", title: "Fitness", color: "bg-green-200" },
];

const Calendar = () => {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  const dates = Array.from({ length: 33 }, (_, i) => i - 2);

  return (
    <div className="pt-6 rounded-md overflow-hidden bg-white">
      <div className="grid grid-cols-7 gap-2 text-center text-sm font-medium text-gray-500">
        {days.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div className="grid grid-cols-7 mt-2">
        {dates.map((d, i) => (
          <Card key={i} className="min-h-[100px] rounded-none">
            <CardContent className="p-2 h-full text-sm text-gray-700">
              {d > 0 && (
                <>
                  <div className="text-xs font-semibold text-gray-500 mb-1">{d}</div>
                  {events
                    .filter((event) => event.date === d)
                    .map((event, idx) => (
                      <div
                        key={idx}
                        className={cn(
                          "text-[11px] px-1 py-[1px] rounded mb-1 text-gray-800 truncate",
                          event.color
                        )}
                      >
                        {event.allDay ? "All Day - " : `${event.time} - `}
                        {event.title}
                      </div>
                    ))}
                </>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Calendar;