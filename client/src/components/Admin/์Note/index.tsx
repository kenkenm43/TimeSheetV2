/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from "react";
import useKeepEmployeeStore from "../../../context/KeepEmployeeProvider";
import useEmployeeStore from "../../../context/EmployeeProvider";
import {
  deleteMessage,
  receiveMessage,
  sendMessage,
  updateMessage,
} from "../../../services/messageServices";
import Swal from "sweetalert2";
import Loading from "../../Loading";

const index = () => {
  const { keepEmployee } = useKeepEmployeeStore();
  const { employee } = useEmployeeStore();
  const [isLoading, setIsLoading] = useState(false);
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
    setIsLoading(true);
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
    setIsLoading(false);
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
      setIsLoading(true);
      Swal.fire({
        title: "ลบข้อความเสร็จสิ้น!",
        text: "ข้อความถูกลบแล้ว",
        icon: "success",
      });
      const { data } = await deleteMessage({
        messageId,
      });

      const updateData = messages.filter((msg: any) => msg.id !== data.id);

      setMessages(updateData);

      setIsLoading(false);
    }
  };
  const [editId, setEditId] = useState(null);
  const startEdit = (id: any, topic: any, content: any) => {
    setEditId(id);
    setEditedTopic(topic);
    setEditedContent(content);
  };
  const saveEdit = async (id: any) => {
    setIsLoading(true);
    const { data } = await updateMessage({
      messageId: id,
      topic: editedTopic,
      content: editedContent,
    });
    console.log(data);

    const updateData = messages.map((msg: any) => {
      if (id === msg.id) {
        return { ...msg, topic: data.topic, content: data.content };
      }
      return msg;
    });

    await Swal.fire({
      title: "แก้ไขข้อมูลเรียบร้อย",
      text: "ทำการแก้ไขเรียบร้อย",
      icon: "success",
      confirmButtonColor: "#30d630",
      confirmButtonText: "ok",
    });

    setMessages(updateData);
    setEditedContent("");
    setEditedTopic("");
    setEditId(null);
    setIsLoading(false);
  };
  const cancel = () => {
    setEditId(null);
  };
  const [editedTopic, setEditedTopic] = useState<any>();
  const [editedContent, setEditedContent] = useState<any>();
  return (
    <div className="mt-5 grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 ">
      {isLoading && <Loading />}
      <div className="h-full border flex flex-col items-center text-center">
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
        <div className="border flex flex-col items-center text-center bg-slate-100 min-h-40">
          <div className="w-full p-1 border-b-2 text-left">
            {editId === message.id ? (
              <input
                value={editedTopic}
                onChange={(e: any) => setEditedTopic(e.target.value)}
                placeholder="เรื่อง"
                className="bg-gray-200 focus:bg-white border border-gray-300  w-full p-1"
              />
            ) : (
              <>{message.topic}</>
            )}
          </div>
          <div className="mt-2 h-full w-full p-1 text-left">
            {editId === message.id ? (
              <textarea
                value={editedContent}
                onChange={(e: any) => setEditedContent(e.target.value)}
                className="resize-none bg-gray-200 focus:bg-white border border-gray-300 rounded p-1 block w-full"
                placeholder="กรอกข้อความ"
                rows={4}
              ></textarea>
            ) : (
              <> {message.content}</>
            )}
          </div>
          <div className=" w-full grid grid-cols-2">
            {!(editId === message.id) ? (
              <div
                onClick={() =>
                  startEdit(message.id, message.topic, message.content)
                }
                className="cursor-pointer border border-black  hover:bg-green-700 bg-green-500 mt-5 flex items-center justify-center"
              >
                <p className="font-bold">แก้ไข</p>
              </div>
            ) : (
              <div
                onClick={() => saveEdit(message.id)}
                className="cursor-pointer border border-black  hover:bg-green-700 bg-green-500 mt-5 flex items-center justify-center"
              >
                <p className="font-bold">บันทึก</p>
              </div>
            )}
            {!(editId === message.id) ? (
              <div
                onClick={() => handleDeleteMessage(message.id)}
                className="cursor-pointer border border-black hover:bg-red-700 bg-red-500 mt-5 flex items-center justify-center"
              >
                <p className="font-bold">ลบ</p>
              </div>
            ) : (
              <div
                onClick={() => cancel()}
                className="cursor-pointer border border-black hover:bg-red-700 bg-red-500 mt-5 flex items-center justify-center"
              >
                <p className="font-bold">ยกเลิก</p>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
};

export default index;
