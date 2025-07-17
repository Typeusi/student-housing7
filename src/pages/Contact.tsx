import React, { useState } from 'react';
import { Mail, Phone, MapPin, MessageCircle, Send, Clock, Shield } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Contact: React.FC = () => {
  const { addContactMessage } = useApp();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // إضافة الرسالة إلى قاعدة البيانات
    addContactMessage({
      name: formData.name,
      email: formData.email,
      subject: formData.subject,
      message: formData.message
    });
    
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 3000);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">تواصل معنا</h1>
            <p className="text-gray-600">نحن هنا لمساعدتك في أي وقت</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Contact Form */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">أرسل لنا رسالة</h2>
              
              {submitted ? (
                <div className="text-center py-8">
                  <div className="bg-green-100 rounded-full p-4 w-16 h-16 mx-auto mb-4">
                    <Send className="h-8 w-8 text-green-600 mx-auto" />
                  </div>
                  <h3 className="text-lg font-semibold text-green-800 mb-2">تم الإرسال بنجاح!</h3>
                  <p className="text-green-600">شكراً لك، سنرد عليك قريباً</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        الاسم
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="اسمك الكامل"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        البريد الإلكتروني
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        placeholder="your@email.com"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                      الموضوع
                    </label>
                    <select
                      id="subject"
                      name="subject"
                      required
                      value={formData.subject}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="">اختر الموضوع</option>
                      <option value="account">مشكلة في الحساب</option>
                      <option value="apartment">استفسار عن شقة</option>
                      <option value="payment">مشكلة في الدفع</option>
                      <option value="technical">مشكلة تقنية</option>
                      <option value="suggestion">اقتراح أو تحسين</option>
                      <option value="other">أخرى</option>
                    </select>
                  </div>
                  
                  <div>
                    <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                      الرسالة
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      required
                      value={formData.message}
                      onChange={handleInputChange}
                      rows={5}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                      placeholder="اكتب رسالتك هنا..."
                    />
                  </div>
                  
                  <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2 space-x-reverse"
                  >
                    <Send className="h-5 w-5" />
                    <span>إرسال الرسالة</span>
                  </button>
                </form>
              )}
            </div>

            {/* Contact Information */}
            <div className="space-y-6">
              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">معلومات التواصل</h2>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3 space-x-reverse">
                    <div className="bg-blue-100 rounded-full p-2">
                      <Mail className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">البريد الإلكتروني</h3>
                      <p className="text-gray-600">support@student-housing.com</p>
                      <p className="text-sm text-gray-500">نرد خلال 24 ساعة</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 space-x-reverse">
                    <div className="bg-green-100 rounded-full p-2">
                      <Phone className="h-5 w-5 text-green-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">الهاتف</h3>
                      <p className="text-gray-600">+20 123 456 7890</p>
                      <p className="text-sm text-gray-500">الأحد - الخميس: 9:00 - 18:00</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3 space-x-reverse">
                    <div className="bg-purple-100 rounded-full p-2">
                      <MapPin className="h-5 w-5 text-purple-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-800">العنوان</h3>
                      <p className="text-gray-600">شارع التحرير، وسط البلد</p>
                      <p className="text-sm text-gray-500">القاهرة، مصر</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow-md p-6">
                <h2 className="text-xl font-semibold text-gray-800 mb-4">ساعات العمل</h2>
                <div className="space-y-3">
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-800">الأحد - الخميس</p>
                      <p className="text-sm text-gray-600">9:00 صباحاً - 6:00 مساءً</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-800">الجمعة</p>
                      <p className="text-sm text-gray-600">2:00 مساءً - 6:00 مساءً</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2 space-x-reverse">
                    <Clock className="h-5 w-5 text-gray-400" />
                    <div>
                      <p className="font-medium text-gray-800">السبت</p>
                      <p className="text-sm text-gray-600">مغلق</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-blue-50 rounded-lg p-6">
                <div className="flex items-center space-x-2 space-x-reverse mb-3">
                  <Shield className="h-6 w-6 text-blue-600" />
                  <h3 className="font-semibold text-blue-800">نحن نضمن لك</h3>
                </div>
                <ul className="space-y-2 text-sm text-blue-700">
                  <li>• الرد السريع على جميع الاستفسارات</li>
                  <li>• حماية كاملة لبياناتك الشخصية</li>
                  <li>• دعم فني متخصص 24/7</li>
                  <li>• حلول مخصصة لكل مشكلة</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;