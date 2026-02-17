
import { GoogleGenAI } from "@google/genai";

// --- Constants & Data ---
const TRANSLATIONS = {
  bn: {
    nav: { home: 'হোম', about: 'আমাদের সম্পর্কে', gallery: 'গ্যালারি', contact: 'যোগাযোগ', login: 'লগইন', logout: 'লগআউট', dashboard: 'ড্যাশবোর্ড' },
    hero: { title: 'খামার থেকে সরাসরি খাঁটি দুধ আপনার টেবিলে।', subtitle: 'সাভারের নিজস্ব খামারে উৎপাদিত বিষমুক্ত ও স্বাস্থ্যকর দুধ।', cta: 'শুরু করুন' }
  },
  en: {
    nav: { home: 'Home', about: 'About', gallery: 'Gallery', contact: 'Contact', login: 'Login', logout: 'Logout', dashboard: 'Dashboard' },
    hero: { title: 'Directly Pure Milk to your table.', subtitle: 'Toxin-free and healthy milk from our own farm in Savar.', cta: 'Get Started' }
  }
};

const MOCK_GALLERY = [
  { id: 1, title: 'সুস্থ গাভী', url: 'https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=400' },
  { id: 2, title: 'তাজা দুধ', url: 'https://images.unsplash.com/photo-1550583724-1255818c0533?auto=format&fit=crop&w=400' }
];

// --- State Management ---
const state = {
  language: localStorage.getItem('lang') || 'bn',
  isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
  userRole: localStorage.getItem('userRole') || 'CUSTOMER',
  view: 'LOGIN' // For auth page internal toggling
};

// --- Utilities ---
const t = (key) => {
  const keys = key.split('.');
  let result = TRANSLATIONS[state.language];
  for (const k of keys) result = result?.[k];
  return result || key;
};

const notify = (msg, type = 'SUCCESS') => {
  const color = type === 'SUCCESS' ? 'bg-green-700' : 'bg-red-700';
  const toast = document.createElement('div');
  toast.className = `fixed bottom-6 right-6 ${color} text-white px-6 py-4 rounded-2xl shadow-2xl z-[10000] font-bold animate-bounce`;
  toast.innerText = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
};

// --- Components ---
const Navbar = () => `
  <nav class="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200 h-20 flex items-center">
    <div class="max-w-7xl mx-auto px-4 w-full flex justify-between items-center">
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
           <svg class="text-white w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <a href="#" class="text-2xl font-black text-slate-900">EcoDairy<span class="text-blue-600">.</span></a>
      </div>
      <div class="hidden md:flex items-center gap-8">
        <a href="#" class="font-bold text-slate-600 hover:text-blue-600 transition-colors">${t('nav.home')}</a>
        <a href="#about" class="font-bold text-slate-600 hover:text-blue-600 transition-colors">${t('nav.about')}</a>
        <a href="#gallery" class="font-bold text-slate-600 hover:text-blue-600 transition-colors">${t('nav.gallery')}</a>
        <a href="#contact" class="font-bold text-slate-600 hover:text-blue-600 transition-colors">${t('nav.contact')}</a>
        <div class="flex bg-slate-100 p-1 rounded-xl">
          <button onclick="setLang('bn')" class="px-3 py-1.5 rounded-lg text-xs font-bold ${state.language === 'bn' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}">বাং</button>
          <button onclick="setLang('en')" class="px-3 py-1.5 rounded-lg text-xs font-bold ${state.language === 'en' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}">EN</button>
        </div>
        ${state.isLoggedIn ? `
          <a href="#dashboard" class="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all">${t('nav.dashboard')}</a>
          <button onclick="logout()" class="text-red-500 font-bold ml-4">${t('nav.logout')}</button>
        ` : `
          <a href="#login" class="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all">${t('nav.login')}</a>
        `}
      </div>
    </div>
  </nav>
`;

const Footer = () => `
  <footer class="bg-slate-900 text-white py-12 mt-auto">
    <div class="max-w-7xl mx-auto px-4 text-center">
      <p class="text-slate-500">© ${new Date().getFullYear()} EcoDairy Farm. All rights reserved.</p>
    </div>
  </footer>
`;

const Home = () => `
  <section class="pt-40 pb-20 px-4">
    <div class="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
      <div>
        <h1 class="text-5xl lg:text-7xl font-black text-slate-900 leading-tight mb-6">${t('hero.title')}</h1>
        <p class="text-lg text-slate-500 mb-8">${t('hero.subtitle')}</p>
        <a href="#login" class="inline-block bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all">${t('hero.cta')}</a>
      </div>
      <div class="relative">
        <img src="https://images.unsplash.com/photo-1596733430284-f7437764b1a9?auto=format&fit=crop&w=800" class="rounded-[40px] shadow-2xl w-full aspect-[4/3] object-cover" />
      </div>
    </div>
  </section>
`;

const Login = () => `
  <section class="min-h-screen pt-40 pb-20 px-4 flex justify-center items-center bg-blue-50/50">
    <div class="w-full max-w-md bg-white p-10 rounded-[40px] shadow-2xl border border-slate-100">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-black text-slate-900">${state.view === 'LOGIN' ? 'লগইন করুন' : 'অ্যাকাউন্ট খুলুন'}</h2>
        <p class="text-slate-500 mt-2">আপনার পছন্দের রোল নির্বাচন করুন</p>
      </div>
      
      <div class="flex gap-2 mb-8 p-1 bg-slate-100 rounded-2xl">
        ${['ADMIN', 'ENTREPRENEUR', 'CUSTOMER'].map(role => `
          <button onclick="setRole('${role}')" class="flex-1 py-3 rounded-xl text-xs font-bold transition-all ${state.userRole === role ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}">
            ${role === 'ADMIN' ? 'এডমিন' : role === 'CUSTOMER' ? 'গ্রাহক' : 'উদ্যোক্তা'}
          </button>
        `).join('')}
      </div>

      <form id="authForm" class="space-y-6">
        <div>
          <label class="block text-sm font-bold text-slate-700 mb-2">ইমেইল</label>
          <input type="email" required class="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-600 outline-none" placeholder="example@email.com" />
        </div>
        <div>
          <label class="block text-sm font-bold text-slate-700 mb-2">পাসওয়ার্ড</label>
          <input type="password" required class="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-600 outline-none" placeholder="••••••••" />
        </div>
        <button type="submit" class="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-lg hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all">প্রবেশ করুন</button>
      </form>
    </div>
  </section>
`;

const Dashboard = () => `
  <section class="pt-32 pb-20 px-4">
    <div class="max-w-7xl mx-auto">
      <div class="flex flex-col md:flex-row justify-between items-start gap-8">
        <aside class="w-full md:w-64 space-y-2">
          <button class="w-full text-left px-6 py-4 rounded-2xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-100">ওভারভিউ</button>
          <button class="w-full text-left px-6 py-4 rounded-2xl text-slate-600 font-bold hover:bg-slate-100">রিপোর্ট</button>
          <button class="w-full text-left px-6 py-4 rounded-2xl text-slate-600 font-bold hover:bg-slate-100">সেটিংস</button>
        </aside>
        <main class="flex-1 bg-white p-10 rounded-[40px] shadow-sm border border-slate-100">
          <h2 class="text-3xl font-black text-slate-900 mb-6">স্বাগতম, ${state.userRole}</h2>
          <div class="grid md:grid-cols-3 gap-6">
            <div class="p-6 bg-blue-50 rounded-3xl border border-blue-100">
              <p class="text-sm font-bold text-blue-600 uppercase">মোট উৎপাদন</p>
              <h4 class="text-3xl font-black text-slate-900 mt-2">৪৫০ লিটার</h4>
            </div>
            <div class="p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
              <p class="text-sm font-bold text-emerald-600 uppercase">অর্ডার সম্পন্ন</p>
              <h4 class="text-3xl font-black text-slate-900 mt-2">১২০টি</h4>
            </div>
            <div class="p-6 bg-amber-50 rounded-3xl border border-amber-100">
              <p class="text-sm font-bold text-amber-600 uppercase">পেন্ডিং অর্ডার</p>
              <h4 class="text-3xl font-black text-slate-900 mt-2">০৫টি</h4>
            </div>
          </div>
        </main>
      </div>
    </div>
  </section>
`;

// --- Global Actions ---
window.setLang = (lang) => {
  state.language = lang;
  localStorage.setItem('lang', lang);
  render();
};

window.logout = () => {
  state.isLoggedIn = false;
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userRole');
  window.location.hash = '';
  render();
  notify('লগআউট সফল হয়েছে');
};

window.setRole = (role) => {
  state.userRole = role;
  render();
};

// --- Rendering Engine ---
const render = () => {
  const root = document.getElementById('root');
  const hash = window.location.hash.replace('#', '') || 'home';
  
  let content = Navbar();

  if (hash === 'home') {
    content += Home();
  } else if (hash === 'login') {
    if (state.isLoggedIn) {
      window.location.hash = 'dashboard';
      return;
    }
    content += Login();
  } else if (hash === 'dashboard') {
    if (!state.isLoggedIn) {
      window.location.hash = 'login';
      return;
    }
    content += Dashboard();
  } else {
    content += Home(); // Fallback
  }

  content += Footer();
  root.innerHTML = content;

  // Re-attach listeners after DOM update
  const authForm = document.getElementById('authForm');
  if (authForm) {
    authForm.addEventListener('submit', (e) => {
      e.preventDefault();
      state.isLoggedIn = true;
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userRole', state.userRole);
      window.location.hash = 'dashboard';
      notify('লগইন সফল হয়েছে!');
      render();
    });
  }

  // Final success check
  console.log("App loaded successfully: View =", hash);
  const loader = document.getElementById('loader');
  if (loader) loader.classList.add('loading-hidden');
};

// Start the app
window.addEventListener('hashchange', render);
window.addEventListener('DOMContentLoaded', () => {
  render();
  console.log("EcoDairy Farm App Initialized Successfully");
});
