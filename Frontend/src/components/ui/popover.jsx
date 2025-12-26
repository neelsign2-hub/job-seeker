import { useState } from "react";
import { LogOut } from "lucide-react";
import { UserRound } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";
import { Link } from "react-router-dom";

function AvatarDropdown({
  userName = "Bonnie Green",
  userEmail = "name@flowbite.com",
  userImage = "/docs/images/people/profile-picture-3.jpg",
}) {
  var BASE_URL = import.meta.env.VITE_BACKEND_HOST;
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  // Function to retrieve token from localStorage
  const getToken = () => {
    return localStorage.getItem("TOKEN");
  };

  const handleLogout = async () => {
    let token = getToken();

    try {
      const response = await fetch(`${BASE_URL}/api/v1/user/logout`, {
        method: "GET",
        headers: {
          // "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Send token in Authorization header
        },
      });
      // Call the logout API endpoint
      // const response = await axios.get(
      //   "https://localhost:5001/api/v1/user/logout",
      //   {
      //     headers: {
      //       Authorization: `Bearer ${token}`, // Add the Bearer token in the Authorization header
      //     },
      //   }
      // );
      toast.success("logged out");
      // Clear client-side state, if any
      localStorage.removeItem("EMAIL");
      localStorage.removeItem("ROLE");
      localStorage.removeItem("TOKEN");

      // Redirect to the login page
      navigate("/login");
    } catch (error) {
      console.log(error);
      toast.error(
        "Error logging out:",
        error.response?.data?.message || error.message
      );
    }
  };

  return (
    <div className="relative">
      <button
        onClick={toggleDropdown}
        className="flex text-sm bg-gray-800 rounded-full border border-black"
        type="button"
      >
        <img
          className="object-cover w-9 h-9 rounded-full"
          src={userImage}
          alt="user avatar"
        />
      </button>

      {isOpen && (
        <div className="absolute top-10 right-0.5 z-10 border-2 border-blue-600 bg-gray-700 divide-y divide-gray-100 rounded-lg shadow size:w-80 w-44 dark:bg-gray-700 dark:divide-blue-600">
          <div className="img flex justify-center px-2 py-2">
            <img
              className="object-cover w-11 h-11 rounded-full border-2 border-blue-500"
              src={userImage}
              alt="user avatar"
            />
          </div>

          <div className="px-4 py-3 text-base text-white">
            <div className="font-medium truncate">{userEmail}</div>
          </div>
          <ul className="py-2 text-sm text-white">
            <li>
              <Link to="/profileuser">
                <div className="flex items-center px-4 py-2  dark:hover:bg-blue-600  dark:hover:text-white rounded-lg gap-4 text-base">
                  <UserRound />
                  View Profile
                </div>
              </Link>
            </li>
          </ul>
          <div className="py-2 text-white">
            <button
              onClick={handleLogout}
              className="flex items-center px-4 py-2 w-full dark:hover:bg-blue-600 dark:hover:text-white rounded-lg gap-4 text-base"
            >
              <LogOut />
              <span>Sign out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default AvatarDropdown;
