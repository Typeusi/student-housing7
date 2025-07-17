import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { MapPin, MessageCircle, Send, ArrowRight, Calendar, Building, User } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';

const ApartmentDetails: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { getApartmentById, getCommentsByApartment, addComment, addApartmentRequest } = useApp();
  const { user } = useAuth();
  const [newComment, setNewComment] = useState('');
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const apartment = getApartmentById(id!);
  const comments = getCommentsByApartment(id!);

  if (!apartment) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">الشقة غير موجودة</h2>
          <button
            onClick={() => navigate('/apartments')}
            className="text-blue-600 hover:text-blue-800"
          >
            العودة إلى الشقق
          </button>
        </div>
      </div>
    );
  }

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (newComment.trim() && user) {
      addComment({
        studentId: user.id,
        apartmentId: apartment.id,
        content: newComment.trim()
      });
      setNewComment('');
    }
  };

  const handleRequest = () => {
    if (user) {
      addApartmentRequest({
        studentId: user.id,
        apartmentId: apartment.id,
        status: 'pending'
      });
      
      alert('تم إرسال طلبك بنجاح! سيتم التواصل معك من قبل الإدارة قريباً.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        {/* Back Button */}
        <button
          onClick={() => navigate('/apartments')}
          className="flex items-center space-x-2 space-x-reverse text-gray-600 hover:text-gray-800 mb-6"
        >
          <ArrowRight className="h-5 w-5" />
          <span>العودة إلى الشقق</span>
        </button>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="relative">
              <img
                src={apartment.images[currentImageIndex] || 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg'}
                alt={apartment.title}
                className="w-full h-96 object-cover rounded-lg shadow-lg"
              />
              <div className="absolute top-4 right-4">
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  apartment.type === 'private' 
                    ? 'bg-blue-100 text-blue-800' 
                    : 'bg-green-100 text-green-800'
                }`}>
                  {apartment.type === 'private' ? 'فردي' : 'مشترك'}
                </span>
              </div>
            </div>

            {apartment.images.length > 1 && (
              <div className="flex space-x-2 space-x-reverse">
                {apartment.images.map((image, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-20 h-20 rounded-lg overflow-hidden border-2 ${
                      currentImageIndex === index ? 'border-blue-500' : 'border-gray-200'
                    }`}
                  >
                    <img
                      src={image}
                      alt={`${apartment.title} - ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Apartment Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-800 mb-2">{apartment.title}</h1>
              <div className="flex items-center text-gray-600 mb-4">
                <MapPin className="h-5 w-5 ml-2" />
                <span>{apartment.address}</span>
              </div>
              <div className="text-3xl font-bold text-blue-600 mb-4">
                {apartment.rent} ج.م
                <span className="text-lg font-normal text-gray-500">/شهر</span>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">تفاصيل الشقة</h2>
              <p className="text-gray-600 leading-relaxed">{apartment.description}</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-3">معلومات إضافية</h2>
              <div className="space-y-3">
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Building className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600">نوع السكن:</span>
                  <span className="font-medium">
                    {apartment.type === 'private' ? 'فردي' : 'مشترك'}
                  </span>
                </div>
                <div className="flex items-center space-x-2 space-x-reverse">
                  <Calendar className="h-5 w-5 text-gray-400" />
                  <span className="text-gray-600">تاريخ الإضافة:</span>
                  <span className="font-medium">
                    {new Date(apartment.createdAt).toLocaleDateString('ar-EG')}
                  </span>
                </div>
              </div>
            </div>

            {user?.role === 'student' && (
              <button
                onClick={handleRequest}
                className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2 space-x-reverse"
              >
                <MessageCircle className="h-5 w-5" />
                <span>أريد هذه الشقة - التواصل عبر الإدارة</span>
              </button>
            )}
          </div>
        </div>

        {/* Comments Section */}
        <div className="mt-12">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">التعليقات</h2>

            {user?.role === 'student' && (
              <form onSubmit={handleAddComment} className="mb-6">
                <div className="flex space-x-4 space-x-reverse">
                  <div className="flex-1">
                    <textarea
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                      placeholder="أضف تعليقاً..."
                      rows={3}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-2 space-x-reverse"
                  >
                    <Send className="h-4 w-4" />
                    <span>إرسال</span>
                  </button>
                </div>
              </form>
            )}

            {comments.length > 0 ? (
              <div className="space-y-4">
                {comments.map((comment) => (
                  <div key={comment.id} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center space-x-2 space-x-reverse mb-2">
                      <User className="h-5 w-5 text-gray-400" />
                      <span className="font-medium text-gray-800">طالب</span>
                      <span className="text-gray-500 text-sm">
                        {new Date(comment.createdAt).toLocaleDateString('ar-EG')}
                      </span>
                    </div>
                    <p className="text-gray-700">{comment.content}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500">لا توجد تعليقات بعد</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApartmentDetails;