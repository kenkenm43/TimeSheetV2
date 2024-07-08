/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from "react";
import useKeepEmployeeStore from "../../../context/KeepEmployeeProvider";
import useEmployeeStore from "../../../context/EmployeeProvider";

const index = () => {
  const { keepEmployee } = useKeepEmployeeStore();
  const { employee } = useEmployeeStore();
  const [messages, setMessages] = useState(["12", "awd", "123", "da", "as"]);
  return (
    <div className="mt-5 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ">
      <div className="w-64 h-full border flex flex-col items-center text-center">
        <div className="w-full">
          <input
            placeholder="เรื่อง"
            className="bg-gray-200 focus:bg-white border border-gray-300  w-full p-1"
          />
        </div>
        <div className="mt-2 w-full">
          <textarea
            className="resize-none bg-gray-200 focus:bg-white border border-gray-300 rounded p-1 block w-full"
            placeholder="กรอกข้อความ"
            rows={4}
          ></textarea>
        </div>
        <div className="cursor-pointer  hover:bg-green-700 w-full bg-green-500 flex items-center justify-center">
          <p className="font-bold">เพิ่มข้อความ</p>
        </div>
      </div>
      {messages.map((message: any) => (
        <div className="w-64 border flex flex-col items-center text-center">
          <div className="w-full">
            <input
              placeholder="เรื่อง"
              className="bg-gray-200 focus:bg-white border border-gray-300  w-full p-1"
            />
          </div>
          <div className="mt-2 w-full">
            <textarea
              className="resize-none bg-gray-200 focus:bg-white border border-gray-300 rounded p-1 block w-full"
              placeholder="กรอกข้อความ"
              rows={4}
            ></textarea>
          </div>
          <div className="cursor-pointer  hover:bg-green-700 w-full bg-green-500 mt-5 flex items-center justify-center">
            <p className="font-bold">เพิ่มข้อความ</p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default index;
