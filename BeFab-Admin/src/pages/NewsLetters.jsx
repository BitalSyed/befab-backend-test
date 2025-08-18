import { API_URL, getCookie } from "@/components/cookieUtils";
import HealthMetrics from "@/components/news-letter-engagement";
import { NewsletterHeader } from "@/components/news-letter-header";
import NewsLetterPerformance from "@/components/news-letter-performance";
import QuickActions from "@/components/news-letter-quick-actions";
import SupportTicket from "@/components/news-letter-recent";
import NewsletterTable from "@/components/news-letter-table";
import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";

const NewsLetters = () => {
  const [users, setUsers] = useState([]);
    const [data, setData] = useState([]);
    useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch(`${API_URL}/admin/news`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: getCookie("skillrextech_auth"),
          }),
        });

        const data = await response.json();

        if (data.error) {
          toast.error(data.error);
        } else {
          setUsers(data);
          setData(data);
          console.log(data)
        }
      } catch (error) {
        console.error("Error during login:", error);
        toast.error("An error occurred. Please try again.");
      }
    };

    fetchUsers();
  }, []);
  return (
    <div className="flex flex-col gap-4 py-4 px-4 lg:px-6 md:gap-6 md:py-6">
      <NewsletterHeader data={users.newsletters} setData={setData} />
      <NewsletterTable data={data.newsletters} />
      <div>
        <div className="flex flex-wrap lg:flex-nowrap gap-5 justify-center lg:justify-between">
          <NewsLetterPerformance data={users.newsletters} className="w-full lg:w-[65%]" />
          <HealthMetrics data={users.stats} title="" className="w-full lg:w-[35%]" />
        </div>
      </div>
    </div>
  );
};

export default NewsLetters;
