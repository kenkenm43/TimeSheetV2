/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import multiMonthPlugin from "@fullcalendar/multimonth";
import "./calendar.module.css";
import { v4 as uuidv4 } from "uuid";
import EventModal from "../Modal";
import moment from "moment";
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

  const formatDate = (date: any, time?: any, format?: any) => {
    const dateF = moment(date + time).format(format);
    return dateF;
  };
  console.log(events);

  const handleDateClick = (arg: any) => {
    const { dateStr } = arg;
    console.log(dateStr);

    const startDate = formatDate(dateStr, "T07:00:00", "YYYY-MM-DDTHH:mm:ss");
    const endDate = formatDate(dateStr, "T18:00:00", "YYYY-MM-DDTHH:mm:ss");
    const currentValueDate = events.find((event: any) => {
      const eventDate = formatDate(event.start, "", "YYYY-MM-DD");
      return eventDate === formatDate(dateStr, "", "YYYY-MM-DD");
    });
    console.log("current", currentValueDate);

    if (!currentValueDate) {
      setValues({
        title: WorkStatus.COME,
        start: startDate,
        end: endDate,
      });
      setWorkStatus(WorkStatus.COME);
    } else {
      console.log("current");

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
    console.log("startDate", startDate);
    console.log("end", endDate);

    const eventDateCurrent = startDate;

    const existingEvent = events.find((event: any) => {
      const eventDateStr = formatDate(event.start, "", "YYYY-MM-DD");

      return eventDateStr === formatDate(eventDateCurrent, "", "YYYY-MM-DD");
    });

    if (!existingEvent) {
      console.log("no exist");

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
      console.log("exist");

      const updatedEvents = events.map((event: any) => {
        const eventDateStr = formatDate(event.start, "", "YYYY-MM-DD");
        if (eventDateStr === formatDate(eventDateCurrent, "", "YYYY-MM-DD")) {
          console.log("if");

          return {
            ...event,
            start: startDate,
            end: endDate,
            title: title,
            backgroundColor: backgroundColor,
          };
        }
        console.log("notif");

        return event;
      });
      console.log("update", updatedEvents);

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

  const handleOk = (e: any, formValue: any) => {
    // console.log({ ...selectedDate });

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
    console.log("start", formValue.start, "end", formValue.end);

    handleEventCreation(values.start, values.end, title, backgroundColor);

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
