// Job_cards.jsx
import React, { useState, useEffect } from "react";

const Job_cards = ({ filters }) => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);

//   const fetchJobs = async () => {
//     setLoading(true);
//     try {
//       const queryParams = new URLSearchParams(filters).toString();
//       const response = await fetch(http://your-api.com/jobs?${queryParams});
//       const data = await response.json();
//       setJobs(data);
//     } catch (error) {
//       console.error("Error fetching jobs:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchJobs();
//   }, [filters]);

  return (
    <div className="flex-grow p-6">
      {loading ? (
        <p>Loading jobs...</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jobs.map((job) => (
            <div
              key={job.id}
              className="p-6 bg-white rounded-lg shadow-md transition-transform transform hover:scale-105 hover:shadow-lg"
            >
              <div className="flex items-center mb-4">
                <img
                  src={job.companyLogo || "placeholder-logo.png"}
                  alt={`${job.company} logo`}
                  className="w-10 h-10 rounded-full mr-4"
                />
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">{job.company || "Company"}</h3>
                  <p className="text-sm text-gray-500">{job.location || "Location"}</p>
                </div>
              </div>
              <h4 className="text-xl font-bold text-purple-700 mb-2">{job.title || "Job Title"}</h4>
              <p className="text-gray-600 mb-4">{job.description || "Job description here"}</p>
              <div className="flex flex-wrap gap-2 mb-4">
                <span className="text-sm px-3 py-1 bg-blue-100 text-blue-600 rounded-full">{job.positions} positions</span>
                <span className="text-sm px-3 py-1 bg-purple-100 text-purple-600 rounded-full">{job.type || "Full Time"}</span>
                <span className="text-sm px-3 py-1 bg-green-100 text-green-600 rounded-full">{job.salary || "N/A"}</span>
              </div>
              <button className="w-full py-2 mt-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700">
                Save For Later
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Job_cards;