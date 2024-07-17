/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpClient from "./httpClient";
export const addSalary = async (payload) => {
    try {
        const response = await httpClient.post(`/salary`, payload);
        return response;
    }
    catch (error) {
        return error.response;
    }
};
export const getSalaryByEmpId = async (payload, employeeId) => {
    try {
        const response = await httpClient.get(`/salary?empId=${employeeId}&month=${payload.month}&year=${payload.year}`, payload);
        return response;
    }
    catch (error) {
        return error.response;
    }
};
export const updateSalaryById = async (payload) => {
    try {
        const response = await httpClient.put(`/salary`, payload);
        return response;
    }
    catch (error) {
        return error.response;
    }
};
