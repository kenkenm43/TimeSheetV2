import React from "react";

const lists = [
  { id: "1", name: "come", title: "มาทำงาน", color: "#22c55e" },
  { id: "2", name: "notcome", title: "ไม่มาทำงาน", color: "#9ca3af" },
  { id: "3", name: "leave", title: "หยุด", color: "#fda4af" },
  { id: "4", name: "ot", title: "OT", color: "#38bdf8" },
  { id: "5", name: "perdiem", title: "Perdiem", color: "#1d4ed8" },
  { id: "6", name: "perdiemOT", title: "OT+Perdiem", color: "#c026d3" },
];

const index = () => {
  return (
    <div className="absolute top-32 left-5 flex flex-col w-40 justify-center">
      {lists.map((list) => (
        <div className="flex items-center space-x-2 space-y-4">
          <div
            className={`w-[30px] h-[30px] bg-[${list.color}] border-2 border-black`}
          ></div>
          <div className="pb-3 mb-2">{list.title}</div>
        </div>
      ))}
    </div>
  );
};

export default index;
