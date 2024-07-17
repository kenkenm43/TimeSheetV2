/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpClient from "./httpClient";
export const getEmployee = async (employeeId) => {
    try {
        const response = await httpClient.get(`/employee/${employeeId}`);
        return response;
    }
    catch (error) {
        return error.response;
    }
};
export const updateEmployee = async (payload, employeeId) => {
    try {
        const response = await httpClient.put(`/employee/${employeeId}`, payload);
        return response;
    }
    catch (error) {
        return error.response;
    }
};
export const updateEmployeeStartWork = async (payload, employeeId) => {
    try {
        const response = await httpClient.put(`/employee/startWork/${employeeId}`, payload);
        return response;
    }
    catch (error) {
        return error.response;
    }
};
export const uploadImage = async (payload, employeeId) => {
    try {
        const response = await httpClient.post(`/employee/uploadImage/${employeeId}`, payload, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return response;
    }
    catch (error) {
        return error.response;
    }
};
export const getWorkSchedules = async (employeeId) => {
    try {
        const response = await httpClient.get(`/work-schedule/${employeeId}`);
        return response;
    }
    catch (error) {
        return error.response;
    }
};
export const getWorkSchedulesByPost = async (payload, employeeId) => {
    try {
        const response = await httpClient.post(`/work-scheduleByPost/${employeeId}`, payload);
        return response;
    }
    catch (error) {
        return error.response;
    }
};
export const addWorkSchedule = async (payload, employeeId) => {
    try {
        const response = await httpClient.post(`/work-schedule/${employeeId}`, payload);
        return response;
    }
    catch (error) {
        return error.response;
    }
};
export const updateWorkSchedule = async (payload, employeeId, dateId) => {
    try {
        const response = await httpClient.patch(`/work-schedule/${employeeId}/${dateId}`, payload);
        return response;
    }
    catch (error) {
        return error.response;
    }
};
export const deleteWorkSchedule = async (employeeId, dateId) => {
    try {
        const response = await httpClient.delete(`/work-schedule/${employeeId}/${dateId}`);
        return response;
    }
    catch (error) {
        return error.response;
    }
};
export const getLeaves = async (employeeId) => {
    try {
        const response = await httpClient.get(`/leave/${employeeId}`);
        return response;
    }
    catch (error) {
        return error.response;
    }
};
export const getLeavesBypost = async (payload, employeeId) => {
    try {
        const response = await httpClient.post(`/leaveByPost/${employeeId}`, payload);
        return response;
    }
    catch (error) {
        return error.response;
    }
};
export const addLeave = async (payload, employeeId) => {
    try {
        const response = await httpClient.post(`/leave/${employeeId}`, payload);
        return response;
    }
    catch (error) {
        return error.response;
    }
};
export const updateLeave = async (payload, employeeId, dateId) => {
    console.log("payload", payload);
    try {
        const response = await httpClient.patch(`/leave/${employeeId}/${dateId}`, payload);
        return response;
    }
    catch (error) {
        return error.response;
    }
};
export const deleteLeaveSchedule = async (employeeId, dateId) => {
    try {
        const response = await httpClient.delete(`/leave/${employeeId}/${dateId}`);
        return response;
    }
    catch (error) {
        return error.response;
    }
};
