
import React from "react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="flex gap-5 justify-center items-center mt-12 h-screen">
      <Link
        to="/form"
        className="w-60 h-60 flex flex-col items-center justify-center bg-gray-200 rounded-lg shadow-md cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-gray-600 mb-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 12h6m2 0a2 2 0 100-4H7a2 2 0 100 4zm0 0v6m0-6H7m0 0v6m0-6h6"
          />
        </svg>
        Go to Form
      </Link>
      
      <Link
        to="/status"
        className="w-60 h-60 flex flex-col items-center justify-center bg-gray-200 rounded-lg shadow-md cursor-pointer"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-12 w-12 text-gray-600 mb-2"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={2}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13 16h-1v-4h-1m1 4h1m-1-4h1m-1 0h-1m6 8H5a2 2 0 01-2-2V7a2 2 0 012-2h14a2 2 0 012 2v10a2 2 0 01-2 2z"
          />
        </svg>
        Check Status
      </Link>
    </div>
  );
};

export default Index;
