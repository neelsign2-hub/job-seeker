import React, { useState } from "react";
import Input from "../shared/Input";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { BASE_URL, setUserData } from "../../lib/api";

function Login() {
  const [role, setRole] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false); // Loader state
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Start loader

    try {
      const response = await axios.post(
        `${BASE_URL}/api/v1/user/login`,
        { email, password, role }
      );
      toast.success(response.data.message);
      console.log(response)
      setUserData(response.data.token, email, role);
      
      navigate("/"); // Redirect to home page upon successful login
      window.location.reload()
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false); // Stop loader
    }
  };

  return (
    <div>
      <div className="flex items-center justify-center max-w-7xl mx-auto mt-10">
        <form
          onSubmit={submitHandler}
          className=" w-full mx-6 size_2:w-1/3 border border-gray-400 shadow-xl rounded-md p-4 my-10"
        >
          <div className="text-center mb-12">
            <h1 className="text-3xl font-bold">
              <span className="text-black">Career</span>
              <span className="text-blue-600">Xperts</span>
            </h1>
          </div>

          <h1 className="font-bold text-xl mb-5 text-blue-600 text-center">
            Login to your Account
          </h1>

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

          <div className="my-4 mx-1">
            <span>
              <Link to="/forgotpassword" className="text-blue-600">
                Forgot Password?
              </Link>
            </span>
          </div>

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
              disabled={isLoading} // Disable button when loading
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
                "Sign in"
              )}
            </button>
          </div>

          <div className="text-center">
            <span>
              Don't have an account?{" "}
              <Link to="/signup" className="text-blue-600">
                Create one
              </Link>
            </span>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
