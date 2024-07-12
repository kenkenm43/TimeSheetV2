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
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";
import { getSalaryByEmpId } from "../../services/salaryServices";
import { MonthCalendar } from "@mui/x-date-pickers/MonthCalendar";
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
        console.log("res", response.data);

        setDatas(response.data);
        setLoading(false);
      } catch (error) {
        console.log("Error fetching data: ", error);
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const data: any = useMemo(
    () =>
      datas.map((dt: any) => {
        return {
          date: `${dt.year}/${dt.month + 1}`,
          name: `${dt.employee.firstName} ${dt.employee.lastName} (${dt.employee.nickName})`,
          salary: `${dt.amount}`,
          ot: `${dt.ot * 750}`,
          perdiem: `${dt.perdiem * 250}`,
        };
      }),
    [datas]
  );
  console.log(data);
  const headers = ["ปี/เดือน", "name", "salary", "ot", "perdiem"];
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
    (sum: any, row: any) => Number(sum) + Number(row.salary),
    0
  );
  const totalOT = filteredData.reduce(
    (sum: any, row: any) => Number(sum) + Number(row.ot),
    0
  );
  const totalPerdiem = filteredData.reduce(
    (sum: any, row: any) => Number(sum) + Number(row.perdiem),
    0
  );
  const handleDate = async (e: any) => {
    console.log(e);

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
                  onChange={handleDate}
                  value={date}
                  label={'"year"'}
                  defaultValue={moment()}
                  views={["year"]}
                />
                <DatePicker
                  // onChange={handleDate}
                  value={date}
                  onChange={handleDate}
                  label={'"month"'}
                  views={["month"]}
                  slotProps={{
                    field: { clearable: true, onClear: () => {} },
                  }}
                />
              </Stack>
            </DemoContainer>
          </LocalizationProvider>
        </div>
        <div>
          <div>Show date</div>
        </div>
      </Stack>
      <Table>
        <TableHead>
          <TableRow>
            {headers.map((v) => {
              return (
                <TableCell sortDirection={orderBy === v ? order : false}>
                  <TableSortLabel
                    active={orderBy === v}
                    direction={orderBy === v ? order : "asc"}
                    onClick={() => handleRequestSort(v)}
                  >
                    {v}
                  </TableSortLabel>
                </TableCell>
              );
            })}
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedData.map((row: any, index: any) => (
            <TableRow key={index}>
              <TableCell>{row.date}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>
                {row.salary
                  .toString()
                  .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") || "-"}
              </TableCell>
              <TableCell>
                {row.ot
                  .toString()
                  .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") || "-"}
              </TableCell>
              <TableCell>
                {row.perdiem
                  .toString()
                  .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") || "-"}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell></TableCell>
            <TableCell>Total</TableCell>
            <TableCell>
              {totalSalary
                .toString()
                .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") || "-"}
            </TableCell>
            <TableCell>
              {totalOT
                .toString()
                .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") || "-"}
            </TableCell>
            <TableCell>
              {totalPerdiem
                .toString()
                .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") || "-"}
            </TableCell>
          </TableRow>
        </TableFooter>
      </Table>
    </TableContainer>
  );
};

export default dashBoard;
