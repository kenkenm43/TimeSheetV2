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
enum WorkStatus {
  COME = "come",
  NOTCOME = "notcome",
  LEAVE = "leave",
}
const employees = () => {
  const { employees, setEmployees, setEvents } = useKeepEmployeesStore();
  const { employee, setEmployee } = useKeepEmployeeStore();
  const [workSchedule, setWorkSchedule] = useState<[]>();
  const [typeButton, setTypeButton] = useState("Calendar");
  const [leave, setLeave] = useState<[]>();
  const [costSSO, setCostSSO] = useState(750);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStart, setCurrentStart] = useState("");
  const [currentEnd, setCurrentEnd] = useState("");
  // const [events, setEvents] = useState<any>();

  const handleMonthChange = async (payload: any) => {
    setCurrentStart(payload.view.currentStart);
    setCurrentEnd(payload.view.currentEnd);

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

    const event = addEvents(work.data, leave.data);

    const eventsData = addEvents(work.data, leave.data);
    setEvents(employee.id, eventsData);
  };
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const findEmployees = employees.find(
        (emp: any) => emp.id === employee.id
      );
      setEmployee(findEmployees);

      if (currentStart || currentEnd) {
        const work = await getWorkSchedulesByPost(
          {
            currentStart: moment(currentStart).format("YYYY-MM-DD"),
            currentEnd: moment(currentEnd).format("YYYY-MM-DD"),
          },
          employee.id
        );
        setWorkSchedule(work.data);
        const leave = await getLeavesBypost(
          {
            currentStart: moment(currentStart).format("YYYY-MM-DD"),
            currentEnd: moment(currentEnd).format("YYYY-MM-DD"),
          },
          employee.id
        );
        setLeave(leave.data);
        const eventsData = addEvents(work.data, leave.data);
        setEvents(employee.id, eventsData);
      }

      setIsLoading(false);
    };
    fetchData();
  }, [setEmployee, employee.id, setEvents]);

  const addEvents = (workArr: any, leaveArr: any) => {
    const formatWorkEvents = workArr.map((arr: any) => {
      let background;
      if (arr.work_status === WorkStatus.COME) {
        background = "green";
      } else if (arr.work_status === WorkStatus.NOTCOME) {
        background = "gray";
      }
      const formatEvent = {
        id: arr.id,
        title: arr.work_status,
        start: moment(arr.work_start)!.utcOffset("-07:00")._d,
        end: moment(arr.work_end)!.utcOffset("-07:00")._d,
        allDay: true,
        display: "background",
        backgroundColor: background,
      };

      return formatEvent;
    });
    const leaveWorkEvents = leaveArr.map((arr: any) => {
      const formatEvent = {
        ...arr,
        id: arr.id,
        title: "leave",
        start: arr.leave_date,
        end: arr.work_end,
        reason: arr.leave_reason,
        cause: arr.leave_cause,
        type: arr.leave_type,
        allDay: true,
        display: "background",
        backgroundColor: "red",
      };

      return formatEvent;
    });

    return [...formatWorkEvents, ...leaveWorkEvents];
  };

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
                    className="lg:w-48 lg:h-48 h-36 w-36"
                    src={`${employee.photo}`}
                    alt="img"
                  />
                </>
              ) : (
                <>
                  <img
                    className="md:w-48 md:h-48 h-20 w-20"
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
                    เงินเดือน : {employee?.Employment_Details?.salary || "-"}
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
            <Calendar
              handleMonthChange={handleMonthChange}
              events={employee.events}
            />
          )}
          <div>
            <div>Based salary : {employee.Employment_Details?.salary}</div>
            <div>ประกันสังคม : {costSSO}</div>
            <div>Add : Expenses claim : -</div>
            <div>
              Total Paid:{" "}
              {employee?.Employment_Details?.salary - costSSO || "-"}
            </div>
          </div>
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
