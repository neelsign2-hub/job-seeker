// HomePage.jsx
import React, { useState } from "react";
import Footer from "./Footer";
import Card from "./Card";
import google from "./google.png";
import Cards_2 from "./Cards_2";
import Backtop from "./Backtop";
import Gotobtm from "./Gotobtm";
import images from "./images.png";
import Fillter from "./Fillter";
import Post_job from "./Post_job";
import { Link } from "react-router-dom";
import apple from "./apple.jpg";
import dell from "./dell.jpg";
import deloitee from "./deloitee.jpg";
import samsung from "./samsung.jpg";
import deshaw from "./deshaw.jpg";
import fastract from "./fastract.jpg";
import amazon from "./amazon.jpg";
import sprikler from "./sprinklr.jpg";

const Home_main = (props) => {
  return (
    <div className="bg-blue-50 min-h-screen flex flex-col">
      {/* Main Content */}
      <main className="flex-row mt-4 p-6 justify-center items-center">
        {/* Discover Section */}
        <div className="flex flex-row gap-4  items-center mb-12 mx-auto justify-center">
          <div className="mt-4">
            <h1 className="text-5xl font-bold mr-10 text-blue-700">
              Welcome to CareerXpert : {")"}
            </h1>
            <p className="text-lg text-gray-600 mt-2">
              Your journey to the perfect career starts here!
            </p>
          </div>
          <div className="flex flex-row gap-4 items-start">
            <Link to="/homecompanies">
              <Card title="Company" description="Shape the future together" />
            </Link>
            <Link to="/homejob">
              <Card title="Jobs" description="Explore career opportunities" />
            </Link>
          </div>
        </div>

        {/* Top MNC Section */}
        <div className="flex flex-col justify-between items-center gap-10 mb-16 mt-16 px-12">
          <div className="flex flex-col justify-center items-center">
            <h2 className="text-2xl font-semibold text-blue-700">
              Leading Companies, Inspiring Futures
            </h2>
            <p className="text-lg text-gray-600 mt-2">
              Unlock your potential with the world's top employers.
            </p>
          </div>
          <div className="flex  gap-8 justify-center">
            <img src={google} alt="Asian Paints" className="w-50 h-20" />
            <img src={amazon} alt="Aditya Birla Group" className="w-50 h-20" />
            <img src={images} alt="Wipro" className="w-50 h-20" />
            <img src={apple} alt="Wipro" className="w-50 h-20" />
            <img src={dell} alt="Wipro" className="w-50 h-20" />
            <img src={deloitee} alt="Wipro" className="w-50 h-20" />
            <img src={samsung} alt="Wipro" className="w-50 h-20" />
            <img src={sprikler} alt="Wipro" className="w50 h-20" />
            <img src={deshaw} alt="Wipro" className="w-50 h-20" />
            <img src={fastract} alt="Wipro" className="w-50 h-20" />
          </div>
        </div>
        {props?.role == "Recruiter" && (
          <Post_job setcompanyData={props.setcompanyData} />
        )}

        <div className="flex flex-row justify-center mt-16 mb-8 items-start">
          {/* <div className="flex px-12 gap-4">
            <Cards_2
              title="Jobs"
              link="/forget"
              buttons={[
                { text: "Web Developer", link: "/web-developer" },
                { text: "Data Scientist", link: "/data-scientist" },
                { text: "Digital Marketing", link: "/digital-marketing" },
              ]}
            />
            <Cards_2
              title="Internships"
              link="/forget"
              buttons={[
                { text: "Content Writer", link: "/content-writer" },
                { text: "Graphic Designer", link: "/graphic-designer" },
                { text: "UI/UX Designer", link: "/ui-ux-designer" },
              ]}
            />
          </div> */}
          <div>
            <div className="mt-4">
              <h1 className="text-4xl font-bold text-blue-700">
                Browse Job / Internship That’s Right For You!
              </h1>
              <p className="text-lg text-gray-600 mt-2 text-center">
                Find a role that fits your career aspirations.
              </p>
            </div>
            <Fillter />
          </div>
        </div>
      </main>

      <Backtop />
      <Gotobtm />
      {/* Footer Section */}
      <Footer />
    </div>
  );
};

export default Home_main;
