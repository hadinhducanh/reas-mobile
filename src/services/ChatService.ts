import axios from "axios";
import { ChatMessage } from "../common/models/chat";
import { API_BASE_URL } from "../common/constant";

export const fetchChatMessages = async (senderId: string, recipientId: string): Promise<ChatMessage[]> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/messages/${senderId}/${recipientId}`);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}

export const fetchChatConversations = async (senderId: string): Promise<ChatMessage[]> => {
    try {
        const response = await axios.get(`${API_BASE_URL}/conversations/${senderId}`);
        return response.data;
    }
    catch (error) {
        throw error;
    }
}