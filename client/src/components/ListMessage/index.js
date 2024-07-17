import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import moment from "moment";
const index = ({ messages }) => {
    return (_jsx("div", { className: "border border-black w-44 min-h-64 max-h-64 overflow-auto p-1 text-xs bg-orange-100", children: messages.length === 0 ? (_jsx("div", { className: "flex items-center justify-center h-full min-h-56 text-xl", children: "\u0E44\u0E21\u0E48\u0E21\u0E35\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21" })) : (messages.map((msg) => (_jsxs("div", { className: "border border-b border-black p-2  my-1 text-xs space-y-1 bg-white", children: [_jsxs("div", { className: "font-semibold flex space-x-1", children: [_jsx("div", { className: "first-letter:uppercase", children: msg.sender.firstName }), " ", _jsx("div", { className: "first-letter:uppercase", children: msg.sender.lastName })] }), _jsxs("div", { className: "border border-black", children: [_jsxs("div", { className: "p-1 border-b border-black", children: ["\u0E40\u0E23\u0E37\u0E48\u0E2D\u0E07 : ", msg.topic] }), _jsx("div", { className: "p-1", children: msg.content })] }), _jsxs("div", { className: "text-xs", children: [_jsx("div", { children: "\u0E40\u0E21\u0E37\u0E48\u0E2D\u0E27\u0E31\u0E19\u0E17\u0E35\u0E48 " }), moment(msg.createdAt).format("YYYY-MM-DD HH:mm")] })] })))) }));
};
export default index;
