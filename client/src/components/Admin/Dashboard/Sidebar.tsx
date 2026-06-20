/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { RxDashboard } from "react-icons/rx";
import { FaUser, FaTable } from "react-icons/fa";
import { FiLogOut, FiChevronDown, FiChevronUp } from "react-icons/fi";
import { getEmployees } from "../../../services/adminServices";
import { logout } from "../../../services/authServices";
import useKeepEmployeeStore from "../../../context/KeepEmployeeProvider";
import useKeepEmployeesStore from "../../../context/KeepEmployeesProvider";
import Loading from "../../Loading";

interface SidebarProps {
  isCollapsed: boolean;
  onToggle: () => void;
}

const Sidebar = ({ isCollapsed, onToggle }: SidebarProps) => {
  const location = useLocation();
  const { employees, setEmployees } = useKeepEmployeesStore();
  const { keepEmployee, setKeepEmployee } = useKeepEmployeeStore();
  const [isLoading, setIsLoading] = useState(false);
  const [isActiveSectionOpen, setIsActiveSectionOpen] = useState(true);
  const [isResignedSectionOpen, setIsResignedSectionOpen] = useState(false);
  const [isOpenListEmployees, setIsOpenListEmployees] = useState(
    location.pathname === "/employee"
  );
  const [currentNavigate, setCurrentNavigate] = useState(
    location.pathname === "/employee" ? "Employee" : "Dashboard"
  );

  const getEmployeesData = (payload: any) => {
    return getEmployees(payload);
  };

  useEffect(() => {
    const fetchData = async () => {
      const { data } = await getEmployeesData({ roleQuery: "user" });
      setEmployees(data);
      if (data && data.length > 0) {
        setKeepEmployee(data[0]);
      }
    };
    fetchData();
  }, [setEmployees, setKeepEmployee]);

  useEffect(() => {
    if (isCollapsed) {
      setIsOpenListEmployees(false);
    }
  }, [isCollapsed]);

  // จัดการสถานะตาม Route ที่เปลี่ยนไป
  useEffect(() => {
    if (location.pathname === "/employee") {
      setCurrentNavigate("Employee");
      setIsOpenListEmployees(true);
    } else if (location.pathname === "/dashboard") {
      setCurrentNavigate("Dashboard");
      setIsOpenListEmployees(false);
    } else if (location.pathname === "/list") {
      setCurrentNavigate("ตารางพนักงาน");
      setIsOpenListEmployees(false);
    }
  }, [location.pathname]);

  const selectEmployee = (emp: any) => {
    if (keepEmployee?.id !== emp.id) {
      setKeepEmployee(emp);
    }
  };

  const links = [
    {
      id: 1,
      title: "Dashboard",
      icon: <RxDashboard className="text-2xl" />,
      link: "/dashboard",
    },
    {
      id: 2,
      title: "ตารางพนักงาน",
      icon: <FaTable className="text-2xl" />,
      link: "/list",
    },
    {
      id: 3,
      title: "Employee",
      icon: <FaUser className="text-2xl" />,
      link: "/employee",
    },
  ];

  const handleNavClick = (nav: any) => {
    if (isCollapsed && (nav.link === "/dashboard" || nav.link === "/list")) {
      onToggle();
    }

    if (nav.title === "Employee") {
      setCurrentNavigate(nav.title);
      setIsOpenListEmployees(true);
    } else {
      setCurrentNavigate(nav.title);
      setIsOpenListEmployees(false);
    }
  };

  const activeEmployees = employees.filter(
    (emp: any) => !emp?.Employment_Details?.end_date
  );
  const resignedEmployees = employees.filter(
    (emp: any) => !!emp?.Employment_Details?.end_date
  );

  const handleLogout = async () => {
    setIsLoading(true);
    await logout();
    setIsLoading(false);
  };

  // เช็คเงื่อนไขว่าเมนูหลัก (ฝั่งซ้ายสุด) ควรจะขยายกว้างหรือไม่
  // จะขยายกว้างเมื่อ ไม่ได้ถูก Collapse และ ไม่ได้เปิดหน้า Employee อยู่
  const isMainMenuExpanded = !isCollapsed && !isOpenListEmployees;

  // คำนวณความกว้างของแต่ละส่วน
  const mainPanelWidth = isMainMenuExpanded ? "w-64" : "w-16";
  const listPanelClasses = isOpenListEmployees && !isCollapsed 
    ? "w-64 opacity-100" 
    : "w-0 opacity-0 pointer-events-none border-transparent";
    
  const sidebarWidth = isCollapsed 
    ? "w-16" 
    : isOpenListEmployees 
      ? "w-80" // ย่อ Main(16) + ขยาย List(64)
      : "w-64"; // ขยาย Main(64) เต็มๆ

  return (
    <>
      {isLoading && <Loading />}

      <aside className={`fixed top-0 left-0 z-40 flex h-screen overflow-hidden transition-all duration-500 ease-in-out shadow-lg ${sidebarWidth}`}>
        
        {/* --- Main Navigation Panel --- */}
        <div className={`flex h-full flex-col justify-between overflow-hidden bg-white py-6 border-r border-gray-100 dark:border-gray-800 dark:bg-gray-900 z-10 transition-all duration-500 ease-in-out ${mainPanelWidth}`}>
          <div className="space-y-4 px-3">
            {/* โลโก้ */}
            <div className={`flex ${isMainMenuExpanded ? "justify-start px-2" : "justify-center"} pb-4 border-b border-gray-100 dark:border-gray-800 transition-all`}>
              <div className="h-10 w-10 shrink-0 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-sm">
                V
              </div>
            </div>

            {/* เมนูต่างๆ */}
            <div className="space-y-2 pt-2">
              {links.map((nav) => {
                const isActive = currentNavigate === nav.title;
                return (
                  <Link
                    key={nav.id}
                    to={nav.link}
                    title={!isMainMenuExpanded ? (nav.title === "Employee" ? "รายชื่อพนักงาน" : nav.title) : undefined}
                    className={`relative flex items-center rounded-xl p-3 transition-all duration-200 group ${
                      isActive
                        ? "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400"
                        : "text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800 hover:text-gray-900 dark:hover:text-white"
                    } ${isMainMenuExpanded ? "justify-start px-4" : "justify-center"}`}
                    onClick={() => handleNavClick(nav)}
                  >
                    {isActive && (
                      <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-blue-600 rounded-r-full"></span>
                    )}
                    <div className="flex items-center w-full">
                      <span className="shrink-0">{nav.icon}</span>
                      {/* ส่วนแสดงข้อความ (จะโผล่มาเมื่อ isMainMenuExpanded เป็น true) */}
                      <span 
                        className={`ml-4 whitespace-nowrap font-medium transition-all duration-300 ${
                          isMainMenuExpanded ? "opacity-100 w-auto" : "opacity-0 w-0 overflow-hidden"
                        }`}
                      >
                        {nav.title === "Employee" ? "รายชื่อพนักงาน" : nav.title}
                      </span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>

          <div className="px-3 space-y-2">
            <button
              title="Logout"
              className={`flex w-full items-center rounded-xl p-3 text-gray-500 transition-all duration-200 hover:bg-red-50 hover:text-red-600 dark:text-gray-400 dark:hover:bg-red-900/30 dark:hover:text-red-400 ${
                isMainMenuExpanded ? "justify-start px-4" : "justify-center"
              }`}
              onClick={handleLogout}
            >
              <div className="flex items-center w-full">
                <span className="shrink-0"><FiLogOut className="text-2xl" /></span>
                <span 
                  className={`ml-4 whitespace-nowrap font-medium transition-all duration-300 ${
                    isMainMenuExpanded ? "opacity-100 w-auto" : "opacity-0 w-0 overflow-hidden"
                  }`}
                >
                  Logout
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* --- Secondary Employee List Panel (โผล่เฉพาะตอนอยู่หน้า Employee) --- */}
        <div
          className={`flex flex-col transition-all duration-500 ease-in-out border-r bg-gray-50/50 dark:border-gray-800 dark:bg-gray-900/95 ${listPanelClasses}`}
          aria-hidden={!isOpenListEmployees}
        >
          {/* Sticky Header */}
          <div className="sticky top-0 z-10 bg-gray-50/95 px-5 py-5 border-b border-gray-200 backdrop-blur-sm dark:border-gray-800 dark:bg-gray-900/95 shrink-0">
            <h2 className="text-lg font-bold text-gray-800 dark:text-white">รายชื่อพนักงาน</h2>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              พนักงานทั้งหมด {employees.length} คน
            </p>
          </div>

          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto space-y-4 custom-scrollbar">
            
            {/* Active Employees Accordion */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 transition-all">
              <button
                type="button"
                onClick={() => setIsActiveSectionOpen((prev) => !prev)}
                className="flex items-center justify-between w-full px-4 py-3.5 text-left text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <span className="flex items-center gap-3">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
                  </span>
                  <span>พนักงานปัจจุบัน</span>
                  <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-900 dark:text-gray-300">
                    {activeEmployees.length}
                  </span>
                </span>
                {isActiveSectionOpen ? <FiChevronUp className="text-gray-400" /> : <FiChevronDown className="text-gray-400" />}
              </button>
              
              <div className={`grid transition-all duration-300 ${isActiveSectionOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                <div className="overflow-hidden">
                  <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
                    {activeEmployees.length ? (
                      activeEmployees.map((emp: any, idx: any) => {
                        const isSelected = emp?.id === keepEmployee?.id;
                        return (
                          <button
                            key={`active-${idx}`}
                            onClick={() => selectEmployee(emp)}
                            className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-all ${
                              isSelected
                                ? "bg-blue-50/50 dark:bg-blue-900/20"
                                : "hover:bg-gray-50 dark:hover:bg-gray-700/30"
                            }`}
                          >
                            <img
                              className={`h-10 w-10 shrink-0 rounded-full object-cover border-2 ${isSelected ? "border-blue-400" : "border-transparent"}`}
                              src={emp.photo || "https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2247726673.jpg"}
                              alt="avatar"
                            />
                            <div className="min-w-0 flex-1">
                              <div className={`text-sm font-medium truncate ${isSelected ? "text-blue-700 dark:text-blue-400" : "text-gray-800 dark:text-gray-200"}`}>
                                {emp?.firstName} {emp?.lastName}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {emp?.nickName || "-"}
                              </div>
                            </div>
                          </button>
                        );
                      })
                    ) : (
                      <div className="px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-400">ไม่มีข้อมูล</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Resigned Employees Accordion */}
            <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm dark:border-gray-700 dark:bg-gray-800 transition-all">
              <button
                type="button"
                onClick={() => setIsResignedSectionOpen((prev) => !prev)}
                className="flex items-center justify-between w-full px-4 py-3.5 text-left text-sm font-semibold text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
              >
                <span className="flex items-center gap-3">
                  <span className="relative flex h-3 w-3">
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-rose-500"></span>
                  </span>
                  <span>ลาออกแล้ว</span>
                  <span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-900 dark:text-gray-300">
                    {resignedEmployees.length}
                  </span>
                </span>
                {isResignedSectionOpen ? <FiChevronUp className="text-gray-400" /> : <FiChevronDown className="text-gray-400" />}
              </button>
              
              <div className={`grid transition-all duration-300 ${isResignedSectionOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                <div className="overflow-hidden">
                  <div className="divide-y divide-gray-100 dark:divide-gray-700/50">
                    {resignedEmployees.length ? (
                      resignedEmployees.map((emp: any, idx: any) => {
                        const isSelected = emp?.id === keepEmployee?.id;
                        return (
                          <button
                            key={`resigned-${idx}`}
                            onClick={() => selectEmployee(emp)}
                            className={`flex w-full items-center gap-3 px-4 py-3 text-left transition-all opacity-75 hover:opacity-100 ${
                              isSelected
                                ? "bg-rose-50/50 dark:bg-rose-900/20"
                                : "hover:bg-gray-50 dark:hover:bg-gray-700/30"
                            }`}
                          >
                            <img
                              className={`h-10 w-10 shrink-0 rounded-full object-cover grayscale border-2 ${isSelected ? "border-rose-400 grayscale-0" : "border-transparent"}`}
                              src={emp.photo || "https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2247726673.jpg"}
                              alt="avatar"
                            />
                            <div className="min-w-0 flex-1">
                              <div className={`text-sm font-medium truncate ${isSelected ? "text-rose-700 dark:text-rose-400" : "text-gray-800 dark:text-gray-300"}`}>
                                {emp?.firstName} {emp?.lastName}
                              </div>
                              <div className="text-xs text-gray-500 dark:text-gray-400 truncate">
                                {emp?.nickName || "-"}
                              </div>
                            </div>
                          </button>
                        );
                      })
                    ) : (
                      <div className="px-4 py-4 text-center text-sm text-gray-500 dark:text-gray-400">ไม่มีข้อมูล</div>
                    )}
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;