/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { TAuthStoreState } from "../../context/AuthProvider";
import useEmployeeStore, {
  TEmployeeStoreState,
} from "../../context/EmployeeProvider";
import { getEmployee } from "../../services/employeeServices";

const Profile = () => {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const { auth }: TAuthStoreState = useAuth();
  const { employee, setEmployee }: TEmployeeStoreState = useEmployeeStore();
  useEffect(() => {
    const fetchData = async () => {
      const employeeData = await getEmployee(employee.id);
      setEmployee(employeeData.data);
    };
    fetchData();
  }, [employee.id]);
  return (
    <div className="flex  max-w-6xl w-full mt-10">
      <div className="px-10">
        {employee.photo ? (
          <div></div>
        ) : (
          <div className="h-56 w-56 bg-slate-500 flex items-center justify-center">
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
      <div className="grid grid-cols-2 space-x-20">
        <p className="flex flex-col space-y-1">
          <span>ชื่อจริง: {employee.firstName}</span>
          <span>นามสกุล: {employee.lastName}</span>
          <span>เลขบัตรประชาชน: {employee.idCard}</span>
          <span>เพศ: {employee.gender}</span>
          <span>วันเกิด: {employee.date_of_birth}</span>
          <span>ที่อยู่: {employee.address}</span>
          <span>เบอร์โทรศัพท์: {employee.phone_number}</span>
          <span>อีเมล: {employee.email}</span>
        </p>
        <p className="flex flex-col space-y-1">
          <span>เริ่มทำงาน: {employee.Employment_Details?.start_date}</span>
          <span>เงินเดือน: {employee.Employment_Details?.salary}</span>
          <span>วันที่ผ่านโปร: </span>
          <span>เงินสะสม: </span>
          <span>วันลาคงเหลือ: </span>
        </p>
      </div>
    </div>
  );
};

export default Profile;
