/* eslint-disable @typescript-eslint/no-explicit-any */
// src/components/EmployeeTable.jsx
import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TableSortLabel,
  TablePagination,
} from "@mui/material";

const EmployeeTable = ({ employees }: any) => {
  const [order, setOrder] = useState<any>("asc");
  const [orderBy, setOrderBy] = useState<any>("fullname");
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(8);

  const handleRequestSort = (property: any) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const sortedEmployees = employees.sort((a: any, b: any) => {
    if (orderBy === "id") {
      return order === "asc" ? a.id - b.id : b.id - a.id;
    } else {
      return order === "asc"
        ? a[orderBy].localeCompare(b[orderBy])
        : b[orderBy].localeCompare(a[orderBy]);
    }
  });

  const paginatedEmployees = sortedEmployees.slice(
    page * rowsPerPage,
    page * rowsPerPage + rowsPerPage
  );
  const headers = Object.keys(employees[0]);
  return (
    <Paper className="p-4">
      <TableContainer>
        <Table>
          <TableHead className="bg-blue-500">
            <TableRow>
              {headers.map((header) => (
                <TableCell key={header} className="text-white">
                  <TableSortLabel
                    active={orderBy === header}
                    direction={orderBy === header ? order : "asc"}
                    onClick={() => handleRequestSort(header)}
                    className="text-white"
                  >
                    {header.charAt(0).toUpperCase() + header.slice(1)}
                  </TableSortLabel>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {paginatedEmployees.map((employee) => (
              <TableRow key={employee.id}>
                {headers.map((header) => (
                  <TableCell key={header} className="text-sm">
                    {employee[header]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={employees.length}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};

export default EmployeeTable;
