import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { BASE_URL, getToken } from "../../lib/api";
import toast from "react-hot-toast";

const RecruiterApplications = ({ user }) => {
  const [applications, setApplications] = useState([]);
  const [stats, setStats] = useState({ total: 0, applied: 0, accepted: 0, rejected: 0 });
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, applied, accepted, rejected

  const token = getToken();

  const fetchAllApplications = async (status = null) => {
    setLoading(true);
    try {
      let URL = `${BASE_URL}/api/v1/application/recruiter/all`;
      if (status && status !== "all") {
        URL += `?status=${status}`;
      }

      const response = await fetch(URL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch applications");
      }

      const data = await response.json();
      setApplications(data.applications);
      setStats(data.stats);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching applications:", error);
      toast.error(error.message || "Failed to load applications");
      setLoading(false);
    }
  };

  const updateApplicationStatus = async (applicationId, newStatus) => {
    try {
      const response = await fetch(
        `${BASE_URL}/api/v1/application/${applicationId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update status");
      }

      const data = await response.json();
      
      // Update local state
      setApplications((prev) =>
        prev.map((app) =>
          app._id === applicationId
            ? { ...app, status: data.application.status }
            : app
        )
      );

      // Refresh to update stats
      fetchAllApplications(filter === "all" ? null : filter);
      toast.success(`Application ${newStatus} successfully!`);
    } catch (error) {
      console.error("Error updating status:", error);
      toast.error(error.message || "Failed to update status");
    }
  };

  useEffect(() => {
    fetchAllApplications(filter === "all" ? null : filter);
  }, [filter]);

  const handleFilterChange = (newFilter) => {
    setFilter(newFilter);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "applied":
        return "text-yellow-600 bg-yellow-100";
      case "accepted":
        return "text-green-600 bg-green-100";
      case "rejected":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar user={user} />

      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-blue-700 mb-2">
            All Applications
          </h1>
          <p className="text-gray-600">
            Manage all applications across your job postings
          </p>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
            <div className="text-gray-600 text-sm font-medium">Total</div>
            <div className="text-3xl font-bold text-blue-700">{stats.total}</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
            <div className="text-gray-600 text-sm font-medium">Pending</div>
            <div className="text-3xl font-bold text-yellow-600">
              {stats.applied}
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-green-500">
            <div className="text-gray-600 text-sm font-medium">Accepted</div>
            <div className="text-3xl font-bold text-green-600">
              {stats.accepted}
            </div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
            <div className="text-gray-600 text-sm font-medium">Rejected</div>
            <div className="text-3xl font-bold text-red-600">
              {stats.rejected}
            </div>
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="mb-6 flex flex-wrap gap-2">
          <button
            onClick={() => handleFilterChange("all")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === "all"
                ? "bg-blue-600 text-white"
                : "bg-white text-gray-700 hover:bg-blue-50"
            }`}
          >
            All Applications
          </button>
          <button
            onClick={() => handleFilterChange("applied")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === "applied"
                ? "bg-yellow-600 text-white"
                : "bg-white text-gray-700 hover:bg-yellow-50"
            }`}
          >
            Pending ({stats.applied})
          </button>
          <button
            onClick={() => handleFilterChange("accepted")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === "accepted"
                ? "bg-green-600 text-white"
                : "bg-white text-gray-700 hover:bg-green-50"
            }`}
          >
            Accepted ({stats.accepted})
          </button>
          <button
            onClick={() => handleFilterChange("rejected")}
            className={`px-4 py-2 rounded-lg font-medium transition ${
              filter === "rejected"
                ? "bg-red-600 text-white"
                : "bg-white text-gray-700 hover:bg-red-50"
            }`}
          >
            Rejected ({stats.rejected})
          </button>
        </div>

        {/* Applications List */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            <p className="mt-4 text-gray-600">Loading applications...</p>
          </div>
        ) : applications.length === 0 ? (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <div className="text-gray-400 text-6xl mb-4">📋</div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">
              No Applications Found
            </h3>
            <p className="text-gray-500">
              {filter === "all"
                ? "You haven't received any applications yet."
                : `No ${filter} applications at the moment.`}
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {applications.map((app) => (
              <div
                key={app._id}
                className="bg-white rounded-lg shadow-md hover:shadow-lg transition duration-200"
              >
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-start space-x-4 flex-1">
                      {/* Applicant Photo */}
                      <img
                        src={
                          app.applicant?.profilePhoto?.url ||
                          "https://via.placeholder.com/64"
                        }
                        alt={app.applicant?.username}
                        className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                      />

                      {/* Applicant Details */}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-800">
                          {app.applicant?.username}
                        </h3>
                        <p className="text-gray-600">{app.applicant?.email}</p>
                        {app.applicant?.phone && (
                          <p className="text-gray-600">
                            📞 {app.applicant?.phone}
                          </p>
                        )}
                        {app.applicant?.city && (
                          <p className="text-gray-600">
                            📍 {app.applicant?.city}
                          </p>
                        )}
                      </div>

                      {/* Status Badge */}
                      <div>
                        <span
                          className={`px-4 py-2 rounded-full text-sm font-semibold ${getStatusColor(
                            app.status
                          )}`}
                        >
                          {app.status.toUpperCase()}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Job Details */}
                  <div className="bg-gray-50 rounded-lg p-4 mb-4">
                    <div className="flex items-center space-x-4">
                      {app.job?.company?.logo && (
                        <img
                          src={app.job.company.logo}
                          alt={app.job?.company?.name}
                          className="w-12 h-12 rounded object-cover"
                        />
                      )}
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-800">
                          {app.job?.title}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {app.job?.company?.name} • {app.job?.location}
                        </p>
                        <p className="text-sm text-gray-500">
                          {app.job?.salary} • {app.job?.timing}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-500">Applied on</p>
                        <p className="text-sm font-medium text-gray-700">
                          {formatDate(app.appliedDate)}
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Skills */}
                  {app.applicant?.skills && app.applicant.skills.length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-semibold text-gray-700 mb-2">
                        Skills:
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {app.applicant.skills.map((skill, index) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                          >
                            {skill}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Actions */}
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="flex gap-3">
                      {app.applicant?.resume?.url && (
                        <Link
                          to={app.applicant.resume.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                          View Resume
                        </Link>
                      )}
                      {app.resume && (
                        <Link
                          to={app.resume}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition"
                        >
                          Submitted Resume
                        </Link>
                      )}
                    </div>

                    {app.status === "applied" && (
                      <div className="flex gap-3">
                        <button
                          onClick={() =>
                            updateApplicationStatus(app._id, "accepted")
                          }
                          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-medium"
                        >
                          Accept
                        </button>
                        <button
                          onClick={() =>
                            updateApplicationStatus(app._id, "rejected")
                          }
                          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-medium"
                        >
                          Reject
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default RecruiterApplications;
