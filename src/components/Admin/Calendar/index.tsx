/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import { useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import multiMonthPlugin from "@fullcalendar/multimonth";
import "./calendar.module.css";

const index = (events: any) => {
  const calendarRef = useRef<any>(null);
  console.log("eventsData", events);

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
        eventContent={renderEventContent}
        initialView="dayGridMonth"
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
