import React from "react";
import Navbar from "../shared/Navbar";
import Home_main from "../shared/Home_main";
import JobPost from "../jobs/JobPost";

const Home = (props) => {
  return (
    <div>
      <Navbar user={props?.user} />
      <Home_main
        setcompanyData={props.setcompanyData}
        role={props?.user?.role}
      />
    </div>
  );
};

export default Home;
