import React from "react";

const save = () => {
  return (
    <div className="w-full h-full fixed top-0 left-0 bg-white opacity-75 z-[5000]">
      <div className="flex justify-center items-center mt-[50vh]">
        <div
          aria-label="Loading..."
          role="status"
          className="flex items-center space-x-2"
        >
          <span className="text-4xl font-medium text-gray-500 flex">
            กำลังบันทึกข้อมูล
            <div className="flex space-x-2 justify-center items-center bg-white">
              <span className="sr-only">กำลังบันทึกข้อมูล...</span>
              <div className="h-8 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.3s]"></div>
              <div className="h-8 w-8 bg-black rounded-full animate-bounce [animation-delay:-0.15s]"></div>
              <div className="h-8 w-8 bg-black rounded-full animate-bounce"></div>
            </div>
          </span>
        </div>
      </div>
    </div>
  );
};

export default save;
