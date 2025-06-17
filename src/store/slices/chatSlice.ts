import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ChatMessage {
  id: string;
  roomId: string;
  senderId: string;
  content: string;
  attachments: string[];
  timestamp: string;
  status: 'sent' | 'delivered' | 'read';
}

interface ChatRoom {
  id: string;
  requestId: string;
  participants: string[];
  lastMessage: ChatMessage | null;
  createdAt: string;
  updatedAt: string;
}

interface ChatState {
  rooms: ChatRoom[];
  currentRoom: ChatRoom | null;
  messages: ChatMessage[];
  loading: boolean;
  error: string | null;
}

const initialState: ChatState = {
  rooms: [],
  currentRoom: null,
  messages: [],
  loading: false,
  error: null,
};

const chatSlice = createSlice({
  name: 'chat',
  initialState,
  reducers: {
    setRooms: (state, action: PayloadAction<ChatRoom[]>) => {
      state.rooms = action.payload;
    },
    setCurrentRoom: (state, action: PayloadAction<ChatRoom | null>) => {
      state.currentRoom = action.payload;
    },
    setMessages: (state, action: PayloadAction<ChatMessage[]>) => {
      state.messages = action.payload;
    },
    addMessage: (state, action: PayloadAction<ChatMessage>) => {
      state.messages.push(action.payload);
      if (state.currentRoom) {
        state.currentRoom.lastMessage = action.payload;
      }
    },
    updateMessageStatus: (state, action: PayloadAction<{ messageId: string; status: ChatMessage['status'] }>) => {
      const message = state.messages.find(msg => msg.id === action.payload.messageId);
      if (message) {
        message.status = action.payload.status;
      }
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
  },
});

export const {
  setRooms,
  setCurrentRoom,
  setMessages,
  addMessage,
  updateMessageStatus,
  setLoading,
  setError,
} = chatSlice.actions;

export default chatSlice.reducer; 