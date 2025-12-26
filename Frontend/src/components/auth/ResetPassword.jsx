import React, { useState } from "react";
import Input from "../shared/Input";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import toast from "react-hot-toast";

const ResetPassword = () => {
  var BASE_URL = import.meta.env.VITE_BACKEND_HOST;
  const { token } = useParams(); // Extract token from URL
  const [password, setPassword] = useState(""); // State to store password
  const navigate = useNavigate();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE_URL}/api/v1/user/reset-password/${token}`, {
        password,
      });
      toast.success("Password reset successfully!");
      navigate("/login"); // Redirect to login page
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || "Failed to reset password.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full mx-4 max-w-md bg-white p-8 rounded-lg border border-gray-400">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Reset Password
        </h2>

        {/* Form */}
        <form onSubmit={handleResetPassword}>
          {/* Password Input */}
          <div className="mb-4">
            <Input
              lablename="New Password"
              type="password"
              value={password}
              name="password"
              onChange={(e) => setPassword(e.target.value)}
              className="w-3/4 mx-auto"
              placeholder="Enter new password"
              required
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 text-white font-medium rounded-full px-5 py-2.5"
          >
            Reset Password
          </button>
        </form>

        {/* Back to login link */}
        <div className="mt-4 text-center">
          <span>
            Remember your password?{" "}
            <a href="/login" className="text-blue-600">
              Login here
            </a>
          </span>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
