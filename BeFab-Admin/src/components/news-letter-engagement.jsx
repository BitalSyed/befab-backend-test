import { cn } from '@/lib/utils';
import React from 'react';

const HealthMetrics = ({className}) => {
  const metrics = [
    {
      title: 'Average open rate',
      value: '68.3%',
      color: 'bg-blue-500',
      width: 'w-[68.3%]',
    },
    {
      title: 'AAverage click rate',
      value: '42.7%',
      color: 'bg-green-500',
      width: 'w-[42.7%]',
    },
    {
      title: 'Unsubscribe rate',
      value: '0.8%',
      color: 'bg-red-500',
      width: 'w-[0.8%]',
    },
    {
      title: 'Growth rate',
      value: '+2.4%',
      color: 'bg-purple-500',
      width: 'w-[2.4%]',
    },
  ];

  return (
    <div className={cn("bg-white rounded-xl shadow-md p-6 space-y-6", className)}>
      <h2 className="text-xl font-semibold text-gray-800">Engagement Summary</h2>

      {metrics.map((metric, index) => (
        <div key={index}>
          <div className="flex justify-between mb-1 text-sm text-gray-600">
            <span>{metric.title}</span>
            <span>{metric.value}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className={`${metric.color} h-2.5 rounded-full ${metric.width}`}></div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default HealthMetrics;
