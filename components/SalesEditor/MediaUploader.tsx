import React, { useRef } from 'react';
import { SalesPage } from '../../types/salesPage';
import { Image as ImageIcon, Trash2, Plus } from 'lucide-react';

interface MediaUploaderProps {
  data: SalesPage;
  onChange: <K extends keyof SalesPage>(field: K, value: SalesPage[K]) => void;
}

const MediaUploader: React.FC<MediaUploaderProps> = ({ data, onChange }) => {
  const heroInputRef = useRef<HTMLInputElement>(null);
  const galleryInputRef = useRef<HTMLInputElement>(null);

  const handleHeroUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => onChange('heroImage', reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleGalleryUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange('galleryImages', [...data.galleryImages, reader.result as string]);
      };
      reader.readAsDataURL(file);
    }
  };

  const removeGalleryImage = (index: number) => {
    const newImages = [...data.galleryImages];
    newImages.splice(index, 1);
    onChange('galleryImages', newImages);
  };

  return (
    <div className="space-y-6">
      {/* Hero Image */}
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2 dark:text-slate-300">Hero Image</label>
        <div 
          onClick={() => heroInputRef.current?.click()}
          className="relative w-full h-48 border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 hover:bg-emerald-50 hover:border-emerald-400 transition-all cursor-pointer flex flex-col items-center justify-center overflow-hidden group dark:bg-slate-700/50 dark:border-slate-600 dark:hover:bg-slate-700 dark:hover:border-emerald-500"
        >
          {data.heroImage ? (
            <>
              <img src={data.heroImage} alt="Hero" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="text-white font-bold text-sm">Change Image</span>
              </div>
            </>
          ) : (
            <div className="text-center text-slate-400 dark:text-slate-500">
              <ImageIcon className="w-8 h-8 mx-auto mb-2" />
              <span className="text-sm font-medium">Click to upload main image</span>
            </div>
          )}
          <input ref={heroInputRef} type="file" className="hidden" accept="image/*" onChange={handleHeroUpload} />
        </div>
      </div>

      {/* Gallery */}
      <div>
        <label className="block text-sm font-bold text-slate-700 mb-2 dark:text-slate-300">Gallery</label>
        <div className="grid grid-cols-3 gap-3">
          {data.galleryImages.map((img, idx) => (
            <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-slate-200 group dark:border-slate-600">
              <img src={img} alt={`Gallery ${idx}`} className="w-full h-full object-cover" />
              <button 
                onClick={() => removeGalleryImage(idx)}
                className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Trash2 size={12} />
              </button>
            </div>
          ))}
          <button 
            onClick={() => galleryInputRef.current?.click()}
            className="aspect-square rounded-lg border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400 hover:text-emerald-600 hover:border-emerald-400 hover:bg-emerald-50 transition-all dark:border-slate-600 dark:text-slate-500 dark:hover:bg-slate-700 dark:hover:border-emerald-500"
          >
            <Plus size={24} />
          </button>
          <input ref={galleryInputRef} type="file" className="hidden" accept="image/*" onChange={handleGalleryUpload} />
        </div>
      </div>
    </div>
  );
};

export default MediaUploader;