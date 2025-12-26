import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "./Navbar";
import { BASE_URL } from "../../lib/api";

const Home_companies = (props) => {
  const [allCompanies, setAllCompanies] = useState([]);
  const [filters, setFilters] = useState({
    search: "", // Search filter for company name
  });

  // Update filters based on user selection
  const handleFilterChange = (name, value) => {
    setFilters({ ...filters, [name]: value });
  };

  // Filter companies array based on user-selected filters
  const filteredCompanies = allCompanies.filter((company) => {
    return (
      !filters.search ||
      company?.name?.toLowerCase().includes(filters.search.toLowerCase())
    );
  });

  // Fetch companies from the backend
  const fetchCompanies = async () => {
    const url = `${BASE_URL}/api/v1/company/`;
    try {
      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await response.json();
      if (!response.ok || data.status !== "success") {
        throw new Error(data.message || "Failed to fetch company data");
      }

      return data.comapanies || [];
    } catch (error) {
      console.error("Error fetching companies:", error.message);
      return [];
    }
  };

  // Fetch companies on component mount
  useEffect(() => {
    const fetchAndSetCompanies = async () => {
      const companies = await fetchCompanies();
      setAllCompanies(companies);
    };
    fetchAndSetCompanies();
  }, []);

  return (
    <div>
      <Navbar user={props?.user} />
      <div className="bg-blue-50 min-h-screen">
        <div className="container mx-auto p-6">
          {/* Header Section */}
          <div className="bg-white rounded-lg shadow-md p-8 mb-8">
            <h1 className="text-4xl font-bold text-blue-700 mb-4">
              Explore Top Companies
            </h1>
            <p className="text-lg text-gray-600">
              Discover companies that match your career aspirations
            </p>
          </div>

          {/* Search Bar */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <input
              type="text"
              placeholder="Search companies by name..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filters.search}
              onChange={(e) => handleFilterChange("search", e.target.value)}
            />
          </div>

          {/* Companies Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompanies.length > 0 ? (
              filteredCompanies.map((company) => (
                <Link
                  key={company._id}
                  to={`/companydescription?company_id=${company._id}`}
                  className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden"
                >
                  <div className="p-6">
                    {/* Company Logo */}
                    <div className="flex items-center mb-4">
                      {company.logo ? (
                        <img
                          src={company.logo}
                          alt={`${company.name} logo`}
                          className="w-16 h-16 object-contain mr-4"
                          onError={(e) => {
                            e.target.src = "https://via.placeholder.com/64?text=Logo";
                          }}
                        />
                      ) : (
                        <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                          <span className="text-2xl font-bold text-blue-600">
                            {company.name?.charAt(0) || "C"}
                          </span>
                        </div>
                      )}
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800">
                          {company.name}
                        </h3>
                      </div>
                    </div>

                    {/* Company About */}
                    <p className="text-gray-600 mb-4 line-clamp-3">
                      {company.about || "No description available"}
                    </p>

                    {/* Company Details */}
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600">
                      {company.employees && (
                        <div>
                          <span className="font-medium">Employees:</span>{" "}
                          {company.employees}
                        </div>
                      )}
                      {company.branches && (
                        <div>
                          <span className="font-medium">Branches:</span>{" "}
                          {company.branches}
                        </div>
                      )}
                    </div>

                    {/* Website Link */}
                    {company.website && (
                      <div className="mt-4">
                        <a
                          href={company.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:underline text-sm"
                          onClick={(e) => e.stopPropagation()}
                        >
                          Visit Website →
                        </a>
                      </div>
                    )}

                    {/* View Details Button */}
                    <div className="mt-4">
                      <button className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition-colors">
                        View Details
                      </button>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-500 text-lg">No companies found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home_companies;
