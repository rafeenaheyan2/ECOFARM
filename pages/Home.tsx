
import React from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, ShieldCheck, Leaf, Heart, Mail, Phone, MapPin, ShoppingBag } from 'lucide-react';
import { PUBLIC_GALLERY } from '../constants.ts';
import { useLanguage } from '../contexts/LanguageContext.tsx';

const Home: React.FC = () => {
  const { t, language } = useLanguage();
  
  // Safe extraction of features
  const featureItems = t('features.items');
  const featuresList = Array.isArray(featureItems) ? featureItems : [];

  return (
    <div className="flex flex-col gap-24 pb-24">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute top-0 right-0 w-1/2 h-full bg-blue-50/50 -z-10 rounded-bl-[100px] hidden lg:block" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold mb-6">
                {t('hero.badge')}
              </span>
              <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 leading-tight mb-6 tracking-tighter">
                {language === 'bn' ? (
                  <>খামার থেকে সরাসরি <span className="text-blue-600">খাঁটি দুধ</span> আপনার টেবিলে।</>
                ) : (
                  <>Directly <span className="text-blue-600">Pure Milk</span> to your table.</>
                )}
              </h1>
              <p className="text-lg text-slate-600 mb-8 leading-relaxed max-w-lg">
                {t('hero.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/login" className="bg-blue-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center gap-2">
                  {t('hero.cta_primary')} <ChevronRight size={20} />
                </Link>
                <Link to="/gallery" className="bg-white text-slate-700 border border-stone-200 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-stone-50 transition-all flex items-center justify-center gap-2">
                  {t('hero.cta_secondary')} <ShoppingBag size={20} />
                </Link>
              </div>
            </div>
            <div className="relative">
              <img 
                src="https://images.unsplash.com/photo-1596733430284-f7437764b1a9?q=80&w=1200&h=900&fit=crop" 
                alt="Farm Cow" 
                className="rounded-[40px] shadow-2xl w-full object-cover aspect-[4/3] ring-8 ring-white"
              />
              <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-stone-100 hidden sm:block">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center">
                    <Heart size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 font-medium">{t('hero.stat_title')}</p>
                    <p className="text-lg font-bold text-slate-900">{t('hero.stat_value')}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-slate-900 mb-4 tracking-tight">{t('features.title')}</h2>
          <p className="text-slate-500 max-w-2xl mx-auto">{t('features.subtitle')}</p>
        </div>
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: <Leaf size={32} />, ...(featuresList[0] || {}) },
            { icon: <ShieldCheck size={32} />, ...(featuresList[1] || {}) },
            { icon: <MapPin size={32} />, ...(featuresList[2] || {}) }
          ].map((feature, i) => (
            <div key={i} className="bg-white p-10 rounded-[32px] shadow-sm border border-stone-100 hover:shadow-xl hover:shadow-blue-900/5 transition-all group">
              <div className="text-blue-600 mb-6 group-hover:scale-110 transition-transform">{feature.icon}</div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">{feature.title || 'Quality'}</h3>
              <p className="text-slate-500 leading-relaxed text-sm">{feature.desc || 'We ensure the highest standards in everything we do.'}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Gallery Preview */}
      <section id="gallery" className="bg-slate-900 py-24 text-white rounded-[60px] mx-4">
        <div className="max-w-7xl mx-auto px-8 sm:px-12 lg:px-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
            <div>
              <h2 className="text-4xl font-black mb-4 tracking-tight">{language === 'bn' ? 'আমাদের খামারের এক ঝলক' : 'A Glimpse of Our Farm'}</h2>
              <p className="text-slate-400 max-w-md">{language === 'bn' ? 'আধুনিক প্রযুক্তি ও প্রাকৃতিক পরিবেশের এক অপূর্ব সমন্বয় আমাদের এই ডেইরি খামার।' : 'A blend of modern technology and natural environment.'}</p>
            </div>
            <Link to="/gallery" className="text-blue-400 font-bold hover:text-blue-300 transition-colors flex items-center gap-2 bg-slate-800 px-6 py-3 rounded-xl">
              {language === 'bn' ? 'সব দেখুন' : 'View All'} <ChevronRight size={18} />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {PUBLIC_GALLERY.map((item) => (
              <div key={item.id} className="group relative overflow-hidden rounded-3xl aspect-square bg-slate-800">
                <img 
                  src={item.url} 
                  alt={item.title[language]} 
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 opacity-60 group-hover:opacity-100" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent opacity-0 group-hover:opacity-100 transition-opacity p-8 flex flex-col justify-end">
                  <h4 className="font-bold text-lg">{item.title[language]}</h4>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section Preview */}
      <section id="contact" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-[48px] shadow-2xl shadow-blue-900/5 overflow-hidden border border-stone-100">
          <div className="grid lg:grid-cols-2">
            <div className="p-10 lg:p-16">
              <h2 className="text-4xl font-black text-slate-900 mb-6 tracking-tight">{language === 'bn' ? 'অর্ডার বা জিজ্ঞাসার জন্য' : 'For Orders & Inquiries'}</h2>
              <p className="text-slate-500 mb-10">{language === 'bn' ? 'দুধের সাবস্ক্রিপশন বা হোম ডেলিভারির জন্য আমাদের সাথে যোগাযোগ করুন।' : 'Contact us for milk subscription or home delivery.'}</p>
              <form className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">{language === 'bn' ? 'আপনার নাম' : 'Your Name'}</label>
                    <input type="text" className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all" placeholder={language === 'bn' ? 'যেমন: রহিম আহমেদ' : 'e.g. John Doe'} />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">{language === 'bn' ? 'ফোন নম্বর' : 'Phone Number'}</label>
                    <input type="tel" className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all" placeholder="01XXXXXXXXX" />
                  </div>
                </div>
                <div>
                  <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">{language === 'bn' ? 'ঠিকানা ও বার্তার বিবরণ' : 'Address & Message Details'}</label>
                  <textarea rows={4} className="w-full px-5 py-4 rounded-2xl bg-slate-50 border border-transparent focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-50 outline-none transition-all" placeholder={language === 'bn' ? 'আপনার ঠিকানা লিখুন...' : 'Write your address and requirements...'} />
                </div>
                <button type="submit" className="w-full bg-blue-600 text-white font-bold py-5 rounded-2xl hover:bg-blue-700 transition-all shadow-xl shadow-blue-200">
                  {language === 'bn' ? 'বার্তা পাঠান' : 'Send Message'}
                </button>
              </form>
            </div>
            <div className="bg-slate-50 p-10 lg:p-16 flex flex-col justify-center gap-10">
              <div className="flex gap-6">
                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-stone-100 flex items-center justify-center text-blue-600">
                  <Phone size={28} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">{language === 'bn' ? 'কল করুন' : 'Call Us'}</p>
                  <p className="text-xl font-bold text-slate-900">০১৭২৭-৩৮৭৭০৬</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-stone-100 flex items-center justify-center text-blue-600">
                  <Mail size={28} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">{language === 'bn' ? 'ইমেইল' : 'Email'}</p>
                  <p className="text-xl font-bold text-slate-900">info@ecodairy.farm</p>
                </div>
              </div>
              <div className="flex gap-6">
                <div className="w-14 h-14 bg-white rounded-2xl shadow-sm border border-stone-100 flex items-center justify-center text-blue-600">
                  <MapPin size={28} />
                </div>
                <div>
                  <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-1">{language === 'bn' ? 'অবস্থান' : 'Location'}</p>
                  <p className="text-xl font-bold text-slate-900">{language === 'bn' ? 'সাভার, ঢাকা' : 'Savar, Dhaka'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
