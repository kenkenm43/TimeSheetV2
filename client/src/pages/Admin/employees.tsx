/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/rules-of-hooks */
import { useEffect, useState } from "react";
import useKeepEmployeeStore from "../../context/KeepEmployeeProvider";
import {
  getEmployee,
  getLeaves,
  getLeavesBypost,
  getWorkSchedules,
  getWorkSchedulesByPost,
  updateEmployeeStartWork,
} from "../../services/employeeServices";
import Calendar from "../../components/Admin/Calendar";
import { FaEdit, FaRegSave } from "react-icons/fa";
import moment from "moment";
import useKeepEmployeesStore from "../../context/KeepEmployeesProvider";
import Loading from "../../components/Loading";
import ListWorking from "../../components/ListWorking";
import Note from "../../components/Admin/์Note";
import { DatePicker, Input } from "rsuite";
import Swal from "sweetalert2";
enum WorkStatus {
  COME = "come",
  NOTCOME = "notcome",
  LEAVE = "leave",
}
const employees = () => {
  const { keepEmployee, setKeepEmployee } = useKeepEmployeeStore();
  const [workSchedule, setWorkSchedule] = useState<[]>();
  const [typeButton, setTypeButton] = useState("Calendar");
  const [leave, setLeave] = useState<[]>();
  const [costSSO, setCostSSO] = useState(750);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingEvent, setIsLoadingEvent] = useState(false);
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
    setCurrentStart(payload.view.currentStart);
    setCurrentEnd(payload.view.currentEnd);
    setTotalDayInMonth(getTotalDaysInMonth(payload.view.title));

    const work = await getWorkSchedulesByPost(
      {
        currentStart: moment(payload.view.currentStart).format("YYYY-MM-DD"),
        currentEnd: moment(payload.view.currentEnd).format("YYYY-MM-DD"),
      },
      keepEmployee.id
    );
    const leave = await getLeavesBypost(
      {
        currentStart: moment(payload.view.currentStart).format("YYYY-MM-DD"),
        currentEnd: moment(payload.view.currentEnd).format("YYYY-MM-DD"),
      },
      keepEmployee.id
    );

    const eventsData = await addEvents(work.data, leave.data);

    setEvents(eventsData);
  };
  useEffect(() => {
    const fetchData = async () => {
      const work = await getWorkSchedulesByPost(
        {
          currentStart: moment(currentStart).format("YYYY-MM-DD"),
          currentEnd: moment(currentEnd).format("YYYY-MM-DD"),
        },
        keepEmployee.id
      );
      const leave = await getLeavesBypost(
        {
          currentStart: moment(currentStart).format("YYYY-MM-DD"),
          currentEnd: moment(currentEnd).format("YYYY-MM-DD"),
        },
        keepEmployee.id
      );

      const eventsData = await addEvents(work.data, leave.data);
      console.log("eventdata", eventsData);

      setEvents(eventsData);
    };
    if (currentStart && currentEnd) {
      fetchData();
    }
  }, [keepEmployee.id, currentStart, currentEnd]);

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

  const filterWorkStatus = (text: any) => {
    const filter = events.filter((event: any) => event.title === text);
    return filter.length;
  };

  const [isEditProfile, setIsEditProfile] = useState(false);
  const handleEditProfile = () => {
    setIsEditProfile(true);
  };
  function formatPhoneNumber(phoneNumberString: any) {
    // Add dashes to the phone number
    const formatted = phoneNumberString?.replace(
      /(\d{3})(\d{3})(\d{4})/,
      "$1-$2-$3"
    );

    return formatted;
  }

  const [startDate, setStartDate] = useState<any>(
    keepEmployee?.Employment_Details?.start_date
      ? new Date(keepEmployee?.Employment_Details?.start_date)
      : new Date()
  );
  const [dateStart, setDateStart] = useState<any>(
    keepEmployee?.Employment_Details?.start_date
      ? new Date(keepEmployee?.Employment_Details?.start_date)
      : new Date()
  );
  const [salaryMock, setSalaryMock] = useState<any>();
  useEffect(() => {
    setStartDate(
      keepEmployee?.Employment_Details?.start_date
        ? new Date(keepEmployee?.Employment_Details?.start_date)
        : new Date()
    );
    setDateStart(
      keepEmployee?.Employment_Details?.start_date
        ? new Date(keepEmployee?.Employment_Details?.start_date)
        : new Date()
    );
    setSalaryMock(
      keepEmployee?.Employment_Details?.salary
        ? keepEmployee?.Employment_Details?.salary
        : 0
    );
    setIsEditProfile(false);
  }, [keepEmployee]);

  const updateInfo = async () => {
    setIsLoading(true);
    try {
      if (
        moment(startDate).format("yyyy-MM-DD") !==
          moment(dateStart).format("yyyy-MM-DD") ||
        keepEmployee?.Employment_Details?.salary !== salaryMock
      ) {
        const employeeDetail = await getEmployee(keepEmployee.id);
        const updateStartDate = await updateEmployeeStartWork(
          { start_date: dateStart, salary: salaryMock },
          keepEmployee.id
        );
        setStartDate(
          new Date(updateStartDate?.data.Employment_Details.start_date)
        );
        setDateStart(
          new Date(updateStartDate?.data.Employment_Details.start_date)
        );
        setSalaryMock(updateStartDate?.data.Employment_Details?.salary);
        const result = await Swal.fire({
          title: "เปลี่ยนแปลงข้อมูลเรียบร้อย",
          icon: "success",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "ตกลง",
        });
        setIsEditProfile(false);
      } else {
        console.log("same");
        const result = await Swal.fire({
          title: "เปลี่ยนแปลงข้อมูลเรียบร้อย",
          icon: "success",
          confirmButtonColor: "#3085d6",
          confirmButtonText: "ตกลง",
        });
        setStartDate(new Date(keepEmployee?.Employment_Details?.start_date));
        setDateStart(new Date(keepEmployee?.Employment_Details?.start_date));
        setSalaryMock(keepEmployee?.Employment_Details?.salary);
        setIsEditProfile(false);
      }
    } catch (error) {
      const result = await Swal.fire({
        title: `ผิดพลาด`,
        text: `${error}`,
        icon: "error",
        confirmButtonColor: "#3085d6",
        confirmButtonText: "ตกลง",
      });
      console.log(error);

      setIsEditProfile(false);
    } finally {
      setIsLoading(false);
    }
  };
  const handleChangeDate = (e: any) => {
    setDateStart(e);
  };
  return (
    <>
      {keepEmployee ? (
        <div className="transition-all p-4 ml-8 min-w-[720px] relative">
          {isLoading && <Loading />}

          <div className="p-1 border rounded-lg relative">
            <div className="flex items-center rounded space-x-5 ">
              {keepEmployee?.photo ? (
                <>
                  <img
                    className="object-cover md:w-48 md:h-48 h-20 w-20"
                    src={keepEmployee.photo}
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
              <div className="grid grid-cols-3 lg:space-x-14 space-x-5">
                <p className="flex flex-col w-full space-y-1 ">
                  <div className="flex font-semibold">
                    <div className="first-letter:uppercase">
                      {keepEmployee.firstName}
                    </div>{" "}
                    <div className="ml-5 first-letter:uppercase">
                      {keepEmployee.lastName}
                    </div>
                  </div>
                  <span>
                    <span className="font-semibold"> เลขบัตรประชาชน : </span>
                    {keepEmployee.idCard || "-"}
                  </span>
                  <span>
                    <span className="font-semibold"> วันเกิด : </span>

                    {keepEmployee.date_of_birth
                      ? moment(keepEmployee.date_of_birth).format("yyyy-MM-DD")
                      : "-"}
                  </span>
                  <span>
                    <span className="font-semibold"> อีเมล : </span>
                    {keepEmployee?.email || "-"}
                  </span>
                </p>
                <p className="flex flex-col w-full space-y-1">
                  <span>
                    <span className="font-semibold"> เบอร์โทรศัพท์ : </span>

                    {formatPhoneNumber(keepEmployee?.phone_number) || "-"}
                  </span>
                  <span>
                    <span className="font-semibold"> เงินเดือน : </span>
                    {!isEditProfile ? (
                      salaryMock ? (
                        salaryMock
                          .toString()
                          .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
                      ) : (
                        "-"
                      )
                    ) : (
                      <Input
                        name="salary"
                        value={salaryMock}
                        type="number"
                        onChange={(e: any) => setSalaryMock(e)}
                      />
                    )}
                  </span>
                  <span>
                    <span className="font-semibold"> วันเริ่มงาน : </span>
                    {!isEditProfile ? (
                      <>{moment(startDate).format("yyyy-MM-DD") || "-"}</>
                    ) : (
                      <DatePicker
                        name="dateStart"
                        value={dateStart}
                        onSelect={handleChangeDate}
                        onChange={handleChangeDate}
                      />
                    )}
                  </span>
                  <span>
                    <span className="font-semibold"> ที่อยู่ : </span>
                    {keepEmployee?.address || "-"}
                  </span>
                </p>
                <p className="flex flex-col w-full space-y-1">
                  <span>
                    <span className="font-semibold"> ธนาคาร : </span>

                    {keepEmployee?.Financial_Details?.bank_name || "-"}
                  </span>
                  <span>
                    <span className="font-semibold"> บัญชี : </span>
                    {keepEmployee?.Financial_Details?.bank_account_number ||
                      "-"}
                  </span>
                  {/* <span>
                    <span className="font-semibold"> เลขประกันสังคม : </span>
                    {keepEmployee?.Financial_Details?.social_security_number ||
                      "-"}
                  </span> */}
                </p>
              </div>
              {!isEditProfile ? (
                <div
                  className="absolute top-0 right-0 cursor-pointer"
                  onClick={() => handleEditProfile()}
                >
                  <FaEdit size={30} />
                </div>
              ) : (
                <div
                  className="absolute top-0 right-0 cursor-pointer"
                  onClick={() => updateInfo()}
                >
                  <FaRegSave size={30} />
                </div>
              )}
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
              className={`bg-gray-300 border border-gray-400 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded text-sm ${
                typeButton === "Calendar" ? "bg-gray-400 cursor-default" : ""
              }`}
            >
              ปฎิทิน
            </button>
            <button
              onClick={() => setTypeButton("Note")}
              className={`bg-gray-300 border border-gray-400 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded text-sm ${
                typeButton === "Note" ? "bg-gray-400 cursor-default" : ""
              }`}
            >
              โน๊ต
            </button>
          </div>

          {typeButton === "Calendar" && (
            <>
              <div className="flex">
                <div className="flex pt-5 ml-10 space-x-5">
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

                    <div className="flex items-cenเิter space-x-2 ">
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
                  <div className="pl-5 absolute right-[-27px]">+</div>
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
                  <div className="flex flex-col items-end min-w-8">
                    <span className="font-medium">
                      {keepEmployee.Employment_Details?.salary
                        ? keepEmployee.Employment_Details?.salary
                            .toString()
                            .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
                        : "-"}
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
                      {keepEmployee.Employment_Details?.salary
                        ? (keepEmployee.Employment_Details?.salary * 0.05 <= 750
                            ? 750
                            : keepEmployee.Employment_Details?.salary * 0.05
                          )
                            .toString()
                            .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
                        : "-"}
                    </span>
                    <span className="font-medium border-double border-b-4 border-black w-full text-right relative">
                      {keepEmployee.Employment_Details?.salary
                        ? (
                            keepEmployee?.Employment_Details?.salary +
                            events.filter((event: any) => event.ot).length *
                              750 +
                            events.filter((event: any) => event.perdiem)
                              .length *
                              250 -
                            (keepEmployee.Employment_Details?.salary * 0.05 <=
                            750
                              ? 750
                              : keepEmployee.Employment_Details?.salary * 0.05)
                          )
                            .toString()
                            .replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",")
                        : "-"}
                    </span>
                  </div>
                </div>
              </div>
              <Calendar handleMonthChange={handleMonthChange} events={events} />
            </>
          )}
          {typeButton === "Note" && <Note />}
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
