import React, { createContext, useContext, useState, useEffect } from 'react';
import { Apartment, Comment, ApartmentRequest, Message, ContactMessage } from '../types';

interface AppContextType {
  apartments: Apartment[];
  comments: Comment[];
  apartmentRequests: ApartmentRequest[];
  messages: Message[];
  contactMessages: ContactMessage[];
  addApartment: (apartment: Omit<Apartment, 'id' | 'createdAt'>) => void;
  approveApartment: (id: string) => void;
  addComment: (comment: Omit<Comment, 'id' | 'createdAt'>) => void;
  addApartmentRequest: (request: Omit<ApartmentRequest, 'id' | 'createdAt'>) => void;
  updateRequestStatus: (id: string, status: 'approved' | 'rejected') => void;
  addContactMessage: (message: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>) => void;
  updateMessageStatus: (id: string, status: 'read' | 'replied') => void;
  getApartmentById: (id: string) => Apartment | undefined;
  getCommentsByApartment: (apartmentId: string) => Comment[];
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [apartments, setApartments] = useState<Apartment[]>([]);
  const [comments, setComments] = useState<Comment[]>([]);
  const [apartmentRequests, setApartmentRequests] = useState<ApartmentRequest[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [contactMessages, setContactMessages] = useState<ContactMessage[]>([]);

  useEffect(() => {
    // تحميل البيانات من localStorage
    const savedApartments = localStorage.getItem('apartments');
    const savedComments = localStorage.getItem('comments');
    const savedRequests = localStorage.getItem('apartmentRequests');
    const savedContactMessages = localStorage.getItem('contactMessages');
    
    if (savedApartments) setApartments(JSON.parse(savedApartments));
    if (savedComments) setComments(JSON.parse(savedComments));
    if (savedRequests) setApartmentRequests(JSON.parse(savedRequests));
    if (savedContactMessages) setContactMessages(JSON.parse(savedContactMessages));
    
    // إضافة شقق تجريبية
    if (!savedApartments || JSON.parse(savedApartments).length === 0) {
      const sampleApartments: Apartment[] = [
        {
          id: '1',
          ownerId: 'owner-1',
          title: 'شقة مميزة بجوار الجامعة',
          address: 'شارع التحرير، القاهرة',
          description: 'شقة مفروشة بالكامل، غرفتين نوم، حمام، مطبخ مجهز، قريبة من المترو والجامعة',
          rent: 2500,
          images: ['https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg'],
          approved: true,
          type: 'private',
          createdAt: new Date()
        },
        {
          id: '2',
          ownerId: 'owner-2',
          title: 'سكن مشترك للطلاب',
          address: 'مدينة نصر، القاهرة',
          description: 'سكن مشترك نظيف وآمن، 4 غرف، 2 حمام، مطبخ مشترك، انترنت سريع',
          rent: 1200,
          images: ['https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg'],
          approved: true,
          type: 'shared',
          createdAt: new Date()
        }
      ];
      setApartments(sampleApartments);
      localStorage.setItem('apartments', JSON.stringify(sampleApartments));
    }
  }, []);

  const addApartment = (apartment: Omit<Apartment, 'id' | 'createdAt'>) => {
    const newApartment: Apartment = {
      ...apartment,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    
    const updatedApartments = [...apartments, newApartment];
    setApartments(updatedApartments);
    localStorage.setItem('apartments', JSON.stringify(updatedApartments));
  };

  const approveApartment = (id: string) => {
    const updatedApartments = apartments.map(apt =>
      apt.id === id ? { ...apt, approved: true } : apt
    );
    setApartments(updatedApartments);
    localStorage.setItem('apartments', JSON.stringify(updatedApartments));
  };

  const addComment = (comment: Omit<Comment, 'id' | 'createdAt'>) => {
    const newComment: Comment = {
      ...comment,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    
    const updatedComments = [...comments, newComment];
    setComments(updatedComments);
    localStorage.setItem('comments', JSON.stringify(updatedComments));
  };

  const addApartmentRequest = (request: Omit<ApartmentRequest, 'id' | 'createdAt'>) => {
    const newRequest: ApartmentRequest = {
      ...request,
      id: Date.now().toString(),
      createdAt: new Date()
    };
    
    const updatedRequests = [...apartmentRequests, newRequest];
    setApartmentRequests(updatedRequests);
    localStorage.setItem('apartmentRequests', JSON.stringify(updatedRequests));
  };

  const updateRequestStatus = (id: string, status: 'approved' | 'rejected') => {
    const updatedRequests = apartmentRequests.map(req =>
      req.id === id ? { ...req, status } : req
    );
    setApartmentRequests(updatedRequests);
    localStorage.setItem('apartmentRequests', JSON.stringify(updatedRequests));
  };

  const addContactMessage = (message: Omit<ContactMessage, 'id' | 'createdAt' | 'status'>) => {
    const newMessage: ContactMessage = {
      ...message,
      id: Date.now().toString(),
      status: 'unread',
      createdAt: new Date()
    };
    
    const updatedMessages = [...contactMessages, newMessage];
    setContactMessages(updatedMessages);
    localStorage.setItem('contactMessages', JSON.stringify(updatedMessages));
  };

  const updateMessageStatus = (id: string, status: 'read' | 'replied') => {
    const updatedMessages = contactMessages.map(msg =>
      msg.id === id ? { ...msg, status } : msg
    );
    setContactMessages(updatedMessages);
    localStorage.setItem('contactMessages', JSON.stringify(updatedMessages));
  };

  const getApartmentById = (id: string) => {
    return apartments.find(apt => apt.id === id);
  };

  const getCommentsByApartment = (apartmentId: string) => {
    return comments.filter(comment => comment.apartmentId === apartmentId);
  };

  return (
    <AppContext.Provider value={{
      apartments,
      comments,
      apartmentRequests,
      messages,
      contactMessages,
      addApartment,
      approveApartment,
      addComment,
      addApartmentRequest,
      updateRequestStatus,
      addContactMessage,
      updateMessageStatus,
      getApartmentById,
      getCommentsByApartment
    }}>
      {children}
    </AppContext.Provider>
  );
};