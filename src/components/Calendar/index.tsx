/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useEffect, useRef, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import multiMonthPlugin from "@fullcalendar/multimonth";
import "./calendar.module.css";
import EventModal from "../Modal";
const index = () => {
  const [editable, setEditable] = useState(false);
  const calendarRef = useRef(null);
  const [lastClickedEventId, setLastClickedEventId] = useState(null);
  const [values, setValues] = useState({ title: "", start: "", end: "" });
  const [events, setEvents]: any = useState([
    {
      id: "dawd",
      start: new Date("2024-03-05"),
      title: "วันหยุด",
    },
  ]);

  const handleDateClick = (arg) => {
    if (lastClickedEventId) {
      console.log("Last clicked event ID:", lastClickedEventId);
      // Use the lastClickedEventId as needed
    }
    console.log(arg);
    setValues({
      title: "",
      start: arg.start,
      end: "",
    });

    // setEditable(true);
  };

  const handleEventClick = (clickInfo) => {
    setLastClickedEventId(clickInfo.event.id);
    // Use the eventId as needed, such as for updating or deleting the event
  };

  const handleEventCreation = (date, title, backgroundColor) => {
    const eventDateStrs = date.toISOString().split("T")[0];

    const existingEvent = events.find((event) => {
      const eventDateStr = event.start.toISOString().split("T")[0];
      return eventDateStr === eventDateStrs;
    });

    if (!existingEvent) {
      const newEvent = {
        id: Math.random(),
        title: title,
        start: date,
        allDay: true,
        display: "background",
        backgroundColor: backgroundColor,
      };
      setEvents([...events, newEvent]);
    } else {
      const updatedEvents = events.map((event) => {
        const eventDateStr = event.start.toISOString().split("T")[0];
        if (eventDateStr === eventDateStr) {
          return { ...event, title: title, backgroundColor: backgroundColor };
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

  const handleOk = (e: any, formValue: any) => {
    // console.log({ ...selectedDate });
    let title = "";
    let backgroundColor = "";
    if (formValue.work_status === "Come") {
      title = "มาทำงาน";
      backgroundColor = "green";
    } else if (formValue.work_status === "Notcome") {
      title = "หยุด";
      backgroundColor = "gray";
    } else {
      title = "ลา";
      backgroundColor = "red";
    }
    console.log(values.start);

    handleEventCreation(values.start, title, backgroundColor);

    setEditable(false);
    setValues({ title: "", start: "", end: "" });
    title = "";
    backgroundColor = "";
  };

  const handleClose = () => {
    setValues({ title: "", start: "", end: "" });
    setEditable(false);
  };
  console.log(events);

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
          right: "dayGridMonth,multiMonthYear",
        }}
        businessHours={{
          daysOfWeek: [1, 2, 3, 4, 5],
        }}
        editable
        selectable
        selectMirror
        height={650}
        dayMaxEvents
        events={events}
        // eventClick={handleEventClick}
        eventContent={renderEventContent}
        initialView="dayGridMonth"
        select={handleDateClick}
      />
      <EventModal
        values={values}
        open={editable}
        onClose={handleClose}
        onAddEvent={handleOk}
      />
    </div>
  );
};

function renderEventContent(eventContent: any) {
  const { timeText, event } = eventContent;

  return (
    <div className="bg-red-100">
      {timeText && (
        <>
          <div className="fc-daygrid-event-dot"></div>
          <div className="fc-event-time">{eventContent.timeText}</div>
        </>
      )}
      <div className="fc-event-title">{event.title}</div>
    </div>
  );
}

export default index;
