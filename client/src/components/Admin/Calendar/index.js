import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
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
const index = ({ handleMonthChange, events }) => {
    const calendarRef = useRef(null);
    const onHandleMonthChange = (payload) => {
        console.log(payload.view.currentStart);
        console.log(payload.view.currentEnd);
        handleMonthChange(payload);
        // setMonthDate(payload.view.title);
    };
    return (_jsxs("div", { className: "", children: [" ", _jsx(FullCalendar, { ref: calendarRef, plugins: [
                    dayGridPlugin,
                    timeGridPlugin,
                    interactionPlugin,
                    multiMonthPlugin,
                ], headerToolbar: {
                    left: "prev,next today",
                    center: "title",
                    right: "",
                }, businessHours: {
                    daysOfWeek: [1, 2, 3, 4, 5],
                }, views: {
                    dayGridMonth: {
                        titleFormat: { year: "numeric", month: "long" },
                    },
                }, datesSet: onHandleMonthChange, editable: false, height: 650, events: events, eventContent: renderEventContent, initialView: "dayGridMonth", fixedWeekCount: false, showNonCurrentDates: false })] }));
};
function renderEventContent(eventContent) {
    console.log(eventContent.event.extendedProps);
    return (_jsx("div", { className: "cursor-pointer", children: eventContent.event.extendedProps &&
            eventContent.event.extendedProps.type === "come" ? (_jsxs("div", { className: "fc-event-main cursor-pointer text-sm", children: [_jsx("div", { children: "\u0E40\u0E27\u0E25\u0E32\u0E40\u0E23\u0E34\u0E48\u0E21\u0E07\u0E32\u0E19" }), moment(eventContent.event.extendedProps.timeStart).format("HH:mm"), _jsx("div", { children: "\u0E40\u0E27\u0E25\u0E32\u0E40\u0E25\u0E34\u0E01\u0E07\u0E32\u0E19" }), moment(eventContent.event.extendedProps.timeEnd).format("HH:mm")] })) : eventContent.event.extendedProps.type === "leave" ? (_jsxs(_Fragment, { children: [_jsx("div", { children: _jsx("span", { children: eventContent.event.extendedProps.cause || "ลาโดยใช้วันหยุด" }) }), _jsxs("div", { children: ["\u0E40\u0E2B\u0E15\u0E38\u0E1C\u0E25:", _jsx("span", { children: eventContent.event.extendedProps.reason || " - " })] })] })) : (_jsx("div", { children: "\u0E2B\u0E22\u0E38\u0E14" })) }));
}
export default index;
