const lists = [
  { id: "1", name: "come", title: "มาทำงาน", color: "bg-[#008000]" },
  { id: "2", name: "notcome", title: "หยุด", color: "bg-[#808080]" },
  { id: "3", name: "leave", title: "ลา", color: "bg-[#FF0000]" },
  { id: "4", name: "ot", title: "OT", color: "bg-[#38BDF8]" },
  { id: "5", name: "perdiem", title: "Perdiem", color: "bg-[#0044FF]" },
  { id: "6", name: "perdiemOT", title: "OT+Perdiem", color: "bg-[#E100FF]" },
];

const index = () => {
  return (
    <div className="">
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
