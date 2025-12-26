import React, { useState } from 'react';
import { FiSearch } from 'react-icons/fi';

const SearchBar = () => {
    const [searchText, setSearchText] = useState('');
    const [isClicked, setIsClicked] = useState(false);

    const handleSearch = (e) => {
        e.preventDefault();
        console.log('Searching for:', searchText);
        // Add search functionality here
    };

    const handleClick = () => {
        setIsClicked(true);
        setTimeout(() => setIsClicked(false), 200); // Reset the click state after a short delay
    };

    return (
        <div className="flex items-center justify-center mt-10">
            <form onSubmit={handleSearch} className="flex items-center w-full max-w-lg">
                <input
                    type="text"
                    className="w-full p-3 border border-gray-300 rounded-l-full focus:outline-none focus:border-blue-600"
                    placeholder="I'm looking for..."
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
                <button
                    type="submit"
                    onClick={handleClick}
                    className={`p-3 rounded-r-full text-white flex items-center justify-center transition-colors duration-200 
                        ${isClicked ? 'bg-blue-500' : 'bg-blue-600'} hover:bg-blue-500 active:bg-blue-700`}
                >
                    <FiSearch size={25} />
                </button>
            </form>
        </div>
    );
};

export default SearchBar;
