import React from "react";
import AvatarDropdown from "../ui/popover";
import { Link } from "react-router-dom";
import google from "./google.png";

const User = (props) => {
  return (
    <div className="sticky top-0 z-50 bg-white shadow-lg">
      {" "}
      {/* Ensure parent is sticky */}
      <div className="bg-white">
        <div className="flex items-center justify-between mx-auto max-w-7xl flex-row h-16">
          {/* Logo Section */}
          <div>
            <h1 className="text-2xl font-bold">
              <Link to="/" className="text-inherit">
                Career<span className="text-blue-600">Xpert</span>
              </Link>
            </h1>
          </div>

          {/* Navigation Links */}
          <div className="flex justify-center gap-5 items-center">
            <ul className="flex cursor-pointer font-medium items-center gap-5">
              <li className="relative group pb-1">
                <Link to="/">
                  <span>Home</span>
                </Link>
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
              </li>
              {/* <li className="relative group pb-1">
                <Link to="/jobs">
                  <span>Jobs</span>
                </Link>
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
              </li> */}

              {/* Conditional Link Based on Role */}
              {props.role === "Job Seeker" ? (
                <li className="relative group pb-1">
                  <Link to="/jobapply">
                    <span>MyApplication</span>
                  </Link>
                  <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
                </li>
              ) : (
                <li className="relative group pb-1">
                  <Link to="/companylist">
                    <span>MyCompany</span>
                  </Link>
                  <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-blue-600 transition-all duration-200 group-hover:w-full"></span>
                </li>
              )}
            </ul>

            {/* Avatar Dropdown */}
            <AvatarDropdown
              className="cursor-pointer"
              userName=""
              userEmail={props.email}
              userImage={props?.user?.profilePhoto?.url}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default User;
