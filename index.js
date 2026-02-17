import { GoogleGenAI } from "@google/genai";

// --- State Management ---
const state = {
  language: localStorage.getItem('lang') || 'bn',
  isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
  userRole: localStorage.getItem('userRole') || 'CUSTOMER',
  isMobileMenuOpen: false,
  loginView: 'LOGIN',
  expandedSections: {
    about: false,
    articles: false,
    gallery: false,
    contact: false
  }
};

const TRANSLATIONS = {
  bn: {
    nav: { home: 'হোম', about: 'আমাদের সম্পর্কে', gallery: 'গ্যালারি', contact: 'যোগাযোগ', login: 'লগইন', logout: 'লগআউট', dashboard: 'ড্যাশবোর্ড', order: 'অর্ডার করুন' },
    hero: { title: 'খামার থেকে সরাসরি খাঁটি দুধ আপনার টেবিলে।', subtitle: 'যাদুরানী, ঠাকুরগাঁওয়ে অবস্থিত আমাদের খামারে উৎপাদিত বিষমুক্ত ও স্বাস্থ্যকর দুধ। আমরা গবাদি পশুর সঠিক যত্ন ও উন্নত প্রজনন নিশ্চিত করি।', cta: 'অর্ডার করুন' },
    farm: {
      title: 'খামার তথ্য',
      subtitle: 'ইকো ডেইরি ফার্ম ঠাকুরগাঁও জেলার হরিপুর উপজেলায় অবস্থিত একটি আধুনিক ও আদর্শ ডেইরি প্রকল্প।',
      address_label: 'ঠিকানা',
      address_value: 'যাদুরানী, কামারপুকুর, হরিপুর, ঠাকুরগাঁও',
      contact_title: 'যোগাযোগ ও ব্যবস্থাপনা',
      manager_label: 'ম্যানেজার'
    },
    articles: {
      title: 'আমাদের কার্যক্রম ও তথ্য',
      subtitle: 'জানুন কিভাবে আমরা আপনার জন্য সেরা মানের দুগ্ধজাত পণ্য নিশ্চিত করি।',
      items: [
        { title: 'খামার কার্যক্রম', desc: 'প্রতিদিন ভোরে পরিষ্কার-পরিচ্ছন্নতা ও দুধ সংগ্রহের মাধ্যমে আমাদের দিন শুরু হয়।' },
        { title: 'দুগ্ধ উৎপাদন প্রক্রিয়া', desc: 'আধুনিক মেশিনের সাহায্যে সম্পূর্ণ স্বাস্থ্যসম্মত উপায়ে দুধ সংগ্রহ করা হয়।' },
        { title: 'প্রাণীর যত্ন', desc: 'আমাদের গাভীদের নিয়মিত স্বাস্থ্য পরীক্ষা এবং দক্ষ চিকিৎসকের ব্যবস্থা রয়েছে।' },
        { title: 'জৈব পদ্ধতি', desc: 'সম্পূর্ণ প্রাকৃতিক ঘাস ও বিষমুক্ত খাবারের মাধ্যমে আমরা জৈব দুধ নিশ্চিত করি।' }
      ]
    },
    expand: {
      more: 'আরও বিস্তারিত দেখুন',
      less: 'বিস্তারিত বন্ধ করুন'
    }
  },
  en: {
    nav: { home: 'Home', about: 'About', gallery: 'Gallery', contact: 'Contact', login: 'Login', logout: 'Logout', dashboard: 'Dashboard', order: 'Order Now' },
    hero: { title: 'Directly Pure Milk to your table.', subtitle: 'Toxin-free and healthy milk from our farm in Yadurani, Thakurgaon. We ensure proper care and improved breeding of livestock.', cta: 'Order Now' },
    farm: {
      title: 'Farm Information',
      subtitle: 'Eco Dairy Farm is a modern and model dairy project located in Haripur, Thakurgaon.',
      address_label: 'Address',
      address_value: 'Yadurani, Kamarpukur, Haripur, Thakurgaon',
      contact_title: 'Contact & Management',
      manager_label: 'Manager'
    },
    articles: {
      title: 'Our Activities & Insights',
      subtitle: 'Learn how we ensure the best quality dairy products for you.',
      items: [
        { title: 'Farm Activities', desc: 'Our day starts early with cleanliness and milk collection protocols.' },
        { title: 'Dairy Production', desc: 'Milk is collected and filtered using modern machinery hygienically.' },
        { title: 'Animal Care', desc: 'Our cows receive regular health checkups through skilled veterinarians.' },
        { title: 'Organic Practices', desc: 'We ensure 100% pure milk production by using natural grass.' }
      ]
    },
    expand: {
      more: 'View Full Details',
      less: 'Close Details'
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
window.toggleExpand = (sectionId) => {
  state.expandedSections[sectionId] = !state.expandedSections[sectionId];
  render();
};

window.toggleMenu = () => {
  state.isMobileMenuOpen = !state.isMobileMenuOpen;
  const menu = document.getElementById('mobile-menu');
  if (menu) {
    if (state.isMobileMenuOpen) {
      menu.classList.add('active');
    } else {
      menu.classList.remove('active');
    }
  }
};

window.handleNavClick = (hash) => {
  const currentHash = window.location.hash.replace('#', '') || 'home';
  const isTargetHomeSection = ['home', 'about', 'gallery', 'articles', 'contact'].includes(hash);
  const isCurrentlyHome = ['home', 'about', 'gallery', 'articles', 'contact', ''].includes(currentHash);

  if (state.isMobileMenuOpen) window.toggleMenu();

  if (hash === 'home') {
    window.location.hash = '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }

  if (isTargetHomeSection && isCurrentlyHome) {
    const el = document.getElementById(hash);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      if (window.location.hash !== '#' + hash) {
        history.pushState(null, null, '#' + hash);
      }
    }
  } else {
    window.location.hash = hash;
  }
};

window.setLang = (lang) => {
  state.language = lang;
  localStorage.setItem('lang', lang);
  render();
};

window.setRole = (role) => {
  state.userRole = role;
  render();
};

window.logout = () => {
  state.isLoggedIn = false;
  localStorage.removeItem('isLoggedIn');
  localStorage.removeItem('userRole');
  window.location.hash = '';
  render();
};

// --- Components ---
const Navbar = () => `
  <nav class="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-b border-slate-200 h-20 flex items-center">
    <div class="max-w-7xl mx-auto px-4 w-full flex justify-between items-center">
      <div class="flex items-center gap-2 md:gap-3">
        <div class="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center cursor-pointer shadow-lg shadow-blue-200 btn-pop" onclick="handleNavClick('home')">
           <svg class="text-white w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
        </div>
        <span class="text-xl md:text-2xl font-black text-slate-900 tracking-tighter cursor-pointer" onclick="handleNavClick('home')">EcoDairy<span class="text-blue-600">.</span></span>
      </div>

      <div class="hidden lg:flex items-center gap-8">
        <button onclick="handleNavClick('home')" class="font-bold text-slate-600 hover:text-blue-600 transition-colors uppercase text-xs tracking-widest">${t('nav.home')}</button>
        <button onclick="handleNavClick('about')" class="font-bold text-slate-600 hover:text-blue-600 transition-colors uppercase text-xs tracking-widest">${t('nav.about')}</button>
        <button onclick="handleNavClick('articles')" class="font-bold text-slate-600 hover:text-blue-600 transition-colors uppercase text-xs tracking-widest">তথ্যসমূহ</button>
        <button onclick="handleNavClick('gallery')" class="font-bold text-slate-600 hover:text-blue-600 transition-colors uppercase text-xs tracking-widest">${t('nav.gallery')}</button>
        <button onclick="handleNavClick('contact')" class="font-bold text-slate-600 hover:text-blue-600 transition-colors uppercase text-xs tracking-widest">${t('nav.contact')}</button>
        <div class="flex bg-slate-100 p-1 rounded-xl">
          <button onclick="setLang('bn')" class="px-3 py-1.5 rounded-lg text-xs font-bold ${state.language === 'bn' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}">বাং</button>
          <button onclick="setLang('en')" class="px-3 py-1.5 rounded-lg text-xs font-bold ${state.language === 'en' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}">EN</button>
        </div>
        ${state.isLoggedIn ? `
          <button onclick="handleNavClick('dashboard')" class="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all text-sm">${t('nav.dashboard')}</button>
        ` : `
          <button onclick="window.location.href='login.html'" class="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all text-sm shadow-xl shadow-blue-200 btn-pop">${t('nav.login')}</button>
        `}
      </div>

      <button onclick="toggleMenu()" class="lg:hidden p-2 text-slate-600">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>
    </div>
  </nav>
`;

const Home = () => {
  const expanded = state.expandedSections;

  return `
    <!-- Hero Section -->
    <section id="home" class="pt-24 lg:pt-40 pb-16 lg:pb-24 px-4 bg-gradient-to-b from-blue-50/50 to-transparent">
      <div class="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
        <div class="text-center lg:text-left space-y-8">
          <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-xs font-black uppercase tracking-widest">১০০% খাঁটি ও প্রাকৃতিক</div>
          <h1 class="text-5xl md:text-6xl lg:text-8xl font-black text-slate-900 leading-tight tracking-tighter">${t('hero.title')}</h1>
          <p class="text-lg md:text-xl text-slate-500 max-w-xl mx-auto lg:mx-0 leading-relaxed">${t('hero.subtitle')}</p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <button onclick="window.location.href='#order'" class="bg-blue-600 text-white px-10 py-5 rounded-2xl font-black text-xl hover:bg-blue-700 shadow-2xl shadow-blue-200 transition-all transform btn-pop">অর্ডার করুন</button>
            <button onclick="handleNavClick('about')" class="bg-white text-slate-700 px-10 py-5 rounded-2xl font-black text-xl border border-slate-200 hover:bg-slate-50 transition-all btn-pop">আরও জানুন</button>
          </div>
        </div>
        <div class="relative mt-8 lg:mt-0">
          <img src="https://images.unsplash.com/photo-1596733430284-f7437764b1a9?auto=format&fit=crop&w=800" class="rounded-[40px] shadow-2xl w-full aspect-[4/3] object-cover" />
        </div>
      </div>
    </section>

    <!-- About Section -->
    <section id="about" class="py-16 lg:py-32 bg-white px-4">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16 space-y-4">
          <h2 class="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter">আমাদের সম্পর্কে</h2>
          <p class="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">প্রাকৃতিক ও স্বাস্থ্যকর দুগ্ধজাত পণ্যের নিশ্চয়তা দিতে আমরা প্রতিশ্রুতিবদ্ধ।</p>
          <button onclick="toggleExpand('about')" class="mt-6 inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-xl glossy-shadow btn-pop transition-all">
            ${expanded.about ? t('expand.less') : t('expand.more')}
            <svg class="w-5 h-5 transition-transform ${expanded.about ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>

        <div class="expandable-container ${expanded.about ? 'expanded' : ''}">
          <div class="article-card space-y-6">
            <h3 class="text-3xl font-black text-blue-600">খামারের ইতিহাস ও লক্ষ্য</h3>
            <p class="text-slate-600 text-lg leading-relaxed">ইকো ডেইরি খামারের অগ্রযাত্রা শুরু হয় ২০০৫ সালে। ঠাকুরগাঁও জেলার হরিপুর উপজেলার যাদুরানী গ্রামে মাত্র কয়েকটি গাভী নিয়ে আমাদের যাত্রা শুরু হলেও আজ আমরা এ অঞ্চলের অন্যতম আদর্শ ডেইরি প্রকল্পে পরিণত হয়েছি। আমাদের মূল লক্ষ্য হল সাধারণ মানুষের কাছে সাশ্রয়ী মূল্যে ভেজালমুক্ত ও প্রাকৃতিক পুষ্টিগুণ সম্পন্ন দুধ পৌঁছে দেওয়া।</p>
            <p class="text-slate-600 text-lg leading-relaxed">আমরা বিশ্বাস করি, সুস্থ জাতি গঠনে নিরাপদ খাদ্য অপরিহার্য। তাই আমরা গবাদি পশুর প্রজনন থেকে শুরু করে খাদ্য ব্যবস্থাপনা পর্যন্ত প্রতিটি পর্যায়ে কঠোর মান নিয়ন্ত্রণ নিশ্চিত করি। আমাদের খামারে উৎপাদিত প্রতিটি লিটার দুধ বিশুদ্ধতার প্রতীক।</p>
          </div>
        </div>
        
        <div class="grid md:grid-cols-3 gap-8 mt-20">
          <div class="p-10 rounded-[40px] bg-slate-50 border border-slate-100 hover:shadow-2xl transition-all group">
            <div class="w-16 h-16 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg></div>
            <h3 class="text-2xl font-black mb-4">বিশুদ্ধতা</h3>
            <p class="text-slate-500 leading-relaxed">কোনো ভেজাল বা রাসায়নিক ছাড়াই সরাসরি খামার থেকে সংগ্রহ।</p>
          </div>
          <div class="p-10 rounded-[40px] bg-slate-50 border border-slate-100 hover:shadow-2xl transition-all group">
            <div class="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg></div>
            <h3 class="text-2xl font-black mb-4">তাজা দুধ</h3>
            <p class="text-slate-500 leading-relaxed">প্রতিদিন সকালে ও বিকালে সরাসরি আপনার দরজায় পৌঁছানো হয়।</p>
          </div>
          <div class="p-10 rounded-[40px] bg-slate-50 border border-slate-100 hover:shadow-2xl transition-all group">
            <div class="w-16 h-16 bg-amber-100 text-amber-600 rounded-3xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform"><svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg></div>
            <h3 class="text-2xl font-black mb-4">দ্রুত ডেলিভারি</h3>
            <p class="text-slate-500 leading-relaxed">আমাদের নিজস্ব ডেলিভারি নেটওয়ার্কের মাধ্যমে দ্রুততম সময়ে সার্ভিস।</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Articles Section -->
    <section id="articles" class="py-16 lg:py-32 bg-stone-50 px-4">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16 space-y-4">
          <h2 class="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter">তথ্য সমূহ</h2>
          <p class="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">খামার পরিচালনা ও উন্নত দুগ্ধ উৎপাদন সম্পর্কে জানুন।</p>
          <button onclick="toggleExpand('articles')" class="mt-6 inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-xl glossy-shadow btn-pop transition-all">
            ${expanded.articles ? t('expand.less') : t('expand.more')}
            <svg class="w-5 h-5 transition-transform ${expanded.articles ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>

        <div class="expandable-container ${expanded.articles ? 'expanded' : ''}">
          <div class="grid md:grid-cols-2 gap-8">
            <div class="article-card space-y-4">
              <h4 class="text-2xl font-black text-blue-600">উন্নত খাদ্য ব্যবস্থাপনা</h4>
              <p class="text-slate-600 leading-relaxed">দুধের পরিমাণ ও গুণমান বৃদ্ধির প্রধান শর্ত হল সঠিক খাদ্য। আমরা গাভীদের প্রতিদিন পর্যাপ্ত সবুজ ঘাস, সাইলেজ এবং সুষম দানাদার খাদ্য প্রদান করি। খাবারের সাথে কোনো প্রকার রাসায়নিক বা গ্রোথ হরমোন ব্যবহার করা হয় না।</p>
            </div>
            <div class="article-card space-y-4">
              <h4 class="text-2xl font-black text-blue-600">আধুনিক ডেইরি প্রযুক্তি</h4>
              <p class="text-slate-600 leading-relaxed">ইকো ডেইরি খামারে দুধ সংগ্রহের জন্য ব্যবহার করা হয় ভ্যাকুয়াম মিল্কিং মেশিন। এতে দুধ সরাসরি বায়ুর সংস্পর্শ ছাড়াই কনটেইনারে জমা হয়, ফলে ব্যাকটেরিয়ার আক্রমণ প্রতিরোধ করা সম্ভব হয় এবং দুধ দীর্ঘক্ষণ সতেজ থাকে।</p>
            </div>
          </div>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
          ${t('articles.items').map(item => `
            <div class="bg-white p-8 rounded-[40px] border border-slate-100 flex flex-col space-y-4 hover:shadow-xl transition-all">
              <div class="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center">
                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/></svg>
              </div>
              <h3 class="text-xl font-black text-slate-900">${item.title}</h3>
              <p class="text-slate-500 text-sm leading-relaxed">${item.desc}</p>
            </div>
          `).join('')}
        </div>
      </div>
    </section>

    <!-- Gallery Section -->
    <section id="gallery" class="py-16 lg:py-32 bg-white px-4">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16 space-y-4">
          <h2 class="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter">গ্যালারি</h2>
          <p class="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">আমাদের খামারের এক ঝলক যা খামারের মনোরম পরিবেশ প্রকাশ করে।</p>
          <button onclick="toggleExpand('gallery')" class="mt-6 inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-xl glossy-shadow btn-pop transition-all">
            ${expanded.gallery ? t('expand.less') : t('expand.more')}
            <svg class="w-5 h-5 transition-transform ${expanded.gallery ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>

        <div class="expandable-container ${expanded.gallery ? 'expanded' : ''}">
          <div class="article-card">
            <h3 class="text-2xl font-black text-blue-600 mb-6 text-center">খামারের কার্যক্রম চিত্রায়ন</h3>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8 text-slate-600 leading-relaxed">
              <p>আমাদের গ্যালারি শুধুমাত্র ছবি নয়, এটি আমাদের পরিশ্রমের গল্প বলে। এখানে আপনারা দেখতে পাবেন কিভাবে আমাদের দক্ষ কর্মীরা পরম যত্নে গাভীদের পরিচর্যা করে। প্রতিদিন সকালে মুক্ত পরিবেশে গাভীদের বিচরণ এবং তাদের প্রাকৃতিক খাদ্যের ব্যবস্থা আমাদের খামারকে অনন্য করেছে।</p>
              <p>দুধ সংগ্রহের পর তা নির্দিষ্ট তাপমাত্রায় সংরক্ষণ এবং সরাসরি গ্রাহকের ঠিকানায় পৌঁছে দেওয়ার প্রক্রিয়ার প্রতিটি মুহূর্ত এখানে ফুটে উঠেছে। স্বচ্ছতা ও বিশুদ্ধতা বজায় রাখাই আমাদের গ্যালারির প্রতিটি ফ্রেমের মূল উপজীব্য।</p>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          <div class="group overflow-hidden rounded-[32px] aspect-square relative shadow-lg">
            <img src="https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=500" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex items-end">
              <span class="text-white font-bold">খামারের সৌন্দর্য</span>
            </div>
          </div>
          <div class="group overflow-hidden rounded-[32px] aspect-square relative shadow-lg">
            <img src="https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=500" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex items-end">
              <span class="text-white font-bold">বিশুদ্ধ দুধ</span>
            </div>
          </div>
          <div class="group overflow-hidden rounded-[32px] aspect-square relative shadow-lg">
            <img src="https://images.unsplash.com/photo-1596733430284-f7437764b1a9?auto=format&fit=crop&w=500" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex items-end">
              <span class="text-white font-bold">গাভীদের বিশ্রাম</span>
            </div>
          </div>
          <div class="group overflow-hidden rounded-[32px] aspect-square relative shadow-lg">
            <img src="https://images.unsplash.com/photo-1527334919514-3c979b370431?auto=format&fit=crop&w=500" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
            <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex items-end">
              <span class="text-white font-bold">পরিচর্যা</span>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Contact Section -->
    <section id="contact" class="py-16 lg:py-32 bg-blue-50/20 px-4 border-t border-slate-100">
      <div class="max-w-7xl mx-auto">
        <div class="text-center mb-16 space-y-4">
          <h2 class="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter">যোগাযোগ</h2>
          <p class="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">যেকোনো প্রশ্ন বা অর্ডারের জন্য সরাসরি আমাদের সাথে যোগাযোগ করুন।</p>
          <button onclick="toggleExpand('contact')" class="mt-6 inline-flex items-center gap-2 px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold shadow-xl glossy-shadow btn-pop transition-all">
            ${expanded.contact ? t('expand.less') : t('expand.more')}
            <svg class="w-5 h-5 transition-transform ${expanded.contact ? 'rotate-180' : ''}" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M19 9l-7 7-7-7" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </button>
        </div>

        <div class="expandable-container ${expanded.contact ? 'expanded' : ''}">
          <div class="article-card">
            <h3 class="text-2xl font-black text-blue-600 mb-6">সেবা সংক্রান্ত সাধারণ জিজ্ঞাসা (FAQ)</h3>
            <div class="space-y-6">
              <div>
                <p class="font-bold text-slate-900">১. আপনারা কি হোম ডেলিভারি দেন?</p>
                <p class="text-slate-500">হ্যাঁ, আমরা প্রতিদিন সকাল ৬টা থেকে ৮টা এবং বিকাল ৫টা থেকে ৭টার মধ্যে ঠাকুরগাঁও সদর ও হরিপুর উপজেলার নির্দিষ্ট এলাকায় হোম ডেলিভারি নিশ্চিত করি।</p>
              </div>
              <div>
                <p class="font-bold text-slate-900">২. দুধের দাম কত?</p>
                <p class="text-slate-500">বাজার দর অনুযায়ী দাম পরিবর্তিত হতে পারে। বর্তমান রেট জানতে আমাদের ম্যানেজারদের ফোন করুন অথবা সরাসরি ফর্ম পূরণ করুন।</p>
              </div>
            </div>
          </div>
        </div>

        <div class="grid lg:grid-cols-5 gap-12 items-start mt-12">
          <div class="lg:col-span-2 space-y-8 bg-white p-10 rounded-[40px] shadow-sm border border-slate-100">
            <h3 class="text-3xl font-black text-blue-600 tracking-tight">Eco Dairy Farm</h3>
            <div class="space-y-6">
              <div class="flex items-start gap-5">
                <div class="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-100 btn-pop"><svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg></div>
                <div>
                  <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">${t('farm.address_label')}</p>
                  <h4 class="text-xl font-bold text-slate-900 leading-tight">${t('farm.address_value')}</h4>
                </div>
              </div>
              <div class="flex items-start gap-5">
                <div class="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-100 btn-pop"><svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg></div>
                <div><p class="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">ফোন</p><a href="tel:01723447229" class="text-xl font-bold text-slate-900 hover:text-blue-600 transition-colors">01723447229</a></div>
              </div>
              <div class="flex items-start gap-5">
                <div class="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-100 btn-pop"><svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg></div>
                <div><p class="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">ইমেইল</p><a href="mailto:ecodairyfirm@gmail.com" class="text-xl font-bold text-slate-900 hover:text-blue-600 transition-colors break-all">ecodairyfirm@gmail.com</a></div>
              </div>
            </div>
          </div>

          <div class="lg:col-span-3 grid md:grid-cols-2 gap-8">
            <div class="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 group hover:shadow-2xl transition-all duration-500 flex flex-col justify-between">
               <div class="flex items-center gap-5 mb-8">
                 <div class="w-20 h-20 bg-blue-100 text-blue-600 rounded-[30px] flex items-center justify-center font-black text-3xl group-hover:scale-110 transition-transform btn-pop">RH</div>
                 <div>
                   <p class="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">${t('farm.manager_label')} ১</p>
                   <h4 class="text-2xl font-black text-slate-900 leading-tight">${state.language === 'bn' ? 'মোঃ রাফিক হুসাইন' : 'MD RAFIK HOSSAIN'}</h4>
                 </div>
               </div>
               <a href="tel:01304652352" class="flex items-center gap-4 p-4 bg-stone-50 rounded-2xl hover:bg-blue-50 transition-colors btn-pop">
                 <svg class="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                 <span class="text-lg font-bold text-slate-600">01304652352</span>
               </a>
            </div>

            <div class="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 group hover:shadow-2xl transition-all duration-500 flex flex-col justify-between">
               <div class="flex items-center gap-5 mb-8">
                 <div class="w-20 h-20 bg-blue-100 text-blue-600 rounded-[30px] flex items-center justify-center font-black text-3xl group-hover:scale-110 transition-transform btn-pop">SH</div>
                 <div>
                   <p class="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">${t('farm.manager_label')} ২</p>
                   <h4 class="text-2xl font-black text-slate-900 leading-tight">${state.language === 'bn' ? 'মোঃ সাগর হোসেন' : 'MD SAGAR HOSEN'}</h4>
                 </div>
               </div>
               <a href="tel:01723447229" class="flex items-center gap-4 p-4 bg-stone-50 rounded-2xl hover:bg-blue-50 transition-colors btn-pop">
                 <svg class="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                 <span class="text-lg font-bold text-slate-600">01723447229</span>
               </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  `;
};

const Dashboard = () => `
  <section id="dashboard" class="pt-24 lg:pt-40 pb-16 lg:pb-32 px-4">
    <div class="max-w-7xl mx-auto">
      <div class="flex flex-col lg:flex-row gap-12 items-start">
        <aside class="w-full lg:w-72 flex lg:flex-col gap-3 overflow-x-auto pb-4 lg:pb-0 no-scrollbar sticky top-28">
          <button class="flex-1 lg:w-full whitespace-nowrap text-left px-8 py-4 rounded-2xl bg-blue-600 text-white font-black shadow-xl btn-pop">ওভারভিউ</button>
          <button class="flex-1 lg:w-full whitespace-nowrap text-left px-8 py-4 rounded-2xl text-slate-600 font-bold hover:bg-slate-100 btn-pop">রিপোর্ট</button>
          <button class="flex-1 lg:w-full whitespace-nowrap text-left px-8 py-4 rounded-2xl text-slate-600 font-bold hover:bg-slate-100 btn-pop">সেটিংস</button>
          <button onclick="logout()" class="flex-1 lg:w-full whitespace-nowrap text-left px-8 py-4 rounded-2xl text-red-500 font-bold hover:bg-red-50 btn-pop">লগআউট</button>
        </aside>

        <main class="flex-1 w-full bg-white p-10 md:p-16 rounded-[50px] shadow-sm border border-slate-100">
          <h2 class="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter mb-12">স্বাগতম, ${state.userRole}</h2>
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            <div class="p-8 bg-blue-50 rounded-[40px] border border-blue-100"><p class="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">মোট উৎপাদন</p><h4 class="text-4xl font-black text-slate-900 mt-4">৪৫০ লিটার</h4></div>
            <div class="p-8 bg-emerald-50 rounded-[40px] border border-emerald-100"><p class="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">অর্ডার সম্পন্ন</p><h4 class="text-4xl font-black text-slate-900 mt-4">১২০টি</h4></div>
            <div class="p-8 bg-amber-50 rounded-[40px] border border-amber-100"><p class="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em]">পেন্ডিং অর্ডার</p><h4 class="text-4xl font-black text-slate-900 mt-4">০৫টি</h4></div>
          </div>
        </main>
      </div>
    </div>
  </section>
`;

const Footer = () => `
  <footer class="bg-slate-900 text-white py-16 lg:py-24 mt-auto px-4">
    <div class="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-16">
      <div class="space-y-6">
        <h4 class="text-2xl font-black tracking-tighter">Eco Dairy Farm</h4>
        <p class="text-slate-400 text-sm leading-relaxed">যাদুরানী, ঠাকুরগাঁওয়ে অবস্থিত আমাদের খামারে উৎপাদিত বিষমুক্ত ও স্বাস্থ্যকর খাঁটি দুধ সরাসরি আপনার টেবিলে পৌঁছে দিতে আমরা বদ্ধপরিকর।</p>
      </div>
      <div class="space-y-6">
        <h5 class="font-black text-blue-500 uppercase tracking-widest text-xs">দ্রুত লিংক</h5>
        <div class="flex flex-col gap-4 text-slate-400 text-sm font-bold">
          <button onclick="handleNavClick('home')" class="text-left hover:text-white transition-colors btn-pop">হোম</button>
          <button onclick="handleNavClick('about')" class="text-left hover:text-white transition-colors btn-pop">আমাদের সম্পর্কে</button>
          <button onclick="handleNavClick('gallery')" class="text-left hover:text-white transition-colors btn-pop">গ্যালারি</button>
        </div>
      </div>
      <div class="space-y-6">
        <h5 class="font-black text-blue-500 uppercase tracking-widest text-xs">যোগাযোগ</h5>
        <p class="text-slate-400 text-sm">যাদুরানী, কামারপুকুর, হরিপুর, ঠাকুরগাঁও<br>ফোন: 01723447229</p>
      </div>
      <div class="space-y-6">
        <h5 class="font-black text-blue-500 uppercase tracking-widest text-xs">নিউজলেটার</h5>
        <div class="flex bg-slate-800 p-2 rounded-2xl">
          <input type="email" placeholder="আপনার ইমেইল..." class="bg-transparent px-4 py-3 text-sm outline-none w-full" />
          <button class="bg-blue-600 text-white px-6 py-3 rounded-xl text-xs font-black hover:bg-blue-700 transition-colors btn-pop">পাঠান</button>
        </div>
      </div>
    </div>
    <div class="max-w-7xl mx-auto pt-10 border-t border-slate-800 text-center">
      <p class="text-slate-500 text-xs font-black uppercase tracking-[0.2em]">© ${new Date().getFullYear()} ইকো ডেইরি ফার্ম. All rights reserved.</p>
    </div>
  </footer>
`;

// --- Rendering Engine ---
const render = () => {
  const root = document.getElementById('root');
  const hash = window.location.hash.replace('#', '') || 'home';
  
  let content = Navbar();

  if (hash === 'dashboard') {
    if (!state.isLoggedIn) {
      window.location.href = 'login.html';
      return;
    }
    content += Dashboard();
  } else {
    content += Home();
  }

  content += Footer();
  root.innerHTML = content;

  // Handle post-render scrolling
  if (['about', 'gallery', 'articles', 'contact'].includes(hash)) {
    setTimeout(() => {
      const el = document.getElementById(hash);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  } else if (hash === 'home' || !hash) {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  const loader = document.getElementById('loader');
  if (loader) loader.classList.add('loading-hidden');
};

// Listen for hash changes
window.addEventListener('hashchange', render);

// Initialize
window.addEventListener('DOMContentLoaded', () => {
  render();
  console.log("EcoDairy Farm App - Interactive Articles Initialized");
});
