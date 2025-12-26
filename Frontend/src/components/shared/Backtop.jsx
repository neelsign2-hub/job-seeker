// GoToTopButton.js
import React from "react";

const Backtop = () => {
  const handleScrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <div className="fixed bottom-5 left-5">
      <button
        onClick={handleScrollToTop}
        className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 text-xl"
      >
        ↑
      </button>
    </div>
  );
};

export default Backtop;



