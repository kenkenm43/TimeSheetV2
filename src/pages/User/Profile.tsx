/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import { getUser } from "../../services/userServices";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useUserStore from "../../context/UserProvider";

const Profile = () => {
  const navigate = useNavigate();
  const axiosPrivate = useAxiosPrivate();
  const { auth } = useAuth();
  const { user, setUser } = useUserStore();
  useEffect(() => {
    let isMounted = true;
    const controller = new AbortController();

    const fetchUser = async () => {
      try {
        const { data }: any = await axiosPrivate(`/user/${auth.id}`, {
          signal: controller.signal,
        });
        isMounted && setUser({ ...data });
        console.log(data);
      } catch (error: any) {
        navigate("/login", { state: { from: location }, replace: true });
      }
    };
    fetchUser();
    return () => {
      isMounted = false;
      controller.abort();
    };
  }, []);
  return (
    <div className="flex flex-col">
      <span>ชื่อผู้ใช้งาน: {user.username}</span>
      <span>ชื่อจริง: {user.firstName}</span>
      <span>นามสกุล: {user.lastName}</span>
      <span>เลขบัตรประชาชน: {user.idCard}</span>
      <span>เริ่มทำงาน 1/1/2567</span>
      <span>วันที่ผ่านโปร</span>
      <span>เงินสะสม</span>
      <span>วันลาคงเหลือ</span>
    </div>
  );
};

export default Profile;
