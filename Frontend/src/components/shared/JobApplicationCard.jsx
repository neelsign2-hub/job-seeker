import React from "react";
import { Link, useNavigate } from "react-router-dom";

const JobApplicationCard = (props) => {
  const navigate = useNavigate();

  const handleCardClick = () => {
    // navigate('/jobdcard');
  };

  return (
    <div
      onClick={handleCardClick}
      className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4 mb-4 cursor-pointer"
    >
      <img
        src={props.logo}
        alt={`${props.companyName} logo`}
        className="object-cover mr-3 w-16 h-16 rounded-full"
      />
      <div className="flex-grow">
        <h3 className="text-lg font-bold text-blue-700">{props.companyName}</h3>
        <p className="text-gray-700">Role: {props.role}</p>
        <p className="text-gray-500">Applied Date: {props.appliedDate}</p>
      </div>
      <div>
        <Link
          to={props.resumelinks}
          target="_blank"
          rel="noopener noreferrer"
          className="bg-blue-500 text-white px-4 py-2 rounded-lg inline-block"
          onClick={(e) => e.stopPropagation()} // Prevents navigating to '/apply_cards'
        >
          Uploaded Resume
        </Link>
        <p
          className={`mt-2 ${
            props.status === "Pending"
              ? "text-yellow-500"
              : props.status === "accepted"
              ? "text-green-500"
              : "text-red-500"
          }`}
        >
          Status: {props.status}
        </p>
      </div>
    </div>
  );
};

export default JobApplicationCard;
