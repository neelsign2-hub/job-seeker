// JobsPage.jsx
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import google from './google.png';

const JobDcard = () => {
    return (
        <div className="p-8 bg-gray-100 min-h-screen">
            <div className="bg-white shadow-lg rounded-lg p-6 flex items-start space-x-4 mb-4">
                <img src={google} alt="logo" className="object-cover mr-3 w-16 h-16 rounded-full" />
                <div className="flex-grow">
                    <h3 className="text-lg font-bold text-blue-700">{`Business Development Executive (BDE)`}</h3>
                    {/* Link to the company page */}
                    <Link to="/companydescription" className="text-gray-800 hover:text-blue-500">
                        {"Google"}
                    </Link>
                    <p className="text-gray-500">{"Rajkot"}</p>
                    <p className="text-gray-400">Updated On: {`Nov 12, 2024`}</p>
                </div>
                <button className="bg-blue-500 text-white px-4 py-2 rounded-lg font-semibold">Applied</button>
            </div>
            <div className="bg-white shadow-md rounded-lg p-6 mb-4">
                <h3 className="text-lg font-semibold text-blue-700 mb-2">Job Description</h3>
                <p className="text-gray-700">{`StoneheadBikes is hiring for the role of Business Development Executive (BDE)!`}</p>
                {/* Full job description */}
            </div>
            <div className="bg-white shadow-md rounded-lg p-6 mb-4">
                <h3 className="text-lg font-semibold text-blue-700 mb-2">Job Details</h3>
                <p className="text-gray-800"><span className="font-semibold">Application Deadline:</span> {`31 Dec 24, 11:59 PM IST`}</p>
                <p className="text-gray-800"><span className="font-semibold">Location:</span> {"Rajkot"}</p>
                <p className="text-gray-800"><span className="font-semibold">Experience:</span> {"2 years"}</p>
                <p className="text-gray-800"><span className="font-semibold">Salary:</span> {`Not Disclosed`}</p>
                <p className="text-gray-800"><span className="font-semibold">Job Type:</span> {"5 Days Working"}</p>
                <p className="text-gray-800"><span className="font-semibold">Type:</span> {"Work From Home"}</p>
                <p className="text-gray-800"><span className="font-semibold">Timing:</span> {"Full Time"}</p>
            </div>
        </div>
    );
};

export default JobDcard;
