
import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { 
  Menu, X, LogIn, LayoutDashboard, Milk, ChevronDown, 
  ShieldCheck, Store, User as UserIcon, Phone, Mail, 
  MapPin, Settings, UserCircle, Image as ImageIcon, 
  ShieldAlert, Globe, LogOut, ChevronRight
} from 'lucide-react';
import { useLanguage } from '../contexts/LanguageContext.tsx';
import { UserRole } from '../types.ts';
import { useToast } from '../contexts/ToastContext.tsx';

interface NavLinkProps {
  to: string;
  children: React.ReactNode;
  mobile?: boolean;
  onClick?: () => void;
}

const NavLink: React.FC<NavLinkProps> = ({ to, children, mobile, onClick }) => {
  const location = useLocation();
  const isActive = location.pathname === to;
  
  const baseStyles = "transition-colors duration-200 font-bold tracking-tight";
  const desktopStyles = isActive ? "text-blue-600" : "text-slate-500 hover:text-blue-600";
  const mobileStyles = `block px-4 py-2 rounded-xl ${isActive ? "bg-blue-50 text-blue-600" : "text-slate-600 hover:bg-slate-100"}`;

  return (
    <Link 
      to={to} 
      onClick={onClick}
      className={mobile ? mobileStyles : `${baseStyles} ${desktopStyles}`}
    >
      {children}
    </Link>
  );
};

export const Navbar: React.FC<{ isLoggedIn: boolean; onLogout: () => void; onProtectedAction: () => void }> = ({ isLoggedIn, onLogout, onProtectedAction }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoginDropdownOpen, setIsLoginDropdownOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { language, setLanguage, t } = useLanguage();
  const { showToast } = useToast();
  
  const userRole = localStorage.getItem('userRole') as UserRole;

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsLoginDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleRoleSelect = (role: UserRole) => {
    setIsLoginDropdownOpen(false);
    setIsOpen(false);
    navigate(`/login?role=${role}`);
  };

  const handleLogoutWithToast = () => {
    onLogout();
    setIsSettingsOpen(false);
    showToast(language === 'bn' ? 'লগআউট সফল হয়েছে।' : 'Logged out successfully.', 'SUCCESS');
    navigate('/');
  };

  const navigateToTab = (tab: string) => {
    setIsSettingsOpen(false);
    setIsOpen(false);
    onProtectedAction();
    // Use a small timeout to ensure navigation happens before tab switching logic (handled in dashboards via query params or state)
    // For simplicity, we assume the dashboard handles the redirect or the user manually navigates.
    // Realistically, you'd pass state: { activeTab: tab }
    setTimeout(() => {
       const event = new CustomEvent('changeTab', { detail: tab });
       window.dispatchEvent(event);
    }, 100);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          <div className="flex items-center gap-3 group">
            <div className="w-12 h-12 bg-blue-600 rounded-[18px] flex items-center justify-center shadow-xl shadow-blue-100 group-hover:scale-105 transition-transform duration-300">
              <Milk className="text-white" size={28} />
            </div>
            <Link to="/" className="text-2xl font-black text-slate-900 tracking-tighter">EcoDairy<span className="text-blue-600">.</span></Link>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {!isLoggedIn && <NavLink to="/">{t('nav.home')}</NavLink>}
            <NavLink to="/about">{t('nav.about')}</NavLink>
            <NavLink to="/gallery">{t('nav.gallery')}</NavLink>
            <NavLink to="/contact">{t('nav.contact')}</NavLink>
            
            <div className="flex items-center bg-slate-100 p-1.5 rounded-2xl border border-slate-200 ml-2">
              <button 
                onClick={() => setLanguage('bn')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all duration-300 ${language === 'bn' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                বাং
              </button>
              <button 
                onClick={() => setLanguage('en')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all duration-300 ${language === 'en' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400 hover:text-slate-600'}`}
              >
                EN
              </button>
            </div>

            {isLoggedIn ? (
              <div className="flex items-center gap-4 border-l pl-8 border-slate-200">
                <button 
                  onClick={onProtectedAction} 
                  className="flex items-center gap-2 text-slate-900 hover:text-blue-600 font-bold transition-colors"
                >
                  <LayoutDashboard size={20} />
                  {t('nav.dashboard')}
                </button>
                <button 
                  onClick={() => setIsSettingsOpen(true)}
                  className="p-2.5 bg-slate-100 text-slate-600 rounded-xl hover:bg-blue-600 hover:text-white transition-all shadow-sm"
                  title="Settings"
                >
                  <Settings size={22} />
                </button>
              </div>
            ) : (
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setIsLoginDropdownOpen(!isLoginDropdownOpen)}
                  className="flex items-center gap-2 bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all shadow-xl shadow-blue-100 active:scale-95"
                >
                  <LogIn size={20} />
                  {t('nav.login')}
                  <ChevronDown size={14} className={`transition-transform duration-300 ${isLoginDropdownOpen ? 'rotate-180' : ''}`} />
                </button>
                
                {isLoginDropdownOpen && (
                  <div className="absolute right-0 mt-4 w-64 bg-white rounded-3xl shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 py-3 animate-in fade-in zoom-in-95 duration-300 origin-top-right">
                    <button onClick={() => handleRoleSelect('ADMIN')} className="w-full flex items-center gap-4 px-5 py-3.5 text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all group">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                        <ShieldCheck size={20} />
                      </div>
                      <span className="font-bold text-sm">{t('nav.roles.admin')}</span>
                    </button>
                    <button onClick={() => handleRoleSelect('ENTREPRENEUR')} className="w-full flex items-center gap-4 px-5 py-3.5 text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all group">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                        <Store size={20} />
                      </div>
                      <span className="font-bold text-sm">{t('nav.roles.entrepreneur')}</span>
                    </button>
                    <button onClick={() => handleRoleSelect('CUSTOMER')} className="w-full flex items-center gap-4 px-5 py-3.5 text-slate-600 hover:bg-blue-50 hover:text-blue-600 transition-all group">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-blue-100 transition-colors">
                        <UserIcon size={20} />
                      </div>
                      <span className="font-bold text-sm">{t('nav.roles.customer')}</span>
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="md:hidden flex items-center gap-4">
            <button onClick={() => setIsOpen(!isOpen)} className="text-slate-900 p-2 bg-slate-100 rounded-xl">
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 py-6 space-y-2 animate-in slide-in-from-top duration-300">
          {!isLoggedIn && <NavLink to="/" mobile onClick={() => setIsOpen(false)}>{t('nav.home')}</NavLink>}
          <NavLink to="/about" mobile onClick={() => setIsOpen(false)}>{t('nav.about')}</NavLink>
          <NavLink to="/gallery" mobile onClick={() => setIsOpen(false)}>{t('nav.gallery')}</NavLink>
          <NavLink to="/contact" mobile onClick={() => setIsOpen(false)}>{t('nav.contact')}</NavLink>
          <hr className="my-4 border-slate-100" />
          {isLoggedIn ? (
            <div className="space-y-2">
              <button 
                onClick={() => { onProtectedAction(); setIsOpen(false); }}
                className="w-full text-left px-4 py-3 bg-blue-50 text-blue-600 rounded-xl font-bold flex items-center gap-2"
              >
                <LayoutDashboard size={20} /> {t('nav.dashboard')}
              </button>
              <button 
                onClick={() => setIsSettingsOpen(true)}
                className="w-full text-left px-4 py-3 bg-slate-50 text-slate-600 rounded-xl font-bold flex items-center gap-2"
              >
                <Settings size={20} /> {language === 'bn' ? 'সেটিংস' : 'Settings'}
              </button>
              <button 
                onClick={() => { handleLogoutWithToast(); setIsOpen(false); }}
                className="w-full text-left px-4 py-3 text-red-600 bg-red-50 rounded-xl font-bold"
              >
                {t('nav.logout')}
              </button>
            </div>
          ) : (
            <div className="space-y-2 pt-2">
              <p className="px-4 py-2 text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{t('nav.login')}</p>
              <button onClick={() => handleRoleSelect('ADMIN')} className="w-full text-left px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-xl font-bold">{t('nav.roles.admin')}</button>
              <button onClick={() => handleRoleSelect('ENTREPRENEUR')} className="w-full text-left px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-xl font-bold">{t('nav.roles.entrepreneur')}</button>
              <button onClick={() => handleRoleSelect('CUSTOMER')} className="w-full text-left px-4 py-3 text-slate-700 hover:bg-slate-50 rounded-xl font-bold">{t('nav.roles.customer')}</button>
            </div>
          )}
        </div>
      )}

      {/* Settings Modal */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-300" onClick={() => setIsSettingsOpen(false)} />
          <div className="relative w-full max-w-lg bg-white rounded-[40px] shadow-2xl overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-10 duration-500">
            <div className="p-8 border-b border-slate-100 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600 text-white rounded-xl flex items-center justify-center">
                  <Settings size={24} />
                </div>
                <div>
                  <h3 className="text-xl font-black text-slate-900">{language === 'bn' ? 'সেটিংস ও এডিট' : 'Settings & Edit'}</h3>
                  <p className="text-slate-500 text-xs font-bold uppercase tracking-widest">{userRole} Account</p>
                </div>
              </div>
              <button onClick={() => setIsSettingsOpen(false)} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-200 rounded-xl transition-all">
                <X size={24} />
              </button>
            </div>

            <div className="p-8 grid grid-cols-1 sm:grid-cols-2 gap-4">
              <button 
                onClick={() => navigateToTab('profile')}
                className="flex items-center gap-4 p-5 rounded-3xl bg-slate-50 hover:bg-blue-50 border border-transparent hover:border-blue-200 transition-all group"
              >
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <UserCircle size={24} />
                </div>
                <div className="text-left">
                  <p className="font-bold text-slate-900 text-sm">{language === 'bn' ? 'প্রোফাইল এডিট' : 'Edit Profile'}</p>
                  <p className="text-xs text-slate-500">{language === 'bn' ? 'নাম ও ইমেইল' : 'Name & Email'}</p>
                </div>
              </button>

              {userRole === 'ENTREPRENEUR' && (
                <button 
                  onClick={() => navigateToTab('business')}
                  className="flex items-center gap-4 p-5 rounded-3xl bg-slate-50 hover:bg-emerald-50 border border-transparent hover:border-emerald-200 transition-all group"
                >
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                    <Store size={24} />
                  </div>
                  <div className="text-left">
                    <p className="font-bold text-slate-900 text-sm">{language === 'bn' ? 'ব্যবসা তথ্য' : 'Business Info'}</p>
                    <p className="text-xs text-slate-500">{language === 'bn' ? 'ঠিকানা ও NID' : 'Address & NID'}</p>
                  </div>
                </button>
              )}

              {userRole === 'ADMIN' && (
                <>
                  <button 
                    onClick={() => navigateToTab('users')}
                    className="flex items-center gap-4 p-5 rounded-3xl bg-slate-50 hover:bg-blue-50 border border-transparent hover:border-blue-200 transition-all group"
                  >
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <ShieldCheck size={24} />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-slate-900 text-sm">{language === 'bn' ? 'ইউজার কন্ট্রোল' : 'Users Control'}</p>
                      <p className="text-xs text-slate-500">{language === 'bn' ? 'অ্যাকাউন্ট রিমুভ' : 'Manage Accounts'}</p>
                    </div>
                  </button>
                  <button 
                    onClick={() => navigateToTab('content')}
                    className="flex items-center gap-4 p-5 rounded-3xl bg-slate-50 hover:bg-orange-50 border border-transparent hover:border-orange-200 transition-all group"
                  >
                    <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                      <ImageIcon size={24} />
                    </div>
                    <div className="text-left">
                      <p className="font-bold text-slate-900 text-sm">{language === 'bn' ? 'কন্টেন্ট এডিট' : 'Edit Content'}</p>
                      <p className="text-xs text-slate-500">{language === 'bn' ? 'গ্যালারি ও পোস্ট' : 'Gallery & Posts'}</p>
                    </div>
                  </button>
                </>
              )}

              <button 
                onClick={() => setLanguage(language === 'bn' ? 'en' : 'bn')}
                className="flex items-center gap-4 p-5 rounded-3xl bg-slate-50 hover:bg-purple-50 border border-transparent hover:border-purple-200 transition-all group"
              >
                <div className="w-12 h-12 bg-purple-100 text-purple-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <Globe size={24} />
                </div>
                <div className="text-left">
                  <p className="font-bold text-slate-900 text-sm">{language === 'bn' ? 'ভাষা পরিবর্তন' : 'Change Language'}</p>
                  <p className="text-xs text-slate-500">{language === 'bn' ? 'English এ যান' : 'Switch to Bengali'}</p>
                </div>
              </button>

              <button 
                onClick={handleLogoutWithToast}
                className="flex items-center gap-4 p-5 rounded-3xl bg-red-50 hover:bg-red-100 border border-transparent hover:border-red-200 transition-all group sm:col-span-2"
              >
                <div className="w-12 h-12 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform">
                  <LogOut size={24} />
                </div>
                <div className="text-left">
                  <p className="font-bold text-red-600 text-sm">{language === 'bn' ? 'লগআউট করুন' : 'Logout'}</p>
                  <p className="text-xs text-red-500/70">{language === 'bn' ? 'সেশন শেষ করুন' : 'End current session'}</p>
                </div>
                <ChevronRight size={20} className="ml-auto text-red-300" />
              </button>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
};

export const Footer: React.FC = () => {
  const { language, t } = useLanguage();
  return (
    <footer className="bg-slate-900 text-white py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          <div className="col-span-2">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
                <Milk className="text-white" size={24} />
              </div>
              <span className="text-2xl font-black tracking-tighter">EcoDairy<span className="text-blue-600">.</span></span>
            </div>
            <p className="text-slate-400 max-w-sm">
              {language === 'bn' 
                ? 'সাভারের নিজস্ব খামারে উৎপাদিত বিষমুক্ত ও স্বাস্থ্যকর দুধ সরাসরি গ্রাহকদের কাছে পৌঁছে দিই।' 
                : 'Delivering toxin-free and healthy milk directly from our own farm in Savar to your table.'}
            </p>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-6">{language === 'bn' ? 'লিংক' : 'Quick Links'}</h4>
            <ul className="space-y-4 text-slate-400 font-medium">
              <li><Link to="/about" className="hover:text-white transition-colors">{t('nav.about')}</Link></li>
              <li><Link to="/gallery" className="hover:text-white transition-colors">{t('nav.gallery')}</Link></li>
              <li><Link to="/contact" className="hover:text-white transition-colors">{t('nav.contact')}</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-bold mb-6">{language === 'bn' ? 'যোগাযোগ' : 'Contact'}</h4>
            <ul className="space-y-4 text-slate-400 font-medium">
              <li className="flex items-center gap-2"><Phone size={16} /> ০১৭২৭-৩৮৭৭০৬</li>
              <li className="flex items-center gap-2"><Mail size={16} /> info@ecodairy.farm</li>
              <li className="flex items-center gap-2"><MapPin size={16} /> {language === 'bn' ? 'সাভার, ঢাকা' : 'Savar, Dhaka'}</li>
            </ul>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-12 pt-8 text-center text-slate-500 text-sm">
          <p>© {new Date().getFullYear()} EcoDairy Farm. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};
