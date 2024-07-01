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
  getLeavesBypost,
  getWorkSchedules,
  getWorkSchedulesByPost,
  updateLeave,
  updateWorkSchedule,
} from "../../services/employeeServices";
import "./calendar.module.css";
import EventModal from "../Modal";
import moment from "moment";
import useEmployeeStore from "../../context/EmployeeProvider";
import ListWorking from "../ListWorking";
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
  const [leaves, setLeaves] = useState<any>([]);
  const [works, setWorks] = useState<any>([]);
  const [countNotCome, setCountNotCome] = useState(0);
  const [countCome, setCountCome] = useState(0);
  const [countLeave, setCountLeave] = useState(0);
  const [costSSO] = useState(750);
  const { employee } = useEmployeeStore();
  const handleMonthChange = async (payload: any) => {
    if (payload.view.currentStart || payload.view.currentEnd) {
      const work = await getWorkSchedulesByPost(
        {
          currentStart: moment(payload.view.currentStart).format("YYYY-MM-DD"),
          currentEnd: moment(payload.view.currentEnd).format("YYYY-MM-DD"),
        },
        employee.id
      );
      setWorks(work.data);
      setCountCome(
        work.data.filter((wrk: any) => wrk.work_status == WorkStatus.COME)
          .length
      );
      setCountNotCome(
        work.data.filter((wrk: any) => wrk.work_status == WorkStatus.NOTCOME)
          .length
      );
      const leave = await getLeavesBypost(
        {
          currentStart: moment(payload.view.currentStart).format("YYYY-MM-DD"),
          currentEnd: moment(payload.view.currentEnd).format("YYYY-MM-DD"),
        },
        employee.id
      );
      setLeaves(leave.data);

      setCountLeave(leave.data.length);
      const event = addEvents(work.data, leave.data);
      setEvents(event);
    }
  };
  console.log(leaves);

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
      setLeaveCause(() => currentValueDate.leave_cause);
      setLeaveReason(() => currentValueDate.leave_reason);
      setLeaveType(() => currentValueDate.type);
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
        display: "background",
        backgroundColor: backgroundColor,
      });
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
        type: leaveType,
        allDay: true,
        display: "background",
        backgroundColor: backgroundColor,
      });
    }

    setEvents(() => [...newEvent]);
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
          display: "background",
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
          display: "background",
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
          display: "background",
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
          display: "background",
          backgroundColor: "red",
        });
      } else if (typeOld === typeNew) {
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
          display: "background",
          backgroundColor: backgroundColor,
        });
      }
    }

    setEvents(() => [...updateEvent]);
  };

  const dateCurrent = (date: any) => {
    const existingEvent = events.find((event: any) => {
      const eventDateStr = formatDate(event.start, "", "YYYY-MM-DD");
      return eventDateStr === formatDate(date, "", "YYYY-MM-DD");
    });
    return existingEvent;
  };

  const handleOk = async (e: any, formValue: any) => {
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
        backgroundColor,
        values.start,
        values.end,
        leaveCause,
        workStatus
      );
    }

    setEditable(false);
    setValues({ title: "", start: new Date(), end: new Date() });
    setWorkStatus(WorkStatus.COME);
    setLeaveType("");
    setLeaveCause("");
    setLeaveReason("");
    title = "";
    backgroundColor = "";
  };

  const handleClose = () => {
    setWorkStatus(WorkStatus.COME);
    setEditable(false);
  };
  const filterWorkStatus = (text: any) => {
    const filter = events.filter((event: any) => event.title === text);
    return filter.length;
  };
  console.log(
    "events",
    events.filter((event: any) => event.ot)
  );

  return (
    <div className="w-full ml-10 mb-10 mt-5">
      <ListWorking />
      <div className="flex justify-between text-xl ">
        <div>
          <div>
            <span className="font-semibold">Based salary :</span>{" "}
            {employee.Employment_Details?.salary}
          </div>
          <div>
            <span className="font-semibold">ประกันสังคม :</span> {costSSO}
          </div>
          <div>
            <span className="font-semibold"> Total Paid : </span>
            {employee?.Employment_Details?.salary - costSSO}
          </div>
        </div>

        <div className="flex ">
          <div className="font-semibold">เดือนนี้</div>
          <div>
            <div>มา: {filterWorkStatus(WorkStatus.COME)} วัน</div>
            <div>ลา: {filterWorkStatus(WorkStatus.LEAVE)} วัน</div>
            <div>หยุด: {filterWorkStatus(WorkStatus.NOTCOME)} วัน</div>
          </div>
          <div>
            <div>OT: {events.filter((event: any) => event.ot).length} วัน</div>
            <div>
              Perdiem: {events.filter((event: any) => event.perdiem).length} วัน
            </div>
          </div>
          {/* {leaves.map((leave: any) => (
            <>{leave}</>
          ))} */}
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
        views={{
          dayGridMonth: {
            titleFormat: { year: "numeric", month: "long" },
          },
        }}
        editable
        height={650}
        events={events}
        dateClick={handleDateClick}
        datesSet={handleMonthChange}
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
