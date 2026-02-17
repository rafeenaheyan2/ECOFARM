
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, Phone, MapPin, Send, MessageCircle, User as UserIcon, ShieldCheck, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext.tsx';

const ContactCard: React.FC<{
  icon: React.ReactNode;
  role: string;
  name: string;
  phone: string;
  whatsapp?: string;
  color: string;
}> = ({ icon, role, name, phone, whatsapp, color }) => {
  return (
    <div className={`p-8 rounded-[32px] border bg-white shadow-sm hover:shadow-xl transition-all duration-300 border-stone-100 group`}>
      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110 ${color}`}>
        {icon}
      </div>
      <p className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">{role}</p>
      <h3 className="text-2xl font-bold text-slate-900 mb-6">{name}</h3>
      
      <div className="space-y-4">
        <a href={`tel:${phone}`} className="flex items-center gap-3 text-slate-600 hover:text-emerald-600 transition-colors">
          <Phone size={18} className="text-emerald-500" />
          <span className="font-medium">{phone}</span>
        </a>
        {whatsapp && (
          <a href={`https://wa.me/${whatsapp}`} target="_blank" rel="noreferrer" className="flex items-center gap-3 text-slate-600 hover:text-green-600 transition-colors">
            <MessageCircle size={18} className="text-green-500" />
            <span className="font-medium">{whatsapp} (WhatsApp)</span>
          </a>
        )}
      </div>
    </div>
  );
};

const Contact: React.FC = () => {
  const { language } = useLanguage();
  const navigate = useNavigate();

  const strings = {
    bn: {
      title: 'যোগাযোগ করুন',
      subtitle: 'আমাদের বিশেষজ্ঞ টিম সর্বদা আপনার সেবায় নিয়োজিত।',
      owner: 'খামার মালিক',
      admin: 'এডমিন / সিস্টেম ম্যানেজার',
      formTitle: 'সরাসরি বার্তা পাঠান',
      name: 'আপনার নাম',
      email: 'ইমেইল এড্রেস',
      message: 'বার্তার বিষয়বস্তু',
      submit: 'বার্তা পাঠান',
      addressLabel: 'আমাদের খামার',
      addressValue: 'সাভার, ঢাকা, বাংলাদেশ',
      back: 'ফিরে যান'
    },
    en: {
      title: 'Contact Us',
      subtitle: 'Our expert team is always ready to assist you.',
      owner: 'Farm Owner',
      admin: 'Admin / System Manager',
      formTitle: 'Send a Direct Message',
      name: 'Your Name',
      email: 'Email Address',
      message: 'Message Content',
      submit: 'Send Message',
      addressLabel: 'Our Farm',
      addressValue: 'Savar, Dhaka, Bangladesh',
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
          <h1 className="text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">{s.title}</h1>
          <p className="text-lg text-slate-500 max-w-2xl mx-auto">{s.subtitle}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-20">
          <ContactCard 
            icon={<UserIcon size={28} />}
            role={s.owner}
            name="মোঃ মুক্তারুল হক"
            phone="01727387706"
            color="bg-emerald-100 text-emerald-600"
          />
          <ContactCard 
            icon={<ShieldCheck size={28} />}
            role={s.admin}
            name="রাফি নাহিয়ান (rafeenaheyan)"
            phone="01304652352"
            whatsapp="01590018360"
            color="bg-blue-100 text-blue-600"
          />
        </div>

        <div className="bg-white rounded-[40px] border border-stone-100 shadow-sm overflow-hidden grid lg:grid-cols-5">
          <div className="lg:col-span-3 p-8 md:p-12">
            <h3 className="text-2xl font-bold text-slate-900 mb-8">{s.formTitle}</h3>
            <form className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">{s.name}</label>
                  <input type="text" className="w-full px-5 py-4 rounded-2xl border border-stone-200 outline-none focus:ring-2 focus:ring-emerald-500 transition-all bg-stone-50/30" placeholder="e.g. Rahim Ahmed" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">{s.email}</label>
                  <input type="email" className="w-full px-5 py-4 rounded-2xl border border-stone-200 outline-none focus:ring-2 focus:ring-emerald-500 transition-all bg-stone-50/30" placeholder="rahim@example.com" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">{s.message}</label>
                <textarea rows={5} className="w-full px-5 py-4 rounded-2xl border border-stone-200 outline-none focus:ring-2 focus:ring-emerald-500 transition-all bg-stone-50/30" placeholder="Write your requirements here..." />
              </div>
              <button type="button" className="bg-emerald-600 text-white px-10 py-4 rounded-xl font-bold hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-200 flex items-center gap-2">
                {s.submit}
                <Send size={18} />
              </button>
            </form>
          </div>
          <div className="lg:col-span-2 bg-emerald-900 p-8 md:p-12 text-white flex flex-col justify-center">
            <div className="space-y-10">
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="font-bold text-emerald-400 text-sm uppercase tracking-widest mb-1">{s.addressLabel}</p>
                  <p className="text-lg text-emerald-50 font-medium">{s.addressValue}</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="w-12 h-12 bg-white/10 rounded-xl flex items-center justify-center shrink-0">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="font-bold text-emerald-400 text-sm uppercase tracking-widest mb-1">Email Support</p>
                  <p className="text-lg text-emerald-50 font-medium">info@ecodairy.farm</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;
