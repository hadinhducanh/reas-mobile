import axios from "axios";
import { GetNotificationRequest, NotificationResponse } from "../common/models/notification";
import { API_BASE_URL } from "../common/constant";

export const fetchNotificationsOfCurrenteUser = async (request: GetNotificationRequest): Promise<NotificationResponse> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/notification/get-notifications-of-user?pageNo=${request.pageNo}&pageSize=${request.pageSize}&username=${request.username}`); 
        return response.data;
    }
    catch (error) {
        throw error;
    }
}