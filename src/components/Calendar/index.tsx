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
  getLeaves,
  getWorkSchedules,
} from "../../services/employeeServices";
import "./calendar.module.css";
import { v4 as uuidv4 } from "uuid";
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
  const [values, setValues] = useState({ title: "", start: "", end: "" });
  const [workStatus, setWorkStatus] = useState(WorkStatus.COME);
  const [events, setEvents]: any = useState([]);
  const [leaveCause, setLeaveCause] = useState("");
  const [leaveType, setLeaveType] = useState("");
  const { employee } = useEmployeeStore();

  useEffect(() => {
    const fetchData = async () => {
      const work = await getWorkSchedules(employee.id);
      const leave = await getLeaves(employee.id);
      console.log(leave);

      const event = addEvents(work.data, leave.data);
      setEvents(event);
    };
    fetchData();
  }, [employee.id]);
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
        start: arr.work_start,
        end: arr.work_end,
        allDay: true,
        display: "background",
        backgroundColor: background,
      };

      return formatEvent;
    });
    const leaveWorkEvents = leaveArr.map((arr: any) => {
      const formatEvent = {
        id: arr.id,
        title: "leave",
        start: arr.leave_date,
        end: arr.work_end,
        cause: arr.leave_reason,
        type: arr.leave_type,
        allDay: true,
        display: "background",
        backgroundColor: "red",
      };

      return formatEvent;
    });
    console.log("leave", leaveWorkEvents);

    return [...formatWorkEvents, ...leaveWorkEvents];
  };

  const handleDateClick = (arg: any) => {
    const { dateStr } = arg;
    const startDate = formatDate(dateStr, "T07:00:00", "YYYY-MM-DDTHH:mm:ss");
    const endDate = formatDate(dateStr, "T18:00:00", "YYYY-MM-DDTHH:mm:ss");
    const currentValueDate = events.find((event: any) => {
      const eventDate = formatDate(event.start, "", "YYYY-MM-DD");
      return eventDate === formatDate(dateStr, "", "YYYY-MM-DD");
    });

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
        start: currentValueDate.start,
        end: currentValueDate.end,
      });
      setWorkStatus(currentValueDate.title);
      console.log("currentitle", currentValueDate.title);

      if (currentValueDate.title === WorkStatus.LEAVE) {
        console.log("cuase", currentValueDate.cause);
        console.log("type", currentValueDate.type);

        setLeaveCause(currentValueDate.cause);
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
    leaveType: any
  ) => {
    const newEvent = {
      id: uuidv4(),
      title: title,
      start: startDate,
      end: endDate,
      allDay: true,
      display: "background",
      backgroundColor: backgroundColor,
    };
    if (title === WorkStatus.LEAVE) {
      await addLeave(
        {
          leave_date: formatDate(values.start, "", "YYYY-MM-DDTHH:mm:ss[Z]"),
          leave_reason: leaveCause,
          leave_type: leaveType,
        },
        employee.id
      );
    } else {
      await addWorkSchedule(
        {
          work_status: title,
          work_start: formatDate(values.start, "", "YYYY-MM-DDTHH:mm:ss[Z]"),
          work_end: formatDate(values.end, "", "YYYY-MM-DDTHH:mm:ss[Z]"),
        },
        employee.id
      );
    }
    setEvents([...events, newEvent]);
    // else {
    //   const updatedEvents = events.map((event: any) => {
    //     const eventDateStr = formatDate(event.start, "", "YYYY-MM-DD");
    //     if (eventDateStr === formatDate(eventDateCurrent, "", "YYYY-MM-DD")) {
    //       return {
    //         ...event,
    //         start: startDate,
    //         end: endDate,
    //         title: title,
    //         backgroundColor: backgroundColor,
    //       };
    //     }

    //     return event;
    //   });

    //   setEvents(updatedEvents);
    // }
  };

  const handleEventUpdate = async (idDate: any, typeOld: any, typeNew: any) => {
    if (typeOld !== typeNew) {
      return;
    }
    return;
  };

  const dateCurrent = (date: any) => {
    const existingEvent = events.find((event: any) => {
      const eventDateStr = formatDate(event.start, "", "YYYY-MM-DD");
      return eventDateStr === formatDate(date, "", "YYYY-MM-DD");
    });
    return existingEvent;
  };

  const handleOk = async (e: any, formValue: any, leaveType: any) => {
    let title = "";
    let backgroundColor = "";
    if (formValue.work_status === WorkStatus.COME) {
      title = WorkStatus.COME;
      backgroundColor = "green";
    } else if (formValue.work_status === WorkStatus.NOTCOME) {
      title = WorkStatus.NOTCOME;
      backgroundColor = "gray";
    } else {
      title = WorkStatus.LEAVE;
      backgroundColor = "red";
    }
    const currentDateValue = dateCurrent(values.start);
    console.log("current", currentDateValue);

    if (!dateCurrent(values.start)) {
      handleEventCreation(
        values.start,
        values.end,
        title,
        backgroundColor,
        formValue.leave_cause,
        leaveType
      );
    } else {
      handleEventUpdate(currentDateValue.id, currentDateValue.title, title);
    }

    // handleEventCreation(values.start, values.end, title, backgroundColor, formValue.leave_cause, leaveType );
    // console.log("start", values.start);
    // console.log("end", values.end);

    // setEditable(false);
    // setValues({ title: "", start: "", end: "" });
    // setWorkStatus(WorkStatus.COME);
    // setLeaveCause("");
    // setLeaveType("");
    // title = "";
    // backgroundColor = "";
    // console.log(events);
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
          right: "dayGridMonth",
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
        leaveType={leaveType}
        setLeaveType={setLeaveType}
        leaveCause={leaveCause}
        setLeaveCause={setLeaveCause}
        open={editable}
        onClose={handleClose}
        onAddEvent={handleOk}
      />
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
