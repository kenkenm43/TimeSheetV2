/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import multiMonthPlugin from "@fullcalendar/multimonth";
import "./calendar.module.css";
import moment from "moment";
import EventModal from "../Modal";
const index = () => {
  const [editable, setEditable] = useState(false);
  const [selectedDate, setSelectedDate] = useState({});
  const [events, setEvents]: any = useState([]);
  const handleDateSelect = (selectInfo: any) => {
    console.log(selectInfo);

    setSelectedDate({
      ...selectedDate,
      ...selectInfo,
      start: selectInfo.startStr,
      end: selectInfo.endStr,
      // end: endStr,
    });

    setEditable(true);
  };

  const handleOk = (e: any, formValue: any) => {
    console.log({ ...selectedDate });
    console.log(formValue);

    setEvents([
      ...events,
      {
        ...selectedDate,
        title: formValue.name,
      },
    ]);

    setEditable(false);
  };
  const handleEventClick = (clickInfo: any) => {
    // console.log("click", clickInfo);
    // setEditable(true);
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
        businessHours={{
          daysOfWeek: [1, 2, 3, 4, 5],
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
        events={events}
      />
      <EventModal
        selectedDate={selectedDate}
        open={editable}
        onClose={() => setEditable(false)}
        onAddEvent={handleOk}
      />
    </div>
  );
};
const d = moment(new Date()).format("DD/MM/YYYY");
console.log(d);

function renderEventContent(eventContent: any) {
  const { timeText, event } = eventContent;

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
