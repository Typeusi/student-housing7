import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { Users, Building, MessageCircle, CheckCircle, XCircle, Clock, Shield, LogOut, Mail, Eye } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import { User } from '../types';

const AdminDashboard: React.FC = () => {
  const { apartments, apartmentRequests, contactMessages, approveApartment, updateRequestStatus, updateMessageStatus } = useApp();
  const { user, logout } = useAuth();
  const [activeTab, setActiveTab] = useState<'users' | 'apartments' | 'requests' | 'messages'>('users');

  // التحقق من صلاحية الأدمن
  if (!user || user.role !== 'admin') {
    return <Navigate to="/admin-login" replace />;
  }

  // محاكاة المستخدمين المنتظرين الموافقة
  const pendingUsers: User[] = JSON.parse(localStorage.getItem('users') || '[]').filter(
    (user: User) => !user.approved
  );

  const approveUser = (userId: string) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map((user: User) =>
      user.id === userId ? { ...user, approved: true } : user
    );
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    alert('تم تفعيل الحساب بنجاح!');
    window.location.reload();
  };

  const rejectUser = (userId: string) => {
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.filter((user: User) => user.id !== userId);
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    alert('تم رفض الحساب!');
    window.location.reload();
  };

  const pendingApartments = apartments.filter(apt => !apt.approved);
  const pendingRequests = apartmentRequests.filter(req => req.status === 'pending');
  const unreadMessages = contactMessages.filter(msg => msg.status === 'unread');

  const TabButton: React.FC<{
    id: 'users' | 'apartments' | 'requests' | 'messages';
    label: string;
    icon: React.ReactNode;
    count: number;
  }> = ({ id, label, icon, count }) => (
    <button
      onClick={() => setActiveTab(id)}
      className={`flex items-center space-x-2 space-x-reverse px-4 py-2 rounded-lg font-medium transition-colors ${
        activeTab === id
          ? 'bg-red-600 text-white'
          : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
      }`}
    >
      {icon}
      <span>{label}</span>
      {count > 0 && (
        <span className="bg-yellow-500 text-white text-xs px-2 py-1 rounded-full">
          {count}
        </span>
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Header */}
      <div className="bg-gray-800 border-b border-gray-700">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 space-x-reverse">
              <div className="bg-red-600 rounded-full p-2">
                <Shield className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-white">لوحة تحكم الأدمن</h1>
                <p className="text-gray-400 text-sm">مرحباً {user.name}</p>
              </div>
            </div>
            <button
              onClick={logout}
              className="flex items-center space-x-2 space-x-reverse px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            >
              <LogOut className="h-5 w-5" />
              <span>تسجيل الخروج</span>
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Statistics Cards */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100">المستخدمين المنتظرين</p>
                <p className="text-3xl font-bold">{pendingUsers.length}</p>
              </div>
              <Users className="h-12 w-12 text-blue-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100">الشقق المنتظرة</p>
                <p className="text-3xl font-bold">{pendingApartments.length}</p>
              </div>
              <Building className="h-12 w-12 text-green-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-purple-600 to-purple-700 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100">طلبات الشقق</p>
                <p className="text-3xl font-bold">{pendingRequests.length}</p>
              </div>
              <MessageCircle className="h-12 w-12 text-purple-200" />
            </div>
          </div>
          
          <div className="bg-gradient-to-r from-orange-600 to-orange-700 rounded-lg p-6 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100">رسائل التواصل</p>
                <p className="text-3xl font-bold">{unreadMessages.length}</p>
              </div>
              <Mail className="h-12 w-12 text-orange-200" />
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <TabButton
            id="users"
            label="المستخدمين المنتظرين"
            icon={<Users className="h-5 w-5" />}
            count={pendingUsers.length}
          />
          <TabButton
            id="apartments"
            label="الشقق المنتظرة"
            icon={<Building className="h-5 w-5" />}
            count={pendingApartments.length}
          />
          <TabButton
            id="requests"
            label="طلبات الشقق"
            icon={<MessageCircle className="h-5 w-5" />}
            count={pendingRequests.length}
          />
          <TabButton
            id="messages"
            label="رسائل التواصل"
            icon={<Mail className="h-5 w-5" />}
            count={unreadMessages.length}
          />
        </div>

        {/* Tab Content */}
        <div className="bg-gray-800 rounded-lg shadow-xl">
          {activeTab === 'users' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                المستخدمين المنتظرين الموافقة ({pendingUsers.length})
              </h2>
              
              {pendingUsers.length > 0 ? (
                <div className="space-y-4">
                  {pendingUsers.map((user) => (
                    <div key={user.id} className="border border-gray-700 rounded-lg p-4 bg-gray-750">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 space-x-reverse mb-2">
                            <Users className="h-5 w-5 text-gray-400" />
                            <h3 className="font-semibold text-white">{user.name}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              user.role === 'student' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {user.role === 'student' ? 'طالب' : 'مالك عقار'}
                            </span>
                          </div>
                          <div className="text-sm text-gray-300 space-y-1">
                            <p><strong>البريد:</strong> {user.email}</p>
                            <p><strong>الرقم القومي:</strong> {user.nationalId}</p>
                            {user.role === 'student' && user.universityId && (
                              <p><strong>الرقم الجامعي:</strong> {user.universityId}</p>
                            )}
                            {user.role === 'owner' && user.phone && (
                              <p><strong>الهاتف:</strong> {user.phone}</p>
                            )}
                            {user.role === 'owner' && user.address && (
                              <p><strong>العنوان:</strong> {user.address}</p>
                            )}
                            <p><strong>تاريخ التسجيل:</strong> {new Date(user.createdAt).toLocaleDateString('ar-EG')}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2 space-x-reverse">
                          <button
                            onClick={() => approveUser(user.id)}
                            className="flex items-center space-x-1 space-x-reverse px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span>موافقة</span>
                          </button>
                          <button
                            onClick={() => rejectUser(user.id)}
                            className="flex items-center space-x-1 space-x-reverse px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          >
                            <XCircle className="h-4 w-4" />
                            <span>رفض</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Users className="h-12 w-12 text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-400">لا توجد حسابات منتظرة الموافقة</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'apartments' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                الشقق المنتظرة الموافقة ({pendingApartments.length})
              </h2>
              
              {pendingApartments.length > 0 ? (
                <div className="space-y-6">
                  {pendingApartments.map((apartment) => (
                    <div key={apartment.id} className="border border-gray-700 rounded-lg p-4 bg-gray-750">
                      <div className="flex gap-4">
                        <img
                          src={apartment.images[0] || 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg'}
                          alt={apartment.title}
                          className="w-32 h-32 object-cover rounded-lg"
                        />
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 space-x-reverse mb-2">
                            <Building className="h-5 w-5 text-gray-400" />
                            <h3 className="font-semibold text-white">{apartment.title}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              apartment.type === 'private' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {apartment.type === 'private' ? 'فردي' : 'مشترك'}
                            </span>
                          </div>
                          <div className="text-sm text-gray-300 space-y-1">
                            <p><strong>العنوان:</strong> {apartment.address}</p>
                            <p><strong>الوصف:</strong> {apartment.description.substring(0, 100)}...</p>
                            <p><strong>الإيجار:</strong> {apartment.rent} ج.م/شهر</p>
                            <p><strong>تاريخ الإضافة:</strong> {new Date(apartment.createdAt).toLocaleDateString('ar-EG')}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2 space-x-reverse">
                          <button
                            onClick={() => approveApartment(apartment.id)}
                            className="flex items-center space-x-1 space-x-reverse px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                          >
                            <CheckCircle className="h-4 w-4" />
                            <span>موافقة</span>
                          </button>
                          <button
                            className="flex items-center space-x-1 space-x-reverse px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                          >
                            <XCircle className="h-4 w-4" />
                            <span>رفض</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Building className="h-12 w-12 text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-400">لا توجد شقق منتظرة الموافقة</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'requests' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                طلبات الشقق ({pendingRequests.length})
              </h2>
              
              {pendingRequests.length > 0 ? (
                <div className="space-y-4">
                  {pendingRequests.map((request) => {
                    const apartment = apartments.find(apt => apt.id === request.apartmentId);
                    return (
                      <div key={request.id} className="border border-gray-700 rounded-lg p-4 bg-gray-750">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 space-x-reverse mb-2">
                              <MessageCircle className="h-5 w-5 text-gray-400" />
                              <h3 className="font-semibold text-white">
                                طلب شقة: {apartment?.title}
                              </h3>
                              <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                <Clock className="h-3 w-3 inline ml-1" />
                                منتظر
                              </span>
                            </div>
                            <div className="text-sm text-gray-300 space-y-1">
                              <p><strong>الشقة:</strong> {apartment?.title}</p>
                              <p><strong>العنوان:</strong> {apartment?.address}</p>
                              <p><strong>الإيجار:</strong> {apartment?.rent} ج.م/شهر</p>
                              <p><strong>تاريخ الطلب:</strong> {new Date(request.createdAt).toLocaleDateString('ar-EG')}</p>
                            </div>
                          </div>
                          <div className="flex space-x-2 space-x-reverse">
                            <button
                              onClick={() => updateRequestStatus(request.id, 'approved')}
                              className="flex items-center space-x-1 space-x-reverse px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                              <CheckCircle className="h-4 w-4" />
                              <span>موافقة</span>
                            </button>
                            <button
                              onClick={() => updateRequestStatus(request.id, 'rejected')}
                              className="flex items-center space-x-1 space-x-reverse px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                              <XCircle className="h-4 w-4" />
                              <span>رفض</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8">
                  <MessageCircle className="h-12 w-12 text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-400">لا توجد طلبات شقق منتظرة</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'messages' && (
            <div className="p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                رسائل التواصل ({contactMessages.length})
              </h2>
              
              {contactMessages.length > 0 ? (
                <div className="space-y-4">
                  {contactMessages.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).map((message) => (
                    <div key={message.id} className={`border rounded-lg p-4 ${
                      message.status === 'unread' 
                        ? 'border-yellow-500 bg-yellow-900/20' 
                        : 'border-gray-700 bg-gray-750'
                    }`}>
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 space-x-reverse mb-2">
                            <Mail className="h-5 w-5 text-gray-400" />
                            <h3 className="font-semibold text-white">{message.name}</h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              message.status === 'unread' 
                                ? 'bg-yellow-100 text-yellow-800' 
                                : message.status === 'read'
                                ? 'bg-blue-100 text-blue-800'
                                : 'bg-green-100 text-green-800'
                            }`}>
                              {message.status === 'unread' ? 'جديد' : message.status === 'read' ? 'مقروء' : 'تم الرد'}
                            </span>
                          </div>
                          <div className="text-sm text-gray-300 space-y-1">
                            <p><strong>البريد:</strong> {message.email}</p>
                            <p><strong>الموضوع:</strong> {message.subject}</p>
                            <p><strong>الرسالة:</strong> {message.message}</p>
                            <p><strong>التاريخ:</strong> {new Date(message.createdAt).toLocaleDateString('ar-EG')} - {new Date(message.createdAt).toLocaleTimeString('ar-EG')}</p>
                          </div>
                        </div>
                        <div className="flex space-x-2 space-x-reverse">
                          {message.status === 'unread' && (
                            <button
                              onClick={() => updateMessageStatus(message.id, 'read')}
                              className="flex items-center space-x-1 space-x-reverse px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                              <Eye className="h-4 w-4" />
                              <span>تم القراءة</span>
                            </button>
                          )}
                          {message.status !== 'replied' && (
                            <button
                              onClick={() => {
                                updateMessageStatus(message.id, 'replied');
                                window.open(`mailto:${message.email}?subject=رد على: ${message.subject}`, '_blank');
                              }}
                              className="flex items-center space-x-1 space-x-reverse px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                            >
                              <Mail className="h-4 w-4" />
                              <span>رد</span>
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Mail className="h-12 w-12 text-gray-500 mx-auto mb-3" />
                  <p className="text-gray-400">لا توجد رسائل تواصل</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;