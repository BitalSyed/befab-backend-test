import React from "react";
import { ChartAreaInteractive } from "./competition-line";
import { NotificationPerformance } from "./competition-performance";

const CompetitionAnalytics = () => {
  const chartData1 = [
    { month: "January", desktop: 4000, mobile: 3000, other: 3000 },
    { month: "February", desktop: 4500, mobile: 3500, other: 2500 },
    { month: "March", desktop: 3000, mobile: 4000, other: 3000 },
    { month: "April", desktop: 3500, mobile: 3500, other: 3000 },
    { month: "May", desktop: 3800, mobile: 3700, other: 3200 },
    { month: "June", desktop: 3900, mobile: 4100, other: 3000 },
  ];
  const chartData2 = [
    { month: "January", desktop: 4000, mobile: 3000, other: 3000 },
    { month: "February", desktop: 4500, mobile: 3500, other: 2500 },
    { month: "March", desktop: 3000, mobile: 4000, other: 3000 },
    { month: "April", desktop: 3500, mobile: 3500, other: 3000 },
    { month: "May", desktop: 3800, mobile: 3700, other: 3200 },
    { month: "June", desktop: 3900, mobile: 4100, other: 3000 },
  ];
  const chartData3 = [
    { month: "January", desktop: 4000, mobile: 3000, other: 3000 },
    { month: "February", desktop: 4500, mobile: 3500, other: 2500 },
    { month: "March", desktop: 3000, mobile: 4000, other: 3000 },
    { month: "April", desktop: 3500, mobile: 3500, other: 3000 },
    { month: "May", desktop: 3800, mobile: 3700, other: 3200 },
    { month: "June", desktop: 3900, mobile: 4100, other: 3000 },
  ];
  return (
    <div className="px-4 py-6 rounded-md bg-white shadow-sm">
      <div className="flex justify-between gap-5">
        <ChartAreaInteractive
          className="w-[40%]"
          chartData={chartData1}
          chartConfig={{ other: { label: "Engagement", color: "#3B82F6" } }}
          up={"4.2%"}
          percentage={"76.3%"}
          title="Engagement Rate"
        />
        <ChartAreaInteractive
          className="w-[40%]"
          chartData={chartData2}
          chartConfig={{ other: { label: "Completion", color: "#10B981" } }}
          up={"2.8%"}
          percentage={"68.5%"}
          title="Completion Rate"
        />
        <ChartAreaInteractive
          className="w-[40%]"
          chartData={chartData3}
          chartConfig={{ other: { label: "Average", color: "#F59E0B" } }}
          up={"12.3%"}
          percentage={"2,145"}
          title="Average Participants"
        />
      </div>
      <NotificationPerformance className="mt-5"/>
    </div>
  );
};

export default CompetitionAnalytics;
