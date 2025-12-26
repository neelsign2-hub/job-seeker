import { useEffect, useState } from "react";
import "./App.css";
import { createBrowserRouter, RouterProvider, useLocation } from "react-router-dom";
import Home from "./components/ui/Home";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Forget from "./components/auth/Forget";
import JobPost from "./components/jobs/JobPost";
import Job_pages from "./components/shared/Job_page";
import ResetPassword from "./components/auth/ResetPassword";
// import Profile from './components/auth/Profile';
import { Toaster } from "react-hot-toast";
// import MyProfile from './components/user/MyProfile';
// import UpdateProfile from './components/user/updateProfile';
import CompanyList from "./components/shared/CompanyList";
import JobList from "./components/shared/JobList";
import ResumeTable from "./components/shared/MyCompany3";
import Profile_user from "./components/shared/Profile_user";
import EditCompanyForm from "./components/shared/EditCompanyForm";
import Job_Apply from "./components/shared/Job_Apply";
import JobDcard from "./components/shared/JobDcard";
import Home_jobs from "./components/shared/Home_jobs";
import Home_companies from "./components/shared/Home_companies";
import CompanyD from "./components/shared/CompanyD";
import ApplyJobDcard from "./components/shared/ApplyJobDcard";
import { BASE_URL, getToken } from "./lib/api";

function App() {
  const [companyData, setcompanyData] = useState({});
  const [currUser, setCurrUser] = useState();

  // fetch the user data
  const fetchUserData = async () => {
    const token = getToken();
    if (!token) {
      console.error("No token found");
      return null;
    }
    console.log(currUser, "[URL]");

    try {
      const response = await fetch(`${BASE_URL}/api/v1/user/me`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`, // Send token in Authorization header
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch user data");
      }

      const data = await response.json();
      return data.data.user;
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };

  useEffect(() => {

    const func = async () => {
      let user = await fetchUserData();
      setCurrUser(user);
    };

    func();
  }, []);

  const appRouter = createBrowserRouter([
    {
      path: "/",
      element: <Home setcompanyData={setcompanyData} user={currUser} />,
    },
    {
      path: "/login",
      element: <Login />,
    },
    {
      path: "/signup",
      element: <Signup />,
    },
    {
      path: "/forgotpassword",
      element: <Forget />,
    },
    {
      path: "/post-job",
      element: <JobPost user={currUser} />,
    },
    // {
    //   path: "/jobs",
    //   element: <Job_pages />,
    // },
    {
      path: "/reset-password/:token",
      element: <ResetPassword />,
    },
    // {
    //   path: '/me',
    //   element: <MyProfile />
    // },
    // {
    //   path: 'update-profile',
    //   element: <UpdateProfile />
    // }
    {
      path: "/companylist",
      element: <CompanyList setcompanyData={setcompanyData} user={currUser} />,
    },
    {
      path: "/joblist",
      element: <JobList user={currUser} />,
    },
    {
      path: "/userdetails",
      element: <ResumeTable user={currUser} />,
    },
    {
      path: "/profileuser",
      element: <Profile_user user={currUser} />,
    },
    {
      path: "/editcompanyprofile",
      element: <EditCompanyForm companyData={companyData} />,
    },
    {
      path: "/jobapply",
      element: <Job_Apply user={currUser} />,
    },
    {
      path: "/jobdcard",
      element: <JobDcard />,
    },

    {
      path: "/homejob",
      element: <Home_jobs user={currUser} />,
    },

    {
      path: "/homecompanies",
      element: <Home_companies user={currUser} />,
    },

    {
      path: "/companydescription",
      element: <CompanyD user={currUser} />,
    },
    {
      path: "/applyjobdcard",
      element: <ApplyJobDcard user={currUser} />,
    },
  ]);

  return (
    <>
      <RouterProvider router={appRouter} />
      <Toaster position="top-right" reverseOrder={false} />
    </>
  );
}

export default App;
