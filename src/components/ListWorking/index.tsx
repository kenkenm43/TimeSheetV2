import React from "react";

const lists = [
  { id: "1", name: "come", title: "มาทำงาน", color: "bg-[#A9D0A9]" },
  { id: "2", name: "notcome", title: "หยุด", color: "bg-[#9ca3af]" },
  { id: "3", name: "leave", title: "ลา", color: "bg-[#fda4af]" },
  { id: "4", name: "ot", title: "OT", color: "bg-[#C3EBFD]" },
  { id: "5", name: "perdiem", title: "Perdiem", color: "bg-[#B7C9FD]" },
  { id: "6", name: "perdiemOT", title: "OT+Perdiem", color: "bg-[#ECBDF2]" },
];

const index = () => {
  return (
    <div className="absolute top-32 left-5 flex flex-col w-40 justify-center">
      {lists.map((list) => (
        <div className="flex items-center space-x-2 space-y-4">
          <div
            className={`w-[30px] h-[30px] ${list.color} border-2 border-black`}
          ></div>
          <div className="pb-3 mb-2">{list.title}</div>
        </div>
      ))}
    </div>
  );
};

export default index;
