import { API_URL, getCookie } from "@/components/cookieUtils";
import React, { useState } from "react";
import { FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const NewNewsLetter = () => {
    const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [picture, setPicture] = useState(null);

  const publishNews = () => {
    const formData = new FormData();
    formData.append("token", getCookie("skillrextech_auth"));
    formData.append("title", title);
    formData.append("description", description);
    if (picture) {
      formData.append("picture", picture);
    }

    fetch(`${API_URL}/admin/push-news`, {
      method: "POST",
      body: formData, // sending multipart/form-data
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          toast.error(data.error);
        } else {
          toast.success(data.message);
        }
      })
      .catch((error) => {
        console.error("Error adding newsletter:", error);
        toast.error("An error occurred while adding the newsletter.");
      });

    // reset form
    navigate("/news-letters");
  };

  return (
    <div className="w-[80%] p-5 flex flex-col gap-5">
      <div className="flex bg-white flex-col gap-5 border-2 border-gray-300 p-5 rounded-md">
        {/* Title */}
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold text-liblack">Title</h3>
          <input
            type="text"
            placeholder="Newsletter Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="border text-liblack border-gray-500 outline-none rounded-md p-2"
          />
        </div>

        {/* Description */}
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold text-liblack">Description</h3>
          <textarea
            placeholder="Newsletter Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="border text-liblack border-gray-500 outline-none rounded-md p-2 h-32"
          />
        </div>

        {/* Picture */}
        <div className="flex flex-col gap-1">
          <h3 className="text-lg font-semibold text-liblack">Picture</h3>
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setPicture(e.target.files[0])}
            className="border text-liblack border-gray-500 outline-none rounded-md p-2"
          />
          {picture && (
            <p className="text-sm text-gray-600 mt-1">
              Selected: {picture.name}
            </p>
          )}
        </div>

        {/* Button */}
        <div className="flex gap-3">
          <button
            onClick={publishNews}
            className="text-sm font-medium p-2 rounded-md text-white bg-green-500 flex items-center gap-2 cursor-pointer"
          >
            <FaCheck /> Publish Newsletter
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewNewsLetter;
