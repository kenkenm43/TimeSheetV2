/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useMemo } from "react";
import EmployeeTable from "../../components/Admin/Table/ListEmployee";
import useKeepEmployeesStore from "../../context/KeepEmployeesProvider";

const listEmployee = () => {
  const { employees, setEmployees } = useKeepEmployeesStore();
  //   const employees = [
  //     { id: 1, fullname: "John Doe", nickname: "Johnny", idCard: "ID12345" },
  //     { id: 2, fullname: "Jane Smith", nickname: "Janey", idCard: "ID67890" },
  //     { id: 3, fullname: "Sam Johnson", nickname: "Sammy", idCard: "ID11223" },
  //     // Add more employee data here
  //   ];

  const data: any = useMemo(
    () =>
      employees.map((emp: any) => {
        return {
          fullname: `${emp.firstName} ${emp.lastName} ${
            emp.nickname ? emp.nickname : ""
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
          date_of_birth: `${emp.date_of_birth || "-"}`,
        };
      }),
    [employees]
  );
  return (
    <div className="mt-5">
      <div className="text-2xl font-bold">ตารางพนักงาน</div>
      <EmployeeTable employees={data} />
    </div>
  );
};

export default listEmployee;
