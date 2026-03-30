export interface Couple {
  id: string;
  brideName: string;
  groomName: string;
  weddingDate: string;
  location: string;
  theme: 'royal' | 'modern' | 'romantic';
  colors: {
    primary: string;
    secondary: string;
  };
  coverImage?: string;
  createdAt: number;
  adminId: string;
}

export interface Guest {
  id: string;
  coupleId: string;
  name: string;
  email?: string;
  phone?: string;
  invitationCode: string; // unique short code
  status: 'pending' | 'accepted' | 'declined';
  companion?: number;
  specialRequests?: string;
  createdAt: number;
}

export interface InvitationStats {
  total: number;
  accepted: number;
  declined: number;
  pending: number;
}
