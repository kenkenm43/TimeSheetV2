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
  IconButton,
} from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import moment from "moment";
import { getSalaryByEmpId } from "../../services/salaryServices";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { ArrowLeftIcon } from "@mui/x-date-pickers/icons";

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
  const [datas, setDatas] = useState<any>([]);
  const [date, setDate] = useState<any>();
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await getSalaryByEmpId(
          {
            month: moment().month(),
            year: moment().year(),
          },
          "all"
        );
        setDatas(response.data);
        setLoading(false);
      } catch (error) {
        console.log("Error fetching data: ", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const data = useMemo(
    () =>
      datas.map((dt: any) => {
        return {
          name: `${dt.employee.firstName} ${dt.employee.lastName} (${dt.employee.nickName})`,
          salary: `${dt.amount}`,
          ot: `${dt.ot * 750}`,
          perdiem: `${dt.perdiem * 250}`,
        };
      }),
    [datas]
  );
  const handleRequestSort = (property: any) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  const filteredData = useMemo(() => {
    return data.filter((row: any) =>
      row.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, data]);

  const sortedData = useMemo(() => {
    return filteredData.sort(getComparator(order, orderBy));
  }, [filteredData, order, orderBy]);

  const totalSalary = filteredData.reduce(
    (sum: any, row: any) => sum + row.salary,
    0
  );
  const totalOT = filteredData.reduce((sum: any, row: any) => sum + row.ot, 0);
  const totalPerdiem = filteredData.reduce(
    (sum: any, row: any) => sum + row.perdiem,
    0
  );
  console.log(date);
  const handleDate = async (e: any) => {
    try {
      const response = await getSalaryByEmpId(
        {
          month: moment(e).month(),
          year: moment(e).year(),
        },
        "all"
      );
      setDatas(response.data);
    } catch (error) {
      console.log("Error fetching data: ", error);
    }
  };
  const [selectedDate, setSelectedDate] = useState(null);

  const handleDateChange = (newDate: any) => {
    setSelectedDate(newDate);
    console.log(newDate); // Do something with the selected date
  };
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
              <Stack direction="row" justifyItems={"center"} spacing={2}>
                <DatePicker
                  openTo="year"
                  onChange={handleDate}
                  value={date}
                  label={'"year"'}
                  defaultValue={moment()}
                  views={["year"]}
                />
                <DatePicker
                  // onChange={handleDate}
                  openTo="month"
                  value={date}
                  label={'"month"'}
                  views={["month"]}
                />
              </Stack>
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
          {sortedData.map((row: any, index: any) => (
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
