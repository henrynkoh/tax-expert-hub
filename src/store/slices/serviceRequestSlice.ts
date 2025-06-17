import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface ServiceRequest {
  id: string;
  title: string;
  description: string;
  category: string;
  budget: {
    min: number;
    max: number;
  };
  deadline: string;
  documents: string[];
  seeker_id: string;
  provider_id?: string;
  status: 'open' | 'in-progress' | 'completed';
  created_at: string;
}

interface ServiceRequestState {
  requests: ServiceRequest[];
  loading: boolean;
  error: string | null;
}

const initialState: ServiceRequestState = {
  requests: [],
  loading: false,
  error: null,
};

const serviceRequestSlice = createSlice({
  name: 'serviceRequest',
  initialState,
  reducers: {
    setRequests: (state, action: PayloadAction<ServiceRequest[]>) => {
      state.requests = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    createServiceRequest: (state, action: PayloadAction<ServiceRequest>) => {
      state.requests.unshift(action.payload);
    },
    updateServiceRequest: (state, action: PayloadAction<ServiceRequest>) => {
      const index = state.requests.findIndex(req => req.id === action.payload.id);
      if (index !== -1) {
        state.requests[index] = action.payload;
      }
    },
    deleteServiceRequest: (state, action: PayloadAction<string>) => {
      state.requests = state.requests.filter(req => req.id !== action.payload);
    },
  },
});

export const {
  setRequests,
  setLoading,
  setError,
  createServiceRequest,
  updateServiceRequest,
  deleteServiceRequest,
} = serviceRequestSlice.actions;

export default serviceRequestSlice.reducer; 