import axios from "axios";
import { NotificationDto } from "../common/models/notification";
import { API_BASE_URL } from "../common/constant";

export const fetchNotificationsOfCurrenteUser = async (username: string): Promise<NotificationDto[]> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/notification/get-notifications-of-user?username=${username}`); 
        return response.data;
    }
    catch (error) {
        throw error;
    }
}