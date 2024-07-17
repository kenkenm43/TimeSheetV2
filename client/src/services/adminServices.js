/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpClient from "./httpClient";
export const getEmployees = async (payload) => {
    try {
        const response = await httpClient.get(`/employee?roleQuery=${payload.roleQuery}`);
        return response;
    }
    catch (error) {
        return error.response;
    }
};
