/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import useAuth from "../../hooks/useAuth";
import { TAuthStoreState } from "../../context/AuthProvider";
import useEmployeeStore, {
  TEmployeeStoreState,
} from "../../context/EmployeeProvider";
import { getEmployee, updateEmployee } from "../../services/employeeServices";
import { FaEdit, FaRegSave } from "react-icons/fa";
import { Button, DatePicker, Modal } from "rsuite";
import moment from "moment";

const Profile = () => {
  const { auth }: TAuthStoreState = useAuth();
  const { employee, setEmployee }: TEmployeeStoreState = useEmployeeStore();
  const [isEditable, setIsEditable] = useState<boolean>();
  const [isOpenModal, setIsOpenModal] = useState<boolean>();
  const [formData, setFormData] = useState({
    firstName: employee.firstName,
    lastName: employee.lastName,
    idCard: employee.idCard,
    gender: employee.gender,
    date_of_birth: employee.date_of_birth,
    phone_number: employee.phone_number,
    email: employee.email,
  });
  const handleChange = (e: any) => {
    const { name, value } = e.target;

    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };
  const handleDateChange = (date: any) => {
    setFormData((prevState) => ({
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
    const employee = await updateEmployee(formData, employeeId);
    setEmployee(employee.data);
    setIsOpenModal(false);
    setIsEditable(false);
  };

  const handleClose = async () => {
    setIsOpenModal(false);
    setIsEditable(false);
  };
  const [image, setImage] = useState(null);
  const handleFileChange = (e: any) => {
    const file = e.target.files[0];
    setImage(file);
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (image) {
      onUpload(image);
      // Optionally, reset the form after submission
      setImage(null);
    }
  };
  {
    employee.photo;
  }
  return (
    <div className="flex max-w-7xl w-full mt-10">
      <div className="px-10">
        {employee.photo ? (
          <div className="h-56 w-56 flex items-center justify-center">
            <img
              className="md:w-48 md:h-48 h-20 w-20"
              src={`http://localhost:8081/${employee.photo}`}
              alt="img"
            />
          </div>
        ) : (
          <div className="h-56 w-56 flex items-center justify-center">
            <img
              className="md:w-48 md:h-48 h-20 w-20"
              src={
                "https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2247726673.jpg"
              }
              alt="img"
            />
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
      <form className="grid grid-cols-2 text-2xl relative p-5 min-w-52">
        <p className="flex justify-between">
          <div className="w-96 text-right space-y-3">
            <div>ชื่อ:</div>
            <div>นามสกุล:</div>
            <div>เลขบัตรประชาชน:</div>
            {/* <div>เพศ:</div> */}
            <div>วันเกิด:</div>
            <div>เบอร์โทรศัพท์:</div>
            <div>อีเมล:</div>
          </div>
          {!isEditable ? (
            <div className="w-96 pl-5 space-y-3">
              <div>{employee.firstName || "-"}</div>
              <div>{employee.lastName || "-"}</div>
              <div>{employee.idCard || "-"}</div>
              {/* <div>{employee.gender || "-"}</div> */}
              <div>
                {moment(employee.date_of_birth).format("yyyy-MM-DD") || "-"}
              </div>
              <div>{employee.phone_number || "-"}</div>
              <div>{employee.email || "-"}</div>
            </div>
          ) : (
            <div className="w-96 ml-2 space-y-3">
              <input
                className="border-b-2 border-black"
                name="firstName"
                defaultValue={employee.firstName}
                value={formData.firstName}
                onChange={handleChange}
              />
              <input
                className="border-b-2 border-black"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
              <input
                className="border-b-2 border-black"
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
                value={formData.date_of_birth}
                format="yyyy-MM-dd"
                onChange={handleDateChange}
              />
              {/* <input
                className="border-b-2 border-black"
                name="dob"
                value={employee.date_of_birth}
                onChange={handleChange}
              /> */}
              <input
                className="border-b-2 border-black"
                name="phone"
                value={formData.phone_number}
                onChange={handleChange}
              />
              <input
                className="border-b-2 border-black"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
            </div>
          )}
        </p>
        <p className="flex">
          <div className="w-96 text-right space-y-3">
            <div>เริ่มทำงาน: </div>
            <div>เงินเดือน: </div>
            {/* <div>วันที่ผ่านโปร: </div>
            <div>เงินสะสม: </div>
            <div>วันลาคงเหลือ: </div> */}
          </div>
          <div className="w-full pl-5 space-y-3">
            <div>{employee.Employment_Details?.start_date || "-"}</div>
            <div>
              {employee.Employment_Details?.salary
                .toString()
                .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") || "-"}
            </div>
          </div>
        </p>

        {!isEditable ? (
          <div
            className="absolute top-0 right-0 cursor-pointer"
            onClick={() => setIsEditable(true)}
          >
            <FaEdit size={30} />
          </div>
        ) : (
          <div
            className="absolute top-0 right-0 cursor-pointer"
            onClick={() => {
              setIsOpenModal(true);
            }}
          >
            <FaRegSave size={30} />
          </div>
        )}
      </form>
    </div>
  );
};

export default Profile;
