import React, { useState, useEffect } from "react";
import Input from "./Input";
import Navbar from "./Navbar";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import axios from "axios";


const ProfileUser = ({ user, loading }) => {
  // Initialize local state based on the user data (if available)
  const [formData, setFormData] = useState({
    username: user?.username || "",
    email: user?.email || "",
    phone: user?.phone || "",
    dob: user?.dob?.split("T")[0] || "",
    city: user?.city || "",
    address: user?.address || "",
    aboutMe: user?.aboutMe || "",
    skills: user?.skills ?? [],
    socialLinks: user?.socialLinks || {},
    jobPreference: user?.jobPreference || {},
    profilePhoto: user?.profilePhoto ?? {
      url: "https://via.placeholder.com/150",
    },
    resume: user?.resume ?? {},
  });
  const [isEditMode, setIsEditMode] = useState(false);
  const [newSkill, setNewSkill] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const navigate = useNavigate();

  // Function to retrieve token from localStorage
  const getToken = () => {
    return localStorage.getItem("TOKEN");
  };

  const checkForValidSkills = (skills) => {
    if (skills) {
      if (
        skills[0]?.split(",").length == 1 &&
        skills[0]?.split(",")[0] === ""
      ) {
        return [];
      } else {
        return skills[0]?.split(",");
      }
    }
    return [];
  };

  // Update formData when the user prop changes
  useEffect(() => {
    setFormData({
      username: user?.username || "",
      email: user?.email || "",
      phone: user?.phone || "",
      dob: user?.dob?.split("T")[0] || "",
      city: user?.city || "",
      address: user?.address || "",
      aboutMe: user?.aboutMe || "",
      skills: checkForValidSkills(user?.skills) || [],
      socialLinks: (user?.socialLinks && JSON.parse(user?.socialLinks)) || {},
      jobPreference:
        (user?.jobPreference && JSON.parse(user?.jobPreference)) || {},
      resume: user?.resume || {},
      profilePhoto: user?.profilePhoto ?? {
        url: "https://via.placeholder.com/150",
      },
    });
  }, [user]);

  const handleResumeUpload = async (e) => {
    e.preventDefault();
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);

    try {
      const uploadedFileUrl = await mockUpload(file);

      setFormData((prev) => ({
        ...prev,
        resume: {
          file,
          url: uploadedFileUrl,
        },
      }));
    } catch (error) {
      console.error("Error uploading resume:", error);
      alert("Failed to upload resume. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  // Simulated upload function for demo purposes
  const mockUpload = (file) =>
    new Promise((resolve) => {
      setTimeout(() => resolve(URL.createObjectURL(file)), 2000);
    });

  const addSkill = (e) => {
    e.preventDefault();

    if (newSkill.trim() && !formData.skills.includes(newSkill.trim())) {
      setFormData((prev) => ({
        ...prev,
        skills: [...prev.skills, newSkill.trim()],
      }));
      setNewSkill("");
    }
  };

  const removeSkill = (skillToRemove) => {
    setFormData((prev) => ({
      ...prev,
      skills: prev.skills.filter((skill) => skill !== skillToRemove),
    }));
  };

  const handleEditClick = () => {
    setIsEditMode(true);
  };

  const handleSaveClick = async (e) => {
    e.preventDefault();
    setIsEditMode(false);

    const formDataToSend = new FormData();

    for (const key in formData) {
      if (key === "socialLinks" || key === "jobPreference") {
        formDataToSend.append(key, JSON.stringify(formData[key]));
      } else if (key !== "profilePhoto" && key !== "resume") {
        formDataToSend.append(key, formData[key]);
      } else if (
        key === "username" ||
        key === "phone" ||
        key === "city" ||
        key === "address" ||
        key === "dob" ||
        key === "skills"
      ) {
        formDataToSend.append(key, formData[key]);
      }
    }

    // Append files if updated
    if (typeof formData.profilePhoto?.file === "object") {
      formDataToSend.append("profilePhoto", formData?.profilePhoto?.file);
    }

    if (typeof formData.resume?.file === "object") {
      formDataToSend.append("resume", formData?.resume?.file);
    }

    for (let [key, value] of formDataToSend.entries()) {
      console.log(`${key}:`, value);
    }

  
    let BASE_URL = import.meta.env.VITE_BACKEND_HOST;
    let token = getToken();

    try {
      const response = await axios.patch(
        `${BASE_URL}/api/v1/user/update-profile/`,
        formDataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "multipart/form-data", // For sending FormData
          },
        }
      );
      
      toast.success(response.data.message)
    } catch (err) {
      console.log(err)
      toast.error(err.response?.data?.message || "Registration failed");
      
    }
  };

  // Handle input changes
  const handleInputChange = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSocialLinks = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      socialLinks: {
        ...prevData?.socialLinks,
        [name]: value,
      },
    }));
  };

  const handleJobPreferences = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      jobPreference: {
        ...prevData?.jobPreference,
        [name]: value,
      },
    }));
  };

  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, profilePhoto: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData((prev) => ({
          ...prev,
          profilePhoto: { file, url: reader?.result },
        }));
      };
      reader.readAsDataURL(file);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <>
      <Navbar user={user} />
      <div className="min-h-screen bg-gray-100 py-8">
        <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
          {/* Profile Header with Photo */}
          <div className="relative h-48 bg-gradient-to-r from-blue-500 to-blue-600">
            <div className="absolute -bottom-16 left-8">
              <div className="relative group">
                {/* Profile Image */}
                <img
                  src={formData?.profilePhoto?.url}
                  alt="Profile"
                  className="w-32 h-32 rounded-full border-4 border-white object-cover"
                />

                {/* Hover Effect with + Icon */}
                {isEditMode && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <label
                      htmlFor="profileImageUploader"
                      className="cursor-pointer text-white text-3xl font-bold"
                    >
                      +
                    </label>
                    {/* Hidden File Input */}
                    <input
                      id="profileImageUploader"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleProfilePhotoChange}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="pt-20 px-8  mb-[1em]">
            <div className="flex justify-end">
              <button
                onClick={isEditMode ? handleSaveClick : handleEditClick}
                className={`px-4 py-2 rounded-md text-white ${
                  isEditMode
                    ? "bg-green-500 hover:bg-green-600"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                {isEditMode ? "Save" : "Edit"}
              </button>
            </div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              <b>Basic Details</b>
            </label>
            <form className="space-y-6">
              {/* Basic Information */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  lablename="Username"
                  type="text"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  disabled={!isEditMode}
                />
                <Input
                  lablename="Email"
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  disabled
                />
                <Input
                  lablename="Phone"
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  disabled={!isEditMode}
                />
                <Input
                  lablename="DOB"
                  type="date"
                  name="dob"
                  value={formData.dob}
                  onChange={handleInputChange}
                  disabled={!isEditMode}
                />
                <Input
                  lablename="City"
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  disabled={!isEditMode}
                />
                <Input
                  lablename="Address"
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  disabled={!isEditMode}
                />
              </div>

              {/* About */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <b>About</b>
                </label>
                <textarea
                  name="aboutMe"
                  rows="4"
                  className="w-full p-2 border border-gray-300 rounded-md bg-gray-50"
                  value={formData.aboutMe}
                  onChange={handleInputChange}
                  disabled={!isEditMode}
                />
              </div>

              {user?.role != "Recruiter" && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <b>Skills</b>
                  </label>
                  {!isEditMode ? (
                    // Display skills as pills when not in edit mode
                    <div className="flex flex-wrap gap-2">
                      {formData?.skills?.map((skill) => (
                        <span
                          key={skill}
                          className="px-4 py-2 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
                        >
                          {skill}
                        </span>
                      ))}
                      {formData?.skills?.length === 0 && (
                        <p className="text-gray-500">No skills added yet.</p>
                      )}
                    </div>
                  ) : (
                    // Edit mode: Add/Remove skills
                    <div>
                      <div className="flex items-center gap-2 mb-4">
                        <input
                          type="text"
                          placeholder="Type your skills here..."
                          value={newSkill}
                          onChange={(e) => setNewSkill(e.target.value)}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring focus:ring-blue-200"
                        />
                        <button
                          onClick={(e) => addSkill(e)}
                          className="bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700"
                        >
                          Add
                        </button>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {formData.skills.map((skill) => (
                          <div
                            key={skill}
                            className="flex items-center px-4 py-2 bg-blue-100 text-blue-800 text-sm font-medium rounded-full"
                          >
                            {skill}
                            <button
                              onClick={() => removeSkill(skill)}
                              className="ml-2 text-red-500 hover:text-red-700"
                            >
                              ×
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Social Links */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <b>Social Links</b>
                </label>

                {/* Social Links */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Input
                    lablename="LinkedIn"
                    type="url"
                    name="linkedin"
                    value={formData.socialLinks?.linkedin || ""}
                    onChange={handleSocialLinks}
                    disabled={!isEditMode}
                  />
                  <Input
                    lablename="GitHub"
                    type="url"
                    name="github"
                    value={formData.socialLinks?.github || ""}
                    onChange={handleSocialLinks}
                    disabled={!isEditMode}
                  />
                  <Input
                    lablename="Portfolio"
                    type="url"
                    name="portfolio"
                    value={formData.socialLinks?.portfolio || ""}
                    onChange={handleSocialLinks}
                    disabled={!isEditMode}
                  />
                  <Input
                    lablename="Twitter"
                    type="url"
                    name="twitter"
                    value={formData.socialLinks?.twitter || ""}
                    onChange={handleSocialLinks}
                    disabled={!isEditMode}
                  />
                </div>
              </div>
              {/* Job Preferences */}
              {user?.role != "Recruiter" && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <b>Job Preferences</b>
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <Input
                      lablename="First Choice"
                      type="text"
                      name="first"
                      value={formData.jobPreference?.first || ""}
                      onChange={handleJobPreferences}
                      disabled={!isEditMode}
                    />
                    <Input
                      lablename="Second Choice"
                      type="text"
                      name="second"
                      value={formData.jobPreference?.second || ""}
                      onChange={handleJobPreferences}
                      disabled={!isEditMode}
                    />
                    <Input
                      lablename="Third Choice"
                      type="text"
                      name="third"
                      value={formData.jobPreference?.third || ""}
                      onChange={handleJobPreferences}
                      disabled={!isEditMode}
                    />
                  </div>
                </div>
              )}

              {/* Resume Section */}

              {user?.role != "Recruiter" && (
                <>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <b>Resume</b>
                    </label>
                  </div>
                  <div className="flex items-center space-x-4 p-4 border rounded-lg bg-gray-50 shadow-sm">
                    {/* Icon Section */}
                    <div className="p-2 bg-blue-100 rounded-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-6 w-6 text-blue-600"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </div>

                    {/* Content Section */}
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-700">
                        {"Resume"}
                      </h3>
                      {formData?.resume?.url ? (
                        <a
                          href={formData?.resume?.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm font-medium text-blue-600 hover:text-blue-700 underline"
                        >
                          View Resume
                        </a>
                      ) : (
                        <p className="text-sm text-gray-500">
                          No resume uploaded.
                        </p>
                      )}

                      {/* Edit Mode */}
                      {isEditMode && (
                        <div className="mt-2">
                          <button
                            onClick={() =>
                              document.getElementById("resume-upload").click()
                            }
                            className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            disabled={isUploading}
                          >
                            {isUploading ? (
                              <>
                                <svg
                                  className="animate-spin h-5 w-5 mr-2 text-white"
                                  xmlns="http://www.w3.org/2000/svg"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  ></circle>
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v8h8a8 8 0 01-16 0z"
                                  ></path>
                                </svg>{" "}
                                Uploading
                              </>
                            ) : (
                              <>
                                <svg
                                  width="16px"
                                  height="18px"
                                  viewBox="0 0 16 16"
                                  xmlns="http://www.w3.org/2000/svg"
                                  version="1.1"
                                  fill="none"
                                  stroke="#ffffff"
                                  stroke-linecap="round"
                                  stroke-linejoin="round"
                                  stroke-width="1.5"
                                >
                                  <g
                                    id="SVGRepo_bgCarrier"
                                    stroke-width="0"
                                  ></g>
                                  <g
                                    id="SVGRepo_tracerCarrier"
                                    stroke-linecap="round"
                                    stroke-linejoin="round"
                                  ></g>
                                  <g id="SVGRepo_iconCarrier">
                                    {" "}
                                    <path d="m3.75 2.75h9m-8.5 6.5 4-3.5 4 3.5m-4 5v-8.5"></path>{" "}
                                  </g>
                                </svg>
                                Upload Resume
                              </>
                            )}
                          </button>
                          <input
                            id="resume-upload"
                            type="file"
                            accept=".pdf,.doc,.docx"
                            className="hidden"
                            onChange={handleResumeUpload}
                            disabled={isUploading}
                          />
                        </div>
                      )}
                    </div>
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProfileUser;
