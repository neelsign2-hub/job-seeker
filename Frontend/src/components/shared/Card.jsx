// Card.jsx
import React from "react";

const Card = (jobs) => {
  return (
    <div className="bg-blue-700 text-white shadow-lg rounded-lg p-6 text-center transform transition duration-300 hover:scale-105 hover:shadow-xl">
      <h2 className="text-xl font-semibold text-white">{jobs.title}</h2>
      <p className="text-white-800 mt-2">{jobs.description}</p>
    </div>
  );
};

export default Card;
