export interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

export interface Pitch {
  id: string;
  name: string;
  location: string;
  pricePerHour: number;
}

export interface Slot {
  startTime: string;
  endTime: string;
  status: "AVAILABLE" | "RESERVED" | "BOOKED";
}

export interface Booking {
  id: string;
  userId: string;
  pitchId: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  status: string;
  createdAt: string;
  pitch: {
    name: string;
    location: string;
    pricePerHour: number;
  };
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  statusCode: number;
}

export interface AuthResponse {
  user: User;
  token: string;
}
