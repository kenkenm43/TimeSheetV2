/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import { useRef } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import multiMonthPlugin from "@fullcalendar/multimonth";
import "./calendar.module.css";
import moment from "moment";

const index = ({ handleMonthChange, events }: any): any => {
  const calendarRef = useRef<any>(null);
  const onHandleMonthChange = (payload: any) => {
    console.log(payload.view.currentStart);
    console.log(payload.view.currentEnd);
    handleMonthChange(payload);
    // setMonthDate(payload.view.title);
  };
  return (
    <div className="">
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
        datesSet={onHandleMonthChange}
        editable={false}
        height={650}
        events={events}
        eventContent={renderEventContent}
        initialView="dayGridMonth"
        fixedWeekCount={false}
        showNonCurrentDates={false}
      />
    </div>
  );
};

function renderEventContent(eventContent: any) {
  console.log(eventContent.event.extendedProps);
  return (
    <div className="cursor-pointer">
      {/* <a className="fc-daygrid-event fc-daygrid-block-event fc-h-event fc-event fc-event-draggable fc-event-resizable fc-event-start fc-event-end fc-event-past ticket ticket"> */}
      {eventContent.event.extendedProps &&
      eventContent.event.extendedProps.type === "come" ? (
        <div className="fc-event-main cursor-pointer text-sm">
          <div>เวลาเริ่มงาน</div>
          {moment(eventContent.event.extendedProps.timeStart).format("HH:mm")}
          <div>เวลาเลิกงาน</div>
          {moment(eventContent.event.extendedProps.timeEnd).format("HH:mm")}
        </div>
      ) : eventContent.event.extendedProps.type === "leave" ? (
        <>
          <div>
            <span>
              {eventContent.event.extendedProps.cause || "ลาโดยใช้วันหยุด"}
            </span>
          </div>
          <div>
            เหตุผล:
            <span>{eventContent.event.extendedProps.reason || " - "}</span>
          </div>
        </>
      ) : (
        <div>หยุด</div>
      )}
      {/* <div className="fc-event-resizer fc-event-resizer-end"></div> */}
      {/* </a> */}
      {/* <div className="fc-event-title">{event.title}</div> */}
    </div>
  );
}

export default index;
