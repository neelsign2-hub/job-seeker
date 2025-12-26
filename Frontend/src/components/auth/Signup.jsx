import React, { useState } from "react";
import Input from "../shared/Input";
import { Link } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { BASE_URL } from "../../lib/api";

const Signup = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [role, setRole] = useState("Job Seeker");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loader state

  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loader
    try {
      const response = await axios.post(`${BASE_URL}/api/v1/user/register`, {
        username,
        email,
        password,
        role,
      });
      toast.success(response.data.message);
      navigate("/login"); // Redirect to login page upon successful registration
    } catch (err) {
      toast.error(err.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false); // Stop loader
    }
  };

  return (
    <div>
      <div className="flex items-center justify-center max-w-7xl mx-auto mt-6">
        {" "}
        {/* Decreased top margin */}
        <form
          onSubmit={submitHandler}
          className="w-full mx-6 size_2:w-1/3 border border-gray-400 shadow-xl rounded-md p-4 my-10"
        >
          {/* CareerXperts title */}
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold">
              <span className="text-black">Career</span>
              <span className="text-blue-600">Xperts</span>
            </h1>
          </div>

          <h1 className="font-bold text-xl mb-5 text-blue-600 text-center">
            Create Account
          </h1>

          <div className="my-4">
            <Input
              lablename="Username"
              type="text"
              value={username}
              name="Username"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="my-4">
            <Input
              lablename="Email"
              type="email"
              value={email}
              name="Email"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="my-4">
            <Input
              lablename="Password"
              type="password"
              value={password}
              name="Password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {/* Radio buttons for account type selection */}
          <div className="mb-4">
            <h2 className="text-gray-700 font-bold mb-2 text-center">
              Select Account Type
            </h2>
            <div className="flex flex-row justify-center space-x-4">
              <label className="flex items-center cursor-pointer text-sm text-gray-700 font-bold">
                <input
                  type="radio"
                  name="role"
                  value="Job Seeker"
                  checked={role === "Job Seeker"}
                  onChange={(e) => setRole(e.target.value)}
                  className="mr-2 cursor-pointer"
                />
                Job Seeker
              </label>
              <label className="flex items-center cursor-pointer text-sm text-gray-700 font-bold">
                <input
                  type="radio"
                  name="role"
                  value="Recruiter"
                  checked={role === "Recruiter"}
                  onChange={(e) => setRole(e.target.value)}
                  className="mr-2 cursor-pointer"
                />
                Recruiter
              </label>
            </div>
          </div>

          <div className="my-4">
            <button
              type="submit"
              className="text-white bg-gradient-to-r from-blue-500 via-blue-600 to-blue-700 hover:bg-gradient-to-br font-medium rounded-full text-sm px-5 py-2.5 text-center mb-4 w-full"
              disabled={isLoading} // Disable button during loading
            >
              {isLoading ? (
                <svg
                  className="animate-spin h-5 w-5 text-white inline-block"
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
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
              ) : (
                "Sign Up"
              )}
            </button>
          </div>

          <div className="text-center">
            <span>
              Already have an account?{" "}
              <Link to="/login" className="text-blue-600">
                Login
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Signup;
