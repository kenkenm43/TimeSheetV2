/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import { useRef, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import interactionPlugin from "@fullcalendar/interaction";
import multiMonthPlugin from "@fullcalendar/multimonth";
import "./calendar.module.css";
import moment from "moment";

const index = ({ handleMonthChange, events, initialDate }: any): any => {
  const calendarRef = useRef<any>(null);

  const onHandleMonthChange = (payload: any) => {
    handleMonthChange(payload);
  };

  useEffect(() => {
    if (initialDate && calendarRef.current) {
      const calendarApi = calendarRef.current.getApi();
      calendarApi.gotoDate(initialDate); 
    }
  }, [initialDate]);

  return (
    <div className="">
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
        initialDate={initialDate}
        eventContent={renderEventContent}
        initialView="dayGridMonth"
        fixedWeekCount={false}
        showNonCurrentDates={false}
        eventDisplay="block" // บังคับให้ Event ทุกตัวแสดงเป็นกล่องบล็อกทึบ
      />
    </div>
  );
};

// ฟังก์ชันสำหรับ Custom การแสดงผลในแต่ละกล่อง Event ให้เหมือนในรูปภาพ
function renderEventContent(eventContent: any) {
  const { event } = eventContent;
  const { type, timeStart, timeEnd, workReason, cause, reason } = event.extendedProps;

  // 1. กรณี "มาทำงาน" (Come)
  if (type === "come") {
    return (
      <div className="text-[11.5px] leading-snug text-white p-0.5 overflow-hidden w-full cursor-pointer">
        <div className="font-semibold whitespace-nowrap">
          {moment(timeStart).format("HH:mm")} - {moment(timeEnd).format("HH:mm")}
        </div>
        {workReason && (
          <div className="truncate w-full mt-[1px]" title={workReason}>
            {workReason}
          </div>
        )}
      </div>
    );
  } 
  
  // 2. กรณี "ลา" (Leave) -> เช็คจาก title เพราะบางที type อาจจะเป็นคำว่า 'sick' 
  else if (event.title === "leave") {
    return (
      <div className="text-[11.5px] leading-snug text-white p-0.5 overflow-hidden w-full cursor-pointer">
        <div className="font-semibold truncate w-full" title={cause || "ลาโดยใช้วันหยุด"}>
          {cause || "ลาโดยใช้วันหยุด"}
        </div>
        {reason && (
          <div className="truncate w-full mt-[1px]" title={reason}>
            {reason}
          </div>
        )}
      </div>
    );
  } 
  
  // 3. กรณี "หยุด/ไม่มา" (Not come)
  else {
    return (
      <div className="text-[11.5px] leading-snug text-white p-0.5 overflow-hidden w-full font-semibold cursor-pointer">
        หยุด
      </div>
    );
  }
}

export default index;