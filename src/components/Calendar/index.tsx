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
  const calendarRef = useRef<any>(null);
  const [values, setValues] = useState({ title: "", start: "", end: "" });
  const [events, setEvents]: any = useState([]);

  const handleDateClick = (arg: any) => {
    const currentValueDate = events.find((event: any) => {
      const eventDate = event.start.toISOString().split("T")[0];

      return eventDate === arg.date.toISOString().split("T")[0];
    });
    console.log(currentValueDate);

    if (!currentValueDate) {
      setValues({ title: "COME", start: arg.date, end: "" });
    } else {
      setValues(currentValueDate);
    }

    setEditable(true);
  };

  const handleEventCreation = (
    date: any,
    endDate: any,
    title: any,
    backgroundColor: any
  ) => {
    const eventDateCurrent = date.toISOString().split("T")[0];

    const existingEvent = events.find((event: any) => {
      const eventDateStr = event.start.toISOString().split("T")[0];
      return eventDateStr === eventDateCurrent;
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
      const updatedEvents = events.map((event: any) => {
        const eventDateStr = event.start.toISOString().split("T")[0];
        if (eventDateStr === eventDateCurrent) {
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
      title = "Come";
      backgroundColor = "green";
    } else if (formValue.work_status === "Notcome") {
      title = "Notcome";
      backgroundColor = "gray";
    } else {
      title = "Leave";
      backgroundColor = "red";
    }

    handleEventCreation(values.start, values.end, title, backgroundColor);

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
          right: "dayGridMonth,multiMonthYear,list",
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
        dateClick={handleDateClick}
        eventContent={renderEventContent}
        initialView="dayGridMonth"
        // select={handleDateClick}
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
      {/* <div className="fc-event-title">{event.title}</div> */}
    </div>
  );
}

export default index;
