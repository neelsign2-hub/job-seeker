import React, { useState } from "react";
import Job_cards from "./Job_cards.jsx";
import Flter_job from "./Flter__job";
import Job_1 from "./Job_1.jsx";
import Jobcard from "./Jobcard";
import Footer from "./Footer";
import Navbar from "./Navbar";

const Job_pages = () => {
  const [filters, setFilters] = useState({
    location: "",
    industry: "",
    salary: "",
  });

  // Update filters based on user selection
  const handleFilterChange = (newFilters) => {
    setFilters({ ...filters, ...newFilters });
  };

  return (

    <div>

      <Navbar></Navbar>

      <div className="flex flex-col items-center  space-y-8">
        {/* Top Centered Section */}
        <div className="w-full text-center">
          <Job_1 />
        </div>

        {/* Filter Section */}
        <div className="w-full max-w-7xl flex justify-center">
          <Flter_job onChange={handleFilterChange} />
        </div>

        {/* Main Content Section */}
        <div className="flex w-full max-w-7xl space-x-8">
          {/* Right Content - Job Cards */}
          <div className="flex-1">
            <Job_cards filters={filters} />

            {/* Static Job Cards - 3 cards per row on large screens */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 px-4 gap-6 mt-4">
              <Jobcard
                company="Google"
                location="India"
                title="FullStack Developer"
                description="We need a senior Fullstack developer, who can write efficient code and work with frontend and backend."
                positions="2"
                role="Full Time"
                salaryRange="45 LPA"
              />
              <Jobcard
                company="Microsoft"
                location="India"
                title="Frontend Developer"
                description="Looking for a frontend developer who can create professional UI web pages."
                positions="3"
                role="Part Time"
                salaryRange="20 LPA"
              />
              <Jobcard
                company="Amazon"
                location="India"
                title="Backend Developer"
                description="Seeking a backend developer proficient in database management and server-side logic."
                positions="1"
                role="Full Time"
                salaryRange="30 LPA"
              />
              <Jobcard
                company="Apple"
                location="India"
                title="iOS Developer"
                description="Hiring an iOS developer with experience in Swift and iOS frameworks."
                positions="2"
                role="Full Time"
                salaryRange="35 LPA"
              />
              <Jobcard
                company="Facebook"
                location="India"
                title="Data Scientist"
                description="Looking for a data scientist with expertise in data analysis and machine learning."
                positions="4"
                role="Full Time"
                salaryRange="50 LPA"
              />
              <Jobcard
                company="Netflix"
                location="India"
                title="UI/UX Designer"
                description="We need a UI/UX designer who can create user-friendly and visually appealing designs."
                positions="1"
                role="Contract"
                salaryRange="25 LPA"
              />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    </div>
  );
};

export default Job_pages;
