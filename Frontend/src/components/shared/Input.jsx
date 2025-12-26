import React from "react";

const Input = (props) => {
  return (
    <div>
      <div className="relative my-3">
        <input
          type={props.type}
          value={props.value}
          name={props.name}
          onChange={props.onChange}
          id="floating_outlined"
          className="block shadow-md px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-transparent rounded-lg border border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
          placeholder=" "
          required
          disabled={props?.disabled}
        />
        <label
          htmlFor="floating_outlined"
          className="absolute text-sm mx-2 text-gray-500 duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0] bg-white px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4"
        >
          {props.lablename}
        </label>
      </div>
    </div>
  );
};

export default Input;
