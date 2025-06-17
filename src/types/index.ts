export interface User {
  id: string;
  email: string;
  name: string;
  role: 'seeker' | 'provider';
}

export interface ServiceRequest {
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
  status: 'open' | 'in_progress' | 'completed';
  created_at: string;
  seekers?: {
    name: string;
  };
  providers?: {
    name: string;
  };
}

export interface Message {
  id: string;
  content: string;
  sender_id: string;
  created_at: string;
  sender_name: string;
}

export interface Proposal {
  id: string;
  request_id: string;
  provider_id: string;
  amount: number;
  message: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
} 