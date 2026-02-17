
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useSearchParams, Link } from 'react-router-dom';
import { 
  Eye, 
  EyeOff, 
  Lock, 
  Mail, 
  Milk, 
  ArrowLeft,
  CheckCircle2,
  ChevronDown,
  ShieldCheck,
  Store,
  User as UserIcon,
  Camera,
  Phone,
  MessageCircle,
  FileUp,
  MapPin,
  UserCircle
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext.tsx';
import { UserRole } from '../types.ts';
import { useToast } from '../contexts/ToastContext.tsx';

interface LoginProps {
  onLogin: (role: UserRole) => void;
}

type View = 'LOGIN' | 'SIGNUP' | 'FORGOT_PASSWORD';

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialRole = (searchParams.get('role') as UserRole) || 'CUSTOMER';
  
  const [currentRole, setCurrentRole] = useState<UserRole>(initialRole);
  const [view, setView] = useState<View>('LOGIN');
  const [showPassword, setShowPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotSuccess, setForgotSuccess] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { language } = useLanguage();
  const { showToast } = useToast();

  useEffect(() => {
    const roleParam = searchParams.get('role') as UserRole | null;
    if (roleParam && roleParam !== currentRole) {
      setCurrentRole(roleParam);
    }
  }, [searchParams]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsRoleDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    setIsRoleDropdownOpen(false);
    setSearchParams({ role });
  };

  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(currentRole);
    showToast(language === 'bn' ? 'লগইন সফল হয়েছে!' : 'Login successful!', 'SUCCESS');
    navigate('/dashboard');
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSignupSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const password = formData.get('password');
    const confirmPassword = formData.get('confirmPassword');

    if (password !== confirmPassword) {
      showToast(language === 'bn' ? 'পাসওয়ার্ড মেলেনি!' : 'Passwords do not match!', 'ERROR');
      return;
    }

    const userData = Object.fromEntries(formData.entries());
    localStorage.setItem('temp_user', JSON.stringify(userData));

    showToast(language === 'bn' ? 'অ্যাকাউন্ট তৈরি সফল হয়েছে!' : 'Account created successfully!', 'SUCCESS');
    setView('LOGIN');
  };

  const handleForgotSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (forgotEmail) {
      setForgotSuccess(true);
      showToast(language === 'bn' ? 'পাসওয়ার্ড রিসেট লিংক পাঠানো হয়েছে।' : 'Reset link sent!', 'SUCCESS');
      setTimeout(() => {
        setForgotSuccess(false);
        setView('LOGIN');
      }, 3000);
    }
  };

  const strings = {
    bn: {
      loginTitle: 'লগইন করুন',
      signupTitle: 'অ্যাকাউন্ট তৈরি করুন',
      forgotTitle: 'পাসওয়ার্ড পুনরুদ্ধার',
      email: 'ইমেইল এড্রেস',
      pass: 'পাসওয়ার্ড',
      confirmPass: 'পাসওয়ার্ড নিশ্চিত করুন',
      fullName: 'পুরো নাম',
      username: 'ইউজারনেম',
      mobile: 'মোবাইল নম্বর',
      whatsapp: 'হোয়াটসঅ্যাপ নম্বর',
      businessName: 'ব্যবসার নাম',
      businessAddress: 'ব্যবসার ঠিকানা',
      nidFront: 'NID সামনের অংশ',
      nidBack: 'NID পিছনের অংশ',
      forgot: 'পাসওয়ার্ড ভুলে গেছেন?',
      submit: 'প্রবেশ করুন',
      signup: 'নিবন্ধন করুন',
      back: 'ফিরে যান',
      noAccount: 'অ্যাকাউন্ট নেই?',
      haveAccount: 'ইতিমধ্যে অ্যাকাউন্ট আছে?',
      remember: 'মনে রাখুন',
      admin: 'এডমিন',
      entrepreneur: 'উদ্যোক্তা',
      customer: 'গ্রাহক',
      forgotMsg: 'আপনার ইমেইলে পাসওয়ার্ড রিসেট লিংক পাঠানো হয়েছে।',
      resetBtn: 'লিংক পাঠান',
      selectRole: 'রোল পরিবর্তন করুন',
      homeBack: 'হোমে ফিরে যান',
      photoLabel: 'আপনার ছবি',
      upload: 'আপলোড করুন'
    },
    en: {
      loginTitle: 'Sign In',
      signupTitle: 'Create Account',
      forgotTitle: 'Forgot Password',
      email: 'Email Address',
      pass: 'Password',
      confirmPass: 'Confirm Password',
      fullName: 'Full Name',
      username: 'Username',
      mobile: 'Mobile Number',
      whatsapp: 'WhatsApp Number',
      businessName: 'Business Name',
      businessAddress: 'Business Address',
      nidFront: 'NID Front Side',
      nidBack: 'NID Back Side',
      forgot: 'Forgot password?',
      submit: 'Sign In',
      signup: 'Sign Up',
      back: 'Back',
      noAccount: "Don't have an account?",
      haveAccount: 'Already have an account?',
      remember: 'Remember me',
      admin: 'Admin',
      entrepreneur: 'Entrepreneur',
      customer: 'Customer',
      forgotMsg: 'A password reset link has been sent to your email.',
      resetBtn: 'Send Reset Link',
      selectRole: 'Change Role',
      homeBack: 'Back to Home',
      photoLabel: 'Your Photo',
      upload: 'Upload'
    }
  };

  const t = strings[language];
  const isExternalRole = currentRole === 'ENTREPRENEUR' || currentRole === 'CUSTOMER';

  const roleIcons = {
    ADMIN: <ShieldCheck size={18} />,
    ENTREPRENEUR: <Store size={18} />,
    CUSTOMER: <UserIcon size={18} />
  };

  return (
    <div className="min-h-screen bg-emerald-50/30 flex flex-col items-center justify-center p-4 pt-24 pb-12">
      <div className={`w-full ${view === 'SIGNUP' ? 'max-w-2xl' : 'max-w-md'}`}>
        
        <div className="mb-6 flex justify-start">
          <Link to="/" className="flex items-center gap-2 text-slate-400 hover:text-emerald-600 font-medium text-sm transition-colors group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            {t.homeBack}
          </Link>
        </div>

        <div className="text-center mb-6">
          <div className="flex justify-center mb-4">
            <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200">
              <Milk className="text-white" size={32} />
            </div>
          </div>
          
          <div className="relative inline-block mb-2" ref={dropdownRef}>
            <button 
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="flex items-center gap-2 px-4 py-1.5 bg-white border border-stone-200 rounded-full text-xs font-bold uppercase tracking-wider text-emerald-700 shadow-sm hover:border-emerald-300 transition-all"
            >
              <span className="text-emerald-500">{roleIcons[currentRole]}</span>
              {currentRole}
              <ChevronDown size={14} className={`transition-transform ${isRoleDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            
            {isRoleDropdownOpen && (
              <div className="absolute left-1/2 -translate-x-1/2 mt-2 w-48 bg-white rounded-2xl shadow-xl border border-stone-100 py-2 z-20 animate-in fade-in zoom-in-95 duration-200">
                {(['ADMIN', 'ENTREPRENEUR', 'CUSTOMER'] as UserRole[]).map((r) => (
                  <button
                    key={r}
                    onClick={() => handleRoleChange(r)}
                    className={`w-full flex items-center gap-3 px-4 py-2 text-sm font-medium transition-colors ${currentRole === r ? 'text-emerald-600 bg-emerald-50' : 'text-slate-600 hover:bg-slate-50'}`}
                  >
                    {roleIcons[r]}
                    {r}
                  </button>
                ))}
              </div>
            )}
          </div>

          <h1 className="text-3xl font-bold text-slate-900 mt-2 tracking-tight">
            {view === 'LOGIN' ? t.loginTitle : view === 'SIGNUP' ? t.signupTitle : t.forgotTitle}
          </h1>
        </div>

        <div className="bg-white p-8 rounded-[32px] shadow-xl shadow-emerald-900/5 border border-stone-100 relative overflow-hidden">
          {forgotSuccess && (
            <div className="absolute inset-0 bg-white z-10 flex flex-col items-center justify-center p-8 text-center animate-in fade-in duration-300">
              <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                <CheckCircle2 size={32} />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-2">{language === 'bn' ? 'সফল হয়েছে!' : 'Success!'}</h3>
              <p className="text-slate-500">{t.forgotMsg}</p>
            </div>
          )}

          {view === 'LOGIN' && (
            <form onSubmit={handleLoginSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">{t.email}</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Mail size={18} />
                  </div>
                  <input
                    type="email"
                    required
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all bg-stone-50/50"
                    placeholder="name@example.com"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-sm font-medium text-slate-700">{t.pass}</label>
                  {isExternalRole && (
                    <button type="button" onClick={() => setView('FORGOT_PASSWORD')} className="text-sm font-medium text-emerald-600 hover:underline">{t.forgot}</button>
                  )}
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                    <Lock size={18} />
                  </div>
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    className="w-full pl-10 pr-12 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all bg-stone-50/50"
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <div className="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" className="h-4 w-4 text-emerald-600 focus:ring-emerald-500 border-stone-300 rounded" />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-700">
                  {t.remember}
                </label>
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 active:scale-[0.98]"
              >
                {t.submit}
              </button>

              {isExternalRole && (
                <p className="mt-8 text-center text-slate-600 text-sm">
                  {t.noAccount} <button type="button" onClick={() => setView('SIGNUP')} className="font-bold text-emerald-600 hover:underline">{t.signup}</button>
                </p>
              )}
            </form>
          )}

          {view === 'SIGNUP' && isExternalRole && (
            <form onSubmit={handleSignupSubmit} className="space-y-8">
              <div className="flex flex-col items-center gap-4 py-4">
                <div className="relative group">
                  <div className="w-24 h-24 rounded-full bg-emerald-50 border-2 border-dashed border-emerald-200 flex items-center justify-center overflow-hidden">
                    {photoPreview ? (
                      <img src={photoPreview} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <UserCircle size={48} className="text-emerald-200" />
                    )}
                  </div>
                  <label className="absolute bottom-0 right-0 w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white cursor-pointer shadow-lg hover:bg-emerald-700 transition-colors">
                    <Camera size={16} />
                    <input type="file" name="photo" accept="image/*" className="hidden" onChange={handlePhotoChange} />
                  </label>
                </div>
                <p className="text-sm font-bold text-emerald-600">{t.photoLabel}</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b pb-2">{language === 'bn' ? 'ব্যক্তিগত তথ্য' : 'Personal Info'}</h3>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">{t.fullName}</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <UserIcon size={16} />
                      </div>
                      <input name="fullName" type="text" required className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-200 outline-none focus:ring-2 focus:ring-emerald-500 transition-all bg-stone-50/50" placeholder="John Doe" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">{t.email}</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Mail size={16} />
                      </div>
                      <input name="email" type="email" required className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-200 outline-none focus:ring-2 focus:ring-emerald-500 transition-all bg-stone-50/50" placeholder="john@example.com" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">{t.mobile}</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Phone size={16} />
                      </div>
                      <input name="mobile" type="tel" required className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-200 outline-none focus:ring-2 focus:ring-emerald-500 transition-all bg-stone-50/50" placeholder="01XXXXXXXXX" />
                    </div>
                  </div>
                </div>

                <div className="space-y-4">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-slate-400 border-b pb-2">{language === 'bn' ? 'নিরাপত্তা' : 'Security'}</h3>
                  
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">{t.username}</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <UserCircle size={16} />
                      </div>
                      <input name="username" type="text" required className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-200 outline-none focus:ring-2 focus:ring-emerald-500 transition-all bg-stone-50/50" placeholder="johndoe123" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">{t.pass}</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Lock size={16} />
                      </div>
                      <input name="password" type={showPassword ? 'text' : 'password'} required className="w-full pl-9 pr-10 py-2.5 rounded-xl border border-stone-200 outline-none focus:ring-2 focus:ring-emerald-500 transition-all bg-stone-50/50" placeholder="••••••••" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-3 flex items-center text-slate-400">
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">{t.confirmPass}</label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                        <Lock size={16} />
                      </div>
                      <input name="confirmPassword" type="password" required className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-200 outline-none focus:ring-2 focus:ring-emerald-500 transition-all bg-stone-50/50" placeholder="••••••••" />
                    </div>
                  </div>
                </div>
              </div>

              {currentRole === 'ENTREPRENEUR' && (
                <div className="animate-in fade-in slide-in-from-top-4 duration-300 space-y-6 pt-4 border-t">
                  <h3 className="text-xs font-bold uppercase tracking-widest text-emerald-600">{language === 'bn' ? 'ব্যবসা সংক্রান্ত তথ্য' : 'Business Details'}</h3>
                  
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">{t.businessName}</label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                          <Store size={16} />
                        </div>
                        <input name="businessName" type="text" className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-200 outline-none focus:ring-2 focus:ring-emerald-500 transition-all bg-stone-50/50" placeholder="My Dairy Shop" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-bold text-slate-700 mb-1">{t.businessAddress}</label>
                      <div className="relative">
                        <div className="absolute top-3 left-0 pl-3 flex pointer-events-none text-slate-400">
                          <MapPin size={16} />
                        </div>
                        <textarea name="businessAddress" rows={1} className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-200 outline-none focus:ring-2 focus:ring-emerald-500 transition-all bg-stone-50/50" placeholder="123 Farm St, Dhaka"></textarea>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <button
                type="submit"
                className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 mt-4 active:scale-[0.98]"
              >
                {t.signup}
              </button>

              <p className="mt-4 text-center text-slate-600 text-sm">
                {t.haveAccount} <button type="button" onClick={() => setView('LOGIN')} className="font-bold text-emerald-600 hover:underline">{t.loginTitle}</button>
              </p>
            </form>
          )}

          {view === 'FORGOT_PASSWORD' && isExternalRole && (
            <form onSubmit={handleForgotSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">{t.email}</label>
                <input
                  type="email"
                  required
                  value={forgotEmail}
                  onChange={(e) => setForgotEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-stone-200 focus:ring-2 focus:ring-emerald-500 outline-none transition-all bg-stone-50/50"
                  placeholder="name@example.com"
                />
              </div>

              <button
                type="submit"
                className="w-full bg-emerald-600 text-white font-bold py-4 rounded-xl hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 active:scale-[0.98]"
              >
                {t.resetBtn}
              </button>

              <button type="button" onClick={() => setView('LOGIN')} className="w-full text-center text-slate-600 font-medium hover:text-emerald-600 flex items-center justify-center gap-2">
                <ArrowLeft size={16} /> {t.back}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default Login;
