import React, { useState, useRef } from 'react';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface ImageUploadProps {
  images: string[];
  onImagesChange: (images: string[]) => void;
  maxImages?: number;
}

const ImageUpload: React.FC<ImageUploadProps> = ({ 
  images, 
  onImagesChange, 
  maxImages = 5 
}) => {
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setUploading(true);

    try {
      const newImages: string[] = [];
      
      for (let i = 0; i < files.length && images.length + newImages.length < maxImages; i++) {
        const file = files[i];
        
        // التحقق من نوع الملف
        if (!file.type.startsWith('image/')) {
          alert('يرجى اختيار ملفات صور فقط');
          continue;
        }

        // التحقق من حجم الملف (5MB max)
        if (file.size > 5 * 1024 * 1024) {
          alert('حجم الصورة يجب أن يكون أقل من 5 ميجابايت');
          continue;
        }

        // تحويل الصورة إلى base64
        const base64 = await convertToBase64(file);
        newImages.push(base64);
      }

      if (newImages.length > 0) {
        onImagesChange([...images, ...newImages]);
      }
    } catch (error) {
      alert('حدث خطأ أثناء رفع الصور');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const convertToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = error => reject(error);
    });
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    onImagesChange(newImages);
  };

  const addImageUrl = () => {
    const url = prompt('أدخل رابط الصورة:');
    if (url && url.trim()) {
      onImagesChange([...images, url.trim()]);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-800">صور الشقة</h3>
        <span className="text-sm text-gray-500">
          {images.length} / {maxImages} صور
        </span>
      </div>

      {/* عرض الصور المرفوعة */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((image, index) => (
            <div key={index} className="relative group">
              <img
                src={image}
                alt={`صورة ${index + 1}`}
                className="w-full h-32 object-cover rounded-lg border border-gray-300"
              />
              <button
                type="button"
                onClick={() => removeImage(index)}
                className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* أزرار الرفع */}
      {images.length < maxImages && (
        <div className="space-y-3">
          <div className="flex gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="flex items-center space-x-2 space-x-reverse px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              <Upload className="h-5 w-5" />
              <span>{uploading ? 'جاري الرفع...' : 'رفع من الجهاز'}</span>
            </button>

            <button
              type="button"
              onClick={addImageUrl}
              className="flex items-center space-x-2 space-x-reverse px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <ImageIcon className="h-5 w-5" />
              <span>إضافة رابط</span>
            </button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            onChange={handleFileSelect}
            className="hidden"
          />

          <p className="text-sm text-gray-500">
            يمكنك رفع الصور من جهازك أو إضافة روابط الصور. الحد الأقصى {maxImages} صور، كل صورة أقل من 5 ميجابايت.
          </p>
        </div>
      )}

      {/* صور تجريبية */}
      <div className="mt-4 p-3 bg-blue-50 rounded-lg">
        <p className="text-sm text-blue-800 mb-2">روابط صور تجريبية:</p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
          {[
            'https://images.pexels.com/photos/1571460/pexels-photo-1571460.jpeg',
            'https://images.pexels.com/photos/1571468/pexels-photo-1571468.jpeg',
            'https://images.pexels.com/photos/1571463/pexels-photo-1571463.jpeg',
            'https://images.pexels.com/photos/1571473/pexels-photo-1571473.jpeg'
          ].map((url, index) => (
            <button
              key={index}
              type="button"
              onClick={() => onImagesChange([...images, url])}
              disabled={images.length >= maxImages}
              className="text-xs text-blue-600 hover:text-blue-800 bg-white p-2 rounded border truncate text-left disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {url}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ImageUpload;