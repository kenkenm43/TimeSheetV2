import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import multiMonthPlugin from "@fullcalendar/multimonth";
import { addSalary, getSalaryByEmpId, updateSalaryById, } from "../../services/salaryServices";
import { addLeave, addWorkSchedule, deleteLeaveSchedule, deleteWorkSchedule, getLeavesBypost, getWorkSchedulesByPost, updateLeave, updateWorkSchedule, } from "../../services/employeeServices";
import "./calendar.module.css";
import EventModal from "../Modal";
import moment from "moment-timezone";
import useEmployeeStore from "../../context/EmployeeProvider";
import ListWorking from "../ListWorking";
import { useLocation } from "react-router-dom";
import ListMessage from "../ListMessage";
import { employeeReceiveMessage } from "../../services/messageServices";
var WorkStatus;
(function (WorkStatus) {
    WorkStatus["COME"] = "come";
    WorkStatus["NOTCOME"] = "notcome";
    WorkStatus["LEAVE"] = "leave";
})(WorkStatus || (WorkStatus = {}));
const index = () => {
    const [editable, setEditable] = useState(false);
    const calendarRef = useRef(null);
    const [values, setValues] = useState({
        title: "",
        start: new Date(),
        end: new Date(),
    });
    const [workStatus, setWorkStatus] = useState(WorkStatus.COME);
    const [events, setEvents] = useState([]);
    const [leaveCause, setLeaveCause] = useState("ลาโดยใช้วันหยุด");
    const [leaveReason, setLeaveReason] = useState("");
    const [leaveType, setLeaveType] = useState("");
    const [checkBoxed, setCheckBoxed] = useState([]);
    const [leaves, setLeaves] = useState([]);
    const [works, setWorks] = useState([]);
    const [countNotCome, setCountNotCome] = useState(0);
    const [countCome, setCountCome] = useState(0);
    const [countLeave, setCountLeave] = useState(0);
    const [costSSO] = useState(750);
    const { employee } = useEmployeeStore();
    const { state } = useLocation();
    const [totalDayInMonth, setTotalDayInMonth] = useState();
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
        if (payload.view.currentStart || payload.view.currentEnd) {
            setTotalDayInMonth(getTotalDaysInMonth(payload.view.title));
            const work = await getWorkSchedulesByPost({
                currentStart: moment(payload.view.currentStart).format("YYYY-MM-DD"),
                currentEnd: moment(payload.view.currentEnd).format("YYYY-MM-DD"),
            }, employee.id);
            setWorks(work.data);
            setCountCome(work.data.filter((wrk) => wrk.work_status == WorkStatus.COME)
                .length);
            setCountNotCome(work.data.filter((wrk) => wrk.work_status == WorkStatus.NOTCOME)
                .length);
            const leave = await getLeavesBypost({
                currentStart: moment(payload.view.currentStart).format("YYYY-MM-DD"),
                currentEnd: moment(payload.view.currentEnd).format("YYYY-MM-DD"),
            }, employee.id);
            setLeaves(leave.data);
            setCountLeave(leave.data.length);
            const event = addEvents(work.data, leave.data);
            setEvents(event);
        }
    };
    const formatDate = (date, time, format) => {
        const dateF = moment(date + time).format(format);
        return dateF;
    };
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
    const handleDateClick = (arg) => {
        console.log("arg", arg);
        const { dateStr } = arg;
        const dateSelect = dateStr || arg.event.startStr;
        const startDate = new Date(formatDate(dateSelect, "T07:00:00", "YYYY-MM-DDTHH:mm:ss"));
        const endDate = new Date(formatDate(dateSelect, "T18:00:00", "YYYY-MM-DDTHH:mm:ss"));
        const currentValueDate = events.find((event) => {
            const eventDate = formatDate(event.start, "", "YYYY-MM-DD");
            return eventDate === formatDate(dateSelect, "", "YYYY-MM-DD");
        });
        setCheckBoxed([
            currentValueDate?.ot ? "OT" : null,
            currentValueDate?.perdiem ? "Perdiem" : null,
        ]);
        if (!currentValueDate) {
            setValues({
                title: WorkStatus.COME,
                start: startDate,
                end: endDate,
            });
            setWorkStatus(WorkStatus.COME);
        }
        else {
            setValues({
                title: currentValueDate.title,
                start: currentValueDate.start || startDate,
                end: currentValueDate.end || endDate,
            });
            setWorkStatus(currentValueDate.title);
            setLeaveCause(currentValueDate.cause || "ลาโดยใช้วันหยุด");
            setLeaveReason(currentValueDate.reason);
            setLeaveType(currentValueDate.type);
        }
        setEditable(true);
    };
    const handleEventCreation = async (startDate, endDate, title, backgroundColor, leaveCause, leaveReason, leaveType) => {
        let newEvent;
        if (title === WorkStatus.LEAVE) {
            const { data } = await addLeave({
                leave_date: formatDate(values.start, "", "YYYY-MM-DDTHH:mm:ss[Z]"),
                leave_reason: leaveReason,
                leave_type: leaveType,
                leave_cause: leaveCause,
            }, employee.id);
            newEvent = events.filter((event) => event);
            newEvent.push({
                id: data.id,
                title: title,
                start: startDate,
                end: endDate,
                reason: leaveReason,
                cause: leaveCause,
                type: leaveType,
                allDay: true,
                backgroundColor: backgroundColor,
            });
            setLeaveReason(leaveReason);
            setLeaveCause(leaveCause);
            setLeaveType(leaveType);
        }
        else {
            const { data } = await addWorkSchedule({
                work_status: title,
                work_start: formatDate(values.start, "", "YYYY-MM-DDTHH:mm:ss[Z]"),
                work_end: formatDate(values.end, "", "YYYY-MM-DDTHH:mm:ss[Z]"),
                work_ot: title === WorkStatus.NOTCOME ? false : checkBoxed.includes("OT"),
                work_perdium: title === WorkStatus.NOTCOME
                    ? false
                    : checkBoxed.includes("Perdiem"),
            }, employee.id);
            newEvent = events.filter((event) => event);
            newEvent.push({
                id: data.id,
                title: title,
                start: startDate,
                end: endDate,
                cause: leaveCause,
                ot: data.work_ot,
                perdiem: data.work_perdium,
                reason: leaveReason,
                type: title,
                timeStart: startDate,
                timeEnd: endDate,
                allDay: true,
                backgroundColor: backgroundColor,
            });
        }
        await setEvents(() => [...newEvent]);
        return [...newEvent];
    };
    const handleEventUpdate = async (idDate, typeOld, typeNew, backgroundColor, timeStart, timeEnd, leaveCause, leaveType) => {
        let updateEvent;
        if (typeOld !== typeNew) {
            if (typeOld === WorkStatus.LEAVE) {
                await deleteLeaveSchedule(employee.id, idDate);
                const { data } = await addWorkSchedule({
                    work_status: typeNew,
                    work_start: formatDate(timeStart, "", "YYYY-MM-DDTHH:mm:ss[Z]"),
                    work_end: formatDate(timeEnd, "", "YYYY-MM-DDTHH:mm:ss[Z]"),
                    work_ot: typeNew === WorkStatus.NOTCOME
                        ? false
                        : checkBoxed.includes("OT"),
                    work_perdium: typeNew === WorkStatus.NOTCOME
                        ? false
                        : checkBoxed.includes("Perdiem"),
                }, employee.id);
                updateEvent = events.filter((event) => event.id !== idDate);
                updateEvent.push({
                    id: data.id,
                    title: typeNew,
                    start: timeStart,
                    ot: data.work_ot || false,
                    perdiem: data.work_perdium || false,
                    end: timeEnd,
                    allDay: true,
                    type: typeNew,
                    timeStart: timeStart,
                    timeEnd: timeEnd,
                    backgroundColor: backgroundColor,
                });
            }
            else if (typeNew === WorkStatus.LEAVE) {
                await deleteWorkSchedule(employee.id, idDate);
                const { data } = await addLeave({
                    leave_date: formatDate(timeStart, "", "YYYY-MM-DDTHH:mm:ss[Z]"),
                    leave_reason: leaveReason,
                    leave_type: leaveType,
                    leave_cause: leaveCause,
                }, employee.id);
                updateEvent = events.filter((event) => event.id !== idDate);
                updateEvent.push({
                    id: data.id,
                    title: WorkStatus.LEAVE,
                    start: timeStart,
                    end: timeEnd,
                    cause: leaveCause,
                    reason: leaveReason,
                    type: leaveType,
                    allDay: true,
                    backgroundColor: "red",
                });
            }
            else {
                const { data } = await updateWorkSchedule({
                    work_start: timeStart,
                    work_end: timeEnd,
                    work_status: typeNew,
                    work_ot: typeNew === WorkStatus.NOTCOME
                        ? false
                        : checkBoxed.includes("OT"),
                    work_perdium: typeNew === WorkStatus.NOTCOME
                        ? false
                        : checkBoxed.includes("Perdiem"),
                }, employee.id, idDate);
                updateEvent = events.filter((event) => event.id !== idDate);
                updateEvent.push({
                    id: idDate,
                    title: typeNew,
                    start: timeStart,
                    end: timeEnd,
                    ot: data.work_ot || false,
                    perdiem: data.work_perdium || false,
                    allDay: true,
                    type: typeNew,
                    timeStart: timeStart,
                    timeEnd: timeEnd,
                    backgroundColor: backgroundColor,
                });
            }
        }
        else {
            if (typeNew === WorkStatus.LEAVE) {
                await updateLeave({
                    leave_date: formatDate(timeStart, "", "YYYY-MM-DDTHH:mm:ss[Z]"),
                    leave_reason: leaveReason,
                    leave_type: leaveType,
                    leave_cause: leaveCause,
                }, employee.id, idDate);
                updateEvent = events.filter((event) => event.id !== idDate);
                updateEvent.push({
                    id: idDate,
                    title: WorkStatus.LEAVE,
                    start: timeStart,
                    end: timeEnd,
                    reason: leaveReason,
                    cause: leaveCause,
                    type: leaveType,
                    allDay: true,
                    backgroundColor: "red",
                });
            }
            else if (typeOld === typeNew) {
                const { data } = await updateWorkSchedule({
                    work_start: formatDate(timeStart, "", "YYYY-MM-DDTHH:mm:ss[Z]"),
                    work_end: formatDate(timeEnd, "", "YYYY-MM-DDTHH:mm:ss[Z]"),
                    work_status: typeNew,
                    work_ot: typeNew === WorkStatus.NOTCOME
                        ? false
                        : checkBoxed.includes("OT"),
                    work_perdium: typeNew === WorkStatus.NOTCOME
                        ? false
                        : checkBoxed.includes("Perdiem"),
                }, employee.id, idDate);
                updateEvent = events.filter((event) => event.id !== idDate);
                updateEvent.push({
                    id: idDate,
                    title: typeNew,
                    start: timeStart,
                    end: timeEnd,
                    ot: data.work_ot || false,
                    perdiem: data.work_perdium || false,
                    allDay: true,
                    type: typeNew,
                    timeStart: timeStart,
                    timeEnd: timeEnd,
                    backgroundColor: backgroundColor,
                });
            }
        }
        setEvents(() => [...updateEvent]);
        return [...updateEvent];
    };
    const dateCurrent = (date) => {
        const existingEvent = events.find((event) => {
            const eventDateStr = formatDate(event.start, "", "YYYY-MM-DD");
            return eventDateStr === formatDate(date, "", "YYYY-MM-DD");
        });
        return existingEvent;
    };
    const handleOk = async (e, formValue) => {
        let title = "";
        let backgroundColor = "";
        if (workStatus === WorkStatus.COME) {
            if (checkBoxed.includes("Perdiem") && checkBoxed.includes("OT")) {
                backgroundColor = "#c026d3 ";
            }
            else if (checkBoxed.includes("Perdiem")) {
                backgroundColor = "#104efa";
            }
            else if (checkBoxed.includes("OT")) {
                backgroundColor = "#38bdf8";
            }
            else {
                backgroundColor = "green";
            }
            title = WorkStatus.COME;
        }
        else if (workStatus === WorkStatus.NOTCOME) {
            title = WorkStatus.NOTCOME;
            backgroundColor = "gray";
        }
        else if (workStatus === WorkStatus.LEAVE) {
            title = WorkStatus.LEAVE;
            backgroundColor = "red";
        }
        const currentDateValue = dateCurrent(values.start);
        let updateEvent;
        if (!dateCurrent(values.start)) {
            updateEvent = await handleEventCreation(values.start, values.end, title, backgroundColor, leaveCause, formValue.leave_reason, workStatus);
        }
        else {
            updateEvent = await handleEventUpdate(currentDateValue.id, currentDateValue.title, title, backgroundColor, values.start, values.end, leaveCause, workStatus);
        }
        console.log(updateEvent.length);
        if (updateEvent.length === totalDayInMonth) {
            console.log(moment(values.start).month());
            console.log(moment(values.start).year());
            const salaryData = await getSalaryByEmpId({
                month: moment(values.start).month(),
                year: moment(values.start).year(),
            }, employee.id);
            console.log(salaryData.data);
            if (!salaryData.data) {
                console.log("add salary");
                const salary = await addSalary({
                    employeeId: employee.id,
                    month: moment(values.start).month(),
                    year: moment(values.start).year(),
                    salary: employee.Employment_Details?.salary,
                    ot: updateEvent.filter((event) => event.ot).length,
                    perdiem: updateEvent.filter((event) => event.perdiem).length,
                    sso: employee.Employment_Details?.salary * 0.05 <= 750
                        ? 750
                        : employee.Employment_Details?.salary * 0.05,
                });
            }
            else {
                console.log("update salary");
                const updateSalary = await updateSalaryById({
                    id: salaryData.data.id,
                    salary: employee.Employment_Details?.salary,
                    ot: updateEvent.filter((event) => event.ot).length,
                    perdiem: updateEvent.filter((event) => event.perdiem).length,
                    sso: employee.Employment_Details?.salary * 0.05 <= 750
                        ? 750
                        : employee.Employment_Details?.salary * 0.05,
                });
            }
        }
        setEditable(false);
        setValues({ title: "", start: new Date(), end: new Date() });
        setWorkStatus(WorkStatus.COME);
        setLeaveType("");
        setLeaveCause("ลาโดยใช้วันหยุด");
        setLeaveReason("");
        title = "";
        backgroundColor = "";
    };
    const handleClose = () => {
        setWorkStatus(WorkStatus.COME);
        setEditable(false);
    };
    const filterWorkStatus = (text) => {
        const filter = events.filter((event) => event.title === text);
        return filter.length;
    };
    const handleSelect = (arg) => { };
    console.log(employee.id);
    const [messages, setMessages] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            const { data } = await employeeReceiveMessage(employee.id);
            setMessages(data);
        };
        fetchData();
    }, []);
    console.log(Number(events.filter((event) => event.ot).length * 750));
    return (_jsxs("div", { className: "w-full ml-20 mb-10 mt-5", children: [_jsxs("div", { className: "absolute top-32 left-5 flex flex-col w-72 justify-center", children: [_jsx(ListWorking, {}), "\u0E02\u0E49\u0E2D\u0E04\u0E27\u0E32\u0E21", _jsx(ListMessage, { messages: messages })] }), _jsxs("div", { className: "flex text-xl bg-red-300 p-2", children: [_jsxs("div", { className: "flex space-x-4 relative", children: [_jsx("div", { className: "pl-5 absolute top-7 right-[-27px]", children: "+" }), _jsxs("div", { className: "flex flex-col", children: [_jsx("span", { className: "font-semibold", children: "\u0E40\u0E07\u0E34\u0E19\u0E40\u0E14\u0E37\u0E2D\u0E19 :" }), " ", _jsxs("span", { children: ["OT (750 X ", events.filter((event) => event.ot).length, ")"] }), _jsxs("span", { children: [" ", "Perdiem (250 X", " ", events.filter((event) => event.perdiem).length, ")"] }), _jsxs("span", { className: "font-semibold", children: [_jsx("u", { children: "\u0E2B\u0E31\u0E01" }), " \u0E1B\u0E23\u0E30\u0E01\u0E31\u0E19\u0E2A\u0E31\u0E07\u0E04\u0E21 :"] }), " ", _jsx("span", { className: "font-semibold", children: " Total Paid : " })] }), _jsxs("div", { className: "flex flex-col items-end min-w-8", children: [_jsx("span", { className: "font-medium", children: employee.Employment_Details?.salary
                                            ? employee.Employment_Details?.salary
                                                .toString()
                                                .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
                                            : "-" }), _jsx("span", { children: (events.filter((event) => event.ot).length * 750)
                                            .toString()
                                            .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") }), _jsx("span", { className: "border-b-2 border-black w-full text-right", children: (events.filter((event) => event.perdiem).length * 250)
                                            .toString()
                                            .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") }), _jsxs("span", { className: "border-b-2 border-black w-full text-right relative", children: [_jsx("div", { className: "pl-5 absolute bottom-[1px] right-[-25px] text-2xl", children: "-" }), employee.Employment_Details?.salary
                                                ? (employee.Employment_Details?.salary * 0.05 <= 750
                                                    ? 750
                                                    : employee.Employment_Details?.salary * 0.05)
                                                    .toString()
                                                    .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
                                                : "-"] }), _jsx("span", { className: "font-medium border-double border-b-4 border-black w-full text-right relative", children: employee.Employment_Details?.salary
                                            ? (employee?.Employment_Details?.salary +
                                                events.filter((event) => event.ot).length * 750 +
                                                events.filter((event) => event.perdiem).length * 250 -
                                                (employee.Employment_Details?.salary * 0.05 <= 750
                                                    ? 750
                                                    : employee.Employment_Details?.salary * 0.05))
                                                .toString()
                                                .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
                                            : "-" })] })] }), _jsxs("div", { className: "flex ml-16 space-x-5", children: [_jsxs("div", { className: "font-semibold", children: ["\u0E40\u0E14\u0E37\u0E2D\u0E19\u0E19\u0E35\u0E49 \u0E21\u0E35 ", totalDayInMonth, " \u0E27\u0E31\u0E19 :", " "] }), _jsxs("div", { className: "space-y-1", children: [_jsxs("div", { children: [" ", _jsxs("div", { className: "flex items-center space-x-2 ", children: [_jsx("div", { className: `w-[30px] h-[30px] bg-[#008000] border-2 border-black` }), _jsxs("span", { children: ["\u0E21\u0E32: ", filterWorkStatus(WorkStatus.COME), " \u0E27\u0E31\u0E19"] })] })] }), _jsxs("div", { className: "flex items-center space-x-2 ", children: [_jsx("div", { className: `w-[30px] h-[30px] bg-[#FF0000] border-2 border-black` }), _jsxs("span", { children: [" \u0E25\u0E32: ", filterWorkStatus(WorkStatus.LEAVE), " \u0E27\u0E31\u0E19"] })] }), _jsxs("div", { className: "flex items-center space-x-2 ", children: [_jsx("div", { className: `w-[30px] h-[30px] bg-[#808080] border-2 border-black` }), _jsxs("span", { children: ["\u0E2B\u0E22\u0E38\u0E14: ", filterWorkStatus(WorkStatus.NOTCOME), " \u0E27\u0E31\u0E19"] })] })] }), _jsxs("div", { className: "space-y-1", children: [_jsxs("div", { className: "flex items-center space-x-2 ", children: [_jsx("div", { className: `w-[30px] h-[30px] bg-[#38BDF8] border-2 border-black` }), _jsxs("span", { children: ["OT: ", events.filter((event) => event.ot).length, " \u0E27\u0E31\u0E19"] })] }), _jsxs("div", { className: "flex items-center space-x-2 ", children: [_jsx("div", { className: `w-[30px] h-[30px] bg-[#0044FF] border-2 border-black` }), _jsxs("span", { children: [" ", "Perdiem: ", events.filter((event) => event.perdiem).length, " ", "\u0E27\u0E31\u0E19"] })] })] }), _jsxs("div", { children: ["\u0E01\u0E23\u0E2D\u0E01\u0E44\u0E1B\u0E41\u0E25\u0E49\u0E27", " ", filterWorkStatus(WorkStatus.COME) +
                                        filterWorkStatus(WorkStatus.LEAVE) +
                                        filterWorkStatus(WorkStatus.NOTCOME), " ", "\u0E27\u0E31\u0E19"] })] })] }), _jsx(FullCalendar, { ref: calendarRef, plugins: [
                    dayGridPlugin,
                    timeGridPlugin,
                    interactionPlugin,
                    multiMonthPlugin,
                ], headerToolbar: {
                    left: "prev,next today",
                    center: "title",
                    right: "",
                }, businessHours: {
                    daysOfWeek: [1, 2, 3, 4, 5],
                }, editable: false, height: 650, events: events, selectable: true, eventClick: handleDateClick, dateClick: handleDateClick, datesSet: handleMonthChange, eventContent: renderEventContent, initialView: "dayGridMonth", fixedWeekCount: false, showNonCurrentDates: false, displayEventTime: true, select: handleSelect }), _jsx(EventModal, { values: values, setValues: setValues, workStatus: workStatus, setWorkStatus: setWorkStatus, leaveReason: leaveReason, setLeaveReason: setLeaveReason, leaveType: leaveType, setLeaveType: setLeaveType, leaveCause: leaveCause, setLeaveCause: setLeaveCause, checkBoxed: checkBoxed, setCheckBoxed: setCheckBoxed, open: editable, onClose: handleClose, onAddEvent: handleOk })] }));
};
function renderEventContent(eventContent) {
    return (_jsx("div", { className: "cursor-pointer", children: eventContent.event.extendedProps &&
            eventContent.event.extendedProps.type === "come" ? (_jsxs("div", { className: "fc-event-main cursor-pointer text-sm", children: [_jsx("div", { children: "\u0E40\u0E27\u0E25\u0E32\u0E40\u0E23\u0E34\u0E48\u0E21\u0E07\u0E32\u0E19" }), moment(eventContent.event.extendedProps.timeStart).format("HH:mm"), _jsx("div", { children: "\u0E40\u0E27\u0E25\u0E32\u0E40\u0E25\u0E34\u0E01\u0E07\u0E32\u0E19" }), moment(eventContent.event.extendedProps.timeEnd).format("HH:mm")] })) : eventContent.event.extendedProps.type === "leave" ? (_jsxs(_Fragment, { children: [_jsx("div", { children: _jsx("span", { children: eventContent.event.extendedProps.cause || "ลาโดยใช้วันหยุด" }) }), _jsxs("div", { children: ["\u0E40\u0E2B\u0E15\u0E38\u0E1C\u0E25:", _jsx("span", { children: eventContent.event.extendedProps.reason || " - " })] })] })) : (_jsx("div", { children: "\u0E2B\u0E22\u0E38\u0E14" })) }));
}
export default index;
