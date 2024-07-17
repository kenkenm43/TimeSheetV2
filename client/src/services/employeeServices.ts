/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpClient from "./httpClient";
export const getEmployee = async (employeeId: any) => {
  try {
    const response = await httpClient.get(`/employee/${employeeId}`);

    return response;
  } catch (error: any) {
    return error.response;
  }
};
export const updateEmployee = async (payload: any, employeeId: any) => {
  try {
    const response = await httpClient.put(`/employee/${employeeId}`, payload);
    return response;
  } catch (error: any) {
    return error.response;
  }
};
export const updateEmployeeStartWork = async (
  payload: any,
  employeeId: any
) => {
  try {
    const response = await httpClient.put(
      `/employee/startWork/${employeeId}`,
      payload
    );
    return response;
  } catch (error: any) {
    return error.response;
  }
};
export const uploadImage = async (payload: any, employeeId: any) => {
  try {
    const response = await httpClient.post(
      `/employee/uploadImage/${employeeId}`,
      payload,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    return response;
  } catch (error: any) {
    return error.response;
  }
};

export const getWorkSchedules = async (employeeId: any) => {
  try {
    const response = await httpClient.get(`/work-schedule/${employeeId}`);
    return response;
  } catch (error: any) {
    return error.response;
  }
};
export const getWorkSchedulesByPost = async (payload: any, employeeId: any) => {
  try {
    const response = await httpClient.post(
      `/work-scheduleByPost/${employeeId}`,
      payload
    );
    return response;
  } catch (error: any) {
    return error.response;
  }
};
export const addWorkSchedule = async (payload: any, employeeId: any) => {
  try {
    const response = await httpClient.post(
      `/work-schedule/${employeeId}`,
      payload
    );

    return response;
  } catch (error: any) {
    return error.response;
  }
};
export const updateWorkSchedule = async (
  payload: any,
  employeeId: any,
  dateId: any
) => {
  try {
    const response = await httpClient.patch(
      `/work-schedule/${employeeId}/${dateId}`,
      payload
    );
    return response;
  } catch (error: any) {
    return error.response;
  }
};
export const deleteWorkSchedule = async (employeeId: any, dateId: any) => {
  try {
    const response = await httpClient.delete(
      `/work-schedule/${employeeId}/${dateId}`
    );
    return response;
  } catch (error: any) {
    return error.response;
  }
};
export const getLeaves = async (employeeId: any) => {
  try {
    const response = await httpClient.get(`/leave/${employeeId}`);
    return response;
  } catch (error: any) {
    return error.response;
  }
};
export const getLeavesBypost = async (payload: any, employeeId: any) => {
  try {
    const response = await httpClient.post(
      `/leaveByPost/${employeeId}`,
      payload
    );
    return response;
  } catch (error: any) {
    return error.response;
  }
};
export const addLeave = async (payload: any, employeeId: any) => {
  try {
    const response = await httpClient.post(`/leave/${employeeId}`, payload);

    return response;
  } catch (error: any) {
    return error.response;
  }
};
export const updateLeave = async (
  payload: any,
  employeeId: any,
  dateId: any
) => {
  console.log("payload", payload);

  try {
    const response = await httpClient.patch(
      `/leave/${employeeId}/${dateId}`,
      payload
    );
    return response;
  } catch (error: any) {
    return error.response;
  }
};
export const deleteLeaveSchedule = async (employeeId: any, dateId: any) => {
  try {
    const response = await httpClient.delete(`/leave/${employeeId}/${dateId}`);
    return response;
  } catch (error: any) {
    return error.response;
  }
};
