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
  const [values, setValues] = useState({ title: "", start: "", end: "" });
  const [events, setEvents]: any = useState([]);
  const handleSelect = (selectInfo: any) => {
    setEditable(true);
    setValues({
      ...values,
      start: selectInfo.startStr,
      end: selectInfo.endStr,
      // end: endStr,
    });
    console.log(values);
  };

  const handleOk = (e: any, formValue: any) => {
    // console.log({ ...selectedDate });
    // console.log(formValue);
    console.log(e.target.value);

    setEvents([
      ...events,
      {
        ...selectedDate,
        ...formValue,
        title: formValue.name,
      },
    ]);

    setEditable(false);
  };

  const handleClose = () => {
    setEditable(false);
  };
  return (
    <div className="w-ful">
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
        eventBackgroundColor="red"
        select={handleSelect}
        eventContent={renderEventContent}
        initialView="dayGridMonth"
        events={events}
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
const d = moment(new Date()).format("DD/MM/YYYY");
console.log(d);

function renderEventContent(eventContent: any) {
  const { timeText, event } = eventContent;
  console.log(event);
  console.log(timeText);

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
