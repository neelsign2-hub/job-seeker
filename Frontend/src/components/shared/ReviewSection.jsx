// ReviewSection.jsx
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLocation } from "react-router-dom";

const ReviewSection = () => {
  var BASE_URL = import.meta.env.VITE_BACKEND_HOST;
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const { search } = useLocation(); // Get the query string from the URL
  const queryParams = new URLSearchParams(search); // Parse the query string
  const company_id = queryParams.get("company_id");

  // Function to retrieve token from localStorage
  const getToken = () => {
    return localStorage.getItem("TOKEN");
  };

  const token = getToken();

  const handleStarClick = (index) => {
    setRating(index + 1); // Set rating based on the clicked star index (1-5)
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/company/${company_id}/reviews`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json", // Required to send JSON data
            Authorization: `Bearer ${token}`, // Send token in Authorization header
          },
          body: JSON.stringify({
            rating,
            reviewText: comment,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to submit the review");
      }

      const data = await response.json();
      toast.success("Review Submitted");

      console.log("Review submitted successfully:", data);
      return data.review; // Return the added review data if needed
    } catch (error) {
      console.error("Error submitting the review:", error);
      return null;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold mb-4">Reviews</h2>
      <div className="flex items-center mb-4">
        {[...Array(5)].map((_, index) => (
          <span
            key={index}
            onClick={() => handleStarClick(index)}
            className={`cursor-pointer text-2xl ${
              index < rating ? "text-yellow-500" : "text-gray-400"
            }`}
          >
            ★
          </span>
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your comment here..."
        className="w-full p-2 border border-gray-300 rounded-md"
        rows="4"
      />
      <button
        onClick={(e) => handleSubmitReview(e)}
        className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
      >
        Submit Review
      </button>
    </div>
  );
};

export default ReviewSection;
