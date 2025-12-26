import React from 'react';

const RadioDropdown = ({ title, name, options, selected, onChange }) => {
  return (
    <div className="w-64 bg-white p-4 border border-gray-200 rounded-lg shadow-md">
      <h3 className="font-semibold text-lg mb-2">{title}</h3>
      {options.map((option, index) => (
        <label key={index} className="block mb-1">
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={selected === option.value}
            onChange={() => onChange(option.value)}
            className="mr-2"
          />
          {option.label}
        </label>
      ))}
    </div>
  );
};

export default RadioDropdown;
