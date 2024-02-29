/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { TAuthStoreState } from "../../context/AuthProvider";
import useEmployeeStore, {
  TEmployeeStoreState,
} from "../../context/EmployeeProvider";

const Profile = () => {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const { auth }: TAuthStoreState = useAuth();
  const { employee, setEmployee }: TEmployeeStoreState = useEmployeeStore();
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchUser = async () => {
      try {
        const { data }: any = await axiosPrivate(
          `/employee/${auth.employeeId}`,
          {
            signal: controller.signal,
          }
        );
        isMounted && setEmployee({ ...data });
      } catch (error: any) {
        navigate("/login", { state: { from: location }, replace: true });
      }
    };
    !employee.id && fetchUser();
    // fetchUser();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);
  return (
    <div className="flex  max-w-6xl w-full mt-10">
      <div className="px-10">
        {employee.photo ? (
          <div></div>
        ) : (
          <div className="h-56 w-56 bg-slate-500 flex items-center justify-center">
            รูปภาพ
          </div>
        )}
      </div>
      <div className="flex flex-col space-y-1">
        <span>ชื่อจริง: {employee.firstName}</span>
        <span>นามสกุล: {employee.lastName}</span>
        <span>เลขบัตรประชาชน: {employee.idCard}</span>
        <span>เพศ: {employee.gender}</span>
        <span>วันเกิด: {employee.date_of_birth}</span>
        <span>ที่อยู่: {employee.address}</span>
        <span>เบอร์โทร {employee.phone_number}</span>
        <span>อีเมล {employee.email}</span>
        <span>เริ่มทำงาน {employee.Employment_Details?.start_date}</span>
        <span>เงินเดือน {employee.Employment_Details?.salary}</span>
        <span>วันที่ผ่านโปร</span>
        <span>เงินสะสม</span>
        <span>วันลาคงเหลือ</span>
      </div>
    </div>
  );
};

export default Profile;
