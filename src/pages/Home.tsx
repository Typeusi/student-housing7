import React from 'react';
import { Link } from 'react-router-dom';
import { Building, Users, Shield, Search, MapPin, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useApp } from '../context/AppContext';

const Home: React.FC = () => {
  const { isAuthenticated, user } = useAuth();
  const { apartments } = useApp();
  const approvedApartments = apartments.filter(apt => apt.approved);

  const features = [
    {
      icon: <Shield className="h-8 w-8 text-blue-600" />,
      title: 'أمان وثقة',
      description: 'جميع الشقق وأصحابها معتمدون من قبل الإدارة'
    },
    {
      icon: <Search className="h-8 w-8 text-green-600" />,
      title: 'سهولة البحث',
      description: 'ابحث عن الشقة المناسبة لك بسهولة'
    },
    {
      icon: <Users className="h-8 w-8 text-purple-600" />,
      title: 'تواصل آمن',
      description: 'تواصل مع أصحاب الشقق عبر الإدارة'
    },
    {
      icon: <MapPin className="h-8 w-8 text-orange-600" />,
      title: 'مواقع مميزة',
      description: 'شقق قريبة من الجامعات والمواصلات'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-br from-blue-600 via-blue-700 to-purple-700 text-white">
        <div className="container mx-auto px-4 py-16">
          <div className="text-center">
            <div className="flex justify-center mb-6">
              <Building className="h-16 w-16 text-white" />
            </div>
            <h1 className="text-4xl md:text-6xl font-bold mb-4">
              سكن الطلاب
            </h1>
            <p className="text-xl md:text-2xl mb-8 opacity-90">
              منصة آمنة لحجز الشقق المناسبة للطلاب
            </p>
            <div className="flex items-center justify-center space-x-4 space-x-reverse">
              {!isAuthenticated ? (
                <Link
                  to="/auth"
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  ابدأ الآن
                </Link>
              ) : user?.role === 'student' ? (
                <Link
                  to="/apartments"
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  تصفح الشقق
                </Link>
              ) : user?.role === 'owner' ? (
                <Link
                  to="/add-apartment"
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  أضف شقتك
                </Link>
              ) : (
                <Link
                  to="/admin-dashboard"
                  className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  لوحة التحكم
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">
            لماذا تختار منصتنا؟
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            نوفر لك منصة آمنة ومريحة للعثور على السكن المناسب مع ضمان الجودة والأمان
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div key={index} className="text-center p-6 bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="flex justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Sample Apartments */}
      {approvedApartments.length > 0 && (
        <div className="bg-white py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800 mb-4">
                شقق مميزة
              </h2>
              <p className="text-gray-600">
                اطلع على بعض من الشقق المتاحة في المنصة
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {approvedApartments.slice(0, 3).map((apartment) => (
                <div key={apartment.id} className="bg-gray-50 rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow">
                  <img
                    src={apartment.images[0] || 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg'}
                    alt={apartment.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      {apartment.title}
                    </h3>
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="h-4 w-4 ml-1" />
                      <span className="text-sm">{apartment.address}</span>
                    </div>
                    <p className="text-gray-600 text-sm mb-4">
                      {apartment.description.substring(0, 100)}...
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="text-xl font-bold text-blue-600">
                        {apartment.rent} ج.م
                        <span className="text-sm font-normal text-gray-500">/شهر</span>
                      </div>
                      <div className="flex items-center text-green-600">
                        <CheckCircle className="h-4 w-4 ml-1" />
                        <span className="text-sm">معتمد</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            {isAuthenticated && user?.role === 'student' && (
              <div className="text-center mt-8">
                <Link
                  to="/apartments"
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
                >
                  عرض جميع الشقق
                </Link>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CTA Section */}
      <div className="bg-gray-800 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">
            هل أنت مالك عقار؟
          </h2>
          <p className="text-gray-300 mb-8 max-w-2xl mx-auto">
            انضم إلى منصتنا وعرض شقتك للطلاب مع ضمان الأمان والجودة
          </p>
          {!isAuthenticated ? (
            <Link
              to="/auth"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              سجل كمالك عقار
            </Link>
          ) : user?.role === 'owner' ? (
            <Link
              to="/add-apartment"
              className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              أضف شقتك الآن
            </Link>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default Home;