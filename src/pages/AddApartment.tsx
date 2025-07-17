import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building, MapPin, DollarSign, FileText } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { useAuth } from '../context/AuthContext';
import ImageUpload from '../components/ImageUpload';

const AddApartment: React.FC = () => {
  const navigate = useNavigate();
  const { addApartment } = useApp();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    address: '',
    description: '',
    rent: '',
    type: 'private' as 'private' | 'shared'
  });
  const [images, setImages] = useState<string[]>(['']);
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validImages = images.filter(img => img && img.trim() !== '');
      
      if (validImages.length === 0) {
        alert('يجب إضافة صورة واحدة على الأقل');
        setLoading(false);
        return;
      }

      addApartment({
        ownerId: user!.id,
        title: formData.title,
        address: formData.address,
        description: formData.description,
        rent: parseInt(formData.rent),
        images: validImages,
        type: formData.type,
        approved: false
      });

      alert('تم إضافة الشقة بنجاح! سيتم مراجعتها من قبل الإدارة قبل النشر.');
      navigate('/');
    } catch (error) {
      alert('حدث خطأ أثناء إضافة الشقة');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-800 mb-2">إضافة شقة جديدة</h1>
            <p className="text-gray-600">أضف شقتك للمنصة وستتم مراجعتها من قبل الإدارة</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">المعلومات الأساسية</h2>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    عنوان الشقة
                  </label>
                  <div className="relative">
                    <Building className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="text"
                      id="title"
                      name="title"
                      required
                      value={formData.title}
                      onChange={handleInputChange}
                      className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="مثال: شقة مميزة بجوار الجامعة"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="rent" className="block text-sm font-medium text-gray-700 mb-2">
                    الإيجار الشهري (ج.م)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                    <input
                      type="number"
                      id="rent"
                      name="rent"
                      required
                      min="0"
                      value={formData.rent}
                      onChange={handleInputChange}
                      className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      placeholder="2500"
                    />
                  </div>
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                  عنوان الشقة
                </label>
                <div className="relative">
                  <MapPin className="absolute right-3 top-3 text-gray-400 h-5 w-5" />
                  <textarea
                    id="address"
                    name="address"
                    required
                    value={formData.address}
                    onChange={handleInputChange}
                    rows={2}
                    className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    placeholder="الشارع، المنطقة، المدينة"
                  />
                </div>
              </div>

              <div className="mt-4">
                <label htmlFor="type" className="block text-sm font-medium text-gray-700 mb-2">
                  نوع السكن
                </label>
                <select
                  id="type"
                  name="type"
                  required
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="private">فردي</option>
                  <option value="shared">مشترك</option>
                </select>
              </div>

              <div className="mt-4">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  وصف الشقة
                </label>
                <div className="relative">
                  <FileText className="absolute right-3 top-3 text-gray-400 h-5 w-5" />
                  <textarea
                    id="description"
                    name="description"
                    required
                    value={formData.description}
                    onChange={handleInputChange}
                    rows={4}
                    className="w-full pr-10 pl-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
                    placeholder="وصف مفصل للشقة يشمل عدد الغرف، المرافق، المميزات..."
                  />
                </div>
              </div>
            </div>

            {/* Images */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <ImageUpload
                images={images}
                onImagesChange={setImages}
                maxImages={5}
              />
            </div>

            {/* Submit Button */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-gray-600">
                  <p>سيتم مراجعة الشقة من قبل الإدارة قبل النشر</p>
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'جاري الحفظ...' : 'إضافة الشقة'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AddApartment;