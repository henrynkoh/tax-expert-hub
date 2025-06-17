import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import serviceRequestReducer from './slices/serviceRequestSlice';
import chatReducer from './slices/chatSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    serviceRequest: serviceRequestReducer,
    chat: chatReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch; 