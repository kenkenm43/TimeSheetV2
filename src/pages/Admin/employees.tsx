/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from "react";
import useKeepEmployeeStore from "../../context/KeepEmployeeProvider";
import {
  getLeaves,
  getLeavesBypost,
  getWorkSchedules,
  getWorkSchedulesByPost,
} from "../../services/employeeServices";
import Calendar from "../../components/Admin/Calendar";
import { FaEdit } from "react-icons/fa";
import moment from "moment";
import useKeepEmployeesStore from "../../context/KeepEmployeesProvider";
import Loading from "../../components/Loading";
import ListWorking from "../../components/ListWorking";
enum WorkStatus {
  COME = "come",
  NOTCOME = "notcome",
  LEAVE = "leave",
}
const employees = () => {
  const { employees, setEmployees } = useKeepEmployeesStore();
  const { employee, setEmployee } = useKeepEmployeeStore();
  const [workSchedule, setWorkSchedule] = useState<[]>();
  const [typeButton, setTypeButton] = useState("Calendar");
  const [leave, setLeave] = useState<[]>();
  const [costSSO, setCostSSO] = useState(750);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStart, setCurrentStart] = useState("");
  const [currentEnd, setCurrentEnd] = useState("");
  const [totalDayInMonth, setTotalDayInMonth] = useState<any>();
  const [events, setEvents]: any = useState([]);
  // const [events, setEvents] = useState<any>();
  function getTotalDaysInMonth(monthString: string) {
    // Parse the month string into a Date object
    const date: any = new Date(monthString);

    // Check if the date is valid
    if (isNaN(date)) {
      return -1; // Invalid date
    }

    // Get the month and year from the Date object
    const month = date.getMonth() + 1; // Months are zero indexed, so we add 1
    const year = date.getFullYear();

    // Return the number of days in the month
    return new Date(year, month, 0).getDate();
  }
  const handleMonthChange = async (payload: any) => {
    console.log("view payload", payload);

    setCurrentStart(payload.view.currentStart);
    setCurrentEnd(payload.view.currentEnd);
    setTotalDayInMonth(getTotalDaysInMonth(payload.view.title));

    const work = await getWorkSchedulesByPost(
      {
        currentStart: moment(payload.view.currentStart).format("YYYY-MM-DD"),
        currentEnd: moment(payload.view.currentEnd).format("YYYY-MM-DD"),
      },
      employee.id
    );
    const leave = await getLeavesBypost(
      {
        currentStart: moment(payload.view.currentStart).format("YYYY-MM-DD"),
        currentEnd: moment(payload.view.currentEnd).format("YYYY-MM-DD"),
      },
      employee.id
    );

    console.log("workData", work.data, "leaveData", leave.data);

    const eventsData = await addEvents(work.data, leave.data);
    console.log("eventdata", eventsData);

    setEvents(eventsData);
  };
  useEffect(() => {
    const fetchData = async () => {
      const work = await getWorkSchedulesByPost(
        {
          currentStart: moment(currentStart).format("YYYY-MM-DD"),
          currentEnd: moment(currentEnd).format("YYYY-MM-DD"),
        },
        employee.id
      );
      const leave = await getLeavesBypost(
        {
          currentStart: moment(currentStart).format("YYYY-MM-DD"),
          currentEnd: moment(currentEnd).format("YYYY-MM-DD"),
        },
        employee.id
      );

      const eventsData = await addEvents(work.data, leave.data);
      console.log("eventdata", eventsData);

      setEvents(eventsData);
    };
    if (currentStart && currentEnd) {
      fetchData();
    }
  }, [employee.id]);

  // useEffect(() => {
  //   const fetchData = async () => {
  //     setIsLoading(true);
  //     const findEmployees = employees.find(
  //       (emp: any) => emp.id === employee.id
  //     );
  //     setEmployee(findEmployees);

  //     if (currentStart || currentEnd) {
  //       const work = await getWorkSchedulesByPost(
  //         {
  //           currentStart: moment(currentStart).format("YYYY-MM-DD"),
  //           currentEnd: moment(currentEnd).format("YYYY-MM-DD"),
  //         },
  //         employee.id
  //       );
  //       setWorkSchedule(work.data);
  //       const leave = await getLeavesBypost(
  //         {
  //           currentStart: moment(currentStart).format("YYYY-MM-DD"),
  //           currentEnd: moment(currentEnd).format("YYYY-MM-DD"),
  //         },
  //         employee.id
  //       );
  //       setLeave(leave.data);
  //       const eventsData = addEvents(work.data, leave.data);
  //       setEvents(employee.id, eventsData);
  //     }

  //     setIsLoading(false);
  //   };
  //   fetchData();
  // }, [setEmployee, employee.id, setEvents]);

  const addEvents = (workArr: any, leaveArr: any) => {
    const formatWorkEvents = workArr.map((arr: any) => {
      let background;
      if (arr.work_status === WorkStatus.COME) {
        if (arr.work_perdium && arr.work_ot) {
          background = "#e100ff";
        } else if (arr.work_perdium) {
          background = "#0044ff";
        } else if (arr.work_ot) {
          background = "#38bdf8";
        } else {
          background = "green";
        }
      } else if (arr.work_status === WorkStatus.NOTCOME) {
        background = "gray";
      }
      const formatEvent = {
        id: arr.id,
        title: arr.work_status,
        start: moment(arr.work_start).utcOffset("-07:00")._d,
        end: moment(arr.work_end).utcOffset("-07:00")._d,
        ot: arr.work_ot,
        perdiem: arr.work_perdium,
        allDay: true,
        backgroundColor: background,
        type: arr.work_status,
        timeStart: moment(arr.work_start).utcOffset("-07:00")._d,
        timeEnd: moment(arr.work_end).utcOffset("-07:00")._d,
      };

      return formatEvent;
    });
    const leaveWorkEvents = leaveArr.map((arr: any) => {
      const formatEvent = {
        ...arr,
        id: arr.id,
        title: "leave",
        start: moment(arr.leave_date).utcOffset("-07:00")._d,
        end: arr.work_end,
        reason: arr.leave_reason,
        cause: arr.leave_cause,
        type: arr.leave_type,
        allDay: true,
        timeStart: moment(arr.leave_date).utcOffset("-07:00")._d,
        backgroundColor: "red",
      };

      return formatEvent;
    });

    return [...formatWorkEvents, ...leaveWorkEvents];
  };
  console.log("event", employee.events);
  console.log(employee.events);

  const filterWorkStatus = (text: any) => {
    const filter = events.filter((event: any) => event.title === text);
    return filter.length;
  };
  const handleEditProfile = () => {};
  return (
    <>
      {employee ? (
        <div className="transition-all p-4 ml-8 min-w-[720px] relative">
          {isLoading && <Loading />}

          <div className="p-1 border rounded-lg relative">
            <div className="flex items-center rounded space-x-5 ">
              {employee?.photo ? (
                <>
                  {" "}
                  <img
                    className="object-cover md:w-48 md:h-48 h-20 w-20"
                    src={`http://localhost:8081/${employee.photo}`}
                    alt="img"
                  />
                </>
              ) : (
                <>
                  <img
                    className="object-cover md:w-48 md:h-48 h-20 w-20"
                    src={
                      "https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2247726673.jpg"
                    }
                    alt="img"
                  />
                </>
              )}
              <div className="grid grid-cols-2 lg:space-x-14 space-x-5">
                <p className="flex flex-col w-full space-y-1">
                  <span>
                    ชื่อ : {employee.firstName} {employee.lastName}
                  </span>
                  <span>เลขบัตรประชาชน : {employee.idCard || "-"}</span>
                  <span>วันเกิด : {employee?.date_of_birth || "-"}</span>
                  <span>อีเมล : {employee?.email || "-"}</span>
                </p>
                <p className="flex flex-col w-full space-y-1">
                  <span>เบอร์โทรศัพท์ : {employee?.phone_number || "-"}</span>
                  <span>
                    เงินเดือน :{" "}
                    {employee?.Employment_Details?.salary
                      .toString()
                      .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") || "-"}
                  </span>
                  <span>
                    วันเริ่มงาน :{" "}
                    {employee?.Employment_Details?.start_date || "-"}
                  </span>
                  <span>ที่อยู่ : {employee?.address || "-"}</span>
                </p>
              </div>
              <div className="absolute top-3 right-5">
                <FaEdit size={30} />
              </div>
            </div>
          </div>
          <div className="flex mt-2 space-x-1">
            {/* <button
          onClick={() => setTypeButton("General")}
          className="border p-1 min-w-16"
        >
          ข้อมูลทั่วไป
        </button> */}
            <button
              onClick={() => setTypeButton("Calendar")}
              className="border p-1 min-w-16"
            >
              ปฎิทิน
            </button>
          </div>

          {typeButton === "Calendar" && (
            <>
              <div className="flex">
                <div className="flex ml-10 space-x-5">
                  <div className="font-semibold">
                    เดือนนี้ มี {totalDayInMonth} วัน :{" "}
                  </div>
                  <div className="space-y-1">
                    <div>
                      {" "}
                      <div className="flex items-center space-x-2 ">
                        <div
                          className={`w-[30px] h-[30px] bg-[#008000] border-2 border-black`}
                        ></div>
                        <span>มา: {filterWorkStatus(WorkStatus.COME)} วัน</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 ">
                      <div
                        className={`w-[30px] h-[30px] bg-[#FF0000] border-2 border-black`}
                      ></div>
                      <span> ลา: {filterWorkStatus(WorkStatus.LEAVE)} วัน</span>
                    </div>
                    <div className="flex items-center space-x-2 ">
                      <div
                        className={`w-[30px] h-[30px] bg-[#808080] border-2 border-black`}
                      ></div>
                      <span>
                        หยุด: {filterWorkStatus(WorkStatus.NOTCOME)} วัน
                      </span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2 ">
                      <div
                        className={`w-[30px] h-[30px] bg-[#38BDF8] border-2 border-black`}
                      ></div>
                      <span>
                        OT: {events.filter((event: any) => event.ot).length} วัน
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 ">
                      <div
                        className={`w-[30px] h-[30px] bg-[#0044FF] border-2 border-black`}
                      ></div>
                      <span>
                        {" "}
                        Perdiem:{" "}
                        {
                          events.filter((event: any) => event.perdiem).length
                        }{" "}
                        วัน
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 ">
                      <div
                        className={`w-[30px] h-[30px] bg-[#E100FF] border-2 border-black`}
                      ></div>
                      <span>OT+Perdiem </span>
                    </div>
                  </div>
                  <div>
                    รวมทั้งหมด{" "}
                    {filterWorkStatus(WorkStatus.COME) +
                      filterWorkStatus(WorkStatus.LEAVE) +
                      filterWorkStatus(WorkStatus.NOTCOME)}{" "}
                    วัน
                  </div>
                </div>
                <div className="flex space-x-4 relative bottom-5 left-10">
                  <div className="pl-5 absolute top-7 right-[-27px]">+</div>
                  <div className="flex flex-col">
                    <span className="font-semibold">เงินเดือน :</span>{" "}
                    <span>
                      OT (750 X {events.filter((event: any) => event.ot).length}
                      )
                    </span>
                    <span>
                      {" "}
                      Perdiem (250 X{" "}
                      {events.filter((event: any) => event.perdiem).length})
                    </span>
                    <span className="font-semibold">
                      <u>หัก</u> ประกันสังคม :
                    </span>{" "}
                    <span className="font-semibold"> Total Paid : </span>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-medium">
                      {employee.Employment_Details?.salary
                        .toString()
                        .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") || 0}
                    </span>
                    <span>
                      {(events.filter((event: any) => event.ot).length * 750)
                        .toString()
                        .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") || 0}
                    </span>
                    <span className="border-b-2 border-black w-full text-right">
                      {(
                        events.filter((event: any) => event.perdiem).length *
                        250
                      )
                        .toString()
                        .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",") || 0}
                    </span>
                    <span className="border-b-2 border-black w-full text-right relative">
                      <div className="pl-5 absolute bottom-[1px] right-[-25px] text-2xl">
                        -
                      </div>
                      {costSSO
                        .toString()
                        .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                    </span>
                    {employee?.Employment_Details?.salary === 0}
                    <span className="font-medium border-double border-b-4 border-black w-full text-right relative">
                      {(
                        employee?.Employment_Details?.salary +
                        events.filter((event: any) => event.ot).length * 750 +
                        events.filter((event: any) => event.perdiem).length *
                          250 -
                        costSSO
                      )
                        .toString()
                        .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")}
                    </span>
                  </div>
                </div>
              </div>

              <Calendar handleMonthChange={handleMonthChange} events={events} />
            </>
          )}
        </div>
      ) : (
        <>
          <div className="transition-all p-4 ml-8 min-w-[720px] relative">
            ยังไม่ได้เลือกพนักงาน
          </div>
        </>
      )}
    </>
  );
};

export default employees;
