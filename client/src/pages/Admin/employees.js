import { jsx as _jsx, Fragment as _Fragment, jsxs as _jsxs } from "react/jsx-runtime";
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from "react";
import useKeepEmployeeStore from "../../context/KeepEmployeeProvider";
import { getEmployee, getLeavesBypost, getWorkSchedulesByPost, updateEmployeeStartWork, } from "../../services/employeeServices";
import Calendar from "../../components/Admin/Calendar";
import { FaEdit, FaRegSave } from "react-icons/fa";
import moment from "moment";
import Loading from "../../components/Loading";
import Note from "../../components/Admin/์Note";
import { DatePicker, Input } from "rsuite";
import Swal from "sweetalert2";
var WorkStatus;
(function (WorkStatus) {
    WorkStatus["COME"] = "come";
    WorkStatus["NOTCOME"] = "notcome";
    WorkStatus["LEAVE"] = "leave";
})(WorkStatus || (WorkStatus = {}));
const employees = () => {
    const { keepEmployee, setKeepEmployee } = useKeepEmployeeStore();
    const [workSchedule, setWorkSchedule] = useState();
    const [typeButton, setTypeButton] = useState("Calendar");
    const [leave, setLeave] = useState();
    const [costSSO, setCostSSO] = useState(750);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingEvent, setIsLoadingEvent] = useState(false);
    const [currentStart, setCurrentStart] = useState("");
    const [currentEnd, setCurrentEnd] = useState("");
    const [totalDayInMonth, setTotalDayInMonth] = useState();
    const [events, setEvents] = useState([]);
    // const [events, setEvents] = useState<any>();
    function getTotalDaysInMonth(monthString) {
        // Parse the month string into a Date object
        const date = new Date(monthString);
        // Check if the date is valid
        if (isNaN(date)) {
            return -1; // Invalid date
        }
        // Get the month and year from the Date object
        const month = date.getMonth() + 1; // Months are zero indexed, so we add 1
        const year = date.getFullYear();
        // Return the number of days in the month
        return new Date(year, month, 0).getDate();
    }
    const handleMonthChange = async (payload) => {
        console.log("view payload", payload);
        setCurrentStart(payload.view.currentStart);
        setCurrentEnd(payload.view.currentEnd);
        setTotalDayInMonth(getTotalDaysInMonth(payload.view.title));
        const work = await getWorkSchedulesByPost({
            currentStart: moment(payload.view.currentStart).format("YYYY-MM-DD"),
            currentEnd: moment(payload.view.currentEnd).format("YYYY-MM-DD"),
        }, keepEmployee.id);
        const leave = await getLeavesBypost({
            currentStart: moment(payload.view.currentStart).format("YYYY-MM-DD"),
            currentEnd: moment(payload.view.currentEnd).format("YYYY-MM-DD"),
        }, keepEmployee.id);
        const eventsData = await addEvents(work.data, leave.data);
        setEvents(eventsData);
    };
    useEffect(() => {
        const fetchData = async () => {
            const work = await getWorkSchedulesByPost({
                currentStart: moment(currentStart).format("YYYY-MM-DD"),
                currentEnd: moment(currentEnd).format("YYYY-MM-DD"),
            }, keepEmployee.id);
            const leave = await getLeavesBypost({
                currentStart: moment(currentStart).format("YYYY-MM-DD"),
                currentEnd: moment(currentEnd).format("YYYY-MM-DD"),
            }, keepEmployee.id);
            const eventsData = await addEvents(work.data, leave.data);
            console.log("eventdata", eventsData);
            setEvents(eventsData);
        };
        if (currentStart && currentEnd) {
            fetchData();
        }
    }, [keepEmployee.id, currentStart, currentEnd]);
    const addEvents = (workArr, leaveArr) => {
        const formatWorkEvents = workArr.map((arr) => {
            let background;
            if (arr.work_status === WorkStatus.COME) {
                if (arr.work_perdium && arr.work_ot) {
                    background = "#e100ff";
                }
                else if (arr.work_perdium) {
                    background = "#0044ff";
                }
                else if (arr.work_ot) {
                    background = "#38bdf8";
                }
                else {
                    background = "green";
                }
            }
            else if (arr.work_status === WorkStatus.NOTCOME) {
                background = "gray";
            }
            const formatEvent = {
                id: arr.id,
                title: arr.work_status,
                start: moment(arr.work_start).utcOffset("-07:00")._d,
                end: moment(arr.work_end).utcOffset("-07:00")._d,
                ot: arr.work_ot,
                perdiem: arr.work_perdium,
                allDay: true,
                backgroundColor: background,
                type: arr.work_status,
                timeStart: moment(arr.work_start).utcOffset("-07:00")._d,
                timeEnd: moment(arr.work_end).utcOffset("-07:00")._d,
            };
            return formatEvent;
        });
        const leaveWorkEvents = leaveArr.map((arr) => {
            const formatEvent = {
                ...arr,
                id: arr.id,
                title: "leave",
                start: moment(arr.leave_date).utcOffset("-07:00")._d,
                end: arr.work_end,
                reason: arr.leave_reason,
                cause: arr.leave_cause,
                type: arr.leave_type,
                allDay: true,
                timeStart: moment(arr.leave_date).utcOffset("-07:00")._d,
                backgroundColor: "red",
            };
            return formatEvent;
        });
        return [...formatWorkEvents, ...leaveWorkEvents];
    };
    const filterWorkStatus = (text) => {
        const filter = events.filter((event) => event.title === text);
        return filter.length;
    };
    const [isEditProfile, setIsEditProfile] = useState(false);
    const handleEditProfile = () => {
        setIsEditProfile(true);
    };
    function formatPhoneNumber(phoneNumberString) {
        // Add dashes to the phone number
        const formatted = phoneNumberString?.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
        return formatted;
    }
    const [startDate, setStartDate] = useState(keepEmployee?.Employment_Details?.start_date
        ? new Date(keepEmployee?.Employment_Details?.start_date)
        : new Date());
    const [dateStart, setDateStart] = useState(keepEmployee?.Employment_Details?.start_date
        ? new Date(keepEmployee?.Employment_Details?.start_date)
        : new Date());
    const [salaryMock, setSalaryMock] = useState();
    useEffect(() => {
        setStartDate(keepEmployee?.Employment_Details?.start_date
            ? new Date(keepEmployee?.Employment_Details?.start_date)
            : new Date());
        setDateStart(keepEmployee?.Employment_Details?.start_date
            ? new Date(keepEmployee?.Employment_Details?.start_date)
            : new Date());
        setSalaryMock(keepEmployee?.Employment_Details?.salary
            ? keepEmployee?.Employment_Details?.salary
            : 0);
        setIsEditProfile(false);
    }, [keepEmployee]);
    const updateInfo = async () => {
        console.log(startDate);
        console.log(salaryMock);
        console.log("keepEmploye", keepEmployee.Employment_Details?.salary);
        console.log("keepEmploye", keepEmployee.Employment_Details?.salary);
        console.log(moment(startDate).format("yyyy-MM-DD") !==
            moment(keepEmployee?.Employment_Details?.start_date).format("yyyy-MM-DD"));
        console.log(keepEmployee?.Employment_Details?.salary !== salaryMock);
        try {
            if (moment(startDate).format("yyyy-MM-DD") !==
                moment(dateStart).format("yyyy-MM-DD") ||
                keepEmployee?.Employment_Details?.salary !== salaryMock) {
                console.log("update");
                const employeeDetail = await getEmployee(keepEmployee.id);
                console.log(employeeDetail.data);
                const updateStartDate = await updateEmployeeStartWork({ start_date: dateStart, salary: salaryMock }, keepEmployee.id);
                console.log("updateslary", updateStartDate);
                setStartDate(new Date(updateStartDate?.data.Employment_Details.start_date));
                setDateStart(new Date(updateStartDate?.data.Employment_Details.start_date));
                setSalaryMock(updateStartDate?.data.Employment_Details?.salary);
                const result = await Swal.fire({
                    title: "เปลี่ยนแปลงข้อมูลเรียบร้อย",
                    icon: "success",
                    confirmButtonColor: "#3085d6",
                    confirmButtonText: "ตกลง",
                });
                setIsEditProfile(false);
            }
            else {
                console.log("same");
                const result = await Swal.fire({
                    title: "เปลี่ยนแปลงข้อมูลเรียบร้อย",
                    icon: "success",
                    confirmButtonColor: "#3085d6",
                    confirmButtonText: "ตกลง",
                });
                setStartDate(new Date(keepEmployee?.Employment_Details?.start_date));
                setDateStart(new Date(keepEmployee?.Employment_Details?.start_date));
                setSalaryMock(keepEmployee?.Employment_Details?.salary);
                setIsEditProfile(false);
            }
        }
        catch (error) {
            console.log(error);
            const result = await Swal.fire({
                title: `ผิดพลาด`,
                text: `${error}`,
                icon: "error",
                confirmButtonColor: "#3085d6",
                confirmButtonText: "ตกลง",
            });
            console.log(error);
            setIsEditProfile(false);
        }
    };
    const handleChangeDate = (e) => {
        setDateStart(e);
    };
    return (_jsx(_Fragment, { children: keepEmployee ? (_jsxs("div", { className: "transition-all p-4 ml-8 min-w-[720px] relative", children: [isLoading && _jsx(Loading, {}), _jsx("div", { className: "p-1 border rounded-lg relative", children: _jsxs("div", { className: "flex items-center rounded space-x-5 ", children: [keepEmployee?.photo ? (_jsx(_Fragment, { children: _jsx("img", { className: "object-cover md:w-48 md:h-48 h-20 w-20", src: `http://localhost:8081/${keepEmployee.photo}`, alt: "img" }) })) : (_jsx(_Fragment, { children: _jsx("img", { className: "object-cover md:w-48 md:h-48 h-20 w-20", src: "https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2247726673.jpg", alt: "img" }) })), _jsxs("div", { className: "grid grid-cols-3 lg:space-x-14 space-x-5", children: [_jsxs("p", { className: "flex flex-col w-full space-y-1 ", children: [_jsxs("div", { className: "flex font-semibold", children: [_jsx("div", { className: "first-letter:uppercase", children: keepEmployee.firstName }), " ", _jsx("div", { className: "ml-5 first-letter:uppercase", children: keepEmployee.lastName })] }), _jsxs("span", { children: [_jsx("span", { className: "font-semibold", children: " \u0E40\u0E25\u0E02\u0E1A\u0E31\u0E15\u0E23\u0E1B\u0E23\u0E30\u0E0A\u0E32\u0E0A\u0E19 : " }), keepEmployee.idCard || "-"] }), _jsxs("span", { children: [_jsx("span", { className: "font-semibold", children: " \u0E27\u0E31\u0E19\u0E40\u0E01\u0E34\u0E14 : " }), keepEmployee.date_of_birth
                                                        ? moment(keepEmployee.date_of_birth).format("yyyy-MM-DD")
                                                        : "-"] }), _jsxs("span", { children: [_jsx("span", { className: "font-semibold", children: " \u0E2D\u0E35\u0E40\u0E21\u0E25 : " }), keepEmployee?.email || "-"] })] }), _jsxs("p", { className: "flex flex-col w-full space-y-1", children: [_jsxs("span", { children: [_jsx("span", { className: "font-semibold", children: " \u0E40\u0E1A\u0E2D\u0E23\u0E4C\u0E42\u0E17\u0E23\u0E28\u0E31\u0E1E\u0E17\u0E4C : " }), formatPhoneNumber(keepEmployee?.phone_number) || "-"] }), _jsxs("span", { children: [_jsx("span", { className: "font-semibold", children: " \u0E40\u0E07\u0E34\u0E19\u0E40\u0E14\u0E37\u0E2D\u0E19 : " }), !isEditProfile ? (salaryMock ? (salaryMock
                                                        .toString()
                                                        .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")) : ("-")) : (_jsx(Input, { name: "salary", value: salaryMock, type: "number", onChange: (e) => setSalaryMock(e) }))] }), _jsxs("span", { children: [_jsx("span", { className: "font-semibold", children: " \u0E27\u0E31\u0E19\u0E40\u0E23\u0E34\u0E48\u0E21\u0E07\u0E32\u0E19 : " }), !isEditProfile ? (_jsx(_Fragment, { children: moment(startDate).format("yyyy-MM-DD") || "-" })) : (_jsx(DatePicker, { name: "dateStart", value: dateStart, onSelect: handleChangeDate, onChange: handleChangeDate }))] }), _jsxs("span", { children: [_jsx("span", { className: "font-semibold", children: " \u0E17\u0E35\u0E48\u0E2D\u0E22\u0E39\u0E48 : " }), keepEmployee?.address || "-"] })] }), _jsxs("p", { className: "flex flex-col w-full space-y-1", children: [_jsxs("span", { children: [_jsx("span", { className: "font-semibold", children: " \u0E18\u0E19\u0E32\u0E04\u0E32\u0E23 : " }), keepEmployee?.Financial_Details?.bank_name || "-"] }), _jsxs("span", { children: [_jsx("span", { className: "font-semibold", children: " \u0E1A\u0E31\u0E0D\u0E0A\u0E35 : " }), keepEmployee?.Financial_Details?.bank_account_number ||
                                                        "-"] })] })] }), !isEditProfile ? (_jsx("div", { className: "absolute top-0 right-0 cursor-pointer", onClick: () => handleEditProfile(), children: _jsx(FaEdit, { size: 30 }) })) : (_jsx("div", { className: "absolute top-0 right-0 cursor-pointer", onClick: () => updateInfo(), children: _jsx(FaRegSave, { size: 30 }) }))] }) }), _jsxs("div", { className: "flex mt-2 space-x-1", children: [_jsx("button", { onClick: () => setTypeButton("Calendar"), className: `bg-gray-300 border border-gray-400 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded text-sm ${typeButton === "Calendar" ? "bg-gray-400 cursor-default" : ""}`, children: "\u0E1B\u0E0E\u0E34\u0E17\u0E34\u0E19" }), _jsx("button", { onClick: () => setTypeButton("Note"), className: `bg-gray-300 border border-gray-400 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded text-sm ${typeButton === "Note" ? "bg-gray-400 cursor-default" : ""}`, children: "\u0E42\u0E19\u0E4A\u0E15" })] }), typeButton === "Calendar" && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "flex", children: [_jsxs("div", { className: "flex pt-5 ml-10 space-x-5", children: [_jsxs("div", { className: "font-semibold", children: ["\u0E40\u0E14\u0E37\u0E2D\u0E19\u0E19\u0E35\u0E49 \u0E21\u0E35 ", totalDayInMonth, " \u0E27\u0E31\u0E19 :", " "] }), _jsxs("div", { className: "space-y-1", children: [_jsxs("div", { children: [" ", _jsxs("div", { className: "flex items-center space-x-2 ", children: [_jsx("div", { className: `w-[30px] h-[30px] bg-[#008000] border-2 border-black` }), _jsxs("span", { children: ["\u0E21\u0E32: ", filterWorkStatus(WorkStatus.COME), " \u0E27\u0E31\u0E19"] })] })] }), _jsxs("div", { className: "flex items-center space-x-2 ", children: [_jsx("div", { className: `w-[30px] h-[30px] bg-[#FF0000] border-2 border-black` }), _jsxs("span", { children: [" \u0E25\u0E32: ", filterWorkStatus(WorkStatus.LEAVE), " \u0E27\u0E31\u0E19"] })] }), _jsxs("div", { className: "flex items-center space-x-2 ", children: [_jsx("div", { className: `w-[30px] h-[30px] bg-[#808080] border-2 border-black` }), _jsxs("span", { children: ["\u0E2B\u0E22\u0E38\u0E14: ", filterWorkStatus(WorkStatus.NOTCOME), " \u0E27\u0E31\u0E19"] })] })] }), _jsxs("div", { className: "space-y-1", children: [_jsxs("div", { className: "flex items-center space-x-2 ", children: [_jsx("div", { className: `w-[30px] h-[30px] bg-[#38BDF8] border-2 border-black` }), _jsxs("span", { children: ["OT: ", events.filter((event) => event.ot).length, " \u0E27\u0E31\u0E19"] })] }), _jsxs("div", { className: "flex items-center space-x-2 ", children: [_jsx("div", { className: `w-[30px] h-[30px] bg-[#0044FF] border-2 border-black` }), _jsxs("span", { children: [" ", "Perdiem:", " ", events.filter((event) => event.perdiem).length, " ", "\u0E27\u0E31\u0E19"] })] }), _jsxs("div", { className: "flex items-cen\u0E40\u0E34ter space-x-2 ", children: [_jsx("div", { className: `w-[30px] h-[30px] bg-[#E100FF] border-2 border-black` }), _jsx("span", { children: "OT+Perdiem " })] })] }), _jsxs("div", { children: ["\u0E23\u0E27\u0E21\u0E17\u0E31\u0E49\u0E07\u0E2B\u0E21\u0E14", " ", filterWorkStatus(WorkStatus.COME) +
                                                    filterWorkStatus(WorkStatus.LEAVE) +
                                                    filterWorkStatus(WorkStatus.NOTCOME), " ", "\u0E27\u0E31\u0E19"] })] }), _jsxs("div", { className: "flex space-x-4 relative bottom-5 left-10", children: [_jsx("div", { className: "pl-5 absolute right-[-27px]", children: "+" }), _jsxs("div", { className: "flex flex-col", children: [_jsx("span", { className: "font-semibold", children: "\u0E40\u0E07\u0E34\u0E19\u0E40\u0E14\u0E37\u0E2D\u0E19 :" }), " ", _jsxs("span", { children: ["OT (750 X ", events.filter((event) => event.ot).length, ")"] }), _jsxs("span", { children: [" ", "Perdiem (250 X", " ", events.filter((event) => event.perdiem).length, ")"] }), _jsxs("span", { className: "font-semibold", children: [_jsx("u", { children: "\u0E2B\u0E31\u0E01" }), " \u0E1B\u0E23\u0E30\u0E01\u0E31\u0E19\u0E2A\u0E31\u0E07\u0E04\u0E21 :"] }), " ", _jsx("span", { className: "font-semibold", children: " Total Paid : " })] }), _jsxs("div", { className: "flex flex-col items-end min-w-8", children: [_jsx("span", { className: "font-medium", children: keepEmployee.Employment_Details?.salary
                                                        ? keepEmployee.Employment_Details?.salary
                                                            .toString()
                                                            .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
                                                        : "-" }), _jsx("span", { children: (events.filter((event) => event.ot).length * 750)
                                                        .toString()
                                                        .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") || 0 }), _jsx("span", { className: "border-b-2 border-black w-full text-right", children: (events.filter((event) => event.perdiem).length *
                                                        250)
                                                        .toString()
                                                        .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") || 0 }), _jsxs("span", { className: "border-b-2 border-black w-full text-right relative", children: [_jsx("div", { className: "pl-5 absolute bottom-[1px] right-[-25px] text-2xl", children: "-" }), keepEmployee.Employment_Details?.salary
                                                            ? (keepEmployee.Employment_Details?.salary * 0.05 <= 750
                                                                ? 750
                                                                : keepEmployee.Employment_Details?.salary * 0.05)
                                                                .toString()
                                                                .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
                                                            : "-"] }), _jsx("span", { className: "font-medium border-double border-b-4 border-black w-full text-right relative", children: keepEmployee.Employment_Details?.salary
                                                        ? (keepEmployee?.Employment_Details?.salary +
                                                            events.filter((event) => event.ot).length *
                                                                750 +
                                                            events.filter((event) => event.perdiem)
                                                                .length *
                                                                250 -
                                                            (keepEmployee.Employment_Details?.salary * 0.05 <=
                                                                750
                                                                ? 750
                                                                : keepEmployee.Employment_Details?.salary * 0.05))
                                                            .toString()
                                                            .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
                                                        : "-" })] })] })] }), _jsx(Calendar, { handleMonthChange: handleMonthChange, events: events })] })), typeButton === "Note" && _jsx(Note, {})] })) : (_jsx(_Fragment, { children: _jsx("div", { className: "transition-all p-4 ml-8 min-w-[720px] relative", children: "\u0E22\u0E31\u0E07\u0E44\u0E21\u0E48\u0E44\u0E14\u0E49\u0E40\u0E25\u0E37\u0E2D\u0E01\u0E1E\u0E19\u0E31\u0E01\u0E07\u0E32\u0E19" }) })) }));
};
export default employees;
