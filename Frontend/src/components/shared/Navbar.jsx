import React from "react";
import { useState } from "react";
import { useEffect } from "react";
import User from "./User";
import New_user from "./New_user";

const Navbar = (props) => {
  const [user, setUser] = useState(null); // Initially, no user is logged in

  useEffect(() => {
    // Check if the user is logged in by looking for a token in localStorage
    const token = localStorage.getItem("TOKEN");
    const email = localStorage.getItem("EMAIL");
    const role = localStorage.getItem("ROLE");

    if (token && email && role) {
      // Set user details if logged in
      setUser({ email, token, role });
    }
  }, []); // Run only once when the component mounts

  const handleLogout = () => {
    // Clear user data from localStorage
    localStorage.removeItem("TOKEN");
    localStorage.removeItem("EMAIL");
    localStorage.removeItem("ROLE");

    // Update state
    setUser(null);

    // Optional: Redirect to home or login page
    window.location.href = "/";
  };

  // Change this value to toggle user login state
  return (
    <div className="bg-white my-2 shadow-md sticky top-0 z-50 w-full">
      {user ? (
        <User role={user.role} email={user.email} user={props?.user}></User>
      ) : (
        <New_user></New_user>
      )}
    </div>
  );
};
// import User from './User';
// import New_user from './New_user';

// const Navbar = () => {
//   const user = true;
//   const role = false; // Change this value to toggle user login state
//   return (
//     <div className='bg-white my-2 shadow-md sticky top-0 z-50 w-full'>
//       {user ? (
//         <User role={role} ></User>
//       ) : (
//         <New_user></New_user>
//       )}
//     </div>
//   );

export default Navbar;
