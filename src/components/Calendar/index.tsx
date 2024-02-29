/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import multiMonthPlugin from "@fullcalendar/multimonth";
import "./calendar.module.css";
import EventModal from "../Modal";
const index = () => {
  const [editable, setEditable] = useState(false);
  const handleDateSelect = (selectInfo: any) => {
    console.log("select", selectInfo);
    setEditable(true);
  };

  const handleEventClick = (clickInfo: any) => {
    console.log(clickInfo);
    setEditable(true);
  };
  return (
    <div className="w-full">
      {" "}
      <FullCalendar
        plugins={[
          dayGridPlugin,
          timeGridPlugin,
          interactionPlugin,
          multiMonthPlugin,
        ]}
        headerToolbar={{
          left: "prev,next today",
          center: "title",
          right: "dayGridMonth,timeGridWeek,multiMonthYear",
        }}
        editable
        selectable
        selectMirror
        height={650}
        dayMaxEvents
        eventBackgroundColor="red"
        eventClick={handleEventClick}
        select={handleDateSelect}
        eventContent={renderEventContent}
        initialView="dayGridMonth"
        events={[{ title: "event 1", date: "2024-02-02" }]}
      />
      <EventModal
        open={editable}
        onClose={() => setEditable(false)}
        onAddEvent={() => {
          setEditable(false);
        }}
      />
    </div>
  );
};

function renderEventContent(eventContent: any) {
  const { timeText, event } = eventContent;
  console.log(eventContent);

  return (
    <>
      {timeText && (
        <>
          <div className="fc-daygrid-event-dot"></div>
          <div className="fc-event-time">{eventContent.timeText}</div>
        </>
      )}
      <div className="fc-event-title">{event.title}</div>
    </>
  );
}

export default index;
