import React from 'react';
import { Link } from 'react-router-dom';
// Import icons as images from the parent directory
import github from './github_img.jpeg.jpg';
import likdin from './likdin_img.jpg';
import twitter from './twitter.png.jpg';

const Footer = () => {
    return (
        <footer className="bg-gray-900 text-white py-10 px-5 w-full" >
            <div className="max-w-7xl mx-auto">
                {/* Help Section */}
                <div className="text-center mb-8">
                    <h2 className="text-xl font-semibold text-gray-500">We're here to help</h2>
                    <p className="text-gray-500 mt-2">Visit our Help Centre for answers to common questions or contact us directly.</p>
                    <div className="mt-4 flex justify-center space-x-4">
                        <button className="px-4 py-2 border border-gray-400 rounded-md text-blue-600 hover:bg-blue-100">Help Center</button>
                        <button className="px-4 py-2 border border-gray-400 rounded-md text-blue-600 hover:bg-blue-100">Contact support</button>
                    </div>
                </div>

                {/* Social Media Icons */}
                <div className="flex justify-center space-x-6 mt-8">
                    <Link to ="https://www.linkedin.com/in/vivek-vaghela-972679319/"><img src={likdin} alt="LinkedIn" className="w-10 h-10 hover:opacity-70" /></Link>
                    <Link
                        to="https://github.com/RP-ICONIC/CareerXpert"
                        target="_blank"
                        rel="noopener noreferrer"
                        >
                        <img src={github} alt="GitHub" className="w-10 h-10 hover:opacity-70" />
                    </Link>
                    <Link to="#"><img src={twitter} alt="twitter" className="w-10 h-10 hover:opacity-70" /></Link>
                </div>

                {/* Footer Bottom */}
                <div className="text-center text-gray-500 mt-4"> {/* Reduced margin to decrease the gap */}
                © 2024 <span className='text-blue-600'>Career</span>
                <span className='text-blue-600'>Xperts</span> | All rights reserved.
                </div>
            </div>
        </footer>
    );
};

export default Footer;
