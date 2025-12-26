import React, { useEffect, useState } from "react";
import Jobcard from "./Jobcard";
import RadioDropdown from "./RadioDropdown";
import Navbar from "./Navbar";
import { Link, useLocation } from "react-router-dom";
import { BASE_URL } from "../../lib/api";

const Home_jobs = (props) => {
  const [allJobs, setAllJobs] = useState([]);
  const [filters, setFilters] = useState({
    location: "",
    domain: "",
    timing: "",
    search: "", // Search filter for title and company name
  });
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);

  // Update filters based on user selection
  const handleFilterChange = (name, value) => {
    setFilters({ ...filters, [name]: value });
  };

  // Filter allJobs array based on user-selected filters
  const filteredJobs = allJobs.filter((job) => {
    return (
      (!filters.location || job?.location === filters.location) &&
      (!filters.domain || job?.domain === filters.domain) &&
      (!filters.timing || job?.timing === filters.timing) &&
      (!filters.search ||
        job?.title?.toLowerCase().includes(filters.search.toLowerCase()) ||
        job?.company?.name
          ?.toLowerCase()
          .includes(filters.search.toLowerCase()))
    );
  });

  // Fetch jobs from the backend
  const fetchJobs = async () => {
    const url = `${BASE_URL}/api/v1/jobs/`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (!response.ok || data.status !== "success") {
        throw new Error(data.message || "Failed to fetch job data");
      }

      return data.jobs;
    } catch (error) {
      console.error("Error fetching jobs:", error.message);
      return [];
    }
  };

  // Fetch jobs on component mount
  useEffect(() => {
    const fetchAndSetJobs = async () => {
      const jobs = await fetchJobs();
      setAllJobs(jobs);
      let job_filter = queryParams.get("filter_job");
      if (job_filter) {
        setFilters({
          ...filters,
          timing: job_filter,
        });
      }
    };
    fetchAndSetJobs();
  }, []);

  return (
    <div>
      <Navbar user={props?.user} />
      <div className="bg-blue-50 flex gap-10 min-h-screen">
        {/* Sidebar for filters */}
        <div className="flex flex-col bg-gray-100 p-4 space-y-4">
          {/* Search Bar */}
          <div>
            <input
              type="text"
              placeholder="Search by Title or Company"
              className="w-full p-2 border border-gray-300 rounded"
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
          </div>
          <RadioDropdown
            title="Location"
            name="location"
            options={[
              { value: "", label: "All" },
              { value: "Delhi", label: "Delhi" },
              { value: "Bangalore", label: "Bangalore" },
              { value: "Pune", label: "Pune" },
              { value: "Mumbai", label: "Mumbai" },
              { value: "Chennai", label: "Chennai" },
            ]}
            selected={filters.location}
            onChange={(value) => handleFilterChange("location", value)}
          />
          <RadioDropdown
            title="Domain"
            name="domain"
            options={[
              { value: "", label: "All" },
              { value: "Management", label: "Management" },
              { value: "Engineering", label: "Engineering" },
              { value: "Law", label: "Law" },
              { value: "Arts", label: "Arts" },
              { value: "Biology", label: "Biology" },
            ]}
            selected={filters.domain}
            onChange={(value) => handleFilterChange("domain", value)}
          />
          <RadioDropdown
            title="Timing"
            name="timing"
            options={[
              { value: "", label: "All" },
              { value: "Full Time", label: "Full Time" },
              { value: "Part Time", label: "Part Time" },
              { value: "Internship", label: "Internship" },
              { value: "Contract", label: "Contract" },
              { value: "Freelance", label: "Freelance" },
            ]}
            selected={filters.timing}
            onChange={(value) => handleFilterChange("timing", value)}
          />
        </div>

        {/* Job Cards */}
        <div className="p-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredJobs.length > 0 ? (
              filteredJobs.map((job) => (
                <Link
                  to={`/applyjobdcard?job_id=${job?._id}&role=${props?.user?.role}`}
                  key={job.id || job.title}
                >
                  <Jobcard {...job} role={props?.user?.role} />
                </Link>
              ))
            ) : (
              <p className="text-gray-500 col-span-full">
                No jobs match the selected filters.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home_jobs;