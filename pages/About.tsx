
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Leaf, ShieldCheck, Heart, ChevronRight, Loader2, BookOpen, User as UserIcon, ArrowLeft } from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext.tsx';
import { geminiService } from '../services/geminiService.ts';

interface Article {
  title: string;
  description: string;
}

const AboutSection: React.FC<{
  id: string;
  icon: React.ReactNode;
  title: string;
  desc: string;
  onShowArticles: (topic: string) => void;
  loading: boolean;
  isActive: boolean;
}> = ({ icon, title, desc, onShowArticles, loading, isActive }) => {
  const { language } = useLanguage();
  return (
    <div className={`p-8 rounded-[32px] border transition-all duration-500 ${isActive ? 'bg-emerald-50 border-emerald-200 shadow-lg' : 'bg-white border-stone-100 hover:shadow-md'}`}>
      <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6">
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-slate-900 mb-4">{title}</h3>
      <p className="text-slate-500 leading-relaxed mb-8">{desc}</p>
      <button 
        onClick={() => onShowArticles(title)}
        disabled={loading}
        className="flex items-center gap-2 text-emerald-600 font-bold hover:gap-3 transition-all disabled:opacity-50"
      >
        {loading ? <Loader2 className="animate-spin" size={20} /> : <Sparkles size={20} />}
        {language === 'bn' ? 'AI পরামর্শ দেখুন' : 'Explore AI Articles'}
        <ChevronRight size={18} />
      </button>
    </div>
  );
};

const About: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  const [activeTopic, setActiveTopic] = useState<string | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(false);

  const handleShowArticles = async (topic: string) => {
    setActiveTopic(topic);
    setLoading(true);
    const results = await geminiService.getSectionArticles(topic, language);
    setArticles(results);
    setLoading(false);
  };

  const strings = {
    bn: {
      title: 'আমাদের সম্পর্কে',
      subtitle: 'আমরা শুধু দুধ উৎপাদন করি না, স্বাস্থ্যকর ভবিষ্যতের স্বপ্ন বুনি।',
      heroDesc: 'ইকোর ডেইরি খামার একটি আধুনিক ও আদর্শ খামার হিসেবে পরিচিত। আমরা আমাদের গাভীদের খাবার থেকে শুরু করে দুধ প্যাকেটজাত করা পর্যন্ত প্রতিটি পর্যায়ে বিশুদ্ধতা বজায় রাখি।',
      sections: [
        { id: 'feed', icon: <Leaf />, title: 'প্রাকৃতিক খাদ্য ব্যবস্থা', desc: 'গাভীরা শুধুমাত্র সবুজ ঘাস ও পুষ্টিকর খড় খায় যা আমরা নিজেদের জমিতে চাষ করি।' },
        { id: 'quality', icon: <ShieldCheck />, title: 'কঠোর মান নিয়ন্ত্রণ', desc: 'প্রতিদিন ল্যাবে দুধের বিশুদ্ধতা পরীক্ষা করা হয় যেন কোনো ভেজাল না থাকে।' },
        { id: 'community', icon: <Heart />, title: 'সামাজিক প্রভাব', desc: 'আমরা স্থানীয় কৃষকদের প্রশিক্ষণ দেই এবং কর্মসংস্থানের সুযোগ সৃষ্টি করি।' }
      ],
      leadershipTitle: 'আমাদের নেতৃত্ব',
      ownerLabel: 'খামার মালিক ও প্রতিষ্ঠাতা',
      adminLabel: 'সিস্টেম এডমিন',
      articleHeader: 'বিশেষজ্ঞ প্রবন্ধসমূহ',
      readMore: 'আরও পড়ুন',
      back: 'ফিরে যান',
      closeArticles: 'আর্টিকেল বন্ধ করুন'
    },
    en: {
      title: 'About Us',
      subtitle: 'We don\'t just produce milk; we nurture a healthy future.',
      heroDesc: 'EcoDairy Farm is recognized as a modern model farm. We maintain purity at every stage, from cattle feed to the final packaging.',
      sections: [
        { id: 'feed', icon: <Leaf />, title: 'Natural Feeding', desc: 'Our cows consume only organic green grass and nutritious fodder grown on our fields.' },
        { id: 'quality', icon: <ShieldCheck />, title: 'Strict Quality Control', desc: 'Milk is tested daily in our labs to ensure zero contamination or additives.' },
        { id: 'community', icon: <Heart />, title: 'Community Impact', desc: 'We provide training to local farmers and create sustainable employment opportunities.' }
      ],
      leadershipTitle: 'Our Leadership',
      ownerLabel: 'Farm Owner & Founder',
      adminLabel: 'System Administrator',
      articleHeader: 'Expert AI Articles',
      readMore: 'Read Full Article',
      back: 'Go Back',
      closeArticles: 'Close Articles'
    }
  };

  const s = strings[language];

  return (
    <div className="min-h-screen pt-32 pb-20 bg-stone-50/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Navigation Back Button */}
        <div className="mb-8">
          <button 
            onClick={() => activeTopic ? setActiveTopic(null) : navigate(-1)}
            className="flex items-center gap-2 text-slate-500 hover:text-emerald-600 font-bold transition-all group"
          >
            <div className="w-8 h-8 rounded-full bg-white border border-stone-200 flex items-center justify-center group-hover:border-emerald-200 group-hover:bg-emerald-50">
              <ArrowLeft size={16} />
            </div>
            {activeTopic ? s.closeArticles : s.back}
          </button>
        </div>

        <div className="text-center mb-20 max-w-3xl mx-auto">
          <h1 className="text-5xl font-extrabold text-slate-900 mb-6 tracking-tight">{s.title}</h1>
          <p className="text-xl text-emerald-600 font-medium mb-4">{s.subtitle}</p>
          <p className="text-lg text-slate-500 leading-relaxed">{s.heroDesc}</p>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-24">
          {s.sections.map((section) => (
            <AboutSection 
              key={section.id}
              id={section.id}
              icon={section.icon}
              title={section.title}
              desc={section.desc}
              loading={loading && activeTopic === section.title}
              isActive={activeTopic === section.title}
              onShowArticles={handleShowArticles}
            />
          ))}
        </div>

        {/* Leadership Section */}
        <div className="mb-24 py-16 bg-white rounded-[40px] border border-stone-100 shadow-sm px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-slate-900">{s.leadershipTitle}</h2>
          </div>
          <div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
            <div className="flex flex-col items-center text-center group">
              <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-emerald-600 mb-4 group-hover:scale-110 transition-transform">
                <UserIcon size={40} />
              </div>
              <h4 className="text-xl font-bold text-slate-900">মোঃ মুক্তারুল হক</h4>
              <p className="text-emerald-600 font-medium text-sm">{s.ownerLabel}</p>
            </div>
            <div className="flex flex-col items-center text-center group">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                <ShieldCheck size={40} />
              </div>
              <h4 className="text-xl font-bold text-slate-900">রাফি নাহিয়ান</h4>
              <p className="text-blue-600 font-medium text-sm">{s.adminLabel}</p>
            </div>
          </div>
        </div>

        {activeTopic && (
          <div className="animate-in fade-in slide-in-from-bottom-10 duration-700">
            <div className="flex items-center gap-4 mb-10 border-b border-stone-200 pb-6">
              <div className="w-12 h-12 bg-emerald-600 text-white rounded-xl flex items-center justify-center">
                <BookOpen size={24} />
              </div>
              <h2 className="text-3xl font-bold text-slate-900">{s.articleHeader}: {activeTopic}</h2>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {loading ? (
                [1, 2, 3].map(i => (
                  <div key={i} className="bg-white p-8 rounded-3xl border border-stone-100 h-64 animate-pulse" />
                ))
              ) : (
                articles.map((article, idx) => (
                  <div key={idx} className="bg-white p-8 rounded-[32px] border border-stone-100 shadow-sm hover:shadow-xl hover:shadow-emerald-100/50 transition-all group">
                    <h4 className="text-xl font-bold text-slate-900 mb-4 group-hover:text-emerald-600 transition-colors">{article.title}</h4>
                    <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-2">{article.description}</p>
                    <a href="#" className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400 group-hover:text-emerald-500 transition-colors">
                      {s.readMore} <ChevronRight size={14} />
                    </a>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default About;
