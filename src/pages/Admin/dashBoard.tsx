/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableFooter,
  TableHead,
  TableRow,
  Paper,
  TextField,
  TableSortLabel,
  Stack,
} from "@mui/material";
import { useMemo, useState } from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import moment from "moment";

const getComparator = (order: any, orderBy: any) => {
  return (a: any, b: any) => {
    if (b[orderBy] < a[orderBy]) return order === "asc" ? -1 : 1;
    if (b[orderBy] > a[orderBy]) return order === "asc" ? 1 : -1;
    return 0;
  };
};
const dashBoard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [order, setOrder] = useState<any>("asc");
  const [orderBy, setOrderBy] = useState<any>("name");
  const data = useMemo(
    () => [
      { name: "Tiger Nixon", salary: 320800, ot: 20000, perdiem: 20000 },
      { name: "Garrett Winters", salary: 170750, ot: 15000, perdiem: 50000 },
      // More data here
    ],
    []
  );

  const handleRequestSort = (property: any) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  const filteredData = useMemo(() => {
    return data.filter((row) =>
      row.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, data]);

  const sortedData = useMemo(() => {
    return filteredData.sort(getComparator(order, orderBy));
  }, [filteredData, order, orderBy]);

  const totalSalary = filteredData.reduce((sum, row) => sum + row.salary, 0);
  const totalOT = filteredData.reduce((sum, row) => sum + row.ot, 0);
  const totalPerdiem = filteredData.reduce((sum, row) => sum + row.perdiem, 0);
  return (
    <TableContainer component={Paper}>
      <Stack direction="row" justifyItems={"center"} spacing={2}>
        <div>
          <TextField
            label="Search by name"
            variant="outlined"
            margin="dense"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div>
          <LocalizationProvider dateAdapter={AdapterMoment}>
            <DemoContainer
              components={["DatePicker", "DatePicker", "DatePicker"]}
            >
              <DatePicker
                label={'"month" and "year"'}
                defaultValue={moment()}
                views={["month", "year"]}
              />
            </DemoContainer>
          </LocalizationProvider>
        </div>
        <div>Show date</div>
      </Stack>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell sortDirection={orderBy === "name" ? order : false}>
              <TableSortLabel
                active={orderBy === "name"}
                direction={orderBy === "name" ? order : "asc"}
                onClick={() => handleRequestSort("name")}
              >
                Name
              </TableSortLabel>
            </TableCell>
            <TableCell sortDirection={orderBy === "salary" ? order : false}>
              <TableSortLabel
                active={orderBy === "salary"}
                direction={orderBy === "salary" ? order : "asc"}
                onClick={() => handleRequestSort("salary")}
              >
                Salary
              </TableSortLabel>
            </TableCell>
            <TableCell sortDirection={orderBy === "ot" ? order : false}>
              <TableSortLabel
                active={orderBy === "ot"}
                direction={orderBy === "ot" ? order : "asc"}
                onClick={() => handleRequestSort("ot")}
              >
                OT
              </TableSortLabel>
            </TableCell>
            <TableCell sortDirection={orderBy === "perdiem" ? order : false}>
              <TableSortLabel
                active={orderBy === "perdiem"}
                direction={orderBy === "perdiem" ? order : "asc"}
                onClick={() => handleRequestSort("perdiem")}
              >
                Perdiem
              </TableSortLabel>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedData.map((row, index) => (
            <TableRow key={index}>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.salary}</TableCell>
              <TableCell>{row.ot}</TableCell>
              <TableCell>{row.perdiem}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell>Total</TableCell>
            <TableCell>{totalSalary}</TableCell>
            <TableCell>{totalOT}</TableCell>
            <TableCell>{totalPerdiem}</TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

export default dashBoard;
