/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useMemo, useState } from "react";
import EmployeeTable from "../../components/Admin/Table/ListEmployee";
import useKeepEmployeesStore from "../../context/KeepEmployeesProvider";
import moment from "moment";

const listEmployee = () => {
  const { employees, setEmployees } = useKeepEmployeesStore();
  //   const employees = [
  //     { id: 1, fullname: "John Doe", nickname: "Johnny", idCard: "ID12345" },
  //     { id: 2, fullname: "Jane Smith", nickname: "Janey", idCard: "ID67890" },
  //     { id: 3, fullname: "Sam Johnson", nickname: "Sammy", idCard: "ID11223" },
  //     // Add more employee data here
  //   ];
const [statusFilter, setStatusFilter] = useState<"all" | "active" | "resigned">("active");
const filteredEmployees = useMemo(() => {
  return employees.filter((emp: any) => {
    const hasEndDate = !!emp.Employment_Details?.end_date;
    if (statusFilter === "active") return !hasEndDate;
    if (statusFilter === "resigned") return hasEndDate;
    return true;
  });
}, [employees, statusFilter]);
  const data: any = useMemo(
    () =>
      
      filteredEmployees.map((emp: any) => {
        return {
          fullname: `${emp.firstName} ${emp.lastName} ${
            emp.nickName ? '('+emp.nickName+')' : ""
          }`,
          salary: `${
            emp.Employment_Details.salary
              ? emp.Employment_Details.salary
                  .toString()
                  .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
              : "-"
          }`,
          bank_name: `${emp.Financial_Details.bank_name || "-"}`,
          bank_id: `${emp.Financial_Details.bank_id || "-"}`,
          date_of_birth: `${
            emp.date_of_birth
              ? moment(emp.date_of_birth).format("YYYY-MMM-DD")
              : "-"
          }`,
          end_date: `${emp.Employment_Details.end_date ? moment(emp.Employment_Details.end_date).format("YYYY-MM-DDDD") : "-"}`
        };
      }),
    [filteredEmployees]
  );
  return (
    <div className="mt-5">
      <div className="text-2xl font-bold">ตารางพนักงาน
      </div>
     <div className="flex gap-2 mb-4">
  <button
    className={`px-4 py-2 rounded ${statusFilter === "all" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
    onClick={() => setStatusFilter("all")}
  >
    ทั้งหมด
  </button>
  <button
    className={`px-4 py-2 rounded ${statusFilter === "active" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
    onClick={() => setStatusFilter("active")}
  >
    ยังไม่ออก
  </button>
  <button
    className={`px-4 py-2 rounded ${statusFilter === "resigned" ? "bg-blue-600 text-white" : "bg-gray-200"}`}
    onClick={() => setStatusFilter("resigned")}
  >
    ออกแล้ว
  </button>
</div>
      <EmployeeTable employees={data} />
      {/* <EmployeeTable employees={filteredEmployees} /> */}
    </div>
  );
};

export default listEmployee;
