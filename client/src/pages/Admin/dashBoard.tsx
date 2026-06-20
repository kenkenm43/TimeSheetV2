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
  TablePagination,
  Button,
  Typography,
  Box,
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

// Helper ฟังก์ชันสำหรับ Format ตัวเลข (ลดการเขียน Regex ซ้ำๆ)
const formatNumber = (num: any) => {
  if (!num && num !== 0) return "-";
  return Number(num).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 2 });
};

const getComparator = (order: any, orderBy: any) => {
  return (a: any, b: any) => {
    if (a.year !== b.year) {
      if (b.year < a.year) return order === "asc" ? -1 : 1;
      if (b.year > a.year) return order === "asc" ? 1 : -1;
    }
    if (a.month !== b.month) {
      if (b.month < a.month) return order === "asc" ? -1 : 1;
      if (b.month > a.month) return order === "asc" ? 1 : -1;
    }
    if (b[orderBy] < a[orderBy]) return order === "asc" ? -1 : 1;
    if (b[orderBy] > a[orderBy]) return order === "asc" ? 1 : -1;
    return 0;
  };
};

const Dashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [order, setOrder] = useState<any>("asc");
  const [orderBy, setOrderBy] = useState<any>("year");
  const [datas, setDatas] = useState<any>([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState<boolean>(false);
  const [selectedMonth, setSelectedMonth] = useState<any>();
  const [selectedYear, setSelectedYear] = useState<any>();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const response = await getSalaryByEmpId(
          {
            year: moment().year(),
          },
          "all"
        );
        setDatas(response.data);
        setSelectedYear(moment().year());
        setSelectedMonth(moment().month() + 1);
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
        return {
          year: dt.year,
          month: dt.month,
          name: `${dt.employee.firstName || "-"} ${dt.employee.lastName || "-"} (${dt.employee.nickName || "-"})`,
          position: dt.employee.Employment_Details.position === ROLESEMPLOOYEE.General ? "พนักงานทั่วไป" : "-",
          salary: dt.amount,
          ot: dt.ot * calOT(dt.amount),
          perdiem: dt.perdiem * 250,
          sso: dt.sso,
          total: dt.amount + dt.ot * calOT(dt.amount) + dt.perdiem * 250 - dt.sso,
          bank_account_name: dt.employee.Financial_Details?.bank_name || "-",
          bank_account_number: dt.employee.Financial_Details?.bank_account_number || "-",
        };
      }),
    [datas]
  );

  const headers = [
    { id: "year", label: "ปี" },
    { id: "month", label: "เดือน" },
    { id: "name", label: "ชื่อ-นามสกุล" },
    { id: "position", label: "ตำแหน่ง" },
    { id: "salary", label: "เงินเดือน" },
    { id: "ot", label: "OT" },
    { id: "perdiem", label: "เบี้ยเลี้ยง" },
    { id: "sso", label: "ประกันสังคม" },
    { id: "total", label: "ยอดสุทธิ" },
    { id: "bank_account_name", label: "ชื่อบัญชีธนาคาร" },
    { id: "bank_account_number", label: "เลขบัญชีธนาคาร" },
  ];

  const handleRequestSort = (property: any) => {
    const isAsc = orderBy === property && order === "asc";
    setOrder(isAsc ? "desc" : "asc");
    setOrderBy(property);
  };

  const filteredData = useMemo(() => {
    return data.filter((row: any) => {
      const matchesName = row.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPosition = row.position.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesMonth = !selectedMonth || row.month === selectedMonth;
      const matchesYear = !selectedYear || row.year === selectedYear;
      return (matchesName || matchesPosition) && matchesMonth && matchesYear;
    });
  }, [searchTerm, selectedMonth, selectedYear, data]);

  const sortedData = useMemo(() => {
    return filteredData.sort(getComparator(order, orderBy));
  }, [filteredData, order, orderBy]);

  const paginatedEmployees = sortedData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);

  const totalSalary = filteredData.reduce((sum: any, row: any) => Number(sum) + Number(row.salary), 0);
  const totalOT = filteredData.reduce((sum: any, row: any) => Number(sum) + Number(row.ot), 0);
  const totalPerdiem = filteredData.reduce((sum: any, row: any) => Number(sum) + Number(row.perdiem), 0);
  const totalSSO = filteredData.reduce((sum: any, row: any) => Number(sum) + Number(row.sso), 0);
  const netTotal = totalPerdiem + totalOT + totalSalary - totalSSO;

  const handleChangePage = (event: any, newPage: any) => setPage(newPage);
  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleChangeMonth = (e: any) => setSelectedMonth(e ? moment(e).month() + 1 : null);
  const handleChangeYear = (e: any) => setSelectedYear(e ? moment(e).year() : null);

  const exportToExcel = () => {
    const worksheet = XLSX.utils.json_to_sheet(filteredData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Filtered Data");
    XLSX.writeFile(workbook, `Salary_Report_${moment().format("YYYY-MM-DD")}.xlsx`);
  };

  return (
    <Box sx={{ p: 2 }}>
      {/* Header */}
      <Typography variant="h5" fontWeight="bold" sx={{ mb: 3, color: "text.primary" }}>
        รายงานสรุปเงินเดือนพนักงาน
      </Typography>

      <Paper sx={{ width: "100%", overflow: "hidden", borderRadius: 2, boxShadow: 3 }}>
        {/* Toolbar Section */}
        <Box sx={{ p: 3, borderBottom: "1px solid #e0e0e0", backgroundColor: "#fafafa" }}>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            alignItems={{ xs: "stretch", md: "center" }}
            justifyContent="space-between"
          >
            {/* Filter Controls */}
            <Stack direction={{ xs: "column", sm: "row" }} spacing={2} alignItems="center" flexWrap="wrap">
              <TextField
                label="ค้นหาชื่อ / ตำแหน่ง"
                variant="outlined"
                size="small"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                sx={{ minWidth: 200, backgroundColor: "#fff" }}
              />

              <LocalizationProvider dateAdapter={AdapterMoment}>
                <DemoContainer components={["DatePicker", "DatePicker"]} sx={{ pt: 0 }}>
                  <Stack direction="row" spacing={2}>
                    <DatePicker
                      onChange={handleChangeYear}
                      label="ปี"
                      value={selectedYear ? moment().year(selectedYear) : null}
                      views={["year"]}
                      slotProps={{
                        textField: { size: "small", sx: { backgroundColor: "#fff", width: 150 } },
                        field: { clearable: true, onClear: () => setSelectedYear(null) },
                      }}
                    />
                    <DatePicker
                      onChange={handleChangeMonth}
                      label="เดือน"
                      value={selectedMonth ? moment().month(selectedMonth - 1) : null}
                      views={["month"]}
                      slotProps={{
                        textField: { size: "small", sx: { backgroundColor: "#fff", width: 150 } },
                        field: { clearable: true, onClear: () => setSelectedMonth(null) },
                      }}
                    />
                  </Stack>
                </DemoContainer>
              </LocalizationProvider>
            </Stack>

            {/* Export Button */}
            <Button
              variant="contained"
              color="success"
              onClick={exportToExcel}
              sx={{ height: 40, whiteSpace: "nowrap", textTransform: "none", fontWeight: "bold" }}
            >
              Export to Excel
            </Button>
          </Stack>
        </Box>

        {/* Table Section */}
        <TableContainer sx={{ maxHeight: 600 }}>
          {loading && <Loading />}
          <Table stickyHeader>
            <TableHead>
              <TableRow>
                {headers.map((headCell) => (
                  <TableCell
                    key={headCell.id}
                    sortDirection={orderBy === headCell.id ? order : false}
                    sx={{ backgroundColor: "#f5f5f5", fontWeight: "bold", whiteSpace: "nowrap" }}
                    align={["salary", "ot", "perdiem", "sso", "total"].includes(headCell.id) ? "right" : "left"}
                  >
                    <TableSortLabel
                      active={orderBy === headCell.id}
                      direction={orderBy === headCell.id ? order : "asc"}
                      onClick={() => handleRequestSort(headCell.id)}
                    >
                      {headCell.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedEmployees.length > 0 ? (
                paginatedEmployees.map((row: any, index: any) => (
                  <TableRow key={index} hover sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                    <TableCell>{row.year}</TableCell>
                    <TableCell>{row.month}</TableCell>
                    <TableCell>{row.name}</TableCell>
                    <TableCell>{row.position}</TableCell>
                    <TableCell align="right">{formatNumber(row.salary)}</TableCell>
                    <TableCell align="right">{formatNumber(row.ot)}</TableCell>
                    <TableCell align="right">{formatNumber(row.perdiem)}</TableCell>
                    <TableCell align="right">{formatNumber(row.sso)}</TableCell>
                    <TableCell align="right" sx={{ fontWeight: "bold", color: "primary.main" }}>
                      {formatNumber(row.total)}
                    </TableCell>
                    <TableCell>{row.bank_account_name}</TableCell>
                    <TableCell>{row.bank_account_number}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={11} align="center" sx={{ py: 3 }}>
                    ไม่พบข้อมูล
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            
            {/* Table Footer / Totals */}
            <TableFooter sx={{ backgroundColor: "#fafafa" }}>
              <TableRow>
                <TableCell colSpan={4} align="right" sx={{ fontWeight: "bold" }}>
                  ยอดรวมทั้งหมด (Total)
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>{formatNumber(totalSalary)}</TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>{formatNumber(totalOT)}</TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>{formatNumber(totalPerdiem)}</TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold" }}>{formatNumber(totalSSO)}</TableCell>
                <TableCell align="right" sx={{ fontWeight: "bold", color: "primary.main" }}>{formatNumber(netTotal)}</TableCell>
                <TableCell colSpan={2}></TableCell>
              </TableRow>
            </TableFooter>
          </Table>
        </TableContainer>

        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={sortedData.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          labelRowsPerPage="จำนวนแถวต่อหน้า:"
        />
      </Paper>
    </Box>
  );
};

export default Dashboard;