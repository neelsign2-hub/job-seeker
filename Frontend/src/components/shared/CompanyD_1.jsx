// CompanyD_1.jsx
import React from "react";

const CompanyD_1 = (props) => {
  return (
    <div className="bg-blue-300 rounded-lg shadow p-4 w-[250px]">
      <h3 className="text-lg font-bold text-black">{props.title}</h3>
      <p className="text-black">{props.company}</p>
      <p className="text-black mt-2">{props.daysLeft} Left</p>
    </div>
  );
};

export default CompanyD_1;
