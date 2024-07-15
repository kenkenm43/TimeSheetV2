/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import moment from "moment";
import useEmployeeStore from "../../context/EmployeeProvider";

const index = ({ messages }: any) => {
  const { employee } = useEmployeeStore();
  return (
    <div className="border border-black w-44 min-h-64 max-h-64 overflow-auto p-1 text-xs bg-orange-100">
      {messages.length === 0 ? (
        <div className="flex items-center justify-center h-full min-h-56 text-xl">
          ไม่มีข้อความ
        </div>
      ) : (
        messages.map((msg: any) => (
          <div className="border border-b border-black p-2  my-1 text-xs space-y-1 bg-white">
            <div className="font-semibold flex space-x-1">
              <div className="first-letter:uppercase">
                {msg.sender.firstName}
              </div>{" "}
              <div className="first-letter:uppercase">
                {msg.sender.lastName}
              </div>
            </div>
            <div className="border border-black">
              <div className="p-1 border-b border-black">
                เรื่อง : {msg.topic}
              </div>
              <div className="p-1">{msg.content}</div>
            </div>
            <div className="text-xs">
              <div>เมื่อวันที่ </div>
              {moment(msg.createdAt).format("YYYY-MM-DD HH:mm")}
            </div>
          </div>
        ))
      )}
    </div>
  );
};

export default index;
