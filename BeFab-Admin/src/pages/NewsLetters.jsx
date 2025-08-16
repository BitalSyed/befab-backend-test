import HealthMetrics from "@/components/news-letter-engagement";
import { NewsletterHeader } from "@/components/news-letter-header";
import NewsLetterPerformance from "@/components/news-letter-performance";
import QuickActions from "@/components/news-letter-quick-actions";
import SupportTicket from "@/components/news-letter-recent";
import NewsletterTable from "@/components/news-letter-table";
import React from "react";

const NewsLetters = () => {
  return (
    <div className="flex flex-col gap-4 py-4 px-4 lg:px-6 md:gap-6 md:py-6">
      <NewsletterHeader />
      <NewsletterTable />
      <div>
        <div className="flex flex-wrap lg:flex-nowrap gap-5 justify-center lg:justify-between">
          <NewsLetterPerformance className="w-full lg:w-[65%]" />
          <HealthMetrics title="" className="w-full lg:w-[35%]" />
        </div>
      </div>
      <div>
        <div className="flex flex-wrap lg:flex-nowrap gap-5 justify-center lg:justify-between">
          <SupportTicket className="w-full lg:w-[65%]" />
          <QuickActions title="" className="w-full lg:w-[35%]" />
        </div>
      </div>
    </div>
  );
};

export default NewsLetters;
