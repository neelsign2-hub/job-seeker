// Company_2.jsx
import React, { useState } from "react";

const Company_2 = (props) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 className="text-xl font-semibold">{props.title}</h2>
      {props.content && (
        <p className="text-gray-700 mt-2">
          {props.showMore ? props.content : `${props.content.slice(0, 100)}...`}
        </p>
      )}
      {props.children}
      {props.content && (
        <button
          onClick={() => setShowMore(!props.showMore)}
          className="text-blue-600 hover:underline mt-2"
        >
          {props.showMore ? "View Less" : "View More"}
        </button>
      )}
      {props.children}
    </div>
  );
};

export default Company_2;
