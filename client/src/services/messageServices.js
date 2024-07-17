/* eslint-disable react-hooks/rules-of-hooks */
/* eslint-disable @typescript-eslint/no-explicit-any */
import httpClient from "./httpClient";
export const sendMessage = async (payload) => {
    try {
        const response = await httpClient.post(`/message`, payload);
        return response;
    }
    catch (error) {
        return error.response;
    }
};
export const receiveMessage = async (senderId, receivedId) => {
    try {
        const response = await httpClient.get(`/message/${senderId}/${receivedId}`);
        return response;
    }
    catch (error) {
        return error.response;
    }
};
export const employeeReceiveMessage = async (receivedId) => {
    console.log("receivedId", receivedId);
    try {
        const response = await httpClient.get(`/message/${receivedId}`);
        return response;
    }
    catch (error) {
        return error.response;
    }
};
export const updateMessage = async (payload) => {
    try {
        const response = await httpClient.put(`/message`, payload);
        return response;
    }
    catch (error) {
        return error.response;
    }
};
export const deleteMessage = async (payload) => {
    try {
        const response = await httpClient.delete(`/message/${payload.messageId}`);
        return response;
    }
    catch (error) {
        return error.response;
    }
};
