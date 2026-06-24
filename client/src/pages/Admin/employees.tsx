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
import { FaEdit, FaRegSave, FaChevronLeft, FaChevronRight, FaRegClock } from "react-icons/fa";
import moment from "moment";
import Loading from "../../components/Loading";
import Note from "../../components/Admin/์Note";
import { DatePicker, Input } from "rsuite";
import Swal from "sweetalert2";
import { ROLESEMPLOOYEE } from "../../Enum/RoleEmployee";
import { calOT, calSSO } from "../../helpers/cal";
import useKeepEmployeesStore from "../../context/KeepEmployeesProvider";

enum WorkStatus {
  COME = "come",
  NOTCOME = "notcome",
  LEAVE = "leave",
}

const formatCurrency = (amount: any) => {
  if (!amount && amount !== 0) return "0";
  return amount.toString().replace(/\B(?<!\.\d*)(?=(\d{3})+(?!\d))/g, ",");
};

const Employees = () => {
  const { keepEmployee, setKeepEmployee } = useKeepEmployeeStore();
  const { setEmployee } = useKeepEmployeesStore();
  const [workSchedule, setWorkSchedule] = useState<[]>();
  const [typeButton, setTypeButton] = useState("Calendar");
  const [leave, setLeave] = useState<[]>();
  const [costSSO, setCostSSO] = useState(875);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingEvent, setIsLoadingEvent] = useState(false);
  const [currentStart, setCurrentStart] = useState("");
  const [currentEnd, setCurrentEnd] = useState("");
  const [totalDayInMonth, setTotalDayInMonth] = useState<any>();
  const [defaultSalary, setDefaultSalary] = useState(0);
  const [events, setEvents] = useState<any>([]);

  // ---- State สำหรับประวัติการลา (รอบ ก.ค. - มิ.ย.) ----
  const currentMonth = moment().month();
  const initialYear = currentMonth >= 6 ? moment().year() : moment().year() - 1;
  const [leavePeriodYear, setLeavePeriodYear] = useState<number>(initialYear);
  const [yearlyLeaves, setYearlyLeaves] = useState<any[]>([]);
  const [isLoadingYearlyLeaves, setIsLoadingYearlyLeaves] = useState(false);

  // ---- เพิ่ม State ควบคุมวันเริ่มต้นของปฏิทินเมื่อกดเลือกวันลา ----
  const [calendarKeyDate, setCalendarKeyDate] = useState<string | undefined>(undefined);

  function getTotalDaysInMonth(monthString: string) {
    const date: any = new Date(monthString);
    if (isNaN(date)) return -1;
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    return new Date(year, month, 0).getDate();
  }

  // ---- Fetch ข้อมูลสำหรับ Calendar หลัก ----
  const handleMonthChange = async (payload: any) => {
    setIsLoading(true);
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
    const leaveData = await getLeavesBypost(
      {
        currentStart: moment(payload.view.currentStart).format("YYYY-MM-DD"),
        currentEnd: moment(payload.view.currentEnd).format("YYYY-MM-DD"),
      },
      keepEmployee.id
    );

    const eventsData = await addEvents(work.data, leaveData.data);
    setEvents(eventsData);
    setIsLoading(false);
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      const work = await getWorkSchedulesByPost(
        {
          currentStart: moment(currentStart).format("YYYY-MM-DD"),
          currentEnd: moment(currentEnd).format("YYYY-MM-DD"),
        },
        keepEmployee.id
      );
      const leaveData = await getLeavesBypost(
        {
          currentStart: moment(currentStart).format("YYYY-MM-DD"),
          currentEnd: moment(currentEnd).format("YYYY-MM-DD"),
        },
        keepEmployee.id
      );

      const eventsData = await addEvents(work.data, leaveData.data);
      setEvents(eventsData);
      setIsLoading(false);
    };
    if (currentStart && currentEnd && keepEmployee.id) {
      fetchData();
    }
  }, [keepEmployee.id, currentStart, currentEnd]);

  // ---- Fetch ข้อมูลสำหรับ ประวัติการลา (รายปี) ----
  useEffect(() => {
    const fetchYearlyLeaves = async () => {
      if (!keepEmployee.id) return;
      setIsLoadingYearlyLeaves(true);
      
      const start = moment().year(leavePeriodYear).month(6).startOf("month").format("YYYY-MM-DD");
      const end = moment().year(leavePeriodYear + 1).month(5).endOf("month").format("YYYY-MM-DD");

      try {
        const res = await getLeavesBypost({ currentStart: start, currentEnd: end }, keepEmployee.id);
        const sortedData = (res.data || []).sort((a: any, b: any) => moment(b.leave_date).valueOf() - moment(a.leave_date).valueOf());
        setYearlyLeaves(sortedData);
      } catch (error) {
        console.error("Error fetching yearly leaves:", error);
      } finally {
        setIsLoadingYearlyLeaves(false);
      }
    };
    fetchYearlyLeaves();
  }, [leavePeriodYear, keepEmployee.id]);

  const addEvents = (workArr: any, leaveArr: any) => {
    const formatWorkEvents = workArr.map((arr: any) => {
      let background;
      if (arr.work_status === WorkStatus.COME) {
        if (arr.work_perdium && arr.work_ot) background = "#e100ff";
        else if (arr.work_perdium) background = "#0044ff";
        else if (arr.work_ot) background = "#38bdf8";
        else background = "green";
      } else if (arr.work_status === WorkStatus.NOTCOME) {
        background = "gray";
      }
      return {
        id: arr.id,
        title: arr.work_status,
        start: moment(arr.work_start).utcOffset("-07:00")._d,
        end: moment(arr.work_end).utcOffset("-07:00")._d,
        ot: arr.work_ot,
        perdiem: arr.work_perdium,
        allDay: true,
        backgroundColor: background,
        type: arr.work_status,
        workReason: arr.work_reason,
        timeStart: moment(arr.work_start).utcOffset("-07:00")._d,
        timeEnd: moment(arr.work_end).utcOffset("-07:00")._d,
      };
    });
    const leaveWorkEvents = leaveArr.map((arr: any) => ({
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
    }));
    return [...formatWorkEvents, ...leaveWorkEvents];
  };

  const filterWorkStatus = (text: any) => {
    return events.filter((event: any) => event.title === text).length;
  };

  const [isEditProfile, setIsEditProfile] = useState(false);
  const handleEditProfile = () => setIsEditProfile(true);

  function formatPhoneNumber(phoneNumberString: any) {
    return phoneNumberString?.replace(/(\d{3})(\d{3})(\d{4})/, "$1-$2-$3");
  }

  const [startDate, setStartDate] = useState<any>(
    keepEmployee?.Employment_Details?.start_date ? new Date(keepEmployee?.Employment_Details?.start_date) : new Date()
  );
  const [dateStart, setDateStart] = useState<any>(
    keepEmployee?.Employment_Details?.start_date ? new Date(keepEmployee?.Employment_Details?.start_date) : new Date()
  );
  const [endDate, setEndDate] = useState<any>(
    keepEmployee?.Employment_Details?.end_date ? new Date(keepEmployee?.Employment_Details?.end_date) : null
  );
  const [dateEnd, setDateEnd] = useState<any>(
    keepEmployee?.Employment_Details?.end_date ? new Date(keepEmployee?.Employment_Details?.end_date) : null
  );
  const [salaryMock, setSalaryMock] = useState<any>();

  useEffect(() => {
    setStartDate(keepEmployee?.Employment_Details?.start_date ? new Date(keepEmployee?.Employment_Details?.start_date) : new Date());
    setEndDate(keepEmployee?.Employment_Details?.end_date ? new Date(keepEmployee?.Employment_Details?.end_date) : null);
    setDateEnd(keepEmployee?.Employment_Details?.end_date ? new Date(keepEmployee?.Employment_Details?.end_date) : null);
    setDateStart(keepEmployee?.Employment_Details?.start_date ? new Date(keepEmployee?.Employment_Details?.start_date) : new Date());
    setDefaultSalary(keepEmployee?.Employment_Details?.salary || 0);
    setSalaryMock(keepEmployee?.Employment_Details?.salary || 0);
    setIsEditProfile(false);
    setCalendarKeyDate(undefined); // Reset วันที่เลือกเมื่อเปลี่ยนคน
  }, [keepEmployee]);

  const updateInfo = async () => {
    try {
      setIsLoading(true);
      if (
        moment(startDate).format("yyyy-MM-DD") !== moment(dateStart).format("yyyy-MM-DD") ||
        keepEmployee?.Employment_Details?.salary !== salaryMock ||
        moment(endDate).format("yyyy-MM-DD") !== moment(dateEnd).format("yyyy-MM-DD")
      ) {
        const updateStartDate = await updateEmployeeStartWork(
          { start_date: dateStart, end_date: endDate, salary: salaryMock },
          keepEmployee.id
        );
        setDefaultSalary(updateStartDate?.data.Employment_Details?.salary);
        setStartDate(new Date(updateStartDate?.data.Employment_Details.start_date));
        setDateStart(new Date(updateStartDate?.data.Employment_Details.start_date));
        setEndDate(new Date(updateStartDate?.data.Employment_Details.end_date));
        setDateEnd(new Date(updateStartDate?.data.Employment_Details.end_date));
        setSalaryMock(updateStartDate?.data.Employment_Details?.salary);
        
        await Swal.fire({ title: "เปลี่ยนแปลงข้อมูลเรียบร้อย", icon: "success", confirmButtonColor: "#3085d6", confirmButtonText: "ตกลง" });
        setEmployee(keepEmployee.id, { salary: updateStartDate?.data.Employment_Details?.salary });
      } else {
        await Swal.fire({ title: "เปลี่ยนแปลงข้อมูลเรียบร้อย", icon: "success", confirmButtonColor: "#3085d6", confirmButtonText: "ตกลง" });
        setStartDate(new Date(keepEmployee?.Employment_Details?.start_date));
        setDateStart(new Date(keepEmployee?.Employment_Details?.start_date));
        setEndDate(new Date(keepEmployee?.Employment_Details?.end_date));
        setDateEnd(new Date(keepEmployee?.Employment_Details?.end_date));
        setSalaryMock(keepEmployee?.Employment_Details?.salary);
      }
      setIsEditProfile(false);
      setIsLoading(false);
    } catch (error) {
      await Swal.fire({ title: `ผิดพลาด`, text: `${error}`, icon: "error", confirmButtonColor: "#3085d6", confirmButtonText: "ตกลง" });
      setIsLoading(false);
      setIsEditProfile(false);
    }
  };

  const handleChangeDate = (e: any) => setDateStart(e);
  const handleChangeEndDate = (e: any) => setEndDate(e);

  // ฟังก์ชันรองรับการคลิกที่รายการวันลาเพื่อเปลี่ยนเดือนปฏิทิน
  const handleLeaveItemClick = (leaveDate: string) => {
    setCalendarKeyDate(moment(leaveDate).format("YYYY-MM-DD"));
  };

  const yearlySickLeaves = yearlyLeaves.filter((l: any) => l.leave_cause?.includes=== "ลาป่วย" || l.leave_cause === "ลาป่วย");
  const yearlyHolidayLeaves = yearlyLeaves.filter((l: any) => l.leave_cause?.toLowerCase() == "ลาโดยใช้วันหยุด" && l.leave_cause == "ลาโดยใช้วันหยุด");

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 space-y-6">
      {isLoading && <Loading />}
      
      {keepEmployee.id !== "" ? (
        <>
          {/* Profile Card Section */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 relative">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              <div className="flex-shrink-0">
                <img
                  className="w-32 h-32 md:w-40 md:h-40 rounded-xl object-cover border border-gray-200 shadow-sm"
                  src={keepEmployee?.photo || "https://www.shutterstock.com/image-vector/user-profile-icon-vector-avatar-600nw-2247726673.jpg"}
                  alt="profile"
                />
              </div>

              <div className="flex-1 w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-6 text-gray-700">
                <div className="space-y-3">
                  <div className="text-xl font-bold text-gray-900 capitalize flex gap-2">
                    <span>{keepEmployee.firstName}</span>
                    <span>{keepEmployee.lastName}</span>
                  </div>
                  <div><span className="font-semibold text-gray-900">เลขบัตรประชาชน :</span> {keepEmployee.idCard || "-"}</div>
                  <div><span className="font-semibold text-gray-900">วันเกิด :</span> {keepEmployee.date_of_birth ? moment(keepEmployee.date_of_birth).format("yyyy-MM-DD") : "-"}</div>
                  <div className="truncate" title={keepEmployee?.email}><span className="font-semibold text-gray-900">อีเมล :</span> {keepEmployee?.email || "-"}</div>
                </div>

                <div className="space-y-3">
                  <div><span className="font-semibold text-gray-900">เบอร์โทรศัพท์ :</span> {formatPhoneNumber(keepEmployee?.phone_number) || "-"}</div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">เงินเดือน :</span>
                    {!isEditProfile ? (
                      salaryMock ? formatCurrency(salaryMock) : "-"
                    ) : (
                      <Input name="salary" value={salaryMock} type="number" onChange={(e: any) => setSalaryMock(e)} style={{ width: 120 }} />
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">วันเริ่มงาน :</span>
                    {!isEditProfile ? (
                      moment(startDate).format("yyyy-MM-DD") || "-"
                    ) : (
                      <DatePicker name="dateStart" value={dateStart} onSelect={handleChangeDate} onChange={handleChangeDate} style={{ width: 140 }} />
                    )}
                  </div>
                  <div className="truncate"><span className="font-semibold text-gray-900">ที่อยู่ :</span> {keepEmployee?.address || "-"}</div>
                </div>

                <div className="space-y-3">
                  <div><span className="font-semibold text-gray-900">ธนาคาร :</span> {keepEmployee?.Financial_Details?.bank_name || "-"}</div>
                  <div><span className="font-semibold text-gray-900">เลขบัญชี :</span> {keepEmployee?.Financial_Details?.bank_account_number || "-"}</div>
                  <div>
                    <span className="font-semibold text-gray-900">ตำแหน่ง :</span>{" "}
                    {keepEmployee?.Employment_Details?.position === ROLESEMPLOOYEE.Trainee ? "ฝึกงาน" 
                      : keepEmployee?.Employment_Details?.position === ROLESEMPLOOYEE.General ? "พนักงานประจำ" : "-"}
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">วันที่ลาออก :</span>
                    {!isEditProfile ? (
                      endDate ? moment(endDate).format("yyyy-MM-DD") : "-"
                    ) : (
                      <DatePicker name="dateEnd" value={endDate} onSelect={handleChangeEndDate} onChange={handleChangeEndDate} style={{ width: 140 }} />
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute top-4 right-4">
              {!isEditProfile ? (
                <button onClick={handleEditProfile} className="p-2 text-gray-400 hover:text-blue-600 transition-colors rounded-full hover:bg-blue-50">
                  <FaEdit size={24} />
                </button>
              ) : (
                <button onClick={updateInfo} className="p-2 text-gray-400 hover:text-green-600 transition-colors rounded-full hover:bg-green-50">
                  <FaRegSave size={24} />
                </button>
              )}
            </div>
          </div>

          <div className="flex space-x-2 border-b border-gray-200">
            <button
              onClick={() => setTypeButton("Calendar")}
              className={`px-6 py-3 font-semibold text-sm rounded-t-lg transition-colors ${
                typeButton === "Calendar" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              ปฏิทิน
            </button>
            <button
              onClick={() => setTypeButton("Note")}
              className={`px-6 py-3 font-semibold text-sm rounded-t-lg transition-colors ${
                typeButton === "Note" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              โน๊ต
            </button>
          </div>

          {typeButton === "Calendar" && (
            <div className="space-y-6">
              
              {/* Summary Dashboard Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 items-stretch">
                {/* Card 1 */}
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-gray-800 mb-3 border-b pb-2">เดือนนี้มี {totalDayInMonth} วัน</h3>
                    <div className="space-y-2.5 text-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 bg-green-600 rounded"></div>
                          <span className="text-gray-600">มาทำงาน</span>
                        </div>
                        <span className="font-bold text-gray-900">{filterWorkStatus(WorkStatus.COME)} วัน</span>
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 bg-red-500 rounded"></div>
                          <span className="text-gray-600">ลาป่วย</span>
                        </div>
                        <span className="font-bold text-red-600">
                          {events.filter((e: any) => e.title === "leave" && (e.type?.toLowerCase() === "sick" || e.type === "ลาป่วย")).length} วัน
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 bg-amber-500 rounded"></div>
                          <span className="text-gray-600">ลากิจ / ลาพักร้อน</span>
                        </div>
                        <span className="font-bold text-amber-600">
                          {events.filter((e: any) => e.title === "leave" && (e.type?.toLowerCase() !== "sick" && e.type !== "ลาป่วย")).length} วัน
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 bg-gray-500 rounded"></div>
                          <span className="text-gray-600">หยุดประจำสัปดาห์ / ไม่มา</span>
                        </div>
                        <span className="font-bold text-gray-900">{filterWorkStatus(WorkStatus.NOTCOME)} วัน</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="pt-2 mt-4 border-t text-gray-700 font-bold flex justify-between text-sm">
                    <span>บันทึกข้อมูลแล้วทั้งหมด:</span>
                    <span>{filterWorkStatus(WorkStatus.COME) + filterWorkStatus(WorkStatus.LEAVE) + filterWorkStatus(WorkStatus.NOTCOME)} วัน</span>
                  </div>
                </div>

                {/* Card 2 */}
                <div className="bg-white p-5 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-gray-800 mb-3 border-b pb-2">OT & Perdiem</h3>
                    <div className="space-y-2.5 text-sm">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 bg-sky-400 rounded"></div>
                          <span className="text-gray-600">OT (โอเวอร์ไทม์)</span>
                        </div>
                        <span className="font-bold text-gray-900">{events.filter((event: any) => event.ot).length} วัน</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 bg-blue-600 rounded"></div>
                          <span className="text-gray-600">Perdiem (เบี้ยเลี้ยง)</span>
                        </div>
                        <span className="font-bold text-gray-900">{events.filter((event: any) => event.perdiem).length} วัน</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-4 h-4 bg-fuchsia-500 rounded"></div>
                          <span className="text-gray-600">ทำงานควบ (OT + เบี้ยเลี้ยง)</span>
                        </div>
                        <span className="font-bold text-gray-900">
                          {events.filter((event: any) => event.ot && event.perdiem).length} วัน
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="pt-2 mt-4 border-t border-transparent text-sm text-transparent select-none">-</div>
                </div>

                {/* Card 3 */}
                <div className="bg-blue-50 p-5 rounded-xl shadow-sm border border-blue-100 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-gray-800 mb-3 border-b border-blue-200 pb-2">สรุปรายได้ (ประมาณการ)</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between items-center">
                        <span className="text-gray-600">เงินเดือน{keepEmployee.Employment_Details.position === ROLESEMPLOOYEE.Trainee && ` (${events.filter((e: any) => e.type === WorkStatus.COME).length} วัน x 500)`}</span>
                        <span className="font-medium">{formatCurrency(keepEmployee.Employment_Details?.position !== ROLESEMPLOOYEE.General ? defaultSalary : (defaultSalary || 0))}</span>
                      </div>
                      <div className="flex justify-between items-center text-green-600">
                        <span>OT ({calOT(defaultSalary)} x {events.filter((e: any) => e.ot).length})</span>
                        <span>+ {formatCurrency(events.filter((e: any) => e.ot).length * calOT(defaultSalary))}</span>
                      </div>
                      <div className="flex justify-between items-center text-green-600">
                        <span>Perdiem (250 x {events.filter((e: any) => e.perdiem).length})</span>
                        <span>+ {formatCurrency(events.filter((e: any) => e.perdiem).length * 250)}</span>
                      </div>
                      <div className="flex justify-between items-center text-red-500 border-b border-blue-200 pb-2">
                        <span>หัก {keepEmployee.Employment_Details?.position === ROLESEMPLOOYEE.General ? "ประกันสังคม" : "ภาษี ณ ที่จ่าย"}</span>
                        <span>- {formatCurrency(keepEmployee.Employment_Details?.position !== ROLESEMPLOOYEE.General ? 1125 : (defaultSalary * 0.05 >= 875 ? 875 : defaultSalary * 0.05))}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex justify-between items-center pt-2 font-bold text-lg text-gray-900">
                    <span>Total Paid :</span>
                    <span className="text-blue-600">
                      {formatCurrency(
                        keepEmployee.Employment_Details?.position !== ROLESEMPLOOYEE.General
                          ? defaultSalary + (events.filter((e: any) => e.ot).length * calOT(defaultSalary)) + (events.filter((e: any) => e.perdiem).length * 250) - 1125
                          : defaultSalary + (events.filter((e: any) => e.ot).length * calOT(defaultSalary)) + (events.filter((e: any) => e.perdiem).length * 250) - calSSO(defaultSalary)
                      )}
                    </span>
                  </div>
                </div>
              </div>

              {/* ส่วนโครงสร้างหลักปฏิทินและประวัติการลา */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Calendar Component -> เพิ่ม key และส่ง initialDate เข้าไปเพื่อให้ควบคุมการเปลี่ยนหน้าจากภายนอกได้ */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                  <Calendar 
  initialDate={calendarKeyDate} 
  handleMonthChange={handleMonthChange} 
  events={events} 
/>
                </div>

                {/* ประวัติการลา */}
                <div className="lg:col-span-1 bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col overflow-hidden h-full max-h-[800px]">
                  {/* Header */}
                  <div className="p-5 border-b border-gray-100">
                    <div className="flex justify-between items-start mb-4">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 bg-gray-50 rounded-xl border border-gray-200 text-gray-600">
                          <FaRegClock size={20} />
                        </div>
                        <h2 className="text-lg font-bold text-gray-800">ประวัติการลา</h2>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-400 font-semibold mb-0.5">TOTAL</div>
                        <div className="text-2xl font-black text-gray-800 leading-none">{yearlyLeaves.length}</div>
                      </div>
                    </div>

                    {/* Month Navigator */}
                    <div className="flex items-center justify-between bg-gray-50 rounded-lg p-1.5 px-3">
                      <button 
                        onClick={() => setLeavePeriodYear(prev => prev - 1)}
                        className="p-1.5 hover:bg-white rounded-md text-gray-400 hover:text-gray-700 transition-colors shadow-sm"
                      >
                        <FaChevronLeft size={14} />
                      </button>
                      <span className="text-sm font-semibold text-gray-700">
                        ก.ค. {leavePeriodYear} - มิ.ย. {leavePeriodYear + 1}
                      </span>
                      <button 
                        onClick={() => setLeavePeriodYear(prev => prev + 1)}
                        className="p-1.5 hover:bg-white rounded-md text-gray-400 hover:text-gray-700 transition-colors shadow-sm"
                      >
                        <FaChevronRight size={14} />
                      </button>
                    </div>

                    {/* Summary Badges */}
                    <div className="flex gap-3 mt-4">
                      <div className="flex-1 bg-[#fff6ed] border border-[#ffedd5] rounded-xl p-3 flex justify-between items-center">
                        <span className="text-[#ea580c] font-semibold text-sm">ลาป่วย</span>
                        <div className="text-[#ea580c]">
                          <span className="text-xl font-bold">{yearlySickLeaves.length}</span> <span className="text-xs">วัน</span>
                        </div>
                      </div>
                      <div className="flex-1 bg-[#f0fdf4] border border-[#dcfce3] rounded-xl p-3 flex justify-between items-center">
                        <span className="text-[#16a34a] font-semibold text-sm">ใช้วันหยุด</span>
                        <div className="text-[#16a34a]">
                          <span className="text-xl font-bold">{yearlyHolidayLeaves.length}</span> <span className="text-xs">วัน</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Leave List Items (เพิ่มคุณสมบัติการคลิกเพื่อเปลี่ยนเดือน) */}
                  <div className="flex-1 overflow-y-auto p-5 space-y-2 relative">
                    {isLoadingYearlyLeaves && (
                      <div className="absolute inset-0 bg-white/70 flex items-center justify-center z-10">
                        <Loading />
                      </div>
                    )}
                    
                    {!isLoadingYearlyLeaves && yearlyLeaves.length === 0 ? (
                      <div className="text-center text-gray-400 text-sm mt-10">ไม่มีประวัติการลาในรอบปีนี้</div>
                    ) : (
                      yearlyLeaves.map((item: any, idx: number) => {
                        const isSick = item.leave_cause?.toLowerCase() === "sick" || item.leave_cause === "ลาป่วย";
                        return (
                          <div 
                            key={idx} 
                            onClick={() => handleLeaveItemClick(item.leave_date)}
                            className="flex justify-between items-start gap-4 p-2.5 rounded-xl cursor-pointer border border-transparent hover:bg-gray-50 hover:border-gray-100 transition-all group"
                            title="คลิกเพื่อดูปฏิทินของเดือนนี้"
                          >
                            <div className="space-y-1">
                              <span className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold 
                                ${isSick ? 'bg-[#fff6ed] text-[#ea580c]' : 'bg-[#dcfce3] text-[#16a34a]'}`}
                              >
                                {isSick ? 'ลาป่วย' : 'ลาโดยใช้วันหยุด'}
                              </span>
                              <p className="text-sm text-gray-600 pl-0.5 group-hover:text-gray-900 transition-colors">
                                {item.leave_reason || "ไม่มีเหตุผลระบุ"}
                              </p>
                            </div>
                            <div className="text-xs font-medium text-gray-400 group-hover:text-blue-500 transition-colors whitespace-nowrap mt-1 bg-gray-50 group-hover:bg-blue-50 px-2 py-1 rounded-md">
                              {moment(item.leave_date).format("DD MMM YYYY")}
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </div>

              </div>
            </div>
          )}

          {/* Notes Content */}
          {typeButton === "Note" && (
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <Note />
            </div>
          )}
        </>
      ) : (
        <div className="flex items-center justify-center h-64 bg-gray-50 rounded-xl border border-dashed border-gray-300 text-gray-500 font-medium">
          ยังไม่ได้เลือกพนักงาน
        </div>
      )}
    </div>
  );
};

export default Employees;