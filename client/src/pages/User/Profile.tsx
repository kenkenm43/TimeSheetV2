/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useRef, useState } from "react";
import useEmployeeStore, {
  TEmployeeStoreState,
} from "../../context/EmployeeProvider";
import {
  getEmployee,
  updateEmployee,
  uploadImage,
} from "../../services/employeeServices";
import { FaRegEdit, FaEdit, FaRegSave, FaInfoCircle, FaCamera } from "react-icons/fa";
import { Button, DatePicker, Input, Modal } from "rsuite";
import moment from "moment";
import { IoMdPerson } from "react-icons/io";
import Swal from "sweetalert2";
import Loading from "../../components/Loading";

const Profile = () => {
  const { employee, setEmployee }: TEmployeeStoreState = useEmployeeStore();
  const [isEditable, setIsEditable] = useState<boolean>(false);
  const [isOpenModal, setIsOpenModal] = useState<boolean>(false);
  const [isEditName, setIsEditName] = useState<boolean>(false);
  const [isChangeImg, setIsChangeImg] = useState<boolean>(false);
  const [state, setState] = useState("about");
  const [isLoadingImage, setIsLoadingImage] = useState(false);
  const [formData, setFormData] = useState<any>({
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

  const handleChange = (value: string, e: any) => {
    const { name } = e.target;
    setFormData((prevState: any) => ({ ...prevState, [name]: value }));
  };

  const handleDateChange = (date: any) => {
    setFormData((prevState: any) => ({
      ...prevState,
      date_of_birth: date,
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      const employeeData = await getEmployee(employee.id);
      setEmployee(employeeData.data);
    };
    fetchData();
  }, [employee.id, setEmployee]);

  const handleUpdateProfile = async (employeeId: any) => {
    setIsLoadingImage(true);
    try {
      const updatedEmployee = await updateEmployee(formData, employeeId);
      setEmployee(updatedEmployee.data);
      Swal.fire({
        title: "Success!",
        text: "อัพเดตข้อมูลเสร็จสิ้น",
        icon: "success",
        confirmButtonText: "OK",
      });
    } catch (error) {
      Swal.fire({
        title: "ไม่สำเร็จ",
        text: `${error}`,
        icon: "error",
        confirmButtonText: "OK",
      });
    } finally {
      setIsOpenModal(false);
      setIsEditable(false);
      setIsEditName(false);
      setIsLoadingImage(false);
    }
  };

  const handleClose = async () => {
    // Reset formData to original employee data when cancelled
    setFormData({
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
    setIsOpenModal(false);
    setIsEditable(false);
    setIsEditName(false);
  };

  const handleEditName = () => {
    setIsEditName(true);
  };

  function formatPhoneNumber(phoneNumberString: any) {
    if (!phoneNumberString) return "-";
    return phoneNumberString.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
  }

  const [previewUrl, setPreviewUrl] = useState(null);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const fileUploadRef: any = useRef(null);

  const handleImageUpload = (event: any) => {
    event.preventDefault();
    setIsChangeImg(true);
    fileUploadRef.current.click();
  };

  const uploadImageDisplay = async (event: any) => {
    if (event.target.files.length > 0) {
      const file = fileUploadRef.current.files[0];
      setSelectedFile(file);
      const reader: any = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setIsChangeImg(false);
    }
  };

  const handleConfirmUpload = async () => {
    setIsLoadingImage(true);
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
      setEmployee({ ...employee, photo: response.data.fileUrl });
    } catch (error: any) {
      Swal?.fire({
        title: "Error!",
        text: error,
        icon: "error",
        confirmButtonText: "OK",
      });
      setIsChangeImg(false);
      setPreviewUrl(null);
    } finally {
      setIsLoadingImage(false);
    }
  };

  return (
    <div className="flex justify-center w-full min-h-screen bg-gray-50 py-10 px-4 sm:px-10 font-sans">
      {isLoadingImage && <Loading />}

      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden h-fit">
        {/* Profile Header Background */}
        <div className="h-32 bg-gradient-to-r from-blue-500 to-indigo-600 w-full"></div>

        <div className="px-8 pb-8 flex flex-col md:flex-row gap-8 relative -mt-16">
          {/* Avatar Section */}
          <div className="flex flex-col items-center shrink-0">
            <div className="relative">
              <img
                className="w-36 h-36 md:w-44 md:h-44 rounded-full border-4 border-white shadow-md object-cover bg-white"
                src={
                  previewUrl ||
                  employee.photo ||
                  "https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2247726673.jpg"
                }
                alt="Profile Avatar"
              />
              <input
                type="file"
                accept="image/png, image/jpeg"
                hidden
                ref={fileUploadRef}
                onChange={uploadImageDisplay}
              />
              <button
                className="absolute bottom-2 right-2 bg-gray-800 hover:bg-gray-900 text-white p-2.5 rounded-full shadow-lg transition-transform hover:scale-105"
                onClick={handleImageUpload}
                title="เปลี่ยนรูปโปรไฟล์"
              >
                <FaCamera size={18} />
              </button>
            </div>

            {isChangeImg && (
              <div className="mt-4 flex gap-2 w-full justify-center">
                <button
                  onClick={handleConfirmUpload}
                  className="bg-green-500 text-white text-sm font-medium py-1.5 px-4 rounded-lg hover:bg-green-600 transition"
                >
                  บันทึก
                </button>
                <button
                  onClick={() => {
                    setIsChangeImg(false);
                    setPreviewUrl(null);
                  }}
                  className="bg-red-500 text-white text-sm font-medium py-1.5 px-4 rounded-lg hover:bg-red-600 transition"
                >
                  ยกเลิก
                </button>
              </div>
            )}
          </div>

          {/* Details Section */}
          <div className="flex-1 pt-20 md:pt-16">
            {/* Name Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
              {!isEditName ? (
                <div className="group flex items-center gap-3">
                  <h1 className="text-2xl md:text-3xl font-extrabold text-gray-800 tracking-tight capitalize">
                    {employee.firstName || "-"} {employee.lastName || "-"}{" "}
                    <span className="text-gray-500 font-medium text-xl">
                      ({employee.nickName || "-"})
                    </span>
                  </h1>
                  <button
                    className="text-gray-400 hover:text-blue-600 transition-colors p-2 opacity-0 group-hover:opacity-100"
                    onClick={handleEditName}
                  >
                    <FaRegEdit size={22} />
                  </button>
                </div>
              ) : (
                <div className="flex flex-wrap items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-200">
                  <Input
                    placeholder="ชื่อจริง"
                    className="w-full sm:w-48"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                  <Input
                    placeholder="นามสกุล"
                    className="w-full sm:w-48"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                  <Input
                    placeholder="ชื่อเล่น"
                    className="w-full sm:w-32"
                    name="nickName"
                    value={formData.nickName}
                    onChange={handleChange}
                  />
                  <div className="flex gap-2 ml-auto">
                    <button
                      onClick={() => setIsOpenModal(true)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-blue-700 transition flex items-center gap-2"
                    >
                      <FaRegSave /> บันทึก
                    </button>
                    <button
                      onClick={handleClose}
                      className="bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium hover:bg-gray-300 transition"
                    >
                      ยกเลิก
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Tabs */}
            <div className="flex space-x-2 bg-gray-100 p-1 rounded-xl w-max mb-6">
              <button
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  state === "about"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-800"
                }`}
                onClick={() => setState("about")}
              >
                <IoMdPerson size={18} /> <span>ข้อมูลส่วนตัว</span>
              </button>
              <button
                className={`flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold transition-all duration-200 ${
                  state === "general"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-800"
                }`}
                onClick={() => setState("general")}
              >
                <FaInfoCircle size={18} /> <span>ข้อมูลทางการเงิน</span>
              </button>
            </div>

            {/* Data Form / View Area */}
            <div className="bg-gray-50 rounded-2xl p-6 md:p-8 border border-gray-100 relative">
              {/* Edit Toggle Button */}
              <div className="absolute top-6 right-6">
                {!isEditable ? (
                  <button
                    className="text-gray-400 hover:text-blue-600 transition flex items-center gap-2 text-sm font-medium"
                    onClick={() => setIsEditable(true)}
                  >
                    <FaEdit size={18} /> แก้ไขข้อมูล
                  </button>
                ) : (
                  <div className="flex gap-2">
                    <button
                      className="bg-blue-600 text-white px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-blue-700 transition flex items-center gap-2"
                      onClick={() => setIsOpenModal(true)}
                    >
                      <FaRegSave /> บันทึก
                    </button>
                    <button
                      className="bg-gray-200 text-gray-700 px-4 py-1.5 rounded-lg text-sm font-medium hover:bg-gray-300 transition"
                      onClick={handleClose}
                    >
                      ยกเลิก
                    </button>
                  </div>
                )}
              </div>

              {state === "about" ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12 mt-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-gray-500">เลขบัตรประชาชน</label>
                    {!isEditable ? (
                      <p className="text-gray-900 font-medium">{employee.idCard || "-"}</p>
                    ) : (
                      <Input name="idCard" value={formData.idCard} onChange={handleChange} />
                    )}
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-gray-500">วันเกิด</label>
                    {!isEditable ? (
                      <p className="text-gray-900 font-medium">
                        {employee.date_of_birth
                          ? moment(employee.date_of_birth).format("DD/MM/YYYY")
                          : "-"}
                      </p>
                    ) : (
                      <DatePicker
                        name="dob"
                        value={
                          formData.date_of_birth
                            ? new Date(moment(formData.date_of_birth).format("YYYY-MM-DD"))
                            : null
                        }
                        format="yyyy-MM-dd"
                        onChange={handleDateChange}
                        className="w-full"
                      />
                    )}
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-gray-500">เบอร์โทรศัพท์</label>
                    {!isEditable ? (
                      <p className="text-gray-900 font-medium">
                        {formatPhoneNumber(employee.phone_number)}
                      </p>
                    ) : (
                      <Input name="phone_number" value={formData.phone_number} onChange={handleChange} />
                    )}
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-gray-500">อีเมล</label>
                    {!isEditable ? (
                      <p className="text-gray-900 font-medium">{employee.email || "-"}</p>
                    ) : (
                      <Input name="email" value={formData.email} onChange={handleChange} />
                    )}
                  </div>

                  <div className="flex flex-col gap-1 sm:col-span-2">
                    <label className="text-sm font-semibold text-gray-500">ที่อยู่</label>
                    {!isEditable ? (
                      <p className="text-gray-900 font-medium">{employee.address || "-"}</p>
                    ) : (
                      <Input
                        as="textarea"
                        rows={3}
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                      />
                    )}
                  </div>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-12 mt-4">
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-gray-500">ธนาคาร</label>
                    {!isEditable ? (
                      <p className="text-gray-900 font-medium">
                        {employee.Financial_Details?.bank_name || "-"}
                      </p>
                    ) : (
                      <Input name="bank_name" value={formData.bank_name} onChange={handleChange} />
                    )}
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-gray-500">เลขที่บัญชี</label>
                    {!isEditable ? (
                      <p className="text-gray-900 font-medium">
                        {employee.Financial_Details?.bank_account_number || "-"}
                      </p>
                    ) : (
                      <Input
                        name="bank_account_number"
                        value={formData.bank_account_number}
                        onChange={handleChange}
                      />
                    )}
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-semibold text-gray-500">เลขประกันสังคม</label>
                    {!isEditable ? (
                      <p className="text-gray-900 font-medium">
                        {employee.Financial_Details?.social_security_number || "-"}
                      </p>
                    ) : (
                      <Input
                        name="social_security_number"
                        value={formData.social_security_number}
                        onChange={handleChange}
                      />
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}
      <Modal open={isOpenModal} onClose={handleClose} backdrop="static" keyboard={false} size="xs">
        <Modal.Header>
          <Modal.Title className="text-lg font-bold">ยืนยันการแก้ไขข้อมูล</Modal.Title>
        </Modal.Header>
        <Modal.Body>คุณต้องการบันทึกการเปลี่ยนแปลงข้อมูลนี้ใช่หรือไม่?</Modal.Body>
        <Modal.Footer>
          <Button onClick={() => handleUpdateProfile(employee.id)} appearance="primary" color="blue">
            ตกลง
          </Button>
          <Button onClick={handleClose} appearance="subtle">
            ยกเลิก
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Profile;