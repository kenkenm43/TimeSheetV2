import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import { Table, TableBody, TableCell, TableContainer, TableFooter, TableHead, TableRow, Paper, TextField, TableSortLabel, Stack, } from "@mui/material";
import { useEffect, useMemo, useState } from "react";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import moment from "moment";
import * as XLSX from "xlsx";
import { getSalaryByEmpId } from "../../services/salaryServices";
const getComparator = (order, orderBy) => {
    return (a, b) => {
        if (b[orderBy] < a[orderBy])
            return order === "asc" ? -1 : 1;
        if (b[orderBy] > a[orderBy])
            return order === "asc" ? 1 : -1;
        return 0;
    };
};
const dashBoard = () => {
    const [searchTerm, setSearchTerm] = useState("");
    const [order, setOrder] = useState("asc");
    const [orderBy, setOrderBy] = useState("name");
    const [datas, setDatas] = useState([]);
    const [setLoading] = useState(false);
    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await getSalaryByEmpId({
                    // month: moment().month(),
                    year: moment().year(),
                }, "all");
                console.log("res", response.data);
                setDatas(response.data);
                setLoading(false);
            }
            catch (error) {
                console.log("Error fetching data: ", error);
                setLoading(false);
            }
        };
        fetchData();
    }, []);
    const data = useMemo(() => datas.map((dt) => {
        return {
            year: dt.year,
            month: dt.month,
            name: `${dt.employee.firstName || "-"} ${dt.employee.lastName || "-"} (${dt.employee.nickName || "-"})`,
            salary: `${dt.amount}`,
            ot: `${dt.ot * 750}`,
            perdiem: `${dt.perdiem * 250}`,
            sso: `${dt.sso}`,
        };
    }), [datas]);
    console.log(data);
    const headers = [
        "ปี",
        "เดือน",
        "ชื่อ",
        "salary",
        "ot",
        "perdiem",
        "ประกันสังคม",
        "total",
    ];
    const handleRequestSort = (property) => {
        const isAsc = orderBy === property && order === "asc";
        setOrder(isAsc ? "desc" : "asc");
        setOrderBy(property);
    };
    const [selectedMonth, setSelectedMonth] = useState();
    const [selectedYear, setSelectedYear] = useState();
    const filteredData = useMemo(() => {
        return data.filter((row) => {
            const matchesName = row.name
                .toLowerCase()
                .includes(searchTerm.toLowerCase());
            const matchesMonth = !selectedMonth || row.month === selectedMonth;
            const matchesYear = !selectedYear || row.year === selectedYear;
            return matchesName && matchesMonth && matchesYear;
        });
    }, [searchTerm, selectedMonth, selectedYear, data]);
    console.log("filter", filteredData);
    const sortedData = useMemo(() => {
        return filteredData.sort(getComparator(order, orderBy));
    }, [filteredData, order, orderBy]);
    const totalSalary = filteredData.reduce((sum, row) => Number(sum) + Number(row.salary), 0);
    const totalOT = filteredData.reduce((sum, row) => Number(sum) + Number(row.ot), 0);
    const totalPerdiem = filteredData.reduce((sum, row) => Number(sum) + Number(row.perdiem), 0);
    const totalSSO = filteredData.reduce((sum, row) => Number(sum) + Number(row.sso), 0);
    const handleChangeMonth = (e) => {
        setSelectedMonth(moment(e).month());
    };
    const handleChangeYear = (e) => {
        setSelectedYear(moment(e).year());
    };
    const exportToExcel = () => {
        const worksheet = XLSX.utils.json_to_sheet(filteredData);
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Filtered Data");
        // Export the Excel file
        XLSX.writeFile(workbook, "List.xlsx");
    };
    return (_jsxs(TableContainer, { component: Paper, children: [_jsxs(Stack, { direction: "row", justifyItems: "center", spacing: 2, children: [_jsx("div", { children: _jsx(TextField, { label: "Search by name", variant: "outlined", margin: "dense", value: searchTerm, onChange: (e) => setSearchTerm(e.target.value) }) }), _jsx("div", { children: _jsx(LocalizationProvider, { dateAdapter: AdapterMoment, children: _jsx(DemoContainer, { components: ["DatePicker", "DatePicker", "DatePicker"], children: _jsxs(Stack, { direction: "row", justifyItems: "center", spacing: 2, children: [_jsx(DatePicker, { onChange: handleChangeYear, label: '"year"', views: ["year"], slotProps: {
                                                field: { clearable: true, onClear: () => { } },
                                            } }), _jsx(DatePicker, { onChange: handleChangeMonth, label: '"month"', views: ["month"], slotProps: {
                                                field: { clearable: true, onClear: () => { } },
                                            } })] }) }) }) }), _jsx("button", { className: "px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-opacity-75", onClick: exportToExcel, children: "Export to Excel" })] }), _jsxs(Table, { children: [_jsx(TableHead, { children: _jsx(TableRow, { children: headers.map((v) => {
                                return (_jsx(TableCell, { sortDirection: orderBy === v ? order : false, children: _jsx(TableSortLabel, { active: orderBy === v, direction: orderBy === v ? order : "asc", onClick: () => handleRequestSort(v), children: v }) }));
                            }) }) }), _jsx(TableBody, { children: sortedData.map((row, index) => (_jsxs(TableRow, { children: [_jsx(TableCell, { children: row.year }), _jsx(TableCell, { children: row.month + 1 }), _jsx(TableCell, { children: row.name }), _jsx(TableCell, { children: row.salary
                                        .toString()
                                        .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") || "-" }), _jsx(TableCell, { children: row.ot
                                        .toString()
                                        .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") || "-" }), _jsx(TableCell, { children: row.perdiem
                                        .toString()
                                        .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") || "-" }), _jsx(TableCell, { children: row.sso
                                        .toString()
                                        .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") || "-" }), _jsx(TableCell, { children: (Number(row.perdiem) +
                                        Number(row.ot) +
                                        Number(row.salary) -
                                        Number(row.sso))
                                        .toString()
                                        .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") || "-" })] }, index))) }), _jsx(TableFooter, { children: _jsxs(TableRow, { children: [_jsx(TableCell, {}), _jsx(TableCell, {}), _jsx(TableCell, { children: "Total" }), _jsx(TableCell, { children: totalSalary
                                        .toString()
                                        .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") || "-" }), _jsx(TableCell, { children: totalOT
                                        .toString()
                                        .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") || "-" }), _jsx(TableCell, { children: totalPerdiem
                                        .toString()
                                        .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") || "-" }), _jsx(TableCell, { children: totalSSO
                                        .toString()
                                        .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") || "-" }), _jsx(TableCell, { children: (totalPerdiem + totalOT + totalSalary - totalSSO)
                                        .toString()
                                        .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") || "-" })] }) })] })] }));
};
export default dashBoard;
