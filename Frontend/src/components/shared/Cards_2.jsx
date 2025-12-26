// Card_2.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function Cards_2(props) {
    return (
        <div className="border border-gray-300 rounded-lg p-6 shadow-lg hover:shadow-xl hover:border-blue-500 transition-all duration-300">
            {/* Title as a Link */}
            <div className="flex items-center justify-between mb-4">
                <Link to={props.link} className="text-xl font-bold text-gray-800 hover:text-blue-700 transition-colors duration-200">
                    {props.title}
                </Link>
            </div>

            {/* Buttons */}
            <div className="space-y-2">
                {props.buttons.map((button, index) => (
                    <Link
                        key={index}
                        to={button.link}
                        className="flex items-center justify-between w-full px-4 py-3 border border-gray-300 rounded-lg text-gray-800 hover:border-blue-400 hover:bg-blue-50 hover:text-blue-700 transition-all duration-200 cursor-pointer"
                    >
                        <span className="font-medium">{button.text}</span>
                        <span className="text-gray-400 hover:text-blue-400 transition-colors duration-200">{'>'}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}

export default Cards_2;