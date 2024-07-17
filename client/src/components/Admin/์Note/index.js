import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from "react";
import useKeepEmployeeStore from "../../../context/KeepEmployeeProvider";
import useEmployeeStore from "../../../context/EmployeeProvider";
import { deleteMessage, receiveMessage, sendMessage, updateMessage, } from "../../../services/messageServices";
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
    const [messages, setMessages] = useState([]);
    const addMessage = async () => {
        const message = await sendMessage({
            topic: formData.topic,
            content: formData.content,
            senderId: employee.id,
            receivedId: keepEmployee.id,
        });
        setMessages((msg) => [message.data, ...msg]);
        setFormData({
            senderId: "",
            receivedId: "",
            content: "",
            topic: "",
        });
    };
    const handleChange = (e) => {
        console.log(e.target);
        const { name, value } = e.target;
        setFormData((prevState) => ({
            ...prevState,
            [name]: value,
        }));
    };
    const handleDeleteMessage = async (messageId) => {
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
            const { data } = await deleteMessage({
                messageId,
            });
            const updateData = messages.filter((msg) => msg.id !== data.id);
            setMessages(updateData);
        }
    };
    const [editId, setEditId] = useState(null);
    const startEdit = (id, topic, content) => {
        setEditId(id);
        setEditedTopic(topic);
        setEditedContent(content);
    };
    const saveEdit = async (id) => {
        const { data } = await updateMessage({
            messageId: id,
            topic: editedTopic,
            content: editedContent,
        });
        console.log(data);
        const updateData = messages.map((msg) => {
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
    };
    const cancel = () => {
        setEditId(null);
    };
    const [editedTopic, setEditedTopic] = useState();
    const [editedContent, setEditedContent] = useState();
    return (_jsxs("div", { className: "mt-5 grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4 ", children: [_jsxs("div", { className: "h-full border flex flex-col items-center text-center", children: [_jsx("div", { className: "w-full", children: _jsx("input", { value: formData.topic, name: "topic", onChange: handleChange, placeholder: "\u0E40\u0E23\u0E37\u0E48\u0E2D\u0E07", className: "bg-gray-200 focus:bg-white border border-gray-300  w-full p-1" }) }), _jsx("div", { className: "pt-2 w-full h-full", children: _jsx("textarea", { value: formData.content, name: "content", onChange: handleChange, className: "resize-none bg-gray-200 focus:bg-white border border-gray-300 rounded p-1 block w-full h-full", placeholder: "\u0E01\u0E23\u0E2D\u0E01\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21", rows: 4 }) }), _jsx("div", { onClick: addMessage, className: "cursor-pointer hover:bg-green-700 w-full bg-green-500 flex items-center justify-center", children: _jsx("p", { className: "font-bold", children: "\u0E40\u0E1E\u0E34\u0E48\u0E21\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21" }) })] }), messages.map((message) => (_jsxs("div", { className: "border flex flex-col items-center text-center bg-slate-100 min-h-40", children: [_jsx("div", { className: "w-full p-1 border-b-2 text-left", children: editId === message.id ? (_jsx("input", { value: editedTopic, onChange: (e) => setEditedTopic(e.target.value), placeholder: "\u0E40\u0E23\u0E37\u0E48\u0E2D\u0E07", className: "bg-gray-200 focus:bg-white border border-gray-300  w-full p-1" })) : (_jsx(_Fragment, { children: message.topic })) }), _jsx("div", { className: "mt-2 h-full w-full p-1 text-left", children: editId === message.id ? (_jsx("textarea", { value: editedContent, onChange: (e) => setEditedContent(e.target.value), className: "resize-none bg-gray-200 focus:bg-white border border-gray-300 rounded p-1 block w-full", placeholder: "\u0E01\u0E23\u0E2D\u0E01\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21", rows: 4 })) : (_jsxs(_Fragment, { children: [" ", message.content] })) }), _jsxs("div", { className: " w-full grid grid-cols-2", children: [!(editId === message.id) ? (_jsx("div", { onClick: () => startEdit(message.id, message.topic, message.content), className: "cursor-pointer border border-black  hover:bg-green-700 bg-green-500 mt-5 flex items-center justify-center", children: _jsx("p", { className: "font-bold", children: "\u0E41\u0E01\u0E49\u0E44\u0E02" }) })) : (_jsx("div", { onClick: () => saveEdit(message.id), className: "cursor-pointer border border-black  hover:bg-green-700 bg-green-500 mt-5 flex items-center justify-center", children: _jsx("p", { className: "font-bold", children: "\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01" }) })), !(editId === message.id) ? (_jsx("div", { onClick: () => handleDeleteMessage(message.id), className: "cursor-pointer border border-black hover:bg-red-700 bg-red-500 mt-5 flex items-center justify-center", children: _jsx("p", { className: "font-bold", children: "\u0E25\u0E1A" }) })) : (_jsx("div", { onClick: () => cancel(), className: "cursor-pointer border border-black hover:bg-red-700 bg-red-500 mt-5 flex items-center justify-center", children: _jsx("p", { className: "font-bold", children: "\u0E22\u0E01\u0E40\u0E25\u0E34\u0E01" }) }))] })] })))] }));
};
export default index;
