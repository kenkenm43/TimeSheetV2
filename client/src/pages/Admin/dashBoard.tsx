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
import { useEffect, useMemo, useState } from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";
import * as XLSX from "xlsx";
import { getSalaryByEmpId } from "../../services/salaryServices";
import { ROLESEMPLOOYEE } from "../../Enum/RoleEmployee";
import Loading from "../../components/Loading";
import { calOT } from "../../helpers/cal";
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
  const [loading, setLoading] = useState<boolean>(false);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getSalaryByEmpId(
          {
            // month: moment().month(),
            year: moment().year(),
          },
          "all"
        );
        console.log(response.data);

        setDatas(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const data: any = useMemo(
    () =>
      datas.map((dt: any) => {
        console.log(dt);

        return {
          year: dt.year,
          month: dt.month,
          name: `${dt.employee.firstName || "-"} ${
            dt.employee.lastName || "-"
          } (${dt.employee.nickName || "-"})`,
          position: `${
            dt.employee.Employment_Details.position === ROLESEMPLOOYEE.General
              ? "พนักงานทั่วไป"
              : "-"
          }`,
          salary: `${dt.amount}`,
          ot: `${dt.ot * calOT(dt.amount)}`,
          perdiem: `${dt.perdiem * 250}`,
          sso: `${dt.sso}`,
          total: `${
            dt.amount + dt.ot * calOT(dt.amount) + dt.perdiem * 250 - dt.sso
          }`,
          bank_account_name: `${
            dt.employee.Financial_Details.bank_name || "-"
          }`,
          bank_account_number: `${
            dt.employee.Financial_Details.bank_account_number || "-"
          }`,
        };
      }),
    [datas]
  );
  const headers = [
    "year",
    "month",
    "name",
    "position",
    "salary",
    "ot",
    "perdiem",
    "ประกันสังคม",
    "total",
    "ชื่อบัญชีธนาคาร",
    "เลขบัญชีธนาคาร",
  ];
  const handleRequestSort = (property: any) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };
  const [selectedMonth, setSelectedMonth] = useState<any>();
  const [selectedYear, setSelectedYear] = useState<any>();
  const filteredData = useMemo(() => {
    return data.filter((row: any) => {
      const matchesName = row.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesPosition = row.position
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const matchesMonth = !selectedMonth || row.month === selectedMonth;
      const matchesYear = !selectedYear || row.year === selectedYear;
      return (matchesName || matchesPosition) && matchesMonth && matchesYear;
    });
  }, [searchTerm, selectedMonth, selectedYear, data]);

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
  const totalSSO = filteredData.reduce(
    (sum: any, row: any) => Number(sum) + Number(row.sso),
    0
  );

  const handleChangeMonth = (e: any) => {
    setSelectedMonth(moment(e).month());
  };
  const handleChangeYear = (e: any) => {
    setSelectedYear(moment(e).year());
  };

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Filtered Data");

    // Export the Excel file
    XLSX.writeFile(workbook, `List${moment()}.xlsx`);
  };
  return (
    <TableContainer component={Paper}>
      {loading && <Loading />}
      <Stack direction="row" justifyItems={"center"} spacing={2}>
        <div>
          <TextField
            label='"ค้นหาชื่อ"'
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
                  onChange={handleChangeYear}
                  label={'"ปี"'}
                  views={["year"]}
                  slotProps={{
                    field: { clearable: true, onClear: () => {} },
                  }}
                />
                <DatePicker
                  onChange={handleChangeMonth}
                  label={'"เดือน"'}
                  views={["month"]}
                  slotProps={{
                    field: { clearable: true, onClear: () => {} },
                  }}
                />
              </Stack>
            </DemoContainer>
          </LocalizationProvider>
        </div>
        <button
          className="px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75"
          onClick={exportToExcel}
        >
          Export to Excel
        </button>
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
              <TableCell>{row.year}</TableCell>
              <TableCell>{row.month}</TableCell>
              <TableCell>{row.name}</TableCell>
              <TableCell>{row.position}</TableCell>
              <TableCell align="center">
                {row.salary
                  .toString()
                  .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") || "-"}
              </TableCell>
              <TableCell align="center">
                {row.ot
                  .toString()
                  .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") || "-"}
              </TableCell>
              <TableCell align="center">
                {row.perdiem
                  .toString()
                  .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") || "-"}
              </TableCell>
              <TableCell align="center">
                {row.sso
                  .toString()
                  .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") || "-"}
              </TableCell>
              <TableCell align="center">
                {(
                  Number(row.perdiem) +
                  Number(row.ot) +
                  Number(row.salary) -
                  Number(row.sso)
                )
                  .toString()
                  .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") || "-"}
              </TableCell>
              <TableCell align="center">{row.bank_account_name}</TableCell>{" "}
              <TableCell align="center">{row.bank_account_number}</TableCell>
            </TableRow>
          ))}
        </TableBody>
        <TableFooter>
          <TableRow>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell></TableCell>
            <TableCell>Total</TableCell>
            <TableCell align="center">
              {totalSalary
                .toString()
                .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") || "-"}
            </TableCell>
            <TableCell align="center">
              {totalOT
                .toString()
                .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") || "-"}
            </TableCell>
            <TableCell align="center">
              {totalPerdiem
                .toString()
                .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") || "-"}
            </TableCell>
            <TableCell align="center">
              {totalSSO
                .toString()
                .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") || "-"}
            </TableCell>
            <TableCell align="center">
              {(totalPerdiem + totalOT + totalSalary - totalSSO)
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
