import { createAsyncThunk } from "@reduxjs/toolkit";
import { ChatMessage } from "../../common/models/chat";
import { fetchChatConversations, fetchChatMessages } from "../../services/ChatService";

export const fetchChatMessagesThunk = createAsyncThunk<ChatMessage[], {senderId: string, recipientId: string}>(
    "chat/fetchChatMessages",
    async ({senderId, recipientId}: {senderId: string, recipientId: string}, thunkAPI) => {
        try {
            return await fetchChatMessages(senderId, recipientId);
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response.data || "Failed to fetch chat messages");
        }
    }
);

export const fetchChatConversationsThunk = createAsyncThunk<ChatMessage[], {senderId: string}>(
    "chat/fetchChatConversations",
    async ({senderId}: {senderId: string}, thunkAPI) => {
        try {
            return await fetchChatConversations(senderId);
        } catch (error: any) {
            return thunkAPI.rejectWithValue(error.response.data || "Failed to fetch chat conversations");
        }
    }
);