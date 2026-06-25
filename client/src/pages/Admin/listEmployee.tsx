/* eslint-disable @typescript-eslint/no-explicit-any */
import React, { useMemo, useState } from "react";
import useKeepEmployeesStore from "../../context/KeepEmployeesProvider";
import moment from "moment";

// --- START: EMPLOYEE TABLE COMPONENT WITH SORTING ---
interface EmployeeTableProps {
  employees: any[];
}

type SortConfig = {
  key: string;
  direction: "asc" | "desc" | null;
};

const ModernEmployeeTable: React.FC<EmployeeTableProps> = ({ employees }) => {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: "", direction: null });

  const handleSort = (key: string) => {
    let direction: "asc" | "desc" = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });
  };

  const sortedEmployees = useMemo(() => {
    if (!sortConfig.direction || !sortConfig.key) return employees;

    return [...employees].sort((a, b) => {
      let aValue: any = "";
      let bValue: any = "";

      switch (sortConfig.key) {
        case "name":
          aValue = `${a.firstName || ""} ${a.lastName || ""}`.toLowerCase();
          bValue = `${b.firstName || ""} ${b.lastName || ""}`.toLowerCase();
          break;
        case "salary":
          aValue = Number(a.Employment_Details?.salary) || 0;
          bValue = Number(b.Employment_Details?.salary) || 0;
          break;
        case "bank_name":
          aValue = (a.Financial_Details?.bank_name || "").toLowerCase();
          bValue = (b.Financial_Details?.bank_name || "").toLowerCase();
          break;
        case "bank_id":
          aValue = a.Financial_Details?.bank_id || "";
          bValue = b.Financial_Details?.bank_id || "";
          break;
        case "dob":
          aValue = a.date_of_birth ? new Date(a.date_of_birth).getTime() : 0;
          bValue = b.date_of_birth ? new Date(b.date_of_birth).getTime() : 0;
          break;
        case "status":
          aValue = a.Employment_Details?.end_date ? 1 : 0;
          bValue = b.Employment_Details?.end_date ? 1 : 0;
          break;
        default:
          break;
      }

      if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
      if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  }, [employees, sortConfig]);

  const SortIcon = ({ columnKey }: { columnKey: string }) => {
    if (sortConfig.key !== columnKey) {
      return <span className="ml-1 text-gray-300">↕</span>;
    }
    return sortConfig.direction === "asc" ? (
      <span className="ml-1 text-blue-600">↑</span>
    ) : (
      <span className="ml-1 text-blue-600">↓</span>
    );
  };

  const thClassName = "px-6 py-4 font-semibold tracking-wider cursor-pointer hover:bg-slate-100 transition-colors select-none group";

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-500 uppercase bg-slate-50 border-b border-gray-100">
            <tr>
              <th scope="col" className={thClassName} onClick={() => handleSort("name")}>
                <div className="flex items-center">ชื่อ-นามสกุล <SortIcon columnKey="name" /></div>
              </th>
              <th scope="col" className={`${thClassName} text-right`} onClick={() => handleSort("salary")}>
                <div className="flex items-center justify-end">เงินเดือน (THB) <SortIcon columnKey="salary" /></div>
              </th>
              <th scope="col" className={thClassName} onClick={() => handleSort("bank_name")}>
                <div className="flex items-center">ธนาคาร <SortIcon columnKey="bank_name" /></div>
              </th>
              <th scope="col" className={thClassName} onClick={() => handleSort("bank_id")}>
                <div className="flex items-center">เลขบัญชี <SortIcon columnKey="bank_id" /></div>
              </th>
              <th scope="col" className={thClassName} onClick={() => handleSort("dob")}>
                <div className="flex items-center">วันเกิด <SortIcon columnKey="dob" /></div>
              </th>
              <th scope="col" className={thClassName} onClick={() => handleSort("status")}>
                <div className="flex items-center">สถานะการจ้างงาน <SortIcon columnKey="status" /></div>
              </th>
            </tr>
          </thead>

          <tbody className="divide-y divide-gray-100">
            {sortedEmployees.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-10 text-gray-500">ไม่พบข้อมูลพนักงาน</td>
              </tr>
            ) : (
              sortedEmployees.map((emp: any, index: number) => (
                <tr key={index} className="bg-white hover:bg-blue-50/50 transition-colors duration-150">
                  <td className="px-6 py-4 font-medium text-gray-900">
                    {/* --- START: AVATAR --- */}
    {/* เพิ่ม div ครอบตรงนี้ เพื่อทำให้เป็น flex แนวนอน */}
                    <div className="flex items-center gap-4">
                      
                      {/* --- START: AVATAR --- */}
                      <div className="h-10 w-10 flex-shrink-0 rounded-full bg-blue-100 border border-blue-200 flex items-center justify-center text-blue-700 font-bold text-lg overflow-hidden shadow-sm">
                        {emp.photo ? (
                          <img
                            src={emp.photo}
                            alt={`${emp.firstName}`}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <span>
                            {emp.firstName ? emp.firstName.charAt(0).toUpperCase() : "?"}
                          </span>
                        )}
                      </div>
                      {/* --- END: AVATAR --- */}

                      {/* ข้อมูลชื่อ */}
                      <div className="flex flex-col">
                        <span className="text-base font-semibold">{emp.firstName} {emp.lastName}</span>
                        {emp.nickName && (
                          <span className="text-sm text-gray-500">({emp.nickName})</span>
                        )}
                      </div>

                    </div>
                  </td>
                  
                  <td className="px-6 py-4 text-right font-mono text-base font-bold text-gray-950">
                    {emp.Employment_Details?.salary
                      ? emp.Employment_Details.salary.toLocaleString('th-TH')
                      : "-"}
                  </td>
                  
                  <td className="px-6 py-4 text-gray-700">{emp.Financial_Details?.bank_name || "-"}</td>
                  <td className="px-6 py-4 text-gray-700 font-mono tracking-tight">{emp.Financial_Details?.bank_id || "-"}</td>
                  
                  <td className="px-6 py-4 text-gray-600">
                    {emp.date_of_birth
                      ? moment(emp.date_of_birth).format("YYYY-MMM-DD")
                      : "-"}
                  </td>
                  
                  <td className="px-6 py-4">
                    {emp.Employment_Details?.end_date ? (
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
                        <span className="relative flex h-2 w-2">
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
                        </span>
                        ลาออกแล้ว ({moment(emp.Employment_Details.end_date).format("YYYY-MM-DD")})
                      </div>
                    ) : (
                      <div className="inline-flex items-center gap-1.5 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
                        <span className="relative flex h-2 w-2">
                          <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
                        </span>
                        ทำงานอยู่
                      </div>
                    )}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
// --- END: EMPLOYEE TABLE COMPONENT WITH SORTING ---


// --- START: MAIN PAGE COMPONENT ---
const ListEmployee = () => {
  const { employees } = useKeepEmployeesStore();
  const [statusFilter, setStatusFilter] = useState<"all" | "active" | "resigned">("active");

  const filteredEmployees = useMemo(() => {
    return employees.filter((emp: any) => {
      const hasEndDate = !!emp.Employment_Details?.end_date;
      if (statusFilter === "active") return !hasEndDate;
      if (statusFilter === "resigned") return hasEndDate;
      return true;
    });
  }, [employees, statusFilter]);

  return (
    <div className="mt-8 p-6 bg-slate-50 rounded-2xl">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h2 className="text-2xl font-bold text-gray-800">
          ตารางพนักงาน
        </h2>
        
        <div className="inline-flex bg-white p-1 rounded-xl shadow-inner border border-gray-100">
          {(["all", "active", "resigned"] as const).map((filter) => (
            <button
              key={filter}
              className={`px-5 py-2.5 text-sm font-semibold rounded-lg transition-all duration-200 ${
                statusFilter === filter
                  ? "bg-blue-600 text-white shadow"
                  : "text-gray-600 hover:text-blue-600 hover:bg-blue-50"
              }`}
              onClick={() => setStatusFilter(filter)}
            >
              {filter === "all" ? "ทั้งหมด" : filter === "active" ? "ทำงานอยู่" : "ลาออกแล้ว"}
            </button>
          ))}
        </div>
      </div>

      <ModernEmployeeTable employees={filteredEmployees} />
    </div>
  );
};

export default ListEmployee;