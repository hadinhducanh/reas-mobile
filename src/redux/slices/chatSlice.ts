import { ActionReducerMapBuilder, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { ChatMessage } from "../../common/models/chat";
import { fetchChatMessagesThunk } from "../thunk/chatThunk";

export interface ChatState {
    chatMessages: ChatMessage[];
    loading: boolean;
    error: string | null;
}

const initialState: ChatState = {
    chatMessages: [],
    loading: false,
    error: null,
};

const chatSlice = createSlice({
    name: "chat",
    initialState,
    reducers: {},
    extraReducers: (builder) => {
       setChatMessages(builder);
    },
});

function setChatMessages(
    builder: ActionReducerMapBuilder<ChatState>,
) {
    builder
    .addCase(fetchChatMessagesThunk.pending, (state) => {
        state.loading = true;
        state.error = null;
    })
    .addCase(fetchChatMessagesThunk.fulfilled, (state, action: PayloadAction<ChatMessage[]>) => {
        state.loading = false;
        state.chatMessages = action.payload;
    })
    .addCase(fetchChatMessagesThunk.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch chat messages";
    });
}

export default chatSlice.reducer;