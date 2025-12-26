// GoToBottomButton.js
import React from 'react';

const Gotobtm = () => {
  const handleScrollToBottom = () => {
    window.scrollTo({ top: document.documentElement.scrollHeight, behavior: 'smooth' });
  };

  return (
    <div className="fixed bottom-5 right-5">
      <button
        onClick={handleScrollToBottom}
        className="px-4 py-2 bg-blue-500 text-white rounded-md shadow-md hover:bg-blue-600 text-xl"
      >
        ↓
      </button>
    </div>
  );
};

export default Gotobtm;