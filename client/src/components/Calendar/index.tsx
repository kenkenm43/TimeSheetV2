/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import multiMonthPlugin from "@fullcalendar/multimonth";
import {
  addSalary,
  getSalaryByEmpId,
  updateSalaryById,
} from "../../services/salaryServices";
import {
  addLeave,
  addWorkSchedule,
  deleteLeaveSchedule,
  deleteWorkSchedule,
  getEmployee,
  getLeavesBypost,
  getWorkSchedulesByPost,
  updateLeave,
  updateWorkSchedule,
} from "../../services/employeeServices";
import "./calendar.module.css";
import EventModal from "../Modal";
import moment from "moment-timezone";
import useEmployeeStore from "../../context/EmployeeProvider";
import ListWorking from "../ListWorking";
import { useLocation } from "react-router-dom";
import ListMessage from "../ListMessage";
import { employeeReceiveMessage } from "../../services/messageServices";
import Loading from "../Loading";
import { ROLESEMPLOOYEE } from "../../Enum/RoleEmployee";
import { calOT, calSSO } from "../../helpers/cal";
import { FaEye, FaEyeSlash, FaSpinner } from "react-icons/fa";

enum WorkStatus {
  COME = "come",
  NOTCOME = "notcome",
  LEAVE = "leave",
}

const index = () => {
  const [editable, setEditable] = useState(false);
  const calendarRef = useRef<any>(null);
  const [values, setValues] = useState({
    title: "",
    start: new Date(),
    end: new Date(),
  });
  const [workStatus, setWorkStatus] = useState(WorkStatus.COME);
  const [workReason, setWorkReason] = useState("");
  const [events, setEvents]: any = useState([]);
  const [leaveCause, setLeaveCause] = useState("ลาโดยใช้วันหยุด");
  const [leaveReason, setLeaveReason] = useState("");
  const [leaveType, setLeaveType] = useState("");
  const [checkBoxed, setCheckBoxed] = useState<any>([]);
  const [type, setType] = useState<any>();
  const { employee, setEmployee } = useEmployeeStore();
  const [totalDayInMonth, setTotalDayInMonth] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCalendar, setIsLoadingCalendar] = useState(false);
  const [idCalendar, setIdCalendar] = useState<any>();
  const [sso, setSSO] = useState();
  const [currentMonth, setCurrentMonth] = useState<any>();
  const [currentYear, setCurrentYear] = useState<any>();
  
  // --- States สำหรับระบบสรุปวันลาประจำปี ---
  const initialBaseYear = moment().month() + 1 >= 7 ? moment().year() : moment().year() - 1;
  const [leaveCycleYear, setLeaveCycleYear] = useState<number>(initialBaseYear);
  const [annualLeaves, setAnnualLeaves] = useState<any[]>([]);
  const [isLoadingAnnual, setIsLoadingAnnual] = useState(false);

  function getTotalDaysInMonth(monthString: string) {
    const date: any = new Date(monthString);
    if (isNaN(date)) return -1;
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return new Date(year, month, 0).getDate();
  }

  // ฟังก์ชันแยกต่างหากสำหรับดึงข้อมูลวันลาตามปีที่กำหนด (ก.ค. - มิ.ย.)
  const fetchAnnualLeavesData = async (targetYear: number) => {
    setIsLoadingAnnual(true);
    const cycleStart = `${targetYear}-07-01`;
    const cycleEnd = `${targetYear + 1}-06-30`;
    try {
      const annualLeaveData = await getLeavesBypost(
        { currentStart: cycleStart, currentEnd: cycleEnd },
        employee.id
      );
      if (annualLeaveData?.data) {
        setAnnualLeaves(annualLeaveData.data);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoadingAnnual(false);
    }
  };

  const handlePrevLeaveYear = () => {
    const newYear = leaveCycleYear - 1;
    setLeaveCycleYear(newYear);
    fetchAnnualLeavesData(newYear);
  };

  const handleNextLeaveYear = () => {
    const newYear = leaveCycleYear + 1;
    setLeaveCycleYear(newYear);
    fetchAnnualLeavesData(newYear);
  };

  const handleMonthChange = async (payload: any) => {
    const viewMonth = moment(payload.view.title).month() + 1;
    const viewYear = moment(payload.view.title).year();

    setCurrentMonth(viewMonth);
    setCurrentYear(viewYear);
    setTotalDayInMonth(getTotalDaysInMonth(payload.view.title));
    setIsLoadingCalendar(true);

    const work = await getWorkSchedulesByPost(
      {
        currentStart: moment(payload.view.currentStart).format("YYYY-MM-DD"),
        currentEnd: moment(payload.view.currentEnd).format("YYYY-MM-DD"),
      },
      employee.id
    );

    const leave = await getLeavesBypost(
      {
        currentStart: moment(payload.view.currentStart).format("YYYY-MM-DD"),
        currentEnd: moment(payload.view.currentEnd).format("YYYY-MM-DD"),
      },
      employee.id
    );

    // เช็คว่าปฏิทินถูกเลื่อนไปปีรอบอื่นหรือไม่ ถ้าใช่ให้โหลดข้อมูล Sidebar ตามปฏิทิน
    let baseYear = viewMonth >= 7 ? viewYear : viewYear - 1;
    if (leaveCycleYear !== baseYear) {
      setLeaveCycleYear(baseYear);
      fetchAnnualLeavesData(baseYear);
    } else if (annualLeaves.length === 0) {
      fetchAnnualLeavesData(baseYear); // โหลดครั้งแรก
    }

    const eventsData = await addEvents(work.data, leave.data);
    setEvents(eventsData);
    setIsLoadingCalendar(false);
  };

  const formatDate = (date: any, time?: any, format?: any) => {
    const dateF = moment(date + time).format(format);
    return dateF;
  };

  const addEvents = (workArr: any, leaveArr: any) => {
    const formatWorkEvents = workArr.map((arr: any) => {
      let background;
      if (arr.work_status === WorkStatus.COME) {
        if (arr.work_perdium && arr.work_ot) background = "#e100ff";
        else if (arr.work_perdium) background = "#0044ff";
        else if (arr.work_ot) background = "#38bdf8";
        else background = "#16a34a";
      } else if (arr.work_status === WorkStatus.NOTCOME) {
        background = "#64748b";
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
        borderColor: background,
        type: arr.work_status,
        workReason: arr.work_reason,
        timeStart: moment(arr.work_start).utcOffset("-07:00")._d,
        timeEnd: moment(arr.work_end).utcOffset("-07:00")._d,
      };
      return formatEvent;
    });

    const leaveWorkEvents = leaveArr.map((arr: any) => {
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
        backgroundColor: "#ef4444",
        borderColor: "#ef4444",
      };
      return formatEvent;
    });

    return [...formatWorkEvents, ...leaveWorkEvents];
  };

  const handleDateClick = (arg: any) => {
    const { dateStr } = arg;
    const dateSelect = dateStr || arg.event.startStr;
    const startDate = new Date(formatDate(dateSelect, "T09:00:00", "YYYY-MM-DDTHH:mm:ss"));
    const endDate = new Date(formatDate(dateSelect, "T18:00:00", "YYYY-MM-DDTHH:mm:ss"));
    const currentValueDate = events.find((event: any) => {
      const eventDate = formatDate(event.start, "", "YYYY-MM-DD");
      return eventDate === formatDate(dateSelect, "", "YYYY-MM-DD");
    });

    setCheckBoxed([
      currentValueDate?.ot ? "OT" : null,
      currentValueDate?.perdiem ? "Perdiem" : null,
    ]);

    if (!currentValueDate) {
      setValues({ title: WorkStatus.COME, start: startDate, end: endDate });
      setWorkStatus(WorkStatus.COME);
    } else {
      setWorkReason(currentValueDate.workReason);
      setType(currentValueDate.type);
      setIdCalendar(currentValueDate.id);
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

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const { data } = await employeeReceiveMessage(employee.id);
      const employ = await getEmployee(employee.id);
      setEmployee(employ.data);
      setMessages(data);
      setIsLoading(false);
    };
    fetchData();
  }, []);

  const handleEventCreation = async (
    workReason: any, startDate: any, endDate: any, title: any,
    backgroundColor: any, leaveCause: any, leaveReason: any, leaveType: any
  ) => {
    let newEvent: any;
    if (title === WorkStatus.LEAVE) {
      const { data } = await addLeave(
        {
          leave_date: formatDate(values.start, "", "YYYY-MM-DDTHH:mm:ss[Z]"),
          leave_reason: leaveReason,
          leave_type: leaveType,
          leave_cause: leaveCause,
        },
        employee.id
      );
      newEvent = events.filter((event: any) => event);
      newEvent.push({
        id: data.id, title: title, start: startDate, end: endDate,
        reason: leaveReason, cause: leaveCause, type: leaveType, allDay: true,
        backgroundColor: backgroundColor, borderColor: backgroundColor
      });
      setLeaveReason(leaveReason);
      setLeaveCause(leaveCause);
      setLeaveType(leaveType);
    } else {
      const { data } = await addWorkSchedule(
        {
          work_status: title,
          work_start: formatDate(values.start, "", "YYYY-MM-DDTHH:mm:ss[Z]"),
          work_end: formatDate(values.end, "", "YYYY-MM-DDTHH:mm:ss[Z]"),
          work_ot: title === WorkStatus.NOTCOME ? false : checkBoxed.includes("OT"),
          work_perdium: title === WorkStatus.NOTCOME ? false : checkBoxed.includes("Perdiem"),
          work_reason: workReason,
        },
        employee.id
      );
      newEvent = events.filter((event: any) => event);
      newEvent.push({
        id: data.id, title: title, start: startDate, end: endDate, cause: leaveCause,
        ot: data.work_ot, perdiem: data.work_perdium, reason: leaveReason,
        workReason: workReason, type: title, timeStart: startDate, timeEnd: endDate,
        allDay: true, backgroundColor: backgroundColor, borderColor: backgroundColor
      });
    }
    await setEvents(() => [...newEvent]);
    fetchAnnualLeavesData(leaveCycleYear); // รีเฟรช Sidebar หลังเพิ่มเสร็จ
    return [...newEvent];
  };

  const handleDelete = async (e: any) => {
    setIsLoading(true);
    let updateEvent = [];
    if (type === WorkStatus.LEAVE) {
      await deleteLeaveSchedule(employee.id, idCalendar);
    } else {
      await deleteWorkSchedule(employee.id, idCalendar);
    }
    updateEvent = events.filter((event: any) => event.id !== idCalendar);
    setEvents(() => [...updateEvent]);
    setEditable(false);
    setIsLoading(false);
    fetchAnnualLeavesData(leaveCycleYear); // รีเฟรช Sidebar หลังลบเสร็จ
  };

  const handleEventUpdate = async (
    workReason: any, idDate: any, typeOld: any, typeNew: any,
    backgroundColor: any, timeStart: any, timeEnd: any,
    leaveCause: any, leaveType: any
  ) => {
    let updateEvent: any;
    if (typeOld !== typeNew) {
      if (typeOld === WorkStatus.LEAVE) {
        await deleteLeaveSchedule(employee.id, idDate);
        const { data } = await addWorkSchedule(
          {
            work_status: typeNew,
            work_start: formatDate(timeStart, "", "YYYY-MM-DDTHH:mm:ss[Z]"),
            work_end: formatDate(timeEnd, "", "YYYY-MM-DDTHH:mm:ss[Z]"),
            work_ot: typeNew === WorkStatus.NOTCOME ? false : checkBoxed.includes("OT"),
            work_perdium: typeNew === WorkStatus.NOTCOME ? false : checkBoxed.includes("Perdiem"),
            work_reason: workReason,
          },
          employee.id
        );
        updateEvent = events.filter((event: any) => event.id !== idDate);
        updateEvent.push({
          id: data.id, title: typeNew, start: timeStart, ot: data.work_ot || false,
          perdiem: data.work_perdium || false, end: timeEnd, allDay: true, type: typeNew,
          workReason: workReason, timeStart: timeStart, timeEnd: timeEnd, backgroundColor: backgroundColor, borderColor: backgroundColor
        });
      } else if (typeNew === WorkStatus.LEAVE) {
        await deleteWorkSchedule(employee.id, idDate);
        const { data } = await addLeave(
          {
            leave_date: formatDate(timeStart, "", "YYYY-MM-DDTHH:mm:ss[Z]"),
            leave_reason: leaveReason, leave_type: leaveType, leave_cause: leaveCause,
          },
          employee.id
        );
        updateEvent = events.filter((event: any) => event.id !== idDate);
        updateEvent.push({
          id: data.id, title: WorkStatus.LEAVE, start: timeStart, end: timeEnd,
          cause: leaveCause, reason: leaveReason, type: leaveType, allDay: true, backgroundColor: "#ef4444", borderColor: "#ef4444"
        });
      } else {
        const { data } = await updateWorkSchedule(
          {
            work_start: timeStart, work_end: timeEnd, work_status: typeNew,
            work_ot: typeNew === WorkStatus.NOTCOME ? false : checkBoxed.includes("OT"),
            work_perdium: typeNew === WorkStatus.NOTCOME ? false : checkBoxed.includes("Perdiem"),
            work_reason: workReason,
          },
          employee.id, idDate
        );
        updateEvent = events.filter((event: any) => event.id !== idDate);
        updateEvent.push({
          id: idDate, title: typeNew, start: timeStart, end: timeEnd,
          ot: data.work_ot || false, perdiem: data.work_perdium || false, workReason: workReason,
          allDay: true, type: typeNew, timeStart: timeStart, timeEnd: timeEnd, backgroundColor: backgroundColor, borderColor: backgroundColor
        });
      }
    } else {
      if (typeNew === WorkStatus.LEAVE) {
        await updateLeave(
          {
            leave_date: formatDate(timeStart, "", "YYYY-MM-DDTHH:mm:ss[Z]"),
            leave_reason: leaveReason, leave_type: leaveType, leave_cause: leaveCause,
          },
          employee.id, idDate
        );
        updateEvent = events.filter((event: any) => event.id !== idDate);
        updateEvent.push({
          id: idDate, title: WorkStatus.LEAVE, start: timeStart, end: timeEnd,
          cause: leaveCause,reason: leaveReason,  type: leaveType, allDay: true, backgroundColor: "#ef4444", borderColor: "#ef4444"
        });
      } else if (typeOld === typeNew) {
        const { data } = await updateWorkSchedule(
          {
            work_start: formatDate(timeStart, "", "YYYY-MM-DDTHH:mm:ss[Z]"),
            work_end: formatDate(timeEnd, "", "YYYY-MM-DDTHH:mm:ss[Z]"),
            work_status: typeNew,
            work_ot: typeNew === WorkStatus.NOTCOME ? false : checkBoxed.includes("OT"),
            work_perdium: typeNew === WorkStatus.NOTCOME ? false : checkBoxed.includes("Perdiem"),
            work_reason: workReason,
          },
          employee.id, idDate
        );
        updateEvent = events.filter((event: any) => event.id !== idDate);
        updateEvent.push({
          id: idDate, title: typeNew, start: timeStart, end: timeEnd,
          ot: data.work_ot || false, perdiem: data.work_perdium || false, workReason: workReason,
          allDay: true, type: typeNew, timeStart: timeStart, timeEnd: timeEnd, backgroundColor: backgroundColor, borderColor: backgroundColor
        });
      }
    }
    setEvents(() => [...updateEvent]);
    fetchAnnualLeavesData(leaveCycleYear); // รีเฟรช Sidebar หลังอัปเดตเสร็จ
    return [...updateEvent];
  };

  const dateCurrent = (date: any) => {
    return events.find((event: any) => {
      return formatDate(event.start, "", "YYYY-MM-DD") === formatDate(date, "", "YYYY-MM-DD");
    });
  };

  const handleOk = async (e: any, formValue: any) => {
    setIsLoading(true);
    try {
      let title = "";
      let backgroundColor = "";
      if (workStatus === WorkStatus.COME) {
        if (checkBoxed.includes("Perdiem") && checkBoxed.includes("OT")) backgroundColor = "#c026d3"; 
        else if (checkBoxed.includes("Perdiem")) backgroundColor = "#0044ff"; 
        else if (checkBoxed.includes("OT")) backgroundColor = "#38bdf8"; 
        else backgroundColor = "#16a34a"; 
        title = WorkStatus.COME;
      } else if (workStatus === WorkStatus.NOTCOME) {
        title = WorkStatus.NOTCOME;
        backgroundColor = "#64748b"; 
      } else if (workStatus === WorkStatus.LEAVE) {
        title = WorkStatus.LEAVE;
        backgroundColor = "#ef4444"; 
      }

      const currentDateValue = dateCurrent(values.start);
      let updateEvent;
      if (!dateCurrent(values.start)) {
        updateEvent = await handleEventCreation(workReason, values.start, values.end, title, backgroundColor, leaveCause, formValue.leave_reason, workStatus);
      } else {
        updateEvent = await handleEventUpdate(workReason, currentDateValue.id, currentDateValue.title, title, backgroundColor, values.start, values.end, leaveCause, workStatus);
      }

      if (updateEvent.length === totalDayInMonth) {
        const salaryData = await getSalaryByEmpId({ month: currentMonth, year: currentYear }, employee.id);
        const position = employee.Employment_Details?.position;
        const salary = employee.Employment_Details?.salary || 0;
        const otCount = events.filter((e: any) => e.ot).length;
        const perdiemCount = events.filter((e: any) => e.perdiem).length;
        
        const ssoCalc = position 
            ? position !== ROLESEMPLOOYEE.General ? 1125 : (salary * 0.05 >= 875 ? 875 : salary * 0.05)
            : 0;

        if (!salaryData.data) {
          await addSalary({
            employeeId: employee.id,
            month: moment(values.start).month() + 1,
            year: moment(values.start).year(),
            amount: position === ROLESEMPLOOYEE.Trainee 
                ? events.filter((e: any) => e.type === WorkStatus.COME).length * 500 
                : position === ROLESEMPLOOYEE.General ? salary : 0,
            ot: otCount,
            perdiem: perdiemCount,
            sso: Number(ssoCalc),
          });
        } else {
          await updateSalaryById({
            id: salaryData.data.id,
            employeeId: employee.id,
            amount: salary,
            ot: Number(updateEvent.filter((e: any) => e.ot).length),
            perdiem: Number(updateEvent.filter((e: any) => e.perdiem).length),
            sso: Number(ssoCalc),
          });
        }
      }

      setEditable(false);
      setValues({ title: "", start: new Date(), end: new Date() });
      setWorkStatus(WorkStatus.COME);
      setLeaveType("");
      setWorkReason("");
      setType("");
      setIdCalendar(null);
      setLeaveCause("ลาโดยใช้วันหยุด");
      setLeaveReason("");
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };
// ฟังก์ชันสำหรับสั่งให้ปฏิทินกระโดดไปยังวันที่กำหนด
  const handleGotoDate = (targetDate: any) => {
    if (calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      // ใช้ moment แปลงวันที่ให้เป็นรูปแบบที่ FullCalendar เข้าใจ
      const formattedDate = moment(targetDate).format("YYYY-MM-DD");
      calendarApi.gotoDate(formattedDate);
    }
  };
  const handleClose = () => {
    setType("");
    setIdCalendar("");
    setWorkStatus(WorkStatus.COME);
    setEditable(false);
  };

  const filterWorkStatus = (text: any) => events.filter((event: any) => event.title === text).length;

  const [messages, setMessages] = useState([]);
  const [isToggleField, setIsToggleField] = useState({
    hideSalary: true, hideOT: true, hidePerdiem: true, hideSSO: true, hideTotalPaid: true,
  });

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-4 md:p-8 bg-slate-50 min-h-screen text-slate-800 font-sans w-full">
      {isLoading && <Loading />}
      {isLoadingCalendar && <Loading />}

  {/* Sidebar: สัดส่วนซ้าย */}
      <aside className="w-full lg:w-80 flex flex-col gap-6 shrink-0">
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
          <ListWorking />
        </div>

        {/* --- ส่วนที่เพิ่มใหม่: สรุปประวัติการใช้วันลา (UI แบบใหม่ + ปุ่มเปลี่ยนปี) --- */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-col max-h-[420px] relative">
          
          {/* กรณีโหลดข้อมูลให้แสดง Spinner อ่อนๆ บังไว้ */}
          {isLoadingAnnual && (
             <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-10 flex items-center justify-center rounded-2xl">
               <FaSpinner className="animate-spin text-slate-400 text-2xl" />
             </div>
          )}

          {/* Header */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex items-start gap-3">
              <div className="flex mt-1 items-center justify-center w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 text-slate-600 shadow-sm shrink-0">
                <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg"><path d="M12 2C6.486 2 2 6.486 2 12s4.486 10 10 10 10-4.486 10-10S17.514 2 12 2zm0 18c-4.411 0-8-3.589-8-8s3.589-8 8-8 8 3.589 8 8-3.589 8-8 8z"></path><path d="M13 7h-2v5.414l3.293 3.293 1.414-1.414L13 11.586z"></path></svg>
              </div>
              <div className="flex flex-col">
                <h3 className="font-bold text-slate-800 leading-tight">ประวัติการลา</h3>
                {/* Navigator ปุ่มกดเปลี่ยนปี */}
                <div className="flex items-center gap-1 mt-1.5 -ml-1">
                  <button 
                    onClick={handlePrevLeaveYear} 
                    /* ปิดปุ่มถ้าย้อนไปแล้วไม่มีข้อมูล (ป้องกันการย้อนไม่จบ) */
                    disabled={isLoadingAnnual || annualLeaves.length === 0}
                    className="p-1 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="16" width="16" xmlns="http://www.w3.org/2000/svg"><path d="M15.41 16.59L10.83 12l4.58-4.59L14 6l-6 6 6 6 1.41-1.41z"></path></svg>
                  </button>
                  <span className="text-[11px] text-slate-600 font-bold bg-slate-100/80 px-2 py-0.5 rounded">
                    ก.ค. {leaveCycleYear} - มิ.ย. {leaveCycleYear + 1}
                  </span>
                  <button 
                    onClick={handleNextLeaveYear} 
                    /* ปิดปุ่มถ้าเป็นรอบปีปัจจุบันแล้ว (ป้องกันการเลื่อนไปอนาคต) */
                    disabled={isLoadingAnnual || leaveCycleYear >= initialBaseYear}
                    className="p-1 rounded-md hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="16" width="16" xmlns="http://www.w3.org/2000/svg"><path d="M8.59 16.59L13.17 12 8.59 7.41 10 6l6 6-6 6-1.41-1.41z"></path></svg>
                  </button>
                </div>
              </div>
            </div>
            {/* สรุปรวมทั้งหมด */}
            <div className="text-right shrink-0">
              <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Total</span>
              <div className="font-bold text-slate-800 text-xl leading-none">{annualLeaves.length}</div>
            </div>
          </div>

          {/* Counters สรุปแยกประเภท */}
          <div className="grid grid-cols-2 gap-2 mb-4 shrink-0">
            <div className="bg-orange-50 border border-orange-100 rounded-lg p-2.5 flex justify-between items-center">
              <span className="text-[11px] font-semibold text-orange-700">ลาป่วย</span>
              <div className="flex items-baseline gap-1">
                <span className="text-base font-bold text-orange-700">
                  {annualLeaves.filter((l: any) => (l.leave_cause || l.cause)?.includes("ป่วย")).length}
                </span>
                <span className="text-[10px] font-medium text-orange-600/70">วัน</span>
              </div>
            </div>
            <div className="bg-emerald-50 border border-emerald-100 rounded-lg p-2.5 flex justify-between items-center">
              <span className="text-[11px] font-semibold text-emerald-700">ใช้วันหยุด</span>
              <div className="flex items-baseline gap-1">
                <span className="text-base font-bold text-emerald-700">
                  {annualLeaves.filter((l: any) => (l.leave_cause || l.cause)?.includes("วันหยุด") || (l.leave_cause || l.cause)?.includes("พักร้อน")).length}
                </span>
                <span className="text-[10px] font-medium text-emerald-600/70">วัน</span>
              </div>
            </div>
          </div>
          
          {/* List Items */}
          <div className="flex flex-col gap-1 overflow-y-auto pr-1 custom-scrollbar -mx-2 px-2 flex-1">
            {annualLeaves.length > 0 ? (
              annualLeaves
                .sort((a: any, b: any) => new Date(b.leave_date || b.start).getTime() - new Date(a.leave_date || a.start).getTime())
                .map((leave: any, index: number) => {
                  const causeText = leave.leave_cause || leave.cause || "ไม่ได้ระบุประเภท";
                  let badgeStyle = "bg-slate-100 text-slate-700"; 
                  if (causeText.includes("ป่วย")) {
                    badgeStyle = "bg-orange-100 text-orange-700";
                  } else if (causeText.includes("วันหยุด") || causeText.includes("พักร้อน")) {
                    badgeStyle = "bg-emerald-100 text-emerald-700";
                  } else {
                    badgeStyle = "bg-blue-100 text-blue-700";
                  }

                  const leaveDate = leave.leave_date || leave.start;

                  return (
                    <div 
                      key={index} 
                      onClick={() => handleGotoDate(leaveDate)}
                      className="flex flex-col p-3 rounded-xl hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-all cursor-pointer group active:scale-[0.98]"
                    >
                      <div className="flex justify-between items-center mb-1.5">
                        <div className="flex items-center gap-2">
                          <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${badgeStyle}`}>
                            {causeText}
                          </span>
                        </div>
                        <span className="text-xs font-semibold text-slate-600">
                          {moment(leaveDate).format("DD MMM YYYY")}
                        </span>
                      </div>
                      {(leave.leave_reason || leave.reason) && (
                        <span className="text-xs text-slate-500 line-clamp-1 group-hover:line-clamp-none transition-all pl-1">
                          {leave.leave_reason || leave.reason}
                        </span>
                      )}
                    </div>
                  );
                })
            ) : (
              <div className="text-sm text-slate-400 text-center py-8 flex flex-col items-center justify-center gap-2 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                ไม่มีประวัติการใช้วันลาในรอบปีนี้
              </div>
            )}
          </div>
        </div>
        {/* -------------------------------------- */}

        <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex-1">
          <h3 className="font-semibold text-lg text-slate-800 border-b border-slate-100 pb-3 mb-4">ข้อความ</h3>
          <ListMessage messages={messages} />
        </div>
      </aside>

      {/* Main Content: สัดส่วนขวา */}
      <main className="flex-1 flex flex-col gap-6 min-w-0">
        
        {/* --- ส่วน Dashboard Cards สรุปการเงิน --- */}
        <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-5 gap-4">
          
          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex flex-col gap-1 relative">
            <span className="text-sm font-medium text-slate-500">เงินเดือน</span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xl font-bold text-slate-800">
                {isToggleField.hideSalary ? "****" : (employee.Employment_Details?.salary ? employee.Employment_Details.salary.toLocaleString() : 0)}
              </span>
              <button onClick={() => setIsToggleField(p => ({ ...p, hideSalary: !p.hideSalary }))} className="text-slate-400 hover:text-slate-600 transition-colors">
                {!isToggleField.hideSalary ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex flex-col gap-1 relative">
            <span className="text-sm font-medium text-slate-500">
              OT ({isToggleField.hideOT ? "X" : (employee.Employment_Details?.salary ? calOT(employee.Employment_Details.salary) : 0)} x {events.filter((e: any) => e.ot).length})
            </span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xl font-bold text-sky-600">
                {isToggleField.hideOT ? "****" : 
                  (events.filter((e: any) => e.ot).length * calOT(employee.Employment_Details?.salary)).toLocaleString()
                }
              </span>
              <button onClick={() => setIsToggleField(p => ({ ...p, hideOT: !p.hideOT }))} className="text-slate-400 hover:text-slate-600 transition-colors">
                {!isToggleField.hideOT ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex flex-col gap-1 relative">
            <span className="text-sm font-medium text-slate-500">
              Perdiem (250 x {events.filter((e: any) => e.perdiem).length})
            </span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xl font-bold text-blue-600">
                {isToggleField.hidePerdiem ? "****" : (events.filter((e: any) => e.perdiem).length * 250).toLocaleString()}
              </span>
              <button onClick={() => setIsToggleField(p => ({ ...p, hidePerdiem: !p.hidePerdiem }))} className="text-slate-400 hover:text-slate-600 transition-colors">
                {!isToggleField.hidePerdiem ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex flex-col gap-1 relative">
            <span className="text-sm font-medium text-slate-500">
              หัก {employee.Employment_Details?.position === ROLESEMPLOOYEE.General ? "ประกันสังคม" : "ภาษี ณ ที่จ่าย"}
            </span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-xl font-bold text-red-500">
                {isToggleField.hideSSO ? "****" : 
                  (employee.Employment_Details?.position 
                    ? employee.Employment_Details?.position !== ROLESEMPLOOYEE.General ? 1125 
                      : (employee.Employment_Details?.salary * 0.05 >= 875 ? 875 : employee.Employment_Details?.salary * 0.05)
                    : 0).toLocaleString()
                }
              </span>
              <button onClick={() => setIsToggleField(p => ({ ...p, hideSSO: !p.hideSSO }))} className="text-slate-400 hover:text-slate-600 transition-colors">
                {!isToggleField.hideSSO ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
          </div>

          <div className="bg-slate-800 text-white rounded-xl p-4 shadow-md flex flex-col gap-1 relative">
            <span className="text-sm font-medium text-slate-300">Total Paid</span>
            <div className="flex items-center justify-between mt-1">
              <span className="text-2xl font-bold text-white">
                {isToggleField.hideTotalPaid ? "****" : 
                  (employee.Employment_Details?.position !== ROLESEMPLOOYEE.General
                    ? (
                        employee.Employment_Details?.salary +
                        events.filter((e: any) => e.ot).length * calOT(employee.Employment_Details?.salary) +
                        events.filter((e: any) => e.perdiem).length * 250 - 1125
                      ).toLocaleString()
                    : employee.Employment_Details?.position === ROLESEMPLOOYEE.General
                    ? (
                        employee.Employment_Details.salary +
                        events.filter((e: any) => e.ot).length * calOT(employee.Employment_Details.salary) +
                        events.filter((e: any) => e.perdiem).length * 250 - calSSO(employee.Employment_Details.salary)
                      ).toLocaleString()
                    : 0)
                }
              </span>
              <button onClick={() => setIsToggleField(p => ({ ...p, hideTotalPaid: !p.hideTotalPaid }))} className="text-slate-400 hover:text-white transition-colors">
                {!isToggleField.hideTotalPaid ? <FaEye /> : <FaEyeSlash />}
              </button>
            </div>
          </div>
        </div>

        {/* --- สรุปสถิติวันเข้างาน (Legend) --- */}
        <div className="bg-white rounded-xl p-4 shadow-sm border border-slate-100 flex flex-wrap items-center gap-6 text-sm">
          <div className="font-semibold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-lg">
            เดือนนี้มี {totalDayInMonth} วัน
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-green-600"></div> มา: {filterWorkStatus(WorkStatus.COME)}</span>
            <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-red-500"></div> ลาเดือนนี้: {filterWorkStatus(WorkStatus.LEAVE)}</span>
            <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-slate-500"></div> หยุด: {filterWorkStatus(WorkStatus.NOTCOME)}</span>
            <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-sky-400"></div> OT: {events.filter((e: any) => e.ot).length}</span>
            <span className="flex items-center gap-2"><div className="w-3 h-3 rounded-full bg-blue-600"></div> Perdiem: {events.filter((e: any) => e.perdiem).length}</span>
          </div>
          <div className="ml-auto text-slate-500 italic">
            กรอกไปแล้ว {filterWorkStatus(WorkStatus.COME) + filterWorkStatus(WorkStatus.LEAVE) + filterWorkStatus(WorkStatus.NOTCOME)} วัน
          </div>
        </div>

        {/* --- ส่วนปฏิทิน --- */}
        <div className="bg-white rounded-2xl p-4 md:p-6 shadow-sm border border-slate-100 relative z-0 overflow-hidden">
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin, multiMonthPlugin]}
            headerToolbar={{
              left: "prev,next today",
              center: "title",
              right: "dayGridMonth",
            }}
            businessHours={{ daysOfWeek: [1, 2, 3, 4, 5] }}
            editable={false}
            height={700}
            events={events}
            selectable={!isLoadingCalendar}
            eventClick={handleDateClick}
            dateClick={handleDateClick}
            datesSet={handleMonthChange}
            eventContent={renderEventContent}
            initialView="dayGridMonth"
            fixedWeekCount={false}
            showNonCurrentDates={false}
            displayEventTime={true}
          />
        </div>
      </main>

      <EventModal
        workReason={workReason}
        setWorkReason={setWorkReason}
        handleDelete={handleDelete}
        type={type}
        idCalendar={idCalendar}
        values={values}
        setValues={setValues}
        workStatus={workStatus}
        setWorkStatus={setWorkStatus}
        leaveReason={leaveReason}
        setLeaveReason={setLeaveReason}
        leaveType={leaveType}
        setLeaveType={setLeaveType}
        leaveCause={leaveCause}
        setLeaveCause={setLeaveCause}
        checkBoxed={checkBoxed}
        setCheckBoxed={setCheckBoxed}
        open={editable}
        onClose={handleClose}
        onAddEvent={handleOk}
      />
    </div>
  );
};

// ปรับรูปแบบ Event ที่แสดงบนปฏิทินให้ดูสะอาดขึ้น
function renderEventContent(eventContent: any) {
  const data = eventContent.event.extendedProps;
  return (
    <div className="cursor-pointer p-1 overflow-hidden">
      {data.type === "come" ? (
        <div className="flex flex-col gap-0.5 text-xs text-white">
          <div className="flex items-center gap-1 font-medium">
            <span>{moment(data.timeStart).format("HH:mm")}</span>
            <span>-</span>
            <span>{moment(data.timeEnd).format("HH:mm")}</span>
          </div>
          {data.workReason && <div className="truncate opacity-90">{data.workReason}</div>}
        </div>
      ) : data.type === "leave" ? (
        <div className="flex flex-col gap-0.5 text-xs text-white">
          <div className="font-medium truncate">{data.cause || "ลา"}</div>
          {data.reason && <div className="truncate opacity-90">{data.reason}</div>}
        </div>
      ) : (
        <div className="flex flex-col gap-0.5 text-xs text-white">
          <div className="font-medium">หยุด</div>
          {data.workReason && <div className="truncate opacity-90">{data.workReason}</div>}
        </div>
      )}
    </div>
  );
}

export default index;