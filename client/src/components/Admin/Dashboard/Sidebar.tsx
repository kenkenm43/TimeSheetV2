/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import { FaUser } from "react-icons/fa";
import { FiLogOut } from "react-icons/fi";
import { getEmployees } from "../../../services/adminServices";
import { FaTable } from "react-icons/fa";
import { logout } from "../../../services/authServices";
import useKeepEmployeeStore from "../../../context/KeepEmployeeProvider";
import useKeepEmployeesStore from "../../../context/KeepEmployeesProvider";
import Loading from "../../Loading";
const Sidebar = () => {
  const { employees, setEmployees } = useKeepEmployeesStore();
  const { keepEmployee, setKeepEmployee } = useKeepEmployeeStore();
  const [isLoading, setIsLoading] = useState(false);
  const getEmployeesData = (payload: any) => {
    return getEmployees(payload);
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getEmployeesData({ roleQuery: "user" });

      setEmployees(data);
      setIsOpenListEmployees(location.pathname == "/employee" ? true : false);
      setKeepEmployee(data[0]);
    };

    fetchData();
  }, []);

  const selectEmployee = (emp: any) => {
    if (!(keepEmployee.id === emp.id)) {
      setKeepEmployee(emp);
    }
  };
  const [isOpenListEmployees, setIsOpenListEmployees] = useState<boolean>(true);
  const [currentNavigate, setCurrentNavigate] = useState("");
  const links = [
    {
      id: 1,
      title: "Dashboard",
      icon: <RxDashboard />,
      link: "/dashboard",
    },
    {
      id: 2,
      title: "ตารางพนักงาน",
      icon: <FaTable />,
      link: "/list",
    },
    {
      id: 3,
      title: "Employee",
      icon: <FaUser />,
      link: "/employee",
    },
  ];
  const logoutItem = {
    id: 1,
    title: "Logout",
    icon: <FiLogOut />,
    link: "/logout",
  };
  const openListEmployees = (title: any) => {
    setCurrentNavigate(title);
    setIsOpenListEmployees(true);
  };
  const closeListEmployees = (title: any) => {
    setCurrentNavigate(title);
    setIsOpenListEmployees(false);
  };

  const handleLogout = async () => {
    setIsLoading(true);
    await logout();
    setIsLoading(false);
  };
  return (
    <>
      {isLoading && <Loading />}
      <aside
        className={`fixed top-0 z-40 ${
          isOpenListEmployees ? "w-72" : "w-72"
        } flex transition-all translate-x-0 h-svh
    duration-700
    `}
      >
        <div
          className={`transition-all duration-700 translate-x-0 h-full px-3 py-4 overflow-y-auto bg-gray-50 dark:bg-gray-800 ${
            isOpenListEmployees ? "w-16" : "w-60"
          }`}
        >
          <ul className="flex flex-col space-y-2 font-medium h-full justify-between">
            <div>
              {links?.map((nav, index) => (
                <li key={index}>
                  {nav.title === "Employee" ? (
                    <>
                      <Link
                        to={nav.link}
                        className={`flex items-center p-3 text-gray-900 rounded-lg dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 group ${
                          currentNavigate === nav.title
                            ? "bg-gray-200 dark:bg-gray-800"
                            : ""
                        }`}
                        onClick={() => openListEmployees(nav.title)}
                      >
                        {nav.icon}
                        {!isOpenListEmployees && (
                          <span className="ms-3">รายชื่อพนักงาน</span>
                        )}
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        to={nav.link}
                        className={`flex items-center p-3 text-gray-900 rounded-lg dark:text-white hover:bg-gray-300 dark:hover:bg-gray-700 group ${
                          currentNavigate === nav.title
                            ? "bg-gray-200 dark:bg-gray-800"
                            : ""
                        }`}
                        onClick={() => closeListEmployees(nav.title)}
                      >
                        {nav.icon}
                        {!isOpenListEmployees && (
                          <span className="ms-3">{nav.title}</span>
                        )}
                      </Link>
                    </>
                  )}
                </li>
              ))}
            </div>
            <button
              className="flex items-center p-2 text-gray-900 rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700 group"
              onClick={handleLogout}
            >
              {logoutItem.icon}
              {!isOpenListEmployees && (
                <span className="ms-3">{logoutItem.title}</span>
              )}
            </button>
          </ul>
        </div>

        <div
          className={`transition-all -translate-x-0 duration-700 h-screen py-6 overflow-y-auto bg-white border-l border-r  ${
            isOpenListEmployees ? "w-56" : "w-0 "
          } dark:bg-gray-900 dark:border-gray-700`}
        >
          <h2 className="px-5 text-lg font-medium text-gray-800 dark:text-white">
            รายชื่อพนักงาน
          </h2>
          {employees.length !== 0 ? (
            employees?.map((emp: any, idx: any) => (
              <div className="space-y-1 border-y" key={idx}>
                <button
                  onClick={() => selectEmployee(emp)}
                  className={`flex items-center w-full px-5 py-2 transition-colors duration-200 dark:hover:bg-gray-800 gap-x-2 hover:bg-gray-100 focus:outline-none
                ${emp?.id === keepEmployee?.id ? "bg-gray-100" : ""} 
                `}
                >
                  {emp.photo ? (
                    <img
                      className="object-fill w-10 h-10 rounded-full"
                      src={emp.photo}
                      alt="img"
                    />
                  ) : (
                    <img
                      className="object-fill w-10 h-10 rounded-full"
                      src="https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2247726673.jpg"
                      alt="img"
                    />
                  )}
                  <div className="text-left rtl:text-right">
                    <h1 className="text-sm font-medium text-gray-700 capitalize dark:text-white">
                      <div>{emp?.firstName}</div>
                      <div>{emp?.lastName}</div>
                      <div>{emp?.nickName ? emp?.nickName : ""}</div>
                    </h1>
                  </div>
                </button>
              </div>
            ))
          ) : (
            <>ไม่มีรายชื่อ</>
          )}
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
