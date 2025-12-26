// PostJobComponent.jsx
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Post_job = (props) => {

    const navigate = useNavigate();
    return (
        <div className="flex justify-between items-center p-6 border rounded-lg shadow-lg w-full max-w-3xl mx-auto bg-blue-200">
            <div className="flex-1">
                <h2 className="text-2xl font-semibold mb-2">Host Now</h2>
                <ul className="text-gray-600 space-y-1 mb-4">
                    <li>💼 Reach a large pool of qualified candidates</li>
                    <li>🕒 Save time by targeting the right talent</li>
                    <li>🔍 Get customized candidate suggestions</li>
                </ul>
                <p className="text-sm text-gray-500">
                    By posting a job, you agree to connect with potential candidates through
                    <h1 className='text-3xl font-bold'>
                        <span className='text-black'>Career</span>
                        <span className='text-blue-600'>Xperts</span>
                    </h1>
                </p>
            </div>
            <div className="ml-6">
                {/* <Link to="/editcompanyprofile" state={{}}> */}
                <button className="px-6 py-2 bg-blue-600 text-white font-semibold rounded hover:bg-blue-700"
                onClick={() => { props.setcompanyData({name: "",
                    logo: "",
                    about: "",
                    website: "",
                    employees: "",
                    branches: "",
                    social: {
                      linkedin: "",
                      facebook: "",
                      twitter: "",
                      instagram: "",
                    },}),navigate('/editcompanyprofile')}}>
                    Host Now
                </button>
                {/* </Link> */}
            </div>
        </div>
    );
};

export default Post_job;