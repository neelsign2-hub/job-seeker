import React from "react";

const Flter_Job = ({ onChange }) => {
  const handleSelectChange = (e) => {
    onChange({ [e.target.name]: e.target.value });
  };

  return (
    <div className="w-full p-6 bg-white rounded-lg flex flex-col items-center">
      <h2 className="text-xl font-semibold mb-4 text-gray-700 text-center">Filter Jobs</h2>

      {/* Filter Dropdowns */}
      <div className="flex space-x-4">
        {/* Location Dropdown */}
        <select
          name="location"
          onChange={handleSelectChange}
          className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:border-blue-500"
        >
          <option value="">Select Location</option>
          <option value="Delhi NCR">Delhi NCR</option>
          <option value="Bangalore">Bangalore</option>
          <option value="Hyderabad">Hyderabad</option>
          <option value="Pune">Pune</option>
          <option value="Chennai">Chennai</option>
          <option value="Mumbai">Mumbai</option>
        </select>

        {/* Industry Dropdown */}
        <select
          name="industry"
          onChange={handleSelectChange}
          className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:border-blue-500"
        >
          <option value="">Select Industry</option>
          <option value="Frontend Developer">Frontend Developer</option>
          <option value="Backend Developer">Backend Developer</option>
          <option value="Data Science">Data Science</option>
          <option value="FullStack Developer">FullStack Developer</option>
          <option value="Nextjs Developer">Nextjs Developer</option>
        </select>

        {/* Salary Dropdown */}
        <select
          name="salary"
          onChange={handleSelectChange}
          className="px-3 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:border-blue-500"
        >
          <option value="">Select Salary Range</option>
          <option value="0 - 40k">0 - 40k</option>
          <option value="42k to 1 lakh">42k to 1 lakh</option>
          <option value="1 lakh to 5 lakh">1 lakh to 5 lakh</option>
        </select>
      </div>
    </div>
  );
};

export default Flter_Job;
