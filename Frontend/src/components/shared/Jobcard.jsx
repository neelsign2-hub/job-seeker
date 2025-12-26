import React from "react";

const Jobcard = (props) => {
  console.log(props);

  const formatSalaryToLPA = `${(props?.salary / 100000).toFixed(2)} LPA`;
  return (
    <div className="p-4 bg-white border border-gray-200 rounded-lg shadow-lg hover:shadow-xl transition-shadow duration-200 hover:bg-blue-100">
      <div className="flex items-center mb-4">
        <img
          src={props?.company?.logo}
          alt={`${props?.company?.logo} logo`}
          className="w-10 h-10 rounded-full mr-3"
        />
        <div>
          <h3 className="font-semibold text-lg">{props?.company?.name}</h3>
          <p className="text-sm text-gray-500">{props?.location}</p>
        </div>
      </div>
      <h2 className="text-xl font-bold text-gray-800 mb-2">{props?.title}</h2>
      <p className="text-sm text-gray-600 mb-4">{props?.description}</p>
      <div className="flex items-center space-x-3 mb-4 text-sm">
        <span className="bg-red-100 text-red-700 py-1 px-3 rounded-full">
          {props?.timing}
        </span>
        <span className="bg-purple-100 text-purple-700 py-1 px-3 rounded-full">
          {props?.domain}
        </span>
        <span className="bg-green-100 text-green-700 py-1 px-3 rounded-full">
          {formatSalaryToLPA}
        </span>
      </div>
      <div className="flex justify-between items-center">
        {/* {props?.role != "Recruiter" && (
          <button className="px-4 py-2 bg-blue-600 text-white rounded-full font-semibold hover:bg-blue-700 transition-colors">
            Save For Later
          </button>
        )} */}
        <button className="text-blue-600 hover:underline font-medium">
          Details
        </button>
      </div>
    </div>
  );
};

export default Jobcard;
