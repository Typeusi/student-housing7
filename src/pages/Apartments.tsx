import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, MapPin, Building } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import ApartmentCard from '../components/ApartmentCard';

const Apartments: React.FC = () => {
  const navigate = useNavigate();
  const { apartments, addApartmentRequest } = useApp();
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'private' | 'shared'>('all');
  const [maxRent, setMaxRent] = useState<number>(5000);

  const approvedApartments = apartments.filter(apt => apt.approved);
  
  const filteredApartments = approvedApartments.filter(apartment => {
    const matchesSearch = apartment.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         apartment.address.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         apartment.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = filterType === 'all' || apartment.type === filterType;
    const matchesRent = apartment.rent <= maxRent;
    
    return matchesSearch && matchesType && matchesRent;
  });

  const handleViewDetails = (apartmentId: string) => {
    navigate(`/apartment/${apartmentId}`);
  };

  const handleRequest = (apartmentId: string) => {
    if (user) {
      addApartmentRequest({
        studentId: user.id,
        apartmentId: apartmentId,
        status: 'pending'
      });
      
      alert('تم إرسال طلبك بنجاح! سيتم التواصل معك من قبل الإدارة قريباً.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">الشقق المتاحة</h1>
          <p className="text-gray-600">اعثر على الشقة المناسبة لك</p>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <div className="grid md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                البحث
              </label>
              <div className="relative">
                <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <input
                  type="text"
                  placeholder="ابحث عن شقة..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                نوع السكن
              </label>
              <div className="relative">
                <Filter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <select
                  value={filterType}
                  onChange={(e) => setFilterType(e.target.value as 'all' | 'private' | 'shared')}
                  className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">جميع الأنواع</option>
                  <option value="private">فردي</option>
                  <option value="shared">مشترك</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                الحد الأقصى للإيجار: {maxRent} ج.م
              </label>
              <input
                type="range"
                min="500"
                max="10000"
                step="100"
                value={maxRent}
                onChange={(e) => setMaxRent(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        </div>

        {/* Results Summary */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-2 space-x-reverse text-gray-600">
            <Building className="h-5 w-5" />
            <span>
              {filteredApartments.length} شقة متاحة
              {searchTerm && ` من أصل ${approvedApartments.length} شقة`}
            </span>
          </div>
        </div>

        {/* Apartments Grid */}
        {filteredApartments.length > 0 ? (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredApartments.map((apartment) => (
              <ApartmentCard
                key={apartment.id}
                apartment={apartment}
                onViewDetails={handleViewDetails}
                onRequest={handleRequest}
                showRequestButton={user?.role === 'student'}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <Building className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-600 mb-2">
              لم يتم العثور على شقق
            </h3>
            <p className="text-gray-500">
              {searchTerm 
                ? 'جرب تعديل مصطلحات البحث أو الفلاتر' 
                : 'لا توجد شقق متاحة حالياً'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Apartments;