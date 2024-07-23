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
  function getTotalDaysInMonth(monthString: string) {
    // Parse the month string into a Date object
    const date: any = new Date(monthString);

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

  const handleMonthChange = async (payload: any) => {
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
        if (arr.work_perdium && arr.work_ot) {
          background = "#e100ff";
        } else if (arr.work_perdium) {
          background = "#0044ff";
        } else if (arr.work_ot) {
          background = "#38bdf8";
        } else {
          background = "green";
        }
      } else if (arr.work_status === WorkStatus.NOTCOME) {
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
        backgroundColor: "red",
      };

      return formatEvent;
    });

    return [...formatWorkEvents, ...leaveWorkEvents];
  };

  const handleDateClick = (arg: any) => {
    const { dateStr } = arg;

    const dateSelect = dateStr || arg.event.startStr;
    const startDate = new Date(
      formatDate(dateSelect, "T09:00:00", "YYYY-MM-DDTHH:mm:ss")
    );
    const endDate = new Date(
      formatDate(dateSelect, "T18:00:00", "YYYY-MM-DDTHH:mm:ss")
    );
    const currentValueDate = events.find((event: any) => {
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
    } else {
      console.log("current", currentValueDate);
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
    startDate: any,
    endDate: any,
    title: any,
    backgroundColor: any,
    leaveCause: any,
    leaveReason: any,
    leaveType: any
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
    } else {
      const { data } = await addWorkSchedule(
        {
          work_status: title,
          work_start: formatDate(values.start, "", "YYYY-MM-DDTHH:mm:ss[Z]"),
          work_end: formatDate(values.end, "", "YYYY-MM-DDTHH:mm:ss[Z]"),
          work_ot:
            title === WorkStatus.NOTCOME ? false : checkBoxed.includes("OT"),
          work_perdium:
            title === WorkStatus.NOTCOME
              ? false
              : checkBoxed.includes("Perdiem"),
        },
        employee.id
      );
      newEvent = events.filter((event: any) => event);
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
  };

  const handleEventUpdate = async (
    idDate: any,
    typeOld: any,
    typeNew: any,
    backgroundColor: any,
    timeStart: any,
    timeEnd: any,
    leaveCause: any,
    leaveType: any
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
            work_ot:
              typeNew === WorkStatus.NOTCOME
                ? false
                : checkBoxed.includes("OT"),
            work_perdium:
              typeNew === WorkStatus.NOTCOME
                ? false
                : checkBoxed.includes("Perdiem"),
          },
          employee.id
        );
        updateEvent = events.filter((event: any) => event.id !== idDate);

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
      } else if (typeNew === WorkStatus.LEAVE) {
        await deleteWorkSchedule(employee.id, idDate);

        const { data } = await addLeave(
          {
            leave_date: formatDate(timeStart, "", "YYYY-MM-DDTHH:mm:ss[Z]"),
            leave_reason: leaveReason,
            leave_type: leaveType,
            leave_cause: leaveCause,
          },
          employee.id
        );
        updateEvent = events.filter((event: any) => event.id !== idDate);

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
      } else {
        const { data } = await updateWorkSchedule(
          {
            work_start: timeStart,
            work_end: timeEnd,
            work_status: typeNew,
            work_ot:
              typeNew === WorkStatus.NOTCOME
                ? false
                : checkBoxed.includes("OT"),
            work_perdium:
              typeNew === WorkStatus.NOTCOME
                ? false
                : checkBoxed.includes("Perdiem"),
          },
          employee.id,
          idDate
        );
        updateEvent = events.filter((event: any) => event.id !== idDate);
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
    } else {
      if (typeNew === WorkStatus.LEAVE) {
        await updateLeave(
          {
            leave_date: formatDate(timeStart, "", "YYYY-MM-DDTHH:mm:ss[Z]"),
            leave_reason: leaveReason,
            leave_type: leaveType,
            leave_cause: leaveCause,
          },
          employee.id,
          idDate
        );
        updateEvent = events.filter((event: any) => event.id !== idDate);

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
      } else if (typeOld === typeNew) {
        const { data } = await updateWorkSchedule(
          {
            work_start: formatDate(timeStart, "", "YYYY-MM-DDTHH:mm:ss[Z]"),
            work_end: formatDate(timeEnd, "", "YYYY-MM-DDTHH:mm:ss[Z]"),
            work_status: typeNew,
            work_ot:
              typeNew === WorkStatus.NOTCOME
                ? false
                : checkBoxed.includes("OT"),
            work_perdium:
              typeNew === WorkStatus.NOTCOME
                ? false
                : checkBoxed.includes("Perdiem"),
          },
          employee.id,
          idDate
        );
        updateEvent = events.filter((event: any) => event.id !== idDate);

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

  const dateCurrent = (date: any) => {
    const existingEvent = events.find((event: any) => {
      const eventDateStr = formatDate(event.start, "", "YYYY-MM-DD");
      return eventDateStr === formatDate(date, "", "YYYY-MM-DD");
    });
    return existingEvent;
  };

  const handleOk = async (e: any, formValue: any) => {
    setIsLoading(true);
    try {
      let title = "";
      let backgroundColor = "";
      if (workStatus === WorkStatus.COME) {
        if (checkBoxed.includes("Perdiem") && checkBoxed.includes("OT")) {
          backgroundColor = "#c026d3 ";
        } else if (checkBoxed.includes("Perdiem")) {
          backgroundColor = "#104efa";
        } else if (checkBoxed.includes("OT")) {
          backgroundColor = "#38bdf8";
        } else {
          backgroundColor = "green";
        }
        title = WorkStatus.COME;
      } else if (workStatus === WorkStatus.NOTCOME) {
        title = WorkStatus.NOTCOME;
        backgroundColor = "gray";
      } else if (workStatus === WorkStatus.LEAVE) {
        title = WorkStatus.LEAVE;
        backgroundColor = "red";
      }
      console.log("values", values);
      const currentDateValue = dateCurrent(values.start);
      let updateEvent;
      if (!dateCurrent(values.start)) {
        updateEvent = await handleEventCreation(
          values.start,
          values.end,
          title,
          backgroundColor,
          leaveCause,
          formValue.leave_reason,
          workStatus
        );
      } else {
        updateEvent = await handleEventUpdate(
          currentDateValue.id,
          currentDateValue.title,
          title,
          backgroundColor,
          values.start,
          values.end,
          leaveCause,
          workStatus
        );
      }

      if (updateEvent.length === totalDayInMonth) {
        const salaryData = await getSalaryByEmpId(
          {
            month: moment(values.start).month(),
            year: moment(values.start).year(),
          },
          employee.id
        );

        if (!salaryData.data) {
          const salaryDataAdd = await addSalary({
            employeeId: employee.id,
            month: moment(values.start).month(),
            year: moment(values.start).year(),
            amount:
              employee.Employment_Details?.position === ROLESEMPLOOYEE.Trainee
                ? events.filter((event: any) => event.type === WorkStatus.COME)
                    .length * 500
                : employee.Employment_Details?.position ===
                  ROLESEMPLOOYEE.General
                ? employee?.Employment_Details?.salary
                : 0,
            ot: Number(events.filter((event: any) => event.ot).length),
            perdiem: Number(
              events.filter((event: any) => event.perdiem).length
            ),
            sso: Number(
              employee?.Employment_Details?.position === ROLESEMPLOOYEE.Trainee
                ? events.filter((event: any) => event.type === WorkStatus.COME)
                    .length *
                    500 *
                    0.03
                : employee.Employment_Details?.position ===
                  ROLESEMPLOOYEE.General
                ? employee?.Employment_Details?.salary * 0.05 >= 750
                  ? 750
                  : employee?.Employment_Details?.salary * 0.05
                : 0
            ),
          });
        } else {
          const updateSalary = await updateSalaryById({
            id: salaryData.data.id,
            employeeId: employee.id,
            amount:
              employee.Employment_Details?.position === ROLESEMPLOOYEE.Trainee
                ? events.filter((event: any) => event.type === WorkStatus.COME)
                    .length * 500
                : employee.Employment_Details?.position ===
                  ROLESEMPLOOYEE.General
                ? employee?.Employment_Details?.salary
                : 0,
            ot: Number(events.filter((event: any) => event.ot).length),
            perdiem: Number(
              events.filter((event: any) => event.perdiem).length
            ),
            sso: Number(
              employee?.Employment_Details?.position === ROLESEMPLOOYEE.Trainee
                ? events.filter((event: any) => event.type === WorkStatus.COME)
                    .length *
                    500 *
                    0.03
                : employee.Employment_Details?.position ===
                  ROLESEMPLOOYEE.General
                ? employee?.Employment_Details?.salary * 0.05 >= 750
                  ? 750
                  : employee?.Employment_Details?.salary * 0.05
                : 0
            ),
          });
        }
      }

      setEditable(false);
      setValues({ title: "", start: new Date(), end: new Date() });
      setWorkStatus(WorkStatus.COME);
      setLeaveType("");
      setType("");
      setIdCalendar(null);
      setLeaveCause("ลาโดยใช้วันหยุด");
      setLeaveReason("");
      setIsLoading(false);
      title = "";
      backgroundColor = "";
    } catch (error) {
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setType("");
    setIdCalendar("");
    setWorkStatus(WorkStatus.COME);
    setEditable(false);
  };
  const filterWorkStatus = (text: any) => {
    const filter = events.filter((event: any) => event.title === text);
    return filter.length;
  };

  const [messages, setMessages] = useState([]);
  const [position, setPosition] = useState();
  return (
    <div className="w-full ml-20 mb-10 mt-5">
      {isLoading && <Loading />}
      {isLoadingCalendar && <Loading />}
      <div className="absolute top-32 left-5 flex flex-col w-72 justify-center">
        <ListWorking />
        ข้อความ
        <ListMessage messages={messages} />
      </div>
      <div className="flex space-x-4 relative  bg-red-300 p-2 w-full">
        <div className="flex space-x-4 relative">
          <div className="pl-5 absolute top-7 right-[-27px]">+</div>
          <div className="flex flex-col w-full">
            <span className="font-semibold">
              เงินเดือน{" "}
              {employee.Employment_Details?.position ===
              ROLESEMPLOOYEE.Trainee ? (
                <>
                  {
                    events.filter(
                      (event: any) => event.type === WorkStatus.COME
                    ).length
                  }
                  วัน X 500 :
                </>
              ) : (
                <>:</>
              )}
            </span>{" "}
            <span>
              OT (
              {employee.Employment_Details?.position === ROLESEMPLOOYEE.Trainee
                ? calOT(
                    events.filter(
                      (event: any) => event.type === WorkStatus.COME
                    ).length * 500
                  )
                : employee.Employment_Details?.position ===
                  ROLESEMPLOOYEE.General
                ? calOT(employee.Employment_Details.salary)
                : 0}
              X {events.filter((event: any) => event.ot).length})
            </span>
            <span>
              {" "}
              Perdiem (250 X{" "}
              {events.filter((event: any) => event.perdiem).length})
            </span>
            <span className="font-semibold">
              <u>หัก</u>
              {employee.Employment_Details?.position === ROLESEMPLOOYEE.General
                ? "ประกันสังคม"
                : "ภาษี ณ ที่จ่าย"}
            </span>{" "}
            <span className="font-semibold"> Total Paid : </span>
          </div>
          <div className="flex flex-col items-end ml-5 min-w-6">
            <span className="font-medium">
              {employee.Employment_Details?.position === ROLESEMPLOOYEE.Trainee
                ? (
                    events.filter(
                      (event: any) => event.type === WorkStatus.COME
                    ).length * 500
                  )
                    .toString()
                    .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") || "-"
                : employee.Employment_Details?.position ===
                  ROLESEMPLOOYEE.General
                ? employee.Employment_Details.salary
                  ? employee.Employment_Details.salary
                      .toString()
                      .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
                  : ""
                : 0}
            </span>
            <span>
              {(
                events.filter((event: any) => event.ot).length *
                calOT(
                  employee.Employment_Details?.position ===
                    ROLESEMPLOOYEE.General
                    ? employee.Employment_Details?.salary
                    : events.filter(
                        (event: any) => event.type === WorkStatus.COME
                      ).length * 500
                )
              )
                .toString()
                .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
            </span>
            <span className="border-b-2 border-black w-full text-right">
              {(events.filter((event: any) => event.perdiem).length * 250)
                .toString()
                .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
            </span>
            <span className="border-b-2 border-black w-full text-right relative">
              <div className="pl-5 absolute bottom-[1px] right-[-25px] text-2xl">
                -
              </div>
              {(employee.Employment_Details?.position
                ? employee.Employment_Details?.position ===
                  ROLESEMPLOOYEE.Trainee
                  ? events.filter(
                      (event: any) => event.type === WorkStatus.COME
                    ).length *
                    500 *
                    0.03
                  : employee.Employment_Details?.salary * 0.05 >= 750
                  ? 750
                  : employee.Employment_Details?.salary * 0.05
                : 0
              )
                .toString()
                .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
            </span>
            <span className="font-medium border-double border-b-4  text-right border-black relative">
              {employee.Employment_Details?.position === ROLESEMPLOOYEE.Trainee
                ? (
                    events.filter(
                      (event: any) => event.type === WorkStatus.COME
                    ).length *
                      500 +
                    events.filter((event: any) => event.ot).length *
                      calOT(
                        events.filter(
                          (event: any) => event.type === WorkStatus.COME
                        ).length * 500
                      ) +
                    events.filter((event: any) => event.perdiem).length * 250 -
                    events.filter(
                      (event: any) => event.type === WorkStatus.COME
                    ).length *
                      500 *
                      0.03
                  )
                    .toString()
                    .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
                : employee.Employment_Details?.position ===
                  ROLESEMPLOOYEE.General
                ? (
                    employee.Employment_Details.salary +
                    events.filter((event: any) => event.ot).length *
                      calOT(employee.Employment_Details.salary) +
                    events.filter((event: any) => event.perdiem).length * 250 -
                    calSSO(employee.Employment_Details.salary)
                  )
                    .toString()
                    .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
                : 0}
            </span>
          </div>
        </div>

        <div className="flex ml-16 space-x-5">
          <div className="font-semibold">
            เดือนนี้ มี {totalDayInMonth} วัน :{" "}
          </div>
          <div className="space-y-1">
            <div>
              {" "}
              <div className="flex items-center space-x-2 ">
                <div
                  className={`w-[30px] h-[30px] bg-[#008000] border-2 border-black`}
                ></div>
                <span>มา: {filterWorkStatus(WorkStatus.COME)} วัน</span>
              </div>
            </div>
            <div className="flex items-center space-x-2 ">
              <div
                className={`w-[30px] h-[30px] bg-[#FF0000] border-2 border-black`}
              ></div>
              <span> ลา: {filterWorkStatus(WorkStatus.LEAVE)} วัน</span>
            </div>
            <div className="flex items-center space-x-2 ">
              <div
                className={`w-[30px] h-[30px] bg-[#808080] border-2 border-black`}
              ></div>
              <span>หยุด: {filterWorkStatus(WorkStatus.NOTCOME)} วัน</span>
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-center space-x-2 ">
              <div
                className={`w-[30px] h-[30px] bg-[#38BDF8] border-2 border-black`}
              ></div>
              <span>
                OT: {events.filter((event: any) => event.ot).length} วัน
              </span>
            </div>
            <div className="flex items-center space-x-2 ">
              <div
                className={`w-[30px] h-[30px] bg-[#0044FF] border-2 border-black`}
              ></div>
              <span>
                {" "}
                Perdiem: {
                  events.filter((event: any) => event.perdiem).length
                }{" "}
                วัน
              </span>
            </div>
          </div>
          <div>
            กรอกไปแล้ว{" "}
            {filterWorkStatus(WorkStatus.COME) +
              filterWorkStatus(WorkStatus.LEAVE) +
              filterWorkStatus(WorkStatus.NOTCOME)}{" "}
            วัน
          </div>
        </div>
      </div>
      <FullCalendar
        ref={calendarRef}
        plugins={[
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin,
          multiMonthPlugin,
        ]}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "",
        }}
        businessHours={{
          daysOfWeek: [1, 2, 3, 4, 5],
        }}
        editable={false}
        height={650}
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
      <EventModal
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

function renderEventContent(eventContent: any) {
  return (
    <div className="cursor-pointer">
      {/* <a className="fc-daygrid-event fc-daygrid-block-event fc-h-event fc-event fc-event-draggable fc-event-resizable fc-event-start fc-event-end fc-event-past ticket ticket"> */}
      {eventContent.event.extendedProps &&
      eventContent.event.extendedProps.type === "come" ? (
        <div className="fc-event-main cursor-pointer text-sm">
          <div>เวลาเริ่มงาน</div>
          {moment(eventContent.event.extendedProps.timeStart).format("HH:mm")}
          <div>เวลาเลิกงาน</div>
          {moment(eventContent.event.extendedProps.timeEnd).format("HH:mm")}
        </div>
      ) : eventContent.event.extendedProps.type === "leave" ? (
        <>
          <div>
            <span>
              {eventContent.event.extendedProps.cause || "ลาโดยใช้วันหยุด"}
            </span>
          </div>
          <div>
            เหตุผล:
            <span>{eventContent.event.extendedProps.reason || " - "}</span>
          </div>
        </>
      ) : (
        <div>หยุด</div>
      )}
      {/* <div className="fc-event-resizer fc-event-resizer-end"></div> */}
      {/* </a> */}
      {/* <div className="fc-event-title">{event.title}</div> */}
    </div>
  );
}

export default index;
