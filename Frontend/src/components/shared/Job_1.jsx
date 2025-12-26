import React from 'react';
import SearchBar from './SearchBar';
const Job_1 = () => {
  return (
    <div className="text-center py-8">
      <h1 className="text-4xl font-bold">
        <span className="text-blue-600">Unlock</span> Ambition
      </h1>
      <p className="text-lg text-gray-600 mt-2">
      Discover endless opportunities & shape your future with top companies!
      </p>
      <SearchBar />
    </div>
  );
};

export default Job_1;