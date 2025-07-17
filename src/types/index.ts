export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'student' | 'owner';
  nationalId?: string;
  universityId?: string;
  phone?: string;
  address?: string;
  approved: boolean;
  avatar?: string;
  createdAt: Date;
}

export interface Apartment {
  id: string;
  ownerId: string;
  title: string;
  address: string;
  description: string;
  rent: number;
  images: string[];
  approved: boolean;
  type: 'shared' | 'private';
  createdAt: Date;
  owner?: User;
}

export interface Comment {
  id: string;
  studentId: string;
  apartmentId: string;
  content: string;
  createdAt: Date;
  student?: User;
}

export interface ApartmentRequest {
  id: string;
  studentId: string;
  apartmentId: string;
  status: 'pending' | 'approved' | 'rejected';
  createdAt: Date;
  student?: User;
  apartment?: Apartment;
}

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  subject: string;
  message: string;
  status: 'unread' | 'read' | 'replied';
  createdAt: Date;
}

export interface Message {
  id: string;
  fromUserId: string;
  toUserId: string;
  message: string;
  createdAt: Date;
  fromUser?: User;
  toUser?: User;
}