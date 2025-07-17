import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { User, Mail, Lock, Phone, MapPin, CreditCard, BookOpen } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Auth: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [userType, setUserType] = useState<'student' | 'owner'>('student');
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    nationalId: '',
    universityId: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, register, isAuthenticated } = useAuth();

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (isLogin) {
        const success = await login(formData.email, formData.password);
        if (!success) {
          setError('بيانات الدخول غير صحيحة أو الحساب غير مفعل');
        }
      } else {
        if (userType === 'student' && !formData.universityId) {
          setError('يجب إدخال الرقم الجامعي للطلاب');
          setLoading(false);
          return;
        }
        if (userType === 'owner' && (!formData.phone || !formData.address)) {
          setError('يجب إدخال رقم الهاتف والعنوان لملاك العقارات');
          setLoading(false);
          return;
        }

        const success = await register({
          name: formData.name,
          email: formData.email,
          role: userType,
          nationalId: formData.nationalId,
          universityId: userType === 'student' ? formData.universityId : undefined,
          phone: userType === 'owner' ? formData.phone : undefined,
          address: userType === 'owner' ? formData.address : undefined
        }, formData.password);

        if (success) {
          setError('تم إنشاء الحساب بنجاح. سيتم تفعيله بعد موافقة الإدارة');
          setIsLogin(true);
          setFormData({
            name: '',
            email: '',
            password: '',
            phone: '',
            nationalId: '',
            universityId: '',
            address: ''
          });
        } else {
          setError('هذا البريد الإلكتروني مستخدم بالفعل');
        }
      }
    } catch (err) {
      setError('حدث خطأ، يرجى المحاولة مرة أخرى');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {isLogin ? 'تسجيل الدخول' : 'إنشاء حساب جديد'}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {isLogin ? 'مرحباً بك مرة أخرى' : 'انضم إلى منصة سكن الطلاب'}
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          {!isLogin && (
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نوع الحساب
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setUserType('student')}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    userType === 'student'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <BookOpen className="h-5 w-5 mx-auto mb-1" />
                  <span className="text-sm font-medium">طالب</span>
                </button>
                <button
                  type="button"
                  onClick={() => setUserType('owner')}
                  className={`p-3 rounded-lg border-2 transition-colors ${
                    userType === 'owner'
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                >
                  <User className="h-5 w-5 mx-auto mb-1" />
                  <span className="text-sm font-medium">مالك عقار</span>
                </button>
              </div>
            </div>
          )}

          <div className="space-y-4">
            {!isLogin && (
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  الاسم الكامل
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required={!isLogin}
                    value={formData.name}
                    onChange={handleInputChange}
                    className="appearance-none rounded-lg relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                    placeholder="أدخل اسمك الكامل"
                  />
                </div>
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                البريد الإلكتروني
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleInputChange}
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="أدخل بريدك الإلكتروني"
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                كلمة المرور
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={handleInputChange}
                  className="appearance-none rounded-lg relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                  placeholder="أدخل كلمة المرور"
                />
              </div>
            </div>

            {!isLogin && (
              <>
                <div>
                  <label htmlFor="nationalId" className="block text-sm font-medium text-gray-700">
                    الرقم القومي
                  </label>
                  <div className="mt-1 relative">
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                      <CreditCard className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      id="nationalId"
                      name="nationalId"
                      type="text"
                      required={!isLogin}
                      value={formData.nationalId}
                      onChange={handleInputChange}
                      className="appearance-none rounded-lg relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                      placeholder="أدخل الرقم القومي"
                    />
                  </div>
                </div>

                {userType === 'student' && (
                  <div>
                    <label htmlFor="universityId" className="block text-sm font-medium text-gray-700">
                      الرقم الجامعي
                    </label>
                    <div className="mt-1 relative">
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                        <BookOpen className="h-5 w-5 text-gray-400" />
                      </div>
                      <input
                        id="universityId"
                        name="universityId"
                        type="text"
                        required={userType === 'student'}
                        value={formData.universityId}
                        onChange={handleInputChange}
                        className="appearance-none rounded-lg relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                        placeholder="أدخل الرقم الجامعي"
                      />
                    </div>
                  </div>
                )}

                {userType === 'owner' && (
                  <>
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700">
                        رقم الهاتف
                      </label>
                      <div className="mt-1 relative">
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <Phone className="h-5 w-5 text-gray-400" />
                        </div>
                        <input
                          id="phone"
                          name="phone"
                          type="tel"
                          required={userType === 'owner'}
                          value={formData.phone}
                          onChange={handleInputChange}
                          className="appearance-none rounded-lg relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                          placeholder="أدخل رقم الهاتف"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                        العنوان
                      </label>
                      <div className="mt-1 relative">
                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                          <MapPin className="h-5 w-5 text-gray-400" />
                        </div>
                        <textarea
                          id="address"
                          name="address"
                          required={userType === 'owner'}
                          value={formData.address}
                          onChange={handleInputChange}
                          rows={3}
                          className="appearance-none rounded-lg relative block w-full px-3 py-2 pr-10 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm"
                          placeholder="أدخل عنوانك"
                        />
                      </div>
                    </div>
                  </>
                )}
              </>
            )}
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-sm text-red-600">{error}</p>
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'جاري التحميل...' : (isLogin ? 'تسجيل الدخول' : 'إنشاء الحساب')}
            </button>
          </div>

          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError('');
                setFormData({
                  name: '',
                  email: '',
                  password: '',
                  phone: '',
                  nationalId: '',
                  universityId: '',
                  address: ''
                });
              }}
              className="text-blue-600 hover:text-blue-500 text-sm"
            >
              {isLogin ? 'ليس لديك حساب؟ إنشاء حساب جديد' : 'لديك حساب؟ تسجيل الدخول'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Auth;