import React from 'react';
import { MapPin, Eye, MessageCircle } from 'lucide-react';
import { Apartment } from '../types';

interface ApartmentCardProps {
  apartment: Apartment;
  onViewDetails: (id: string) => void;
  onRequest?: (id: string) => void;
  showRequestButton?: boolean;
}

const ApartmentCard: React.FC<ApartmentCardProps> = ({ 
  apartment, 
  onViewDetails, 
  onRequest, 
  showRequestButton = false 
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative">
        <img
          src={apartment.images[0] || 'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg'}
          alt={apartment.title}
          className="w-full h-48 object-cover"
        />
        <div className="absolute top-2 right-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            apartment.type === 'private' 
              ? 'bg-blue-100 text-blue-800' 
              : 'bg-green-100 text-green-800'
          }`}>
            {apartment.type === 'private' ? 'فردي' : 'مشترك'}
          </span>
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{apartment.title}</h3>
        
        <div className="flex items-center text-gray-600 mb-2">
          <MapPin className="h-4 w-4 ml-1" />
          <span className="text-sm">{apartment.address}</span>
        </div>
        
        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
          {apartment.description}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="text-xl font-bold text-blue-600">
            {apartment.rent} ج.م
            <span className="text-sm font-normal text-gray-500">/شهر</span>
          </div>
          
          <div className="flex items-center space-x-2 space-x-reverse">
            <button
              onClick={() => onViewDetails(apartment.id)}
              className="flex items-center space-x-1 space-x-reverse px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Eye className="h-4 w-4" />
              <span>عرض التفاصيل</span>
            </button>
            
            {showRequestButton && onRequest && (
              <button
                onClick={() => onRequest(apartment.id)}
                className="flex items-center space-x-1 space-x-reverse px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <MessageCircle className="h-4 w-4" />
                <span>أريد هذه الشقة</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApartmentCard;