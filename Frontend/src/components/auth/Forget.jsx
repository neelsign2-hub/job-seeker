import React, { useState } from "react";
import Input from "../shared/Input";
import axios from "axios";
import toast from "react-hot-toast";

const Forget = () => {
  var BASE_URL = import.meta.env.VITE_BACKEND_HOST;
  const [email, setEmail] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE_URL}/api/v1/user/forgot-password`, { email });
      toast.success("Reset link sent! Check your email.");
    } catch (error) {
      toast.error("Something went wrong.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full mx-4 max-w-md bg-white p-8 rounded-lg border border-gray-400">
        <h2 className="text-2xl font-bold text-center text-blue-600 mb-6">
          Forgot Password
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Input
              lablename="Email"
              name="Email"
              value={email}
              type="email"
              className="w-3/4 mx-auto"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gradient-to-r  from-blue-500 via-blue-600 to-blue-700  text-white font-medium rounded-full px-5 py-2.5"
          >
            Get reset link
          </button>
        </form>

        {/* Message
                {message && (
                    <div className="mt-4 text-center text-green-600">
                        <p>{message}</p>
                    </div>
                )} */}

        <div className="mt-4 text-center">
          <span>
            Remembered your password?{" "}
            <a href="/login" className="text-blue-600">
              Login here
            </a>
          </span>
        </div>
      </div>
    </div>
  );
};

export default Forget;
