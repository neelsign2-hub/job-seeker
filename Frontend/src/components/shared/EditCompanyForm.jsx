import React, { useState } from "react";
import toast from "react-hot-toast";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { BASE_URL, getToken } from "../../lib/api";

const EditCompanyForm = (props) => {
  const navigate = useNavigate();
  const [EditCompany, setEditCompany] = useState(false);
  console.log(props.companyData);

  const [formData, setFormData] = useState({
    name: props.companyData.name || "",
    logo: props.companyData.logo || "",
    about: props.companyData.about || "",
    website: props.companyData.website || "",
    employees: props.companyData.employees || "",
    branches: props.companyData.branches || "",
    social: {
      linkedin: props.companyData.linkedin || "",
      facebook: props.companyData.facebook || "",
      twitter: props.companyData.name || "",
      instagram: props.companyData.instagram || "",
    },
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes("social.")) {
      const [_, key] = name.split(".");
      setFormData({
        ...formData,
        social: {
          ...formData.social,
          [key]: value,
        },
      });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const token = getToken();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent form default behavior
    setIsSubmitting(true); // Indicate the form is being submitted
    // console.log('Hello');
    // Validate form data
    if (!formData.name || !formData.about) {
      toast.error("Please fill in all required fields.");
      setIsSubmitting(false);
      return;
    }

    try {
      // Send data to the backend API
      const response = await axios.post(
        `${BASE_URL}/api/v1/company/register`, // Backend API endpoint
        formData,
        {
          headers: {
            // "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Send token in Authorization header
          },
        } // Include credentials if needed (e.g., cookies)
      );

      // Success feedback
      toast.success(response.data.message);
      // console.log(response);

      // Reset form after submission
      setFormData({
        name: "",
        logo: "",
        about: "",
        website: "",
        employees: "",
        branches: "",
        social: {
          linkedin: "",
          facebook: "",
          twitter: "",
          instagram: "",
        },
      });
      navigate("/");
    } catch (error) {
      // Handle errors (e.g., validation issues, server errors)
      console.error("Error during submission:", error);
      toast.error(error.response?.data?.message || "Error registering company");
    } finally {
      setIsSubmitting(false); // Reset submission state
    }
  };

  const changhandleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form behavior
    setIsSubmitting(true); // Indicate that the form is being submitted

    if (!formData.name || !formData.about) {
      toast.error("Please fill in all required fields.");
      setIsSubmitting(false);
      return;
    }

    try {
      // Send updated data to the backend API
      const response = await axios.put(
        `${BASE_URL}/api/v1/company/update/${props.companyData._id}`, // Backend API endpoint with ID
        formData, // Updated data object to be sent
        {
          headers: {
            // "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // Send token in Authorization header
          },
        } // Include credentials if needed
      );

      // Success feedback
      toast.success("Company data updated successfully!");
      console.log("Backend response:", response.data);

      // Optionally navigate or reset form
      setFormData({
        name: "",
        logo: "",
        about: "",
        website: "",
        employees: "",
        branches: "",
        social: {
          linkedin: "",
          facebook: "",
          twitter: "",
          instagram: "",
        },
      });
      // window.location.href = "/companylist";
      navigate("/companylist");
      // Redirect to another page after updating data
    } catch (error) {
      // Handle errors (e.g., validation issues, server errors)
      console.error("Error during update:", error);
      toast.error(
        error.response?.data?.message || "Error updating company data"
      );
    } finally {
      setIsSubmitting(false); // Reset submission state
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-7">
      {/* Header Section */}
      <div className="bg-blue-600 text-white w-full py-6 px-8 rounded-t-lg shadow-md max-w-3xl">
        <h2 className="text-2xl font-bold">
          {props.companyData.name ? "Update Company" : "Host Company"}
        </h2>
        <p className="text-sm text-gray-100 mt-1">
          Update the details of your company below
        </p>
      </div>

      {/* Form Section */}
      <form className="bg-white p-8 rounded-b-lg shadow-md w-full max-w-3xl">
        {/* Basic Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name */}
          <div>
            <label className="block text-gray-700 font-medium">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter company name"
              className="w-full border border-gray-300 rounded-lg p-2 placeholder-gray-400"
              required
            />
          </div>

          {/* Logo */}
          <div>
            <label className="block text-gray-700 font-medium">Logo URL</label>
            <input
              type="url"
              name="logo"
              value={formData.logo}
              onChange={handleChange}
              placeholder="e.g., https://example.com/logo.png"
              className="w-full border border-gray-300 rounded-lg p-2 placeholder-gray-400"
            />
          </div>

          {/* About */}
          <div className="col-span-2">
            <label className="block text-gray-700 font-medium">
              About <span className="text-red-500">*</span>
            </label>
            <textarea
              name="about"
              value={formData.about}
              onChange={handleChange}
              placeholder="Provide a brief description about the company"
              className="w-full border border-gray-300 rounded-lg p-2 placeholder-gray-400"
              required
            ></textarea>
          </div>
        </div>

        {/* Additional Information */}
        <h3 className="text-lg font-semibold text-gray-700 mt-8">
          Additional Information
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {/* Website */}
          <div>
            <label className="block text-gray-700 font-medium">
              Website <span className="text-red-500">*</span>
            </label>
            <input
              type="url"
              name="website"
              value={formData.website}
              onChange={handleChange}
              placeholder="e.g., https://www.companywebsite.com"
              className="w-full border border-gray-300 rounded-lg p-2 placeholder-gray-400"
              required
            />
          </div>

          {/* Employees */}
          <div>
            <label className="block text-gray-700 font-medium">
              Number of Employees
            </label>
            <input
              type="number"
              name="employees"
              min="0"
              value={formData.employees}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 placeholder-gray-400"
            />
          </div>

          {/* Branches */}
          <div>
            <label className="block text-gray-700 font-medium">
              Number of Branches
            </label>
            <input
              type="number"
              name="branches"
              min="0"
              value={formData.branches}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg p-2 placeholder-gray-400"
            />
          </div>
        </div>

        {/* Social Links */}
        <h3 className="text-lg font-semibold text-gray-700 mt-8">
          Social Links
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
          {["linkedin", "facebook", "twitter", "instagram"].map((platform) => (
            <div key={platform}>
              <label className="block text-gray-700 font-medium capitalize">
                {platform}
              </label>
              <input
                type="url"
                name={`social.${platform}`}
                value={formData.social[platform]}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-lg p-2 placeholder-gray-400"
              />
            </div>
          ))}
        </div>

        {/* Submit Button */}
        <div className="mt-8">
          <button
            type="button" // Change to type="button" to prevent form submission
            onClick={props.companyData.name ? changhandleSubmit : handleSubmit} // Call the handleSubmit function on button click
            className="w-full bg-blue-600 text-white font-medium py-2 rounded-lg hover:bg-blue-700"
          >
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditCompanyForm;
