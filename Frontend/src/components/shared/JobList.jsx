import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { Link } from "react-router-dom";
import toast from "react-hot-toast";
import { BASE_URL, getToken } from "../../lib/api";

const JobList = (props) => {
  const [currentJobList, setCurrentJobList] = useState([]);
  const { search } = useLocation(); // Get the query string from the URL
  const queryParams = new URLSearchParams(search); // Parse the query string
  const company_id = queryParams.get("company_id");

  const navigate = useNavigate(); // Initialize useNavigate

  const route = (jobid) => {
    navigate(`/userdetails?company_id=${company_id}&job_id=${jobid}`); // Navigate to the /userdetails route
  };

  const routetopostjob = (jobid) => {
    navigate(`/post-job?company_id=${company_id}&job_id=${jobid}`);
  };

  const token = getToken();

  const fetchUserData = async () => {
    try {
      const response = await fetch(`${BASE_URL}/api/v1/job/${company_id}`, {
        method: "GET",
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch user data");
      }

      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };

  const handleDelete = async (e, jobid) => {
    e.stopPropagation();
    try {
      const response = await fetch(`${BASE_URL}/api/v1/job/${jobid}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 204) {
        let jobList = currentJobList.filter((job) => job?._id != jobid);
        setCurrentJobList(jobList);

        toast.success("Job deleted successfully");
        return;
      }
    } catch (error) {
      console.error("Error deleting job:", error.message || error);
      return null;
    }
  };

  useEffect(() => {
    const func = async () => {
      const res = await fetchUserData();
      if (res.status == "success") {
        setCurrentJobList(res?.jobs);
      }
    };

    func();
  }, []);

  return (
    <>
      <Navbar user={props?.user} />
      {/* Hero Section */}
      <div className="bg-white py-12 text-center">
        <div className="container mx-auto">
          <div className="flex justify-center items-center mb-4">
            {/* <img
              src="https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg"
              alt="Google Logo"
              className=" object-fill w-16 h-16 mr-3"
            /> */}
            <p className="text-3xl font-semibold text-800">
                Welcome to our platform
            </p>
          </div>
          <h1 className="text-4xl font-bold">
            Easily Post Jobs to Attract{" "}
            <span className="text-blue-600 ">Top Talent!</span>
          </h1>
          <p className="text-lg mt-4 text-gray-600">
            Fill out the form to share your job openings and find the best candidates for your company. <br/>
            Take the first step toward building a great team!
          </p>
        </div>
      </div>

      {/* Post Job Button */}
      <div className="flex justify-center my-8">
        <Link to={`/post-job?company_id=${company_id}`}>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-full shadow-md transition duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-blue-400 focus:ring-opacity-50">
            Post Job
          </button>
        </Link>
      </div>

      {/* Job List Section */}
      <div className="flex flex-col items-center justify-center container mx-auto p-6 bg-white rounded-lg">
        <table className="min-w-lg divide-y divide-gray-200 bg-white">
          <thead className="bg-white">
            <tr>
              <th
                scope="col"
                className="px-20 py-3 text-xs font-medium text-black font-bold uppercase tracking-wider"
              >
                Domain
              </th>
              <th
                scope="col"
                className="px-20 py-3 text-xs font-medium text-black font-bold uppercase tracking-wider"
              >
                Timing
              </th>
              <th
                scope="col"
                className="px-20 py-3 text-xs font-medium text-black font-bold uppercase tracking-wider"
              >
                Location
              </th>
              <th
                scope="col"
                className="px-20 py-3 text-xs font-medium text-black font-bold uppercase tracking-wider"
              >
                Job title
              </th>
              <th
                scope="col"
                className="px-20 py-3 text-xs font-medium text-black font-bold uppercase tracking-wider"
              >
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentJobList.map((job, index) => {
              // const parsedDate = new Date(job?.deadline);
              // const formattedDate = `${parsedDate.getFullYear()}-${
              //   parsedDate.getMonth() + 1
              // }-${parsedDate.getDate()}`;
              return (
                <tr
                  onClick={(e) => route(job._id)} // Call route function when the row is clicked
                  key={index}
                  className="hover:bg-blue-50 cursor-pointer" // Add cursor-pointer for better UX
                >
                  <td className="px-20 py-4 whitespace-nowrap text-sm text-gray-900">
                    {job.domain}
                  </td>
                  <td className="px-20 py-4 whitespace-nowrap text-sm text-gray-900">
                    {job.timing}
                  </td>
                  <td className="px-20 py-4 whitespace-nowrap text-sm text-gray-900">
                    {job.location}
                  </td>
                  <td className="px-20 py-4 whitespace-nowrap text-sm text-gray-900">
                    {job.title}
                  </td>
                  <td className="px-20 py-4 whitespace-nowrap text-sm flex space-x-3">
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // Prevent parent click event
                        routetopostjob(job._id); // Navigate to post-job
                      }}
                      className="text-blue-600 hover:text-blue-800 px-6 py-4"
                    >
                      Edit
                    </button>
                    <button
                      onClick={(e) => handleDelete(e, job?._id)}
                      className="text-red-600 hover:text-red-800 px-6 py-4"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {currentJobList?.length == 0 ? (
          <p className="mt-4 text-center text-sm text-gray-500">
            {"No Jobs Available"}
          </p>
        ) : (
          <p className="mt-4 text-center text-sm text-gray-500">
            A list of your recent posted jobs
          </p>
        )}
      </div>
      <Footer></Footer>
    </>
  );
};

export default JobList;
