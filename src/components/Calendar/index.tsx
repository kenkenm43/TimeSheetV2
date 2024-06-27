/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import multiMonthPlugin from "@fullcalendar/multimonth";
import {
  addLeave,
  addWorkSchedule,
  deleteLeaveSchedule,
  deleteWorkSchedule,
  getLeaves,
  getWorkSchedules,
  updateLeave,
  updateWorkSchedule,
} from "../../services/employeeServices";
import "./calendar.module.css";
import EventModal from "../Modal";
import moment from "moment";
import useEmployeeStore from "../../context/EmployeeProvider";
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
  const [currentMonth, setCurretMonth] = useState("");
  const [costSSO, setCostSSO] = useState(750);
  const { employee } = useEmployeeStore();
  console.log("new events", events);

  useEffect(() => {
    const fetchData = async () => {
      const work = await getWorkSchedules(employee.id);
      const leave = await getLeaves(employee.id);
      setLeaveType(leave);
      const event = addEvents(work.data, leave.data);
      setEvents(event);
    };
    fetchData();
  }, [employee.id]);

  useEffect(() => {});
  const formatDate = (date: any, time?: any, format?: any) => {
    const dateF = moment(date + time).format(format);
    return dateF;
  };

  const addEvents = (workArr: any, leaveArr: any) => {
    const formatWorkEvents = workArr.map((arr: any) => {
      let background;
      if (arr.work_status === WorkStatus.COME) {
        background = "green";
      } else if (arr.work_status === WorkStatus.NOTCOME) {
        background = "gray";
      }
      const formatEvent = {
        id: arr.id,
        title: arr.work_status,
        start: moment(arr.work_start)!.utcOffset("-07:00")._d,
        end: moment(arr.work_end)!.utcOffset("-07:00")._d,
        ot: arr.work_ot,
        perdiem: arr.work_perdium,
        allDay: true,
        display: "background",
        backgroundColor: background,
      };

      return formatEvent;
    });
    const leaveWorkEvents = leaveArr.map((arr: any) => {
      const formatEvent = {
        ...arr,
        id: arr.id,
        title: "leave",
        start: arr.leave_date,
        end: arr.work_end,
        reason: arr.leave_reason,
        cause: arr.leave_cause,
        type: arr.leave_type,
        allDay: true,
        display: "background",
        backgroundColor: "red",
      };

      return formatEvent;
    });

    return [...formatWorkEvents, ...leaveWorkEvents];
  };

  const handleDateClick = (arg: any) => {
    const { dateStr } = arg;
    const startDate = new Date(
      formatDate(dateStr, "T14:00:00", "YYYY-MM-DDTHH:mm:ss")
    );
    const endDate = new Date(
      formatDate(dateStr, "T01:00:00", "YYYY-MM-DDTHH:mm:ss")
    );
    const currentValueDate = events.find((event: any) => {
      const eventDate = formatDate(event.start, "", "YYYY-MM-DD");
      return eventDate === formatDate(dateStr, "", "YYYY-MM-DD");
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
      setValues({
        title: currentValueDate.title,
        start: startDate,
        end: currentValueDate.end || endDate,
      });

      setWorkStatus(currentValueDate.title);
      if (currentValueDate.title === WorkStatus.LEAVE) {
        setLeaveCause(currentValueDate.leave_cause);
        setLeaveReason(currentValueDate.leave_reason);
        setLeaveType(currentValueDate.type);
      }
    }
    setEditable(true);
  };

  const handleEventCreation = async (
    startDate: any,
    endDate: any,
    title: any,
    backgroundColor: any,
    leaveCause: any,
    leaveReason: any,
    leaveType: any
  ) => {
    let newEvent;
    if (title === WorkStatus.LEAVE) {
      console.log("leaveReason", leaveReason);
      console.log("leaveType", leaveType);
      console.log("leaveCause", leaveCause);

      const { data } = await addLeave(
        {
          leave_date: formatDate(values.start, "", "YYYY-MM-DDTHH:mm:ss[Z]"),
          leave_reason: leaveReason,
          leave_type: leaveType,
          leave_cause: leaveCause,
        },
        employee.id
      );
      // console.log("dataLEave", data);

      newEvent = {
        id: data.id,
        title: title,
        start: startDate,
        end: endDate,
        cause: leaveCause,
        reason: leaveReason,
        type: leaveType,
        allDay: true,
        display: "background",
        backgroundColor: backgroundColor,
      };
    } else {
      const { data } = await addWorkSchedule(
        {
          work_status: title,
          work_start: formatDate(values.start, "", "YYYY-MM-DDTHH:mm:ss[Z]"),
          work_end: formatDate(values.end, "", "YYYY-MM-DDTHH:mm:ss[Z]"),
          work_ot: checkBoxed.includes("OT") ? true : false,
          work_perdium: checkBoxed.includes("Perdiem") ? true : false,
        },
        employee.id
      );
      newEvent = {
        id: data.id,
        title: title,
        start: startDate,
        end: endDate,
        cause: leaveCause,
        reason: leaveReason,
        type: leaveType,
        allDay: true,
        display: "background",
        backgroundColor: backgroundColor,
      };
    }
    setEvents([...events, newEvent]);
  };

  const handleEventUpdate = async (
    idDate: any,
    typeOld: any,
    typeNew: any,
    timeStart: any,
    timeEnd: any,
    leaveCause: any,
    leaveType: any
  ) => {
    let updateEvent: any;
    if (typeOld !== typeNew) {
      if (typeOld === WorkStatus.LEAVE) {
        await deleteLeaveSchedule(employee.id, idDate);
        await addWorkSchedule(
          {
            work_status: typeNew,
            work_start: formatDate(values.start, "", "YYYY-MM-DDTHH:mm:ss[Z]"),
            work_end:
              formatDate(values.end, "", "YYYY-MM-DDTHH:mm:ss[Z]") || null,
            work_ot: checkBoxed.includes("OT") ? true : false,
            work_perdium: checkBoxed.includes("Perdiem") ? true : false,
          },
          employee.id
        );
        updateEvent = {
          id: idDate,
          title: typeNew,
          start: timeStart,
          end: timeEnd,
          allDay: true,
          display: "background",
          backgroundColor: typeNew === WorkStatus.COME ? "green" : "gray",
        };
      } else if (typeNew === WorkStatus.LEAVE) {
        await deleteWorkSchedule(employee.id, idDate);

        await addLeave(
          {
            leave_date: formatDate(timeStart, "", "YYYY-MM-DDTHH:mm:ss[Z]"),
            leave_reason: leaveReason,
            leave_type: leaveType,
            leave_cause: leaveCause,
          },
          employee.id
        );
        updateEvent = {
          id: idDate,
          title: WorkStatus.LEAVE,
          start: timeStart,
          end: timeEnd,
          cause: leaveCause,
          type: leaveType,
          allDay: true,
          display: "background",
          backgroundColor: "red",
        };
      } else {
        console.log("updateWOrk");

        updateWorkSchedule(
          {
            work_start: timeStart,
            work_end: timeEnd,
            work_status: typeNew,
            work_ot: checkBoxed.includes("OT") ? true : false,
            work_perdium: checkBoxed.includes("Perdiem") ? true : false,
          },
          employee.id,
          idDate
        );

        updateEvent = {
          id: idDate,
          title: typeNew,
          start: timeStart,
          end: timeEnd,
          allDay: true,
          display: "background",
          backgroundColor: typeNew === WorkStatus.COME ? "green" : "gray",
        };
      }
    } else {
      if (typeNew === WorkStatus.LEAVE) {
        console.log("updatesameleave");

        const { data } = await updateLeave(
          {
            leave_date: formatDate(timeStart, "", "YYYY-MM-DDTHH:mm:ss[Z]"),
            leave_reason: leaveReason,
            leave_type: leaveType,
            leave_cause: leaveCause,
          },
          employee.id,
          idDate
        );
        console.log("leave update data", data);
        console.log("leave updateReason", leaveReason);
        console.log("leaveupdate caues", leaveCause);

        updateEvent = {
          id: idDate,
          title: WorkStatus.LEAVE,
          start: timeStart,
          end: timeEnd,
          reason: leaveReason,
          cause: leaveCause,
          type: leaveType,
          allDay: true,
          display: "background",
          backgroundColor: "red",
        };
      } else if (typeOld === typeNew) {
        console.log("update work");
        console.log("chckbox", checkBoxed);
        console.log("OT", checkBoxed.includes("OT") ? true : false);
        console.log("Perdiem", checkBoxed.includes("Perdiem") ? true : false);

        updateWorkSchedule(
          {
            work_start: timeStart,
            work_end: timeEnd,
            work_status: typeNew,
            work_ot: checkBoxed.includes("OT") ? true : false,
            work_perdium: checkBoxed.includes("Perdiem") ? true : false,
          },
          employee.id,
          idDate
        );

        updateEvent = {
          id: idDate,
          title: typeNew,
          start: timeStart,
          end: timeEnd,
          allDay: true,
          display: "background",
          backgroundColor: typeNew === WorkStatus.COME ? "green" : "gray",
        };
      }
    }
    setEvents((events: any) => [...events, updateEvent]);
  };

  const dateCurrent = (date: any) => {
    const existingEvent = events.find((event: any) => {
      const eventDateStr = formatDate(event.start, "", "YYYY-MM-DD");
      return eventDateStr === formatDate(date, "", "YYYY-MM-DD");
    });
    return existingEvent;
  };

  const handleOk = async (e: any, formValue: any) => {
    console.log("formValue", formValue);

    let title = "";
    let backgroundColor = "";
    if (workStatus === WorkStatus.COME) {
      title = WorkStatus.COME;
      backgroundColor = "green";
    } else if (workStatus === WorkStatus.NOTCOME) {
      title = WorkStatus.NOTCOME;
      backgroundColor = "gray";
    } else if (workStatus === WorkStatus.LEAVE) {
      title = WorkStatus.LEAVE;
      backgroundColor = "red";
    }
    const currentDateValue = dateCurrent(values.start);

    if (!dateCurrent(values.start)) {
      handleEventCreation(
        values.start,
        values.end,
        title,
        backgroundColor,
        leaveCause,
        formValue.leave_reason,
        workStatus
      );
    } else {
      handleEventUpdate(
        currentDateValue.id,
        currentDateValue.title,
        title,
        values.start,
        values.end,
        leaveCause,
        workStatus
      );
    }

    setEditable(false);
    setValues({ title: "", start: new Date(), end: new Date() });
    setWorkStatus(WorkStatus.COME);
    setLeaveCause("");
    setLeaveType("");
    setLeaveReason("");
    title = "";
    backgroundColor = "";
  };

  const handleClose = () => {
    setWorkStatus(WorkStatus.COME);
    setEditable(false);
  };

  return (
    <div className="w-full">
      {" "}
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
        views={{
          dayGridMonth: {
            titleFormat: { year: "numeric", month: "long" },
          },
        }}
        editable
        height={650}
        events={events}
        dateClick={handleDateClick}
        eventContent={renderEventContent}
        initialView="dayGridMonth"
      />
      <EventModal
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
      <div>
        <div>Based salary : {employee.Employment_Details?.salary}</div>
        <div>ประกันสังคม : {costSSO}</div>
        <div>Add : Expenses claim : -</div>
        <div>Total Paid: {employee?.Employment_Details?.salary - costSSO}</div>
      </div>
    </div>
  );
};

function renderEventContent(eventContent: any) {
  const { timeText } = eventContent;

  return (
    <div className="bg-red-800">
      {timeText && (
        <>
          <div className="fc-daygrid-event-dot"></div>
          <div className="fc-event-time">{timeText}</div>
        </>
      )}
      {/* <div className="fc-event-title">{event.title}</div> */}
    </div>
  );
}

export default index;
