/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useState } from "react";
import useKeepEmployeeStore from "../../../context/KeepEmployeeProvider";
import useEmployeeStore from "../../../context/EmployeeProvider";
import {
  deleteMessage,
  receiveMessage,
  sendMessage,
} from "../../../services/messageServices";
import Swal from "sweetalert2";

const index = () => {
  const { keepEmployee } = useKeepEmployeeStore();
  const { employee } = useEmployeeStore();
  useEffect(() => {
    const fetchData = async () => {
      console.log("employeeId", employee.id);
      console.log("receivedId", keepEmployee.id);

      const { data } = await receiveMessage(employee.id, keepEmployee.id);
      console.log("message", data);

      setMessages(data);
    };
    fetchData();
  }, [employee.id, keepEmployee.id]);
  const [formData, setFormData] = useState({
    senderId: "",
    receivedId: "",
    content: "",
    topic: "",
  });

  const [messages, setMessages] = useState<any>([]);

  const addMessage = async () => {
    const message: any = await sendMessage({
      topic: formData.topic,
      content: formData.content,
      senderId: employee.id,
      receivedId: keepEmployee.id,
    });

    setMessages((msg: any) => [message.data, ...msg]);
    setFormData({
      senderId: "",
      receivedId: "",
      content: "",
      topic: "",
    });
  };
  const handleChange = (e: any) => {
    console.log(e.target);

    const { name, value } = e.target;

    setFormData((prevState: any) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const handleDeleteMessage = async (messageId: any) => {
    const result = await Swal.fire({
      title: "ลบข้อความ",
      text: "ต้องการลบข้อความหรือไม่",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "ลบ",
    });

    if (result.isConfirmed) {
      Swal.fire({
        title: "ลบข้อความเสร็จสิ้น!",
        text: "ข้อความถูกลบแล้ว",
        icon: "success",
      });
      const { data } = await deleteMessage({ messageId });
      console.log("messageId", messageId);

      console.log(data);

      // setMessages(data);
    }
  };
  return (
    <div className="mt-5 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 ">
      <div className="w-64 h-full border flex flex-col items-center text-center">
        <div className="w-full">
          <input
            value={formData.topic}
            name="topic"
            onChange={handleChange}
            placeholder="เรื่อง"
            className="bg-gray-200 focus:bg-white border border-gray-300  w-full p-1"
          />
        </div>
        <div className="pt-2 w-full h-full">
          <textarea
            value={formData.content}
            name="content"
            onChange={handleChange}
            className="resize-none bg-gray-200 focus:bg-white border border-gray-300 rounded p-1 block w-full h-full"
            placeholder="กรอกข้อความ"
            rows={4}
          ></textarea>
        </div>
        <div
          onClick={addMessage}
          className="cursor-pointer hover:bg-green-700 w-full bg-green-500 flex items-center justify-center"
        >
          <p className="font-bold">เพิ่มข้อความ</p>
        </div>
      </div>
      {messages.map((message: any) => (
        <div className="w-64 border flex flex-col items-center text-center bg-slate-100 min-h-40">
          <div className="w-full p-1 border-b-2 text-left">
            {message.topic}
            {/* <input
              placeholder="เรื่อง"
              className="bg-gray-200 focus:bg-white border border-gray-300  w-full p-1"
            /> */}
          </div>
          <div className="mt-2 h-full w-full p-1 text-left">
            {message.content}
            {/* <textarea
              className="resize-none bg-gray-200 focus:bg-white border border-gray-300 rounded p-1 block w-full"
              placeholder="กรอกข้อความ"
              rows={4}
            ></textarea> */}
          </div>
          <div className=" w-full grid grid-cols-2">
            <div className="cursor-pointer  hover:bg-green-700 bg-green-500 mt-5 flex items-center justify-center">
              <p className="font-bold">แก้ไข</p>
            </div>
            <div
              onClick={() => handleDeleteMessage(message.id)}
              className="cursor-pointer  hover:bg-red-700 bg-red-500 mt-5 flex items-center justify-center"
            >
              <p className="font-bold">ลบ</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default index;
