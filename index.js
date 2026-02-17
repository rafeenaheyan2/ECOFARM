import { GoogleGenAI } from "@google/genai";

// --- State Management ---
const state = {
  language: localStorage.getItem('lang') || 'bn',
  isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
  userRole: localStorage.getItem('userRole') || 'CUSTOMER',
  isMobileMenuOpen: false,
  view: 'LOGIN' // For auth page toggling
};

const TRANSLATIONS = {
  bn: {
    nav: { home: 'হোম', about: 'আমাদের সম্পর্কে', gallery: 'গ্যালারি', contact: 'যোগাযোগ', login: 'লগইন', logout: 'লগআউট', dashboard: 'ড্যাশবোর্ড' },
    hero: { title: 'খামার থেকে সরাসরি খাঁটি দুধ আপনার টেবিলে।', subtitle: 'যাদুরানী, ঠাকুরগাঁওয়ে অবস্থিত আমাদের খামারে উৎপাদিত বিষমুক্ত ও স্বাস্থ্যকর দুধ।', cta: 'শুরু করুন' },
    farm: {
      title: 'খামার তথ্য',
      subtitle: 'ইকো ডেইরি ফার্ম ঠাকুরগাঁও জেলার হরিপুর উপজেলায় অবস্থিত একটি আধুনিক ও আদর্শ ডেইরি প্রকল্প।',
      address_label: 'ঠিকানা',
      address_value: 'যাদুরানী, কামারপুকুর, হরিপুর, ঠাকুরগাঁও',
      contact_title: 'যোগাযোগ ও ব্যবস্থাপনা',
      manager_label: 'ম্যানেজার'
    }
  },
  en: {
    nav: { home: 'Home', about: 'About', gallery: 'Gallery', contact: 'Contact', login: 'Login', logout: 'Logout', dashboard: 'Dashboard' },
    hero: { title: 'Directly Pure Milk to your table.', subtitle: 'Toxin-free and healthy milk from our farm in Yadurani, Thakurgaon.', cta: 'Get Started' },
    farm: {
      title: 'Farm Information',
      subtitle: 'Eco Dairy Farm is a modern and model dairy project located in Haripur, Thakurgaon.',
      address_label: 'Address',
      address_value: 'Yadurani, Kamarpukur, Haripur, Thakurgaon',
      contact_title: 'Contact & Management',
      manager_label: 'Manager'
    }
  }
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
  toast.className = `fixed bottom-4 left-4 right-4 md:bottom-6 md:right-6 md:left-auto ${color} text-white px-6 py-4 rounded-2xl shadow-2xl z-[10000] font-bold animate-bounce text-center md:text-left`;
  toast.innerText = msg;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3000);
};

// --- Global Actions ---
window.toggleMenu = () => {
  state.isMobileMenuOpen = !state.isMobileMenuOpen;
  const menu = document.getElementById('mobile-menu');
  if (menu) menu.classList.toggle('active', state.isMobileMenuOpen);
};

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
  notify(state.language === 'bn' ? 'লগআউট সফল হয়েছে' : 'Logout successful');
};

window.setRole = (role) => {
  state.userRole = role;
  render();
};

// --- Components ---
const Navbar = () => `
  <nav class="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200 h-20 flex items-center">
    <div class="max-w-7xl mx-auto px-4 w-full flex justify-between items-center">
      <div class="flex items-center gap-2 md:gap-3">
        <div class="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
           <svg class="text-white w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <a href="#" class="text-xl md:text-2xl font-black text-slate-900 tracking-tighter">EcoDairy<span class="text-blue-600">.</span></a>
      </div>

      <div class="hidden lg:flex items-center gap-8">
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

      <button onclick="toggleMenu()" class="lg:hidden p-2 text-slate-600">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>
    </div>

    <div id="mobile-menu" class="lg:hidden fixed top-20 left-0 right-0 bg-white border-b border-slate-200 p-6 space-y-4 shadow-2xl z-40">
      <a href="#" onclick="toggleMenu()" class="block font-bold text-lg text-slate-600">${t('nav.home')}</a>
      <a href="#about" onclick="toggleMenu()" class="block font-bold text-lg text-slate-600">${t('nav.about')}</a>
      <a href="#gallery" onclick="toggleMenu()" class="block font-bold text-lg text-slate-600">${t('nav.gallery')}</a>
      <a href="#contact" onclick="toggleMenu()" class="block font-bold text-lg text-slate-600">${t('nav.contact')}</a>
      <div class="flex justify-between items-center py-2 border-t border-slate-100">
        <div class="flex bg-slate-100 p-1 rounded-xl">
          <button onclick="setLang('bn')" class="px-4 py-2 rounded-lg text-sm font-bold ${state.language === 'bn' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}">বাং</button>
          <button onclick="setLang('en')" class="px-4 py-2 rounded-lg text-sm font-bold ${state.language === 'en' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}">EN</button>
        </div>
        ${state.isLoggedIn ? `
          <div class="flex flex-col gap-2">
            <a href="#dashboard" onclick="toggleMenu()" class="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold text-center">${t('nav.dashboard')}</a>
            <button onclick="logout(); toggleMenu();" class="text-red-500 font-bold">${t('nav.logout')}</button>
          </div>
        ` : `
          <a href="#login" onclick="toggleMenu()" class="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold text-center">${t('nav.login')}</a>
        `}
      </div>
    </div>
  </nav>
`;

const Home = () => `
  <section class="pt-24 lg:pt-40 pb-12 lg:pb-20 px-4">
    <div class="max-w-7xl mx-auto grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
      <div class="text-center lg:text-left">
        <h1 class="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 leading-tight mb-4 lg:mb-6">
          ${t('hero.title')}
        </h1>
        <p class="text-base md:text-lg text-slate-500 mb-6 lg:mb-8 max-w-xl mx-auto lg:mx-0">
          ${t('hero.subtitle')}
        </p>
        <a href="#login" class="inline-block w-full sm:w-auto bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 shadow-xl shadow-blue-200 transition-all text-center">
          ${t('hero.cta')}
        </a>
      </div>
      <div class="relative mt-8 lg:mt-0">
        <img src="https://images.unsplash.com/photo-1596733430284-f7437764b1a9?auto=format&fit=crop&w=800" class="rounded-3xl lg:rounded-[40px] shadow-2xl w-full aspect-[4/3] object-cover" />
      </div>
    </div>
  </section>

  <!-- Farm Information Section -->
  <section id="farm-info" class="py-16 lg:py-24 bg-blue-50/30 px-4">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-16">
        <h2 class="text-3xl md:text-5xl font-black text-slate-900 mb-6">${t('farm.title')}</h2>
        <p class="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">${t('farm.subtitle')}</p>
      </div>

      <div class="grid lg:grid-cols-5 gap-8 items-start">
        <div class="lg:col-span-2 space-y-8 bg-white p-6 md:p-10 rounded-3xl md:rounded-[40px] shadow-sm border border-slate-100">
          <div class="flex items-start gap-5">
            <div class="w-12 h-12 md:w-14 md:h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-100">
              <svg class="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            </div>
            <div>
              <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">${t('farm.address_label')}</p>
              <h4 class="text-lg md:text-xl font-bold text-slate-900 leading-tight">${t('farm.address_value')}</h4>
            </div>
          </div>

          <div class="flex items-start gap-5">
            <div class="w-12 h-12 md:w-14 md:h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-100">
              <svg class="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
            </div>
            <div>
              <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Phone</p>
              <a href="tel:01723447229" class="text-lg md:text-xl font-bold text-slate-900 hover:text-blue-600 transition-colors">01723447229</a>
            </div>
          </div>

          <div class="flex items-start gap-5">
            <div class="w-12 h-12 md:w-14 md:h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-100">
              <svg class="w-6 h-6 md:w-8 md:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
            </div>
            <div>
              <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">Email</p>
              <a href="mailto:ecodairyfirm@gmail.com" class="text-lg md:text-xl font-bold text-slate-900 hover:text-blue-600 transition-colors break-all">ecodairyfirm@gmail.com</a>
            </div>
          </div>
        </div>

        <div class="lg:col-span-3 grid md:grid-cols-2 gap-6">
          <div class="bg-white p-8 rounded-3xl md:rounded-[40px] shadow-sm border border-slate-100 group hover:shadow-xl transition-all duration-300">
             <div class="flex items-center gap-4 mb-6">
               <div class="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center font-black text-2xl group-hover:scale-110 transition-transform">RH</div>
               <div>
                 <p class="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">${t('farm.manager_label')} 1</p>
                 <h4 class="text-lg md:text-xl font-bold text-slate-900">${state.language === 'bn' ? 'মোঃ রাফিক হুসাইন' : 'MD RAFIK HOSSAIN'}</h4>
               </div>
             </div>
             <div class="space-y-3">
               <a href="tel:01304652352" class="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-blue-50 transition-colors">
                 <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                 <span class="text-sm font-bold text-slate-600">01304652352</span>
               </a>
               <a href="https://wa.me/01590018360" target="_blank" class="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-green-50 transition-colors">
                 <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .004 5.412.001 12.049c0 2.12.554 4.189 1.605 6.04L0 24l6.117-1.604a11.803 11.803 0 005.927 1.588h.005c6.635 0 12.045-5.413 12.048-12.05a11.77 11.77 0 00-3.528-8.421"/></svg>
                 <span class="text-sm font-bold text-slate-600">01590018360</span>
               </a>
             </div>
          </div>

          <div class="bg-white p-8 rounded-3xl md:rounded-[40px] shadow-sm border border-slate-100 group hover:shadow-xl transition-all duration-300">
             <div class="flex items-center gap-4 mb-6">
               <div class="w-16 h-16 bg-blue-100 text-blue-600 rounded-2xl flex items-center justify-center font-black text-2xl group-hover:scale-110 transition-transform">SH</div>
               <div>
                 <p class="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">${t('farm.manager_label')} 2</p>
                 <h4 class="text-lg md:text-xl font-bold text-slate-900">${state.language === 'bn' ? 'মোঃ সাগর হোসেন' : 'MD SAGAR HOSEN'}</h4>
               </div>
             </div>
             <div class="space-y-3">
               <a href="tel:01723447229" class="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-blue-50 transition-colors">
                 <svg class="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                 <span class="text-sm font-bold text-slate-600">01723447229</span>
               </a>
               <a href="https://wa.me/01723447229" target="_blank" class="flex items-center gap-3 p-3 bg-slate-50 rounded-xl hover:bg-green-50 transition-colors">
                 <svg class="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 24 24"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.414 0 .004 5.412.001 12.049c0 2.12.554 4.189 1.605 6.04L0 24l6.117-1.604a11.803 11.803 0 005.927 1.588h.005c6.635 0 12.045-5.413 12.048-12.05a11.77 11.77 0 00-3.528-8.421"/></svg>
                 <span class="text-sm font-bold text-slate-600">01723447229</span>
               </a>
             </div>
          </div>
        </div>
      </div>
    </div>
  </section>
`;

const Login = () => `
  <section class="min-h-screen pt-24 pb-12 px-4 flex justify-center items-center bg-blue-50/50">
    <div class="w-full max-w-md bg-white p-6 md:p-10 rounded-3xl md:rounded-[40px] shadow-2xl border border-slate-100">
      <div class="text-center mb-6">
        <h2 class="text-2xl md:text-3xl font-black text-slate-900">${state.view === 'LOGIN' ? 'লগইন করুন' : 'অ্যাকাউন্ট খুলুন'}</h2>
        <p class="text-slate-500 mt-2 text-sm">আপনার পছন্দের রোল নির্বাচন করুন</p>
      </div>
      
      <div class="flex gap-1 mb-6 p-1 bg-slate-100 rounded-2xl overflow-x-auto">
        ${['ADMIN', 'ENTREPRENEUR', 'CUSTOMER'].map(role => `
          <button onclick="setRole('${role}')" class="flex-1 min-w-[80px] py-3 rounded-xl text-[10px] sm:text-xs font-bold transition-all ${state.userRole === role ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-500'}">
            ${role === 'ADMIN' ? 'এডমিন' : role === 'CUSTOMER' ? 'গ্রাহক' : 'উদ্যোক্তা'}
          </button>
        `).join('')}
      </div>

      <form id="authForm" class="space-y-4 lg:space-y-6">
        <div>
          <label class="block text-sm font-bold text-slate-700 mb-2">ইমেইল</label>
          <input type="email" required class="w-full px-5 py-3 lg:py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-600 outline-none" placeholder="example@email.com" />
        </div>
        <div>
          <label class="block text-sm font-bold text-slate-700 mb-2">পাসওয়ার্ড</label>
          <input type="password" required class="w-full px-5 py-3 lg:py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-blue-600 outline-none" placeholder="••••••••" />
        </div>
        <button type="submit" class="w-full bg-blue-600 text-white py-4 lg:py-5 rounded-2xl font-black text-lg hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all">প্রবেশ করুন</button>
      </form>
    </div>
  </section>
`;

const Dashboard = () => `
  <section class="pt-24 lg:pt-32 pb-12 lg:pb-20 px-4">
    <div class="max-w-7xl mx-auto">
      <div class="flex flex-col lg:flex-row gap-8 items-start">
        <aside class="w-full lg:w-64 flex lg:flex-col gap-2 overflow-x-auto pb-2 lg:pb-0">
          <button class="flex-1 lg:w-full whitespace-nowrap text-center lg:text-left px-6 py-4 rounded-2xl bg-blue-600 text-white font-bold shadow-lg shadow-blue-100">ওভারভিউ</button>
          <button class="flex-1 lg:w-full whitespace-nowrap text-center lg:text-left px-6 py-4 rounded-2xl text-slate-600 font-bold hover:bg-slate-100">রিপোর্ট</button>
          <button class="flex-1 lg:w-full whitespace-nowrap text-center lg:text-left px-6 py-4 rounded-2xl text-slate-600 font-bold hover:bg-slate-100">সেটিংস</button>
        </aside>

        <main class="flex-1 w-full bg-white p-6 md:p-10 rounded-3xl md:rounded-[40px] shadow-sm border border-slate-100">
          <h2 class="text-2xl md:text-3xl font-black text-slate-900 mb-6">স্বাগতম, ${state.userRole}</h2>
          
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 lg:gap-6">
            <div class="p-6 bg-blue-50 rounded-3xl border border-blue-100">
              <p class="text-xs font-bold text-blue-600 uppercase tracking-widest">মোট উৎপাদন</p>
              <h4 class="text-2xl md:text-3xl font-black text-slate-900 mt-2">৪৫০ লিটার</h4>
            </div>
            <div class="p-6 bg-emerald-50 rounded-3xl border border-emerald-100">
              <p class="text-xs font-bold text-emerald-600 uppercase tracking-widest">অর্ডার সম্পন্ন</p>
              <h4 class="text-2xl md:text-3xl font-black text-slate-900 mt-2">১২০টি</h4>
            </div>
            <div class="p-6 bg-amber-50 rounded-3xl border border-amber-100 md:col-span-2 xl:col-span-1">
              <p class="text-xs font-bold text-amber-600 uppercase tracking-widest">পেন্ডিং অর্ডার</p>
              <h4 class="text-2xl md:text-3xl font-black text-slate-900 mt-2">০৫টি</h4>
            </div>
          </div>
        </main>
      </div>
    </div>
  </section>
`;

const Footer = () => `
  <footer class="bg-slate-900 text-white py-12 lg:py-16 mt-auto px-4">
    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-8">
      <div class="space-y-4">
        <h4 class="text-xl font-black tracking-tighter">ইকো ডেইরি ফার্ম<br/><span class="text-blue-500 font-bold">Eco Dairy Farm</span></h4>
        <p class="text-slate-400 text-sm">প্রাকৃতিক ও তাজা দুধের নিশ্চয়তা দিতে আমরা বদ্ধপরিকর। ঠাকুরগাঁও জেলার একটি আদর্শ ডেইরি প্রকল্প।</p>
      </div>
      <div class="space-y-4">
        <h5 class="font-bold text-blue-400 uppercase tracking-widest text-xs">${state.language === 'bn' ? 'দ্রুত লিংক' : 'Quick Links'}</h5>
        <div class="flex flex-col gap-2 text-slate-400 text-sm">
          <a href="#" class="hover:text-blue-500 transition-colors">${t('nav.home')}</a>
          <a href="#about" class="hover:text-blue-500 transition-colors">${t('nav.about')}</a>
          <a href="#gallery" class="hover:text-blue-500 transition-colors">${t('nav.gallery')}</a>
        </div>
      </div>
      <div class="space-y-4">
        <h5 class="font-bold text-blue-400 uppercase tracking-widest text-xs">${state.language === 'bn' ? 'যোগাযোগ' : 'Contact'}</h5>
        <div class="flex flex-col gap-3 text-slate-400 text-sm">
          <div class="flex gap-2">
            <svg class="w-5 h-5 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            <p>যাদুরানী, কামারপুকুর, হরিপুর, ঠাকুরগাঁও</p>
          </div>
          <div class="flex gap-2">
            <svg class="w-5 h-5 text-blue-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
            <p>01723447229</p>
          </div>
        </div>
      </div>
      <div class="space-y-4">
        <h5 class="font-bold text-blue-400 uppercase tracking-widest text-xs">${state.language === 'bn' ? 'নিউজলেটার' : 'Newsletter'}</h5>
        <div class="flex bg-slate-800 p-1 rounded-xl">
          <input type="email" placeholder="ইমেইল..." class="bg-transparent px-4 py-2 text-sm outline-none w-full" />
          <button class="bg-blue-600 text-white px-4 py-2 rounded-lg text-xs font-bold hover:bg-blue-700 transition-colors">পাঠান</button>
        </div>
      </div>
    </div>
    <div class="max-w-7xl mx-auto pt-8 border-t border-slate-800 text-center">
      <p class="text-slate-500 text-[10px] md:text-xs font-medium">© ${new Date().getFullYear()} ইকো ডেইরি ফার্ম (Eco Dairy Farm). All rights reserved.</p>
    </div>
  </footer>
`;

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
  } else if (hash === 'about' || hash === 'gallery' || hash === 'contact') {
    // Basic sections can be handled or redirect to home with anchor
    content += Home();
  } else {
    content += Home();
  }

  content += Footer();
  root.innerHTML = content;

  // Re-attach listeners
  const authForm = document.getElementById('authForm');
  if (authForm) {
    authForm.addEventListener('submit', (e) => {
      e.preventDefault();
      state.isLoggedIn = true;
      localStorage.setItem('isLoggedIn', 'true');
      localStorage.setItem('userRole', state.userRole);
      window.location.hash = 'dashboard';
      notify(state.language === 'bn' ? 'লগইন সফল হয়েছে!' : 'Login successful!');
      render();
    });
  }

  // Hide loader
  const loader = document.getElementById('loader');
  if (loader) loader.classList.add('loading-hidden');
};

// Start
window.addEventListener('hashchange', render);
window.addEventListener('DOMContentLoaded', () => {
  render();
  console.log("EcoDairy Farm Vanilla JS App Loaded Successfully");
});