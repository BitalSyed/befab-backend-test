import { API_URL, getCookie } from "@/components/cookieUtils";
import React, { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const NewCompetition = () => {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const publishCompetition = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // remove time for clean comparison
    const startDate = new Date(start);
    const endDate = new Date(end);

    // 🔹 Validation checks
    if (!title || !description || !start || !end) {
      toast.error("All fields are required.");
      return;
    }

    if (startDate < today) {
      toast.error("Start date cannot be before today.");
      return;
    }

    if (endDate < startDate) {
      toast.error("End date cannot be before start date.");
      return;
    }

    const formData = new FormData();
    formData.append("token", getCookie("skillrextech_auth"));
    formData.append("title", title);
    formData.append("description", description);
    formData.append("start", start);
    formData.append("end", end);

    fetch(`${API_URL}/admin/push-competition`, {
      method: "POST",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          toast.error(data.error);
        } else {
          toast.success(data.message);
          navigate("/competitions");
        }
      })
      .catch((error) => {
        console.error("Error adding competition:", error);
        toast.error("An error occurred while adding the competition.");
      });
  };

  return (
    <div className="w-[80%] p-5 flex flex-col gap-5">
      <div className="flex bg-white flex-col gap-5 border-2 border-gray-300 p-5 rounded-md">
        
        {/* Title */}
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold text-liblack">Title</h3>
          <input
            type="text"
            placeholder="Competition Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border text-liblack border-gray-500 outline-none rounded-md p-2"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold text-liblack">Description</h3>
          <textarea
            placeholder="Competition Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border text-liblack border-gray-500 outline-none rounded-md p-2 h-32"
          />
        </div>

        {/* Start Date */}
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold text-liblack">Start Date</h3>
          <input
            type="date"
            value={start}
            min={new Date().toISOString().split("T")[0]} // 🔹 disable past dates
            onChange={(e) => setStart(e.target.value)}
            className="border text-liblack border-gray-500 outline-none rounded-md p-2"
          />
        </div>

        {/* End Date */}
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold text-liblack">End Date</h3>
          <input
            type="date"
            value={end}
            min={start || new Date().toISOString().split("T")[0]} // 🔹 end can't be before start
            onChange={(e) => setEnd(e.target.value)}
            className="border text-liblack border-gray-500 outline-none rounded-md p-2"
          />
        </div>

        {/* Button */}
        <div className="flex gap-3">
          <button
            onClick={publishCompetition}
            className="text-sm font-medium p-2 rounded-md text-white bg-green-500 flex items-center gap-2 cursor-pointer"
          >
            <FaCheck /> Publish Competition
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewCompetition;
