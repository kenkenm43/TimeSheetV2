/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import multiMonthPlugin from "@fullcalendar/multimonth";
import {
  addWorkSchedule,
  getWorkSchedule,
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
  const { employee } = useEmployeeStore();

  useEffect(() => {
    const fetchData = async () => {
      const response = await getWorkSchedule(employee.id);
      console.log(response.data);

      const event = addEvents(response.data);
      console.log(event);

      // setEvents(event);
    };
    fetchData();
  }, [employee.id]);
  const formatDate = (date: any, time?: any, format?: any) => {
    const dateF = moment(date + time).format(format);
    return dateF;
  };

  const addEvents = (arrs: any) => {
    const formatEvents = arrs.map((arr: any) => {
      let background;
      if (arr.work_status === WorkStatus.COME) {
        background = "green";
      } else if (arr.work_status === WorkStatus.NOTCOME) {
        background = "gray";
      }
      const formatEvent = {
        id: arr.id,
        title: arr.work_status,
        start: formatDate(arr.work_start, "", "YYYY-MM-DDTHH:mm:ss"),
        end: formatDate(arr.work_end, "", "YYYY-MM-DDTHH:mm:ss"),
        background: background,
      };

      return formatEvent;
    });
    return formatEvents;
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
    }

    setEditable(true);
  };

  const handleEventCreation = (
    startDate: any,
    endDate: any,
    title: any,
    backgroundColor: any
  ) => {
    const eventDateCurrent = startDate;
    const existingEvent = events.find((event: any) => {
      const eventDateStr = formatDate(event.start, "", "YYYY-MM-DD");
      return eventDateStr === formatDate(eventDateCurrent, "", "YYYY-MM-DD");
    });

    if (!existingEvent) {
      const newEvent = {
        id: uuidv4(),
        title: title,
        start: new Date(startDate),
        end: new Date(endDate),
        allDay: true,
        display: "background",
        backgroundColor: backgroundColor,
      };
      setEvents([...events, newEvent]);
    } else {
      const updatedEvents = events.map((event: any) => {
        const eventDateStr = formatDate(event.start, "", "YYYY-MM-DD");
        if (eventDateStr === formatDate(eventDateCurrent, "", "YYYY-MM-DD")) {
          return {
            ...event,
            start: startDate,
            end: endDate,
            title: title,
            backgroundColor: backgroundColor,
          };
        }

        return event;
      });

      setEvents(updatedEvents);
    }
  };

  // const handleDateSelect = (arg) => {
  //   const newTitle = prompt("Enter event name:");
  //   const { start, end } = arg;

  //   // Iterate through each date in the selected range
  //   for (
  //     let date = new Date(start);
  //     date <= end;
  //     date.setDate(date.getDate() + 1)
  //   ) {
  //     handleEventCreation(new Date(date), newTitle);
  //   }
  // };

  const handleOk = async (e: any, formValue: any) => {
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
    handleEventCreation(values.start, values.end, title, backgroundColor);

    await addWorkSchedule(
      {
        work_status: title,
        work_start: formatDate(values.start, "YYYY-MM-DDTHH:mm:ss[Z]"),
        work_end: formatDate(values.end, "YYYY-MM-DDTHH:mm:ss[Z]"),
      },
      employee.id
    );

    setEditable(false);
    setValues({ title: "", start: "", end: "" });
    setWorkStatus(WorkStatus.COME);
    title = "";
    backgroundColor = "";
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
    <div className="bg-red-500">
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
