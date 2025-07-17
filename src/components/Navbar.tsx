import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, User, Building, MessageCircle, LogOut, Shield } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar: React.FC = () => {
  const location = useLocation();
  const { user, logout, isAuthenticated } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg border-b-2 border-blue-100">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link to="/" className="flex items-center space-x-2 space-x-reverse">
            <Building className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-800">سكن الطلاب</span>
          </Link>

          <div className="flex items-center space-x-4 space-x-reverse">
            {isAuthenticated ? (
              <>
                <Link
                  to="/"
                  className={`flex items-center space-x-1 space-x-reverse px-3 py-2 rounded-lg transition-colors ${
                    isActive('/') 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <Home className="h-5 w-5" />
                  <span>الرئيسية</span>
                </Link>

                {user?.role === 'student' && (
                  <Link
                    to="/apartments"
                    className={`flex items-center space-x-1 space-x-reverse px-3 py-2 rounded-lg transition-colors ${
                      isActive('/apartments') 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <Building className="h-5 w-5" />
                    <span>الشقق</span>
                  </Link>
                )}

                {user?.role === 'owner' && (
                  <Link
                    to="/add-apartment"
                    className={`flex items-center space-x-1 space-x-reverse px-3 py-2 rounded-lg transition-colors ${
                      isActive('/add-apartment') 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <Building className="h-5 w-5" />
                    <span>إضافة شقة</span>
                  </Link>
                )}

                {user?.role === 'admin' && (
                  <Link
                    to="/admin-dashboard"
                    className={`flex items-center space-x-1 space-x-reverse px-3 py-2 rounded-lg transition-colors ${
                      isActive('/admin-dashboard') 
                        ? 'bg-blue-100 text-blue-700' 
                        : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                    }`}
                  >
                    <Shield className="h-5 w-5" />
                    <span>لوحة التحكم</span>
                  </Link>
                )}

                <Link
                  to="/contact"
                  className={`flex items-center space-x-1 space-x-reverse px-3 py-2 rounded-lg transition-colors ${
                    isActive('/contact') 
                      ? 'bg-blue-100 text-blue-700' 
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <MessageCircle className="h-5 w-5" />
                  <span>تواصل معنا</span>
                </Link>

                <div className="flex items-center space-x-2 space-x-reverse">
                  <div className="flex items-center space-x-2 space-x-reverse px-3 py-2 bg-gray-100 rounded-lg">
                    <User className="h-5 w-5 text-gray-600" />
                    <span className="text-sm text-gray-700">{user.name}</span>
                    <span className="text-xs text-gray-500 bg-gray-200 px-2 py-1 rounded">
                      {user.role === 'admin' ? 'أدمن' : user.role === 'student' ? 'طالب' : 'مالك'}
                    </span>
                  </div>
                  <button
                    onClick={logout}
                    className="flex items-center space-x-1 space-x-reverse px-3 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <LogOut className="h-5 w-5" />
                    <span>تسجيل الخروج</span>
                  </button>
                </div>
              </>
            ) : (
              <Link
                to="/auth"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
              >
                تسجيل الدخول
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;