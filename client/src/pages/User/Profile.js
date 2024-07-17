import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import useEmployeeStore from "../../context/EmployeeProvider";
import { getEmployee, updateEmployee, uploadImage, } from "../../services/employeeServices";
import { FaRegEdit, FaEdit, FaRegSave, FaInfoCircle } from "react-icons/fa";
import { Button, DatePicker, Input, Modal } from "rsuite";
import moment from "moment";
import { IoMdPerson } from "react-icons/io";
import Swal from "sweetalert2";
const Profile = () => {
    const { employee, setEmployee } = useEmployeeStore();
    const [isEditable, setIsEditable] = useState();
    const [isOpenModal, setIsOpenModal] = useState();
    const [isEditName, setIsEditName] = useState(false);
    const [isChangeImg, setIsChangeImg] = useState(false);
    const [state, setState] = useState("about");
    const [formData, setFormData] = useState({
        firstName: employee.firstName,
        lastName: employee.lastName,
        nickName: employee.nickName,
        idCard: employee.idCard,
        gender: employee.gender,
        address: employee.address,
        date_of_birth: employee.date_of_birth,
        phone_number: employee.phone_number,
        email: employee.email,
        bank_name: employee.Financial_Details?.bank_name,
        bank_account_number: employee.Financial_Details?.bank_account_number,
        social_security_number: employee.Financial_Details?.social_security_number,
    });
    const handleChange = (value, e) => {
        const { name } = e.target;
        console.log(name, value);
        setFormData((prevState) => ({ ...prevState, [name]: value }));
    };
    const handleDateChange = (date) => {
        setFormData((prevState) => ({
            ...prevState,
            date_of_birth: date,
        }));
    };
    useEffect(() => {
        const fetchData = async () => {
            const employeeData = await getEmployee(employee.id);
            console.log(employeeData.data);
            setEmployee(employeeData.data);
        };
        fetchData();
    }, [employee.id]);
    const handleUpdateProfile = async (employeeId) => {
        try {
            const employee = await updateEmployee(formData, employeeId);
            console.log(employee);
            setEmployee(employee.data);
            Swal.fire({
                title: "Success!",
                text: "อัพเดตข้อมูลเสร็จสิ้น",
                icon: "success",
                confirmButtonText: "OK",
            });
        }
        catch (error) {
            Swal.fire({
                title: "ไม่สำเร็จ",
                text: `${error}`,
                icon: "error",
                confirmButtonText: "OK",
            });
        }
        finally {
            setIsOpenModal(false);
            setIsEditable(false);
            setIsEditName(false);
        }
    };
    console.log(employee);
    const handleClose = async () => {
        setFormData((formData) => {
            formData;
        });
        setIsOpenModal(false);
        setIsEditable(false);
        setIsEditName(false);
    };
    const handleEditName = () => {
        setIsEditName(true);
    };
    function formatPhoneNumber(phoneNumberString) {
        // Add dashes to the phone number
        const formatted = phoneNumberString.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
        return formatted;
    }
    const [previewUrl, setPreviewUrl] = useState(null);
    const [selectedFile, setSelectedFile] = useState(null);
    const fileUploadRef = useRef(null);
    const handleImageUpload = (event) => {
        event.preventDefault();
        setIsChangeImg(true);
        fileUploadRef.current.click();
    };
    const uploadImageDisplay = async (event) => {
        if (event.target.files.length > 0) {
            const file = fileUploadRef.current.files[0];
            console.log("file", file);
            setSelectedFile(file);
            // Preview image
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        }
        else {
            console.log("File selection canceled.");
        }
    };
    const handleConfirmUpload = async () => {
        try {
            const formData = new FormData();
            formData.append("file", selectedFile);
            formData.append("oldImage", String(employee.photo));
            const response = await uploadImage(formData, employee.id);
            Swal.fire({
                title: "Success!",
                text: "อัพโหลดไฟล์เสร็จสิ้น",
                icon: "success",
                confirmButtonText: "OK",
            });
            setPreviewUrl(null);
            setIsChangeImg(false);
            setEmployee({ employee, photo: response.data.fileUrl });
        }
        catch (error) {
            Swal?.fire({
                title: "Error!",
                text: error,
                icon: "error",
                confirmButtonText: "Cool",
            });
            setIsChangeImg(false);
            setPreviewUrl(null);
        }
    };
    return (_jsxs("div", { className: "flex max-w-7xl w-full mt-10 px-10", children: [_jsxs("div", { className: "flex flex-col items-center md:w-64 md:h-64 h-32 w-32 relative", children: [previewUrl ? (_jsx("div", { className: "md:w-64 md:h-64 h-32 w-32 flex items-center justify-center border", children: _jsx("img", { className: "md:w-64 md:h-64 h-32 w-32 object-cover", src: previewUrl, alt: "Preview" }) })) : (_jsx(_Fragment, { children: employee.photo ? (_jsx("div", { className: "md:w-64 md:h-64 h-32 w-32 flex items-center justify-center border", children: _jsx("img", { className: "md:w-64 md:h-64 h-32 w-32 object-cover", src: `http://localhost:8081/${employee.photo}`, alt: "img" }) })) : (_jsx("div", { className: "md:w-64 md:h-64 h-32 w-32 flex items-center justify-center border", children: _jsx("img", { className: "md:w-64 md:h-64 h-32 w-32 object-cover", src: "https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2247726673.jpg", alt: "img" }) })) })), _jsx("input", { type: "file", accept: "image/png, image/jpeg", hidden: true, ref: fileUploadRef, onChange: uploadImageDisplay }), _jsx("div", { className: "absolute right-0 opacity-70 hover:opacity-100 cursor-pointer", onClick: handleImageUpload, children: _jsx(FaEdit, { size: 30 }) }), _jsx("div", {}), isChangeImg && (_jsxs("div", { className: "flex space-x-5", children: [_jsx("button", { onClick: () => handleConfirmUpload(), className: "bg-green-500 text-white font-bold py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition ease-in-out duration-300", children: "\u0E1A\u0E31\u0E19\u0E17\u0E36\u0E01" }), _jsx("button", { onClick: () => {
                                    setIsChangeImg(false);
                                    setPreviewUrl(null);
                                }, className: "bg-red-500 text-white font-bold py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition ease-in-out duration-300", children: "\u0E22\u0E01\u0E40\u0E25\u0E34\u0E01" })] }))] }), _jsxs(Modal, { className: "pt-64", open: isOpenModal, onClose: () => handleClose(), backdrop: "static", keyboard: false, size: "sm", children: [_jsx(Modal.Header, { children: _jsx(Modal.Title, { children: "\u0E15\u0E49\u0E2D\u0E07\u0E01\u0E32\u0E23\u0E41\u0E01\u0E49\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25\u0E43\u0E0A\u0E48\u0E2B\u0E23\u0E37\u0E2D\u0E44\u0E21\u0E48" }) }), _jsxs(Modal.Footer, { children: [_jsx(Button, { onClick: () => handleUpdateProfile(employee.id), appearance: "primary", children: "Ok" }), _jsx(Button, { onClick: () => handleClose(), appearance: "subtle", children: "Cancel" })] })] }), _jsxs("div", { className: "mx-14 w-full", children: [_jsx("div", { className: "flex items-center text-2xl font-bold relative h-16", children: !isEditName ? (_jsxs(_Fragment, { children: [_jsx("div", { className: "first-letter:uppercase", children: employee.firstName || "-" }), " ", _jsx("div", { className: "ml-5 first-letter:uppercase", children: employee.lastName || "-" }), _jsxs("div", { className: "ml-5 first-letter:uppercase", children: ["(", employee.nickName || "-", ")"] }), _jsx("div", { className: "absolute right-0 opacity-30 hover:opacity-75 cursor-pointer", onClick: handleEditName, children: _jsx(FaRegEdit, {}) })] })) : (_jsxs("div", { className: "flex space-x-4", children: [_jsx(Input, { placeholder: "\u0E0A\u0E37\u0E48\u0E2D\u0E08\u0E23\u0E34\u0E07", 
                                    // style={inputStyle}
                                    classPrefix: "input", className: "min-w-56 max-w-56", name: "firstName", defaultValue: employee.firstName, value: formData.firstName, onChange: handleChange }), _jsx(Input, { placeholder: "\u0E19\u0E32\u0E21\u0E2A\u0E01\u0E38\u0E25", className: "min-w-56 max-w-56", name: "lastName", defaultValue: employee.lastName, value: formData.lastName, onChange: handleChange }), _jsx(Input, { placeholder: "\u0E0A\u0E37\u0E48\u0E2D\u0E40\u0E25\u0E48\u0E19", name: "nickName", className: "min-w-56 max-w-56", defaultValue: employee.nickName, value: formData.nickName, onChange: handleChange }), _jsx("div", { className: "absolute right-0 opacity-30 hover:opacity-75 cursor-pointer", onClick: () => setIsOpenModal(true), children: _jsx(FaRegSave, { size: 30 }) })] })) }), _jsxs("div", { className: "relative flex space-x-3 text-xl font-semibold mt-9 border-b-2 w-full ", children: [_jsxs("div", { className: `flex items-center w-32 p-1  transition-all  duration-300 ease-in-out cursor-pointer hover:transition-all hover:bg-slate-200 ${state === "about" ? "border-b-4 border-blue-600 " : ""}`, onClick: () => setState("about"), children: [_jsx(IoMdPerson, {}), " ", _jsx("span", { className: "ml-2", children: "\u0E40\u0E01\u0E35\u0E48\u0E22\u0E27\u0E01\u0E31\u0E1A" })] }), _jsxs("div", { className: `flex items-center w-32 p-1 transition-all  duration-300 ease-in-out cursor-pointer hover:transition-all hover:bg-slate-200 ${state === "general" ? "border-b-4 border-blue-600" : ""}`, onClick: () => setState("general"), children: [_jsx(FaInfoCircle, {}), " ", _jsx("span", { className: "ml-2", children: "\u0E02\u0E49\u0E2D\u0E21\u0E39\u0E25" })] })] }), _jsxs("form", { className: "relative mt-9", children: [state === "general" ? (_jsxs("div", { className: "flex", children: [_jsxs("div", { className: " space-y-5 font-bold", children: [_jsx("div", { children: "\u0E18\u0E19\u0E32\u0E04\u0E32\u0E23:" }), _jsx("div", { children: "\u0E40\u0E25\u0E02\u0E17\u0E35\u0E48\u0E1A\u0E31\u0E0D\u0E0A\u0E35:" }), _jsx("div", { children: "\u0E40\u0E25\u0E02\u0E1B\u0E23\u0E30\u0E01\u0E31\u0E19\u0E2A\u0E31\u0E07\u0E04\u0E21:" })] }), !isEditable ? (_jsxs("div", { className: "w-96 pl-5 space-y-5", children: [_jsx("div", { children: employee.Financial_Details?.bank_name || "-" }), _jsx("div", { children: _jsx("div", { children: employee.Financial_Details?.bank_account_number || "-" }) }), _jsx("div", { children: employee.Financial_Details?.social_security_number || "-" })] })) : (_jsxs("div", { className: "flex flex-col w-96 ml-2 space-y-2", children: [_jsx(Input, { name: "bank_name", value: formData.bank_name, onChange: handleChange }), _jsx(Input, { name: "bank_account_number", value: formData.bank_account_number, onChange: handleChange }), _jsx(Input, { name: "social_security_number", value: formData.social_security_number, onChange: handleChange })] }))] })) : state === "about" ? (_jsxs("div", { className: "flex", children: [_jsxs("div", { className: " space-y-5 font-bold", children: [_jsx("div", { children: "\u0E40\u0E25\u0E02\u0E1A\u0E31\u0E15\u0E23\u0E1B\u0E23\u0E30\u0E0A\u0E32\u0E0A\u0E19:" }), _jsx("div", { children: "\u0E27\u0E31\u0E19\u0E40\u0E01\u0E34\u0E14:" }), _jsx("div", { children: "\u0E40\u0E1A\u0E2D\u0E23\u0E4C\u0E42\u0E17\u0E23\u0E28\u0E31\u0E1E\u0E17\u0E4C:" }), _jsx("div", { children: "\u0E2D\u0E35\u0E40\u0E21\u0E25:" }), _jsx("div", { children: "\u0E17\u0E35\u0E48\u0E2D\u0E22\u0E39\u0E48:" })] }), !isEditable ? (_jsxs("div", { className: "w-96 pl-5 space-y-5", children: [_jsx("div", { children: employee.idCard || "-" }), _jsx("div", { children: employee.date_of_birth
                                                    ? moment(employee.date_of_birth).format("yyyy-MM-DD")
                                                    : "-" }), _jsx("div", { children: employee.phone_number
                                                    ? formatPhoneNumber(employee.phone_number)
                                                    : "-" }), _jsx("div", { children: employee.email || "-" }), _jsx("div", { children: employee.address || "-" })] })) : (_jsxs("div", { className: "flex flex-col w-96 ml-2 space-y-2", children: [_jsx(Input, { name: "idCard", value: formData.idCard, onChange: handleChange }), _jsx(DatePicker, { name: "dob", value: new Date(moment(formData.date_of_birth).format("YYYY-MM-DD")), format: "yyyy-MM-dd", onChange: handleDateChange }), _jsx(Input, { name: "phone_number", value: formData.phone_number, onChange: handleChange }), _jsx(Input, { name: "email", value: formData.email, onChange: handleChange }), _jsx(Input, { name: "address", value: formData.address, onChange: handleChange })] }))] })) : (_jsx(_Fragment, {})), !isEditable ? (_jsx("div", { className: "absolute top-[-10px] right-0 opacity-30 hover:opacity-75 cursor-pointer", onClick: () => setIsEditable(true), children: _jsx(FaEdit, { size: 25 }) })) : (_jsx("div", { className: "absolute top-[-10px] right-0 opacity-30 hover:opacity-75 cursor-pointer", onClick: () => {
                                    setIsOpenModal(true);
                                }, children: _jsx(FaRegSave, { size: 30 }) }))] })] })] }));
};
export default Profile;
