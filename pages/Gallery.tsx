
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Eye, Image as ImageIcon, Sparkles, ArrowLeft } from 'lucide-react';
import { PUBLIC_GALLERY } from '../constants.ts';
import { useLanguage } from '../contexts/LanguageContext.tsx';

interface GalleryProps {
  isLoggedIn: boolean;
  onProtectedAction: (target: string) => void;
}

const Gallery: React.FC<GalleryProps> = ({ isLoggedIn, onProtectedAction }) => {
  const { language } = useLanguage();
  const navigate = useNavigate();
  
  const strings = {
    bn: {
      title: 'খামার গ্যালারি',
      subtitle: 'আমাদের খামারের মনোরম পরিবেশ ও কার্যক্রমের এক ঝলক।',
      public: 'পাবলিক গ্যালারি',
      private: 'প্রাইভেট আর্কাইভস',
      privateDesc: 'এই সেকশনটি শুধুমাত্র নিবন্ধিত সদস্যদের জন্য।',
      lockedBtn: 'লগইন করে দেখুন',
      unlockedBtn: 'আর্কাইভ খুলুন',
      back: 'ফিরে যান'
    },
    en: {
      title: 'Farm Gallery',
      subtitle: 'A glimpse of our farm\'s beautiful environment and daily activities.',
      public: 'Public Showcase',
      private: 'Private Archives',
      privateDesc: 'This section is reserved for registered members only.',
      lockedBtn: 'Login to Access',
      unlockedBtn: 'Open Archives',
      back: 'Go Back'
    }
  };

  const s = strings[language];

  return (
    <div className="min-h-screen pt-32 pb-20 bg-stone-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Back Button */}
        <div className="mb-8">
          <button 
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 font-bold transition-all group"
          >
            <div className="w-8 h-8 rounded-full bg-white border border-stone-200 flex items-center justify-center group-hover:border-emerald-200 group-hover:bg-emerald-50">
              <ArrowLeft size={16} />
            </div>
            {s.back}
          </button>
        </div>

        <div className="text-center mb-16">
          <h1 className="text-4xl font-extrabold text-slate-900 mb-4 tracking-tight">{s.title}</h1>
          <p className="text-slate-500">{s.subtitle}</p>
        </div>

        <div className="mb-20">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center">
              <Eye size={20} />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">{s.public}</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PUBLIC_GALLERY.map((item) => (
              <div key={item.id} className="group relative overflow-hidden rounded-3xl aspect-[4/5] bg-white shadow-sm hover:shadow-xl transition-all border border-stone-100">
                <img 
                  src={item.url} 
                  alt={item.title[language]} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex flex-col justify-end">
                  <h4 className="font-bold text-white text-lg">{item.title[language]}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="relative">
          <div className="bg-emerald-900 rounded-[40px] p-12 text-center text-white overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-800 rounded-full -mr-32 -mt-32 opacity-20 blur-3xl" />
            <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-600 rounded-full -ml-32 -mb-32 opacity-20 blur-3xl" />
            
            <div className="relative z-10 max-w-lg mx-auto">
              <div className="w-16 h-16 bg-white/10 backdrop-blur-md rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Lock className="text-emerald-400" size={32} />
              </div>
              <h2 className="text-3xl font-bold mb-4">{s.private}</h2>
              <p className="text-emerald-100/70 mb-8">{s.privateDesc}</p>
              <button 
                onClick={() => onProtectedAction('private-gallery')}
                className="bg-white text-emerald-900 px-8 py-4 rounded-xl font-bold hover:bg-emerald-50 transition-colors flex items-center justify-center gap-2 mx-auto"
              >
                {isLoggedIn ? s.unlockedBtn : s.lockedBtn}
                {isLoggedIn ? <Sparkles size={18} /> : <Lock size={18} />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Gallery;
