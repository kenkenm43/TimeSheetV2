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
import { FaRegEdit, FaEdit, FaRegSave, FaInfoCircle } from "react-icons/fa";
import { Button, DatePicker, Input, Modal } from "rsuite";
import moment from "moment";
import { IoMdPerson } from "react-icons/io";
import Swal from "sweetalert2";
import Loading from "../../components/Loading";
const Profile = () => {
  const { employee, setEmployee }: TEmployeeStoreState = useEmployeeStore();
  const [isEditable, setIsEditable] = useState<boolean>();
  const [isOpenModal, setIsOpenModal] = useState<boolean>();
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
  const [isLoading, setIsLoading] = useState(false);
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
  }, [employee.id]);
  const handleUpdateProfile = async (employeeId: any) => {
    setIsLoadingImage(true);
    try {
      const employee = await updateEmployee(formData, employeeId);

      setEmployee(employee.data);
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
    setFormData((formData: any) => {
      formData;
    });
    setIsOpenModal(false);
    setIsEditable(false);
    setIsEditName(false);
  };

  const handleEditName = () => {
    setIsEditName(true);
  };
  function formatPhoneNumber(phoneNumberString: any) {
    // Add dashes to the phone number
    const formatted = phoneNumberString.replace(
      /(\d{3})(\d{3})(\d{4})/,
      "$1-$2-$3"
    );

    return formatted;
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
      // Preview image
      const reader: any = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      console.log("File selection canceled.");
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
      setEmployee({ employee, photo: response.data.fileUrl });
    } catch (error: any) {
      Swal?.fire({
        title: "Error!",
        text: error,
        icon: "error",
        confirmButtonText: "Cool",
      });
      setIsChangeImg(false);

      setPreviewUrl(null);
    } finally {
      setIsLoadingImage(false);
    }
  };

  return (
    <div className="flex max-w-7xl w-full mt-10 px-10">
      {isLoadingImage && <Loading />}
      <div className=" gap-4 flex flex-col items-center md:w-64 md:h-64 h-32 w-32 relative">
        {previewUrl ? (
          <div className="flex flex-col items-center gap-4">
            <img
              className="max-w-full max-h-72 w-64 border border-gray-300"
              src={previewUrl}
              alt="Preview"
            />
          </div>
        ) : (
          <>
            {employee.photo ? (
              <div className="flex flex-col items-center gap-4">
                <img
                  className="max-w-full max-h-72 w-64 border border-gray-300"
                  src={employee.photo}
                  alt="img"
                />
              </div>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <img
                  className="max-w-full max-h-72 w-64 border border-gray-300"
                  src={
                    "https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2247726673.jpg"
                  }
                  alt="img"
                />
              </div>
            )}
          </>
        )}
        {/* <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          แก้ไขรูปภาพ
          </button> */}
        <input
          type="file"
          accept="image/png, image/jpeg"
          hidden
          ref={fileUploadRef}
          onChange={uploadImageDisplay}
        />
        <div
          className="absolute right-0 opacity-70 hover:opacity-100 cursor-pointer"
          onClick={handleImageUpload}
        >
          <FaEdit size={30} />
        </div>

        {/* <div className="flex space-x-5" onClick={handleImageUpload}>
          <FaEdit
            size={25}
            style={{ stroke: "black", strokeWidth: 2, color: "white" }}
          />
        </div> */}
        <div></div>
        {isChangeImg && (
          <div className="flex space-x-5">
            <button
              onClick={() => handleConfirmUpload()}
              className="bg-green-500 text-white font-bold py-2 px-4 rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition ease-in-out duration-300"
            >
              บันทึก
            </button>
            <button
              onClick={() => {
                setIsChangeImg(false);
                setPreviewUrl(null);
              }}
              className="bg-red-500 text-white font-bold py-2 px-4 rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50 transition ease-in-out duration-300"
            >
              ยกเลิก
            </button>
          </div>
        )}
      </div>
      <Modal
        className="pt-64"
        open={isOpenModal}
        onClose={() => handleClose()}
        backdrop="static"
        keyboard={false}
        size="sm"
      >
        <Modal.Header>
          <Modal.Title>ต้องการแก้ข้อมูลใช่หรือไม่</Modal.Title>
        </Modal.Header>
        <Modal.Footer>
          <Button
            onClick={() => handleUpdateProfile(employee.id)}
            appearance="primary"
          >
            Ok
          </Button>
          <Button onClick={() => handleClose()} appearance="subtle">
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
      <div className="mx-14 w-full">
        <div className="flex items-center text-2xl font-bold relative h-16">
          {!isEditName ? (
            <>
              <div className="first-letter:uppercase">
                {employee.firstName || "-"}
              </div>{" "}
              <div className="ml-5 first-letter:uppercase">
                {employee.lastName || "-"}
              </div>
              <div className="ml-5 first-letter:uppercase">
                ({employee.nickName || "-"})
              </div>
              <div
                className="absolute right-0 opacity-30 hover:opacity-75 cursor-pointer"
                onClick={handleEditName}
              >
                <FaRegEdit />
              </div>
            </>
          ) : (
            <div className="flex space-x-4">
              <Input
                placeholder="ชื่อจริง"
                // style={inputStyle}
                classPrefix="input"
                className="min-w-56 max-w-56"
                name="firstName"
                defaultValue={employee.firstName}
                value={formData.firstName}
                onChange={handleChange}
              />
              <Input
                placeholder="นามสกุล"
                className="min-w-56 max-w-56"
                name="lastName"
                defaultValue={employee.lastName}
                value={formData.lastName}
                onChange={handleChange}
              />
              <Input
                placeholder="ชื่อเล่น"
                name="nickName"
                className="min-w-56 max-w-56"
                defaultValue={employee.nickName}
                value={formData.nickName}
                onChange={handleChange}
              />

              <div
                className="absolute right-0 opacity-30 hover:opacity-75 cursor-pointer"
                onClick={() => setIsOpenModal(true)}
              >
                <FaRegSave size={30} />
              </div>
            </div>
          )}
        </div>
        <div className="relative flex space-x-3 text-xl font-semibold mt-9 border-b-2 w-full ">
          <div
            className={`flex items-center w-32 p-1  transition-all  duration-300 ease-in-out cursor-pointer hover:transition-all hover:bg-slate-200 ${
              state === "about" ? "border-b-4 border-blue-600 " : ""
            }`}
            onClick={() => setState("about")}
          >
            <IoMdPerson /> <span className="ml-2">เกี่ยวกับ</span>
          </div>
          <div
            className={`flex items-center w-32 p-1 transition-all  duration-300 ease-in-out cursor-pointer hover:transition-all hover:bg-slate-200 ${
              state === "general" ? "border-b-4 border-blue-600" : ""
            }`}
            onClick={() => setState("general")}
          >
            <FaInfoCircle /> <span className="ml-2">ข้อมูล</span>
          </div>
        </div>
        {/* <div className="mt-9 text-xl font-semibold">ข้อมูลทั่วไป / ติดต่อ</div> */}
        <form className="relative mt-9">
          {state === "general" ? (
            <div className="flex">
              <div className=" space-y-5 font-bold">
                <div>ธนาคาร:</div>
                {/* <div>เพศ:</div> */}
                <div>เลขที่บัญชี:</div>
                <div>เลขประกันสังคม:</div>
                {/* <div>:</div>
                <div>ที่อยู่:</div> */}
                {/* <div>เริ่มทำงาน: </div>
            <div>เงินเดือน: </div> */}
              </div>
              {!isEditable ? (
                <div className="w-96 pl-5 space-y-5">
                  <div>{employee.Financial_Details?.bank_name || "-"}</div>
                  {/* <div>{employee.gender || "-"}</div> */}
                  <div>
                    <div>
                      {employee.Financial_Details?.bank_account_number || "-"}
                    </div>
                  </div>
                  <div>
                    {employee.Financial_Details?.social_security_number || "-"}
                  </div>
                </div>
              ) : (
                <div className="flex flex-col w-96 ml-2 space-y-2">
                  <Input
                    name="bank_name"
                    value={formData.bank_name}
                    onChange={handleChange}
                  />
                  <Input
                    name="bank_account_number"
                    value={formData.bank_account_number}
                    onChange={handleChange}
                  />
                  <Input
                    name="social_security_number"
                    value={formData.social_security_number}
                    onChange={handleChange}
                  />
                </div>
              )}
            </div>
          ) : state === "about" ? (
            <div className="flex">
              <div className=" space-y-5 font-bold">
                <div>เลขบัตรประชาชน:</div>
                {/* <div>เพศ:</div> */}
                <div>วันเกิด:</div>
                <div>เบอร์โทรศัพท์:</div>
                <div>อีเมล:</div>
                <div>ที่อยู่:</div>
                {/* <div>เริ่มทำงาน: </div>
        <div>เงินเดือน: </div> */}
              </div>
              {!isEditable ? (
                <div className="w-96 pl-5 space-y-5">
                  <div>{employee.idCard || "-"}</div>
                  {/* <div>{employee.gender || "-"}</div> */}
                  <div>
                    {employee.date_of_birth
                      ? moment(employee.date_of_birth).format("yyyy-MM-DD")
                      : "-"}
                  </div>
                  <div>
                    {employee.phone_number
                      ? formatPhoneNumber(employee.phone_number)
                      : "-"}
                  </div>
                  <div>{employee.email || "-"}</div>
                  <div>{employee.address || "-"}</div>
                </div>
              ) : (
                <div className="flex flex-col w-96 ml-2 space-y-2">
                  <Input
                    name="idCard"
                    value={formData.idCard}
                    onChange={handleChange}
                  />
                  {/* <input
          className="border-b-2 border-black"
          name="gender"
          value={formData.gender}
          onChange={handleChange}
        /> */}
                  <DatePicker
                    name="dob"
                    value={
                      new Date(
                        moment(formData.date_of_birth).format("YYYY-MM-DD")
                      )
                    }
                    format="yyyy-MM-dd"
                    onChange={handleDateChange}
                  />
                  <Input
                    name="phone_number"
                    value={formData.phone_number}
                    onChange={handleChange}
                  />
                  <Input
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <Input
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                  />
                </div>
              )}
            </div>
          ) : (
            <></>
          )}

          {!isEditable ? (
            <div
              className="absolute top-[-10px] right-0 opacity-30 hover:opacity-75 cursor-pointer"
              onClick={() => setIsEditable(true)}
            >
              <FaEdit size={25} />
            </div>
          ) : (
            <div
              className="absolute top-[-10px] right-0 opacity-30 hover:opacity-75 cursor-pointer"
              onClick={() => {
                setIsOpenModal(true);
              }}
            >
              <FaRegSave size={30} />
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Profile;
