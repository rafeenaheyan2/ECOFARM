
import { GoogleGenAI } from "@google/genai";

// --- State Management ---
const state = {
  language: localStorage.getItem('lang') || 'bn',
  isLoggedIn: localStorage.getItem('isLoggedIn') === 'true',
  userRole: localStorage.getItem('userRole') || 'CUSTOMER',
  isMobileMenuOpen: false,
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
        {
          title: 'খামার কার্যক্রম',
          desc: 'প্রতিদিন ভোরে পরিষ্কার-পরিচ্ছন্নতা ও দুধ সংগ্রহের মাধ্যমে আমাদের দিন শুরু হয়। প্রতিটি ধাপ অত্যন্ত সতর্কতার সাথে সম্পন্ন করা হয়।'
        },
        {
          title: 'দুগ্ধ উৎপাদন প্রক্রিয়া',
          desc: 'আধুনিক মেশিনের সাহায্যে সম্পূর্ণ স্বাস্থ্যসম্মত উপায়ে দুধ সংগ্রহ ও ফিল্টারিং করা হয়, যা পুষ্টিগুণ বজায় রাখে।'
        },
        {
          title: 'প্রাণীর যত্ন',
          desc: 'আমাদের গাভীদের নিয়মিত স্বাস্থ্য পরীক্ষা এবং দক্ষ পশুচিকিৎসকের মাধ্যমে উন্নত চিকিৎসার ব্যবস্থা রয়েছে।'
        },
        {
          title: 'জৈব পদ্ধতি',
          desc: 'সম্পূর্ণ প্রাকৃতিক ঘাস ও বিষমুক্ত খাবার ব্যবহারের মাধ্যমে আমরা শতভাগ খাঁটি ও জৈব দুধ উৎপাদন নিশ্চিত করি।'
        }
      ]
    },
    order: {
      title: 'তাজা দুধের অর্ডার দিন',
      subtitle: 'সরাসরি খামার থেকে সংগৃহীত খাঁটি দুধের জন্য নিচের ফর্মটি পূরণ করুন।',
      product: 'দুধের ধরন',
      quantity: 'পরিমাণ (লিটার)',
      schedule: 'ডেলিভারি সময়সূচী',
      address: 'ডেলিভারি ঠিকানা',
      name: 'আপনার নাম',
      phone: 'ফোন নম্বর',
      submit: 'অর্ডার নিশ্চিত করুন',
      payment_note: 'পেমেন্ট পদ্ধতি: ক্যাশ অন ডেলিভারি (পণ্য হাতে পেয়ে টাকা পরিশোধ করুন)',
      success: 'আপনার অর্ডারটি সফলভাবে গ্রহণ করা হয়েছে! আমরা শীঘ্রই যোগাযোগ করব।',
      products: {
        cow: 'খাঁটি গরুর দুধ (Cow Milk)',
        buffalo: 'মহিষের দুধ (Buffalo Milk)',
        ghee: 'খাঁটি গাওয়া ঘি (Pure Ghee)'
      },
      schedules: {
        once: 'একবার (Only Once)',
        daily: 'প্রতিদিন (Daily)',
        weekly: 'সাপ্তাহিক (Weekly)'
      }
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
        {
          title: 'Farm Activities',
          desc: 'Our day starts early with cleanliness and milk collection. Every step is completed with extreme caution.'
        },
        {
          title: 'Dairy Production',
          desc: 'Milk is collected and filtered using modern machinery in a completely hygienic way, preserving its nutritional value.'
        },
        {
          title: 'Animal Care',
          desc: 'Our cows receive regular health checkups and advanced treatment through skilled veterinarians.'
        },
        {
          title: 'Organic Practices',
          desc: 'We ensure 100% pure and organic milk production by using completely natural grass and toxin-free feed.'
        }
      ]
    },
    order: {
      title: 'Order Fresh Milk',
      subtitle: 'Fill out the form below to order pure milk directly from the farm.',
      product: 'Milk Type',
      quantity: 'Quantity (Liters)',
      schedule: 'Delivery Schedule',
      address: 'Delivery Address',
      name: 'Your Name',
      phone: 'Phone Number',
      submit: 'Confirm Order',
      payment_note: 'Payment Method: Cash on Delivery (Pay when you receive)',
      success: 'Your order has been placed successfully! We will contact you soon.',
      products: {
        cow: 'Pure Cow Milk',
        buffalo: 'Buffalo Milk',
        ghee: 'Pure Cow Ghee'
      },
      schedules: {
        once: 'Only Once',
        daily: 'Daily',
        weekly: 'Weekly'
      }
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
  if (menu) {
    if (state.isMobileMenuOpen) {
      menu.classList.add('active');
    } else {
      menu.classList.remove('active');
    }
  }
};

window.closeMenu = () => {
  state.isMobileMenuOpen = false;
  const menu = document.getElementById('mobile-menu');
  if (menu) menu.classList.remove('active');
};

window.handleNavClick = (hash) => {
  const currentHash = window.location.hash.replace('#', '') || 'home';
  const isTargetHomeSection = ['home', 'about', 'gallery', 'articles', 'contact'].includes(hash);
  const isCurrentlyHome = ['home', 'about', 'gallery', 'articles', 'contact', ''].includes(currentHash);

  window.closeMenu();

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
        <div class="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center cursor-pointer shadow-lg shadow-blue-200" onclick="handleNavClick('home')">
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
          <button onclick="logout()" class="text-red-500 font-bold ml-4 text-sm">${t('nav.logout')}</button>
        ` : `
          <button onclick="handleNavClick('login')" class="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition-all text-sm shadow-xl shadow-blue-200">${t('nav.login')}</button>
        `}
      </div>

      <button onclick="toggleMenu()" class="lg:hidden p-2 text-slate-600 focus:outline-none">
        <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16"/></svg>
      </button>
    </div>

    <div id="mobile-menu" class="lg:hidden fixed top-20 left-0 right-0 bg-white border-b border-slate-200 p-6 space-y-4 shadow-2xl z-40">
      <button onclick="handleNavClick('home')" class="block w-full text-left font-bold text-lg text-slate-600">${t('nav.home')}</button>
      <button onclick="handleNavClick('about')" class="block w-full text-left font-bold text-lg text-slate-600">${t('nav.about')}</button>
      <button onclick="handleNavClick('articles')" class="block w-full text-left font-bold text-lg text-slate-600">তথ্যসমূহ</button>
      <button onclick="handleNavClick('gallery')" class="block w-full text-left font-bold text-lg text-slate-600">${t('nav.gallery')}</button>
      <button onclick="handleNavClick('contact')" class="block w-full text-left font-bold text-lg text-slate-600">${t('nav.contact')}</button>
      <div class="flex justify-between items-center py-4 border-t border-slate-100">
        <div class="flex bg-slate-100 p-1 rounded-xl">
          <button onclick="setLang('bn')" class="px-4 py-2 rounded-lg text-sm font-bold ${state.language === 'bn' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}">বাং</button>
          <button onclick="setLang('en')" class="px-4 py-2 rounded-lg text-sm font-bold ${state.language === 'en' ? 'bg-white text-blue-600 shadow-sm' : 'text-slate-400'}">EN</button>
        </div>
        ${state.isLoggedIn ? `
          <div class="flex flex-col gap-2">
            <button onclick="handleNavClick('dashboard')" class="bg-blue-600 text-white px-6 py-2 rounded-xl font-bold text-center">${t('nav.dashboard')}</button>
            <button onclick="logout()" class="text-red-500 font-bold text-center">${t('nav.logout')}</button>
          </div>
        ` : `
          <button onclick="handleNavClick('login')" class="bg-blue-600 text-white px-8 py-3 rounded-xl font-bold text-center shadow-lg shadow-blue-100">${t('nav.login')}</button>
        `}
      </div>
    </div>
  </nav>
`;

const Home = () => `
  <!-- Hero Section -->
  <section id="home" class="pt-24 lg:pt-40 pb-16 lg:pb-24 px-4 bg-gradient-to-b from-blue-50/50 to-transparent">
    <div class="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
      <div class="text-center lg:text-left space-y-8">
        <div class="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-600 text-xs font-black uppercase tracking-widest">
          <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/></svg>
          ১০০% খাঁটি ও প্রাকৃতিক
        </div>
        <h1 class="text-5xl md:text-6xl lg:text-8xl font-black text-slate-900 leading-tight tracking-tighter">
          ${t('hero.title')}
        </h1>
        <p class="text-lg md:text-xl text-slate-500 max-w-xl mx-auto lg:mx-0 leading-relaxed">
          ${t('hero.subtitle')}
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
          <button onclick="handleNavClick('order')" class="bg-blue-600 text-white px-10 py-5 rounded-2xl font-black text-xl hover:bg-blue-700 shadow-2xl shadow-blue-200 transition-all transform hover:-translate-y-1">
            ${t('hero.cta')}
          </button>
          <button onclick="handleNavClick('about')" class="bg-white text-slate-700 px-10 py-5 rounded-2xl font-black text-xl border border-slate-200 hover:bg-slate-50 transition-all">
            আরও জানুন
          </button>
        </div>
      </div>
      <div class="relative mt-8 lg:mt-0 group">
        <div class="absolute -inset-4 bg-blue-100 rounded-[50px] transform rotate-3 -z-10 transition-transform group-hover:rotate-1"></div>
        <img src="https://images.unsplash.com/photo-1596733430284-f7437764b1a9?auto=format&fit=crop&w=800" class="rounded-[40px] shadow-2xl w-full aspect-[4/3] object-cover" alt="Cow on Farm" />
      </div>
    </div>
  </section>

  <!-- About Section -->
  <section id="about" class="py-16 lg:py-32 bg-white px-4">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-16 lg:mb-24 space-y-4">
        <h2 class="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter">কেন আমাদের বেছে নেবেন?</h2>
        <p class="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">প্রাকৃতিক ও স্বাস্থ্যকর দুগ্ধজাত পণ্যের নিশ্চয়তা দিতে আমরা প্রতিশ্রুতিবদ্ধ।</p>
      </div>
      <div class="grid md:grid-cols-3 gap-8">
        <div class="p-10 rounded-[40px] bg-slate-50 border border-slate-100 hover:shadow-2xl transition-all group">
          <div class="w-20 h-20 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
            <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>
          </div>
          <h3 class="text-2xl font-black mb-4">বিশুদ্ধতা</h3>
          <p class="text-slate-500 leading-relaxed text-lg">কোনো ভেজাল বা রাসায়নিক ছাড়াই সরাসরি খামার থেকে সংগ্রহ করা হয়।</p>
        </div>
        <div class="p-10 rounded-[40px] bg-slate-50 border border-slate-100 hover:shadow-2xl transition-all group">
          <div class="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
            <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"/></svg>
          </div>
          <h3 class="text-2xl font-black mb-4">তাজা দুধ</h3>
          <p class="text-slate-500 leading-relaxed text-lg">প্রতিদিন সকালে ও বিকালে সরাসরি আপনার দরজায় পৌঁছানো হয়।</p>
        </div>
        <div class="p-10 rounded-[40px] bg-slate-50 border border-slate-100 hover:shadow-2xl transition-all group">
          <div class="w-20 h-20 bg-amber-100 text-amber-600 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform">
            <svg class="w-10 h-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>
          </div>
          <h3 class="text-2xl font-black mb-4">দ্রুত ডেলিভারি</h3>
          <p class="text-slate-500 leading-relaxed text-lg">আমাদের নিজস্ব ডেলিভারি নেটওয়ার্কের মাধ্যমে দ্রুততম সময়ে সার্ভিস নিশ্চিত করি।</p>
        </div>
      </div>
    </div>
  </section>

  <!-- Photo Gallery Section -->
  <section id="gallery" class="py-16 lg:py-32 bg-stone-50 px-4">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-16 lg:mb-24 space-y-4">
        <h2 class="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter">${t('nav.gallery')}</h2>
        <p class="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">আমাদের খামারের এক ঝলক যা খামারের শান্ত ও মনোরম পরিবেশ প্রকাশ করে।</p>
      </div>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div class="group overflow-hidden rounded-[32px] aspect-square relative shadow-lg">
          <img src="https://images.unsplash.com/photo-1570042225831-d98fa7577f1e?auto=format&fit=crop&w=500" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Dairy Cow" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex items-end">
            <span class="text-white font-bold text-lg">খামারের সৌন্দর্য</span>
          </div>
        </div>
        <div class="group overflow-hidden rounded-[32px] aspect-square relative shadow-lg">
          <img src="https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?auto=format&fit=crop&w=500" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Fresh Milk" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex items-end">
            <span class="text-white font-bold text-lg">বিশুদ্ধ দুধ</span>
          </div>
        </div>
        <div class="group overflow-hidden rounded-[32px] aspect-square relative shadow-lg">
          <img src="https://images.unsplash.com/photo-1596733430284-f7437764b1a9?auto=format&fit=crop&w=500" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Farm Environment" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex items-end">
            <span class="text-white font-bold text-lg">গাভীদের বিশ্রাম</span>
          </div>
        </div>
        <div class="group overflow-hidden rounded-[32px] aspect-square relative shadow-lg">
          <img src="https://images.unsplash.com/photo-1527334919514-3c979b370431?auto=format&fit=crop&w=500" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="Farm Work" />
          <div class="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity p-6 flex items-end">
            <span class="text-white font-bold text-lg">পরিচর্যা</span>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Articles / Information Section -->
  <section id="articles" class="py-16 lg:py-32 bg-white px-4">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-16 lg:mb-24 space-y-4">
        <h2 class="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter">${t('articles.title')}</h2>
        <p class="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">${t('articles.subtitle')}</p>
      </div>
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
        ${t('articles.items').map(item => `
          <div class="bg-stone-50 p-8 rounded-[40px] border border-stone-100 flex flex-col space-y-4 hover:bg-white hover:shadow-xl transition-all duration-300">
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

  <!-- Farm Information / Contact Section -->
  <section id="contact" class="py-16 lg:py-32 bg-blue-50/20 px-4 border-t border-slate-100">
    <div class="max-w-7xl mx-auto">
      <div class="text-center mb-16 space-y-4">
        <h2 class="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter">যোগাযোগ করুন</h2>
        <p class="text-slate-500 max-w-2xl mx-auto text-lg leading-relaxed">যেকোনো প্রশ্ন বা অর্ডারের জন্য সরাসরি আমাদের সাথে যোগাযোগ করুন।</p>
      </div>

      <div class="grid lg:grid-cols-5 gap-12 items-start">
        <!-- Farm Details -->
        <div class="lg:col-span-2 space-y-8 bg-white p-10 rounded-[40px] shadow-sm border border-slate-100">
          <div class="space-y-2">
            <h3 class="text-3xl font-black text-blue-600 tracking-tight">Eco Dairy Farm</h3>
            <div class="h-1.5 w-12 bg-blue-600 rounded-full"></div>
          </div>
          
          <div class="space-y-6">
            <div class="flex items-start gap-5">
              <div class="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-100">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
              </div>
              <div>
                <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">${t('farm.address_label')}</p>
                <h4 class="text-xl font-bold text-slate-900 leading-tight">${t('farm.address_value')}</h4>
              </div>
            </div>

            <div class="flex items-start gap-5">
              <div class="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-100">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
              </div>
              <div>
                <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">ফোন নম্বর</p>
                <a href="tel:01723447229" class="text-xl font-bold text-slate-900 hover:text-blue-600 transition-colors tracking-tight">01723447229</a>
              </div>
            </div>

            <div class="flex items-start gap-5">
              <div class="w-14 h-14 bg-blue-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-blue-100">
                <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>
              </div>
              <div>
                <p class="text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-1">ইমেইল</p>
                <a href="mailto:ecodairyfirm@gmail.com" class="text-xl font-bold text-slate-900 hover:text-blue-600 transition-colors break-all tracking-tight">ecodairyfirm@gmail.com</a>
              </div>
            </div>
          </div>
        </div>

        <!-- Manager Cards -->
        <div class="lg:col-span-3 grid md:grid-cols-2 gap-8">
          <div class="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 group hover:shadow-2xl transition-all duration-500 flex flex-col justify-between">
             <div class="flex items-center gap-5 mb-8">
               <div class="w-20 h-20 bg-blue-100 text-blue-600 rounded-[30px] flex items-center justify-center font-black text-3xl group-hover:scale-110 transition-transform">RH</div>
               <div>
                 <p class="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">${t('farm.manager_label')} ১</p>
                 <h4 class="text-2xl font-black text-slate-900 leading-tight">${state.language === 'bn' ? 'মোঃ রাফিক হুসাইন' : 'MD RAFIK HOSSAIN'}</h4>
               </div>
             </div>
             <div class="space-y-4">
               <a href="tel:01304652352" class="flex items-center gap-4 p-4 bg-stone-50 rounded-2xl hover:bg-blue-50 transition-colors">
                 <svg class="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                 <span class="text-lg font-bold text-slate-600">01304652352</span>
               </a>
             </div>
          </div>

          <div class="bg-white p-8 rounded-[40px] shadow-sm border border-slate-100 group hover:shadow-2xl transition-all duration-500 flex flex-col justify-between">
             <div class="flex items-center gap-5 mb-8">
               <div class="w-20 h-20 bg-blue-100 text-blue-600 rounded-[30px] flex items-center justify-center font-black text-3xl group-hover:scale-110 transition-transform">SH</div>
               <div>
                 <p class="text-[10px] font-black uppercase tracking-[0.2em] text-blue-500">${t('farm.manager_label')} ২</p>
                 <h4 class="text-2xl font-black text-slate-900 leading-tight">${state.language === 'bn' ? 'মোঃ সাগর হোসেন' : 'MD SAGAR HOSEN'}</h4>
               </div>
             </div>
             <div class="space-y-4">
               <a href="tel:01723447229" class="flex items-center gap-4 p-4 bg-stone-50 rounded-2xl hover:bg-blue-50 transition-colors">
                 <svg class="w-6 h-6 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
                 <span class="text-lg font-bold text-slate-600">01723447229</span>
               </a>
             </div>
          </div>
        </div>
      </div>
    </div>
  </section>
`;

const OrderForm = () => `
  <section id="order" class="pt-24 lg:pt-32 pb-12 lg:pb-20 px-4 min-h-screen bg-stone-50">
    <div class="max-w-4xl mx-auto">
      <div class="text-center mb-10 space-y-4">
        <h2 class="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter">${t('order.title')}</h2>
        <p class="text-slate-500 text-xl leading-relaxed">${t('order.subtitle')}</p>
      </div>

      <div class="bg-white p-8 md:p-12 rounded-[50px] shadow-2xl border border-slate-100">
        <form id="orderForm" class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="space-y-6">
            <div>
              <label class="block text-sm font-black text-slate-700 mb-2 uppercase tracking-widest">${t('order.name')}</label>
              <input type="text" name="name" required class="w-full px-6 py-4 rounded-2xl bg-stone-50 border-none focus:ring-2 focus:ring-blue-600 outline-none transition-all" placeholder="Rahim Ahmed" />
            </div>
            <div>
              <label class="block text-sm font-black text-slate-700 mb-2 uppercase tracking-widest">${t('order.phone')}</label>
              <input type="tel" name="phone" required class="w-full px-6 py-4 rounded-2xl bg-stone-50 border-none focus:ring-2 focus:ring-blue-600 outline-none transition-all" placeholder="017XXXXXXXX" />
            </div>
            <div>
              <label class="block text-sm font-black text-slate-700 mb-2 uppercase tracking-widest">${t('order.address')}</label>
              <textarea name="address" required rows="3" class="w-full px-6 py-4 rounded-2xl bg-stone-50 border-none focus:ring-2 focus:ring-blue-600 outline-none transition-all" placeholder="আপনার সম্পূর্ণ ডেলিভারি ঠিকানা..."></textarea>
            </div>
          </div>

          <div class="space-y-6">
            <div>
              <label class="block text-sm font-black text-slate-700 mb-2 uppercase tracking-widest">${t('order.product')}</label>
              <select name="product" required class="w-full px-6 py-4 rounded-2xl bg-stone-50 border-none focus:ring-2 focus:ring-blue-600 outline-none transition-all appearance-none cursor-pointer">
                <option value="cow">${t('order.products.cow')}</option>
                <option value="buffalo">${t('order.products.buffalo')}</option>
                <option value="ghee">${t('order.products.ghee')}</option>
              </select>
            </div>
            <div>
              <label class="block text-sm font-black text-slate-700 mb-2 uppercase tracking-widest">${t('order.quantity')}</label>
              <input type="number" name="quantity" required min="1" class="w-full px-6 py-4 rounded-2xl bg-stone-50 border-none focus:ring-2 focus:ring-blue-600 outline-none transition-all" placeholder="যেমন: ৫" />
            </div>
            <div>
              <label class="block text-sm font-black text-slate-700 mb-2 uppercase tracking-widest">${t('order.schedule')}</label>
              <select name="schedule" required class="w-full px-6 py-4 rounded-2xl bg-stone-50 border-none focus:ring-2 focus:ring-blue-600 outline-none transition-all appearance-none cursor-pointer">
                <option value="once">${t('order.schedules.once')}</option>
                <option value="daily">${t('order.schedules.daily')}</option>
                <option value="weekly">${t('order.schedules.weekly')}</option>
              </select>
            </div>
          </div>

          <div class="md:col-span-2 pt-6 border-t border-slate-100 mt-4">
            <div class="bg-blue-50 p-6 rounded-3xl mb-8 border border-blue-100 flex items-center gap-4">
              <svg class="w-10 h-10 text-blue-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
              <p class="text-blue-700 text-sm font-bold leading-relaxed">${t('order.payment_note')}</p>
            </div>
            <button type="submit" class="w-full bg-blue-600 text-white py-6 rounded-2xl font-black text-2xl hover:bg-blue-700 shadow-2xl shadow-blue-200 transition-all flex items-center justify-center gap-4 group">
              <svg class="w-8 h-8 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"/></svg>
              ${t('order.submit')}
            </button>
          </div>
        </form>
      </div>
    </div>
  </section>
`;

const Login = () => `
  <section id="login" class="min-h-screen pt-24 pb-12 px-4 flex justify-center items-center bg-blue-50/20">
    <div class="w-full max-w-md bg-white p-8 md:p-12 rounded-[50px] shadow-2xl border border-slate-100">
      <div class="text-center mb-10">
        <h2 class="text-3xl font-black text-slate-900 tracking-tighter">${state.language === 'bn' ? 'লগইন করুন' : 'Sign In'}</h2>
        <p class="text-slate-500 mt-2 font-bold text-sm uppercase tracking-widest">আপনার পছন্দের রোল নির্বাচন করুন</p>
      </div>
      
      <div class="flex gap-2 mb-8 p-1.5 bg-slate-100 rounded-3xl overflow-x-auto no-scrollbar">
        ${['ADMIN', 'ENTREPRENEUR', 'CUSTOMER'].map(role => `
          <button onclick="setRole('${role}')" class="flex-1 min-w-[100px] py-4 rounded-2xl text-xs font-black transition-all ${state.userRole === role ? 'bg-white text-blue-600 shadow-xl' : 'text-slate-500 hover:text-slate-700'}">
            ${role === 'ADMIN' ? 'এডমিন' : role === 'CUSTOMER' ? 'গ্রাহক' : 'উদ্যোক্তা'}
          </button>
        `).join('')}
      </div>

      <form id="authForm" class="space-y-6">
        <div>
          <label class="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">ইমেইল</label>
          <input type="email" required class="w-full px-6 py-4 rounded-2xl bg-stone-50 border-none focus:ring-2 focus:ring-blue-600 outline-none transition-all" placeholder="example@email.com" />
        </div>
        <div>
          <label class="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">পাসওয়ার্ড</label>
          <input type="password" required class="w-full px-6 py-4 rounded-2xl bg-stone-50 border-none focus:ring-2 focus:ring-blue-600 outline-none transition-all" placeholder="••••••••" />
        </div>
        <button type="submit" class="w-full bg-blue-600 text-white py-5 rounded-2xl font-black text-xl hover:bg-blue-700 shadow-xl shadow-blue-100 transition-all transform hover:scale-[1.02]">প্রবেশ করুন</button>
      </form>
    </div>
  </section>
`;

const Dashboard = () => `
  <section id="dashboard" class="pt-24 lg:pt-40 pb-16 lg:pb-32 px-4">
    <div class="max-w-7xl mx-auto">
      <div class="flex flex-col lg:flex-row gap-12 items-start">
        <aside class="w-full lg:w-72 flex lg:flex-col gap-3 overflow-x-auto pb-4 lg:pb-0 no-scrollbar sticky top-28">
          <button class="flex-1 lg:w-full whitespace-nowrap text-left px-8 py-4 rounded-2xl bg-blue-600 text-white font-black shadow-xl shadow-blue-100 transition-all">ওভারভিউ</button>
          <button class="flex-1 lg:w-full whitespace-nowrap text-left px-8 py-4 rounded-2xl text-slate-600 font-bold hover:bg-slate-100 transition-all">রিপোর্ট</button>
          <button class="flex-1 lg:w-full whitespace-nowrap text-left px-8 py-4 rounded-2xl text-slate-600 font-bold hover:bg-slate-100 transition-all">সেটিংস</button>
        </aside>

        <main class="flex-1 w-full bg-white p-10 md:p-16 rounded-[50px] shadow-sm border border-slate-100">
          <div class="mb-12 space-y-2">
            <h2 class="text-3xl md:text-5xl font-black text-slate-900 tracking-tighter">স্বাগতম, ${state.userRole}</h2>
            <div class="h-1.5 w-24 bg-blue-600 rounded-full"></div>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            <div class="p-8 bg-blue-50 rounded-[40px] border border-blue-100 group hover:shadow-2xl transition-all">
              <p class="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">মোট উৎপাদন</p>
              <h4 class="text-4xl font-black text-slate-900 mt-4">৪৫০ লিটার</h4>
            </div>
            <div class="p-8 bg-emerald-50 rounded-[40px] border border-emerald-100 group hover:shadow-2xl transition-all">
              <p class="text-[10px] font-black text-emerald-600 uppercase tracking-[0.2em]">অর্ডার সম্পন্ন</p>
              <h4 class="text-4xl font-black text-slate-900 mt-4">১২০টি</h4>
            </div>
            <div class="p-8 bg-amber-50 rounded-[40px] border border-amber-100 md:col-span-2 xl:col-span-1 group hover:shadow-2xl transition-all">
              <p class="text-[10px] font-black text-amber-600 uppercase tracking-[0.2em]">পেন্ডিং অর্ডার</p>
              <h4 class="text-4xl font-black text-slate-900 mt-4">০৫টি</h4>
            </div>
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
        <div class="flex items-center gap-3">
          <div class="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
            <svg class="text-white w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg>
          </div>
          <h4 class="text-2xl font-black tracking-tighter">Eco Dairy Farm</h4>
        </div>
        <p class="text-slate-400 text-sm leading-relaxed">যাদুরানী, ঠাকুরগাঁওয়ে অবস্থিত আমাদের খামারে উৎপাদিত বিষমুক্ত ও স্বাস্থ্যকর খাঁটি দুধ সরাসরি আপনার টেবিলে পৌঁছে দিতে আমরা বদ্ধপরিকর।</p>
      </div>
      <div class="space-y-6">
        <h5 class="font-black text-blue-500 uppercase tracking-widest text-xs">${state.language === 'bn' ? 'দ্রুত লিংক' : 'Quick Links'}</h5>
        <div class="flex flex-col gap-4 text-slate-400 text-sm font-bold">
          <button onclick="handleNavClick('home')" class="text-left hover:text-white transition-colors">${t('nav.home')}</button>
          <button onclick="handleNavClick('about')" class="text-left hover:text-white transition-colors">${t('nav.about')}</button>
          <button onclick="handleNavClick('gallery')" class="text-left hover:text-white transition-colors">${t('nav.gallery')}</button>
          <button onclick="handleNavClick('order')" class="text-left text-blue-500 hover:text-blue-400 transition-colors uppercase tracking-widest text-xs font-black">${t('nav.order')}</button>
        </div>
      </div>
      <div class="space-y-6">
        <h5 class="font-black text-blue-500 uppercase tracking-widest text-xs">${state.language === 'bn' ? 'যোগাযোগ' : 'Contact'}</h5>
        <div class="flex flex-col gap-6 text-slate-400 text-sm">
          <div class="flex gap-4">
            <svg class="w-6 h-6 text-blue-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>
            <p>যাদুরানী, কামারপুকুর, হরিপুর, ঠাকুরগাঁও</p>
          </div>
          <div class="flex gap-4">
            <svg class="w-6 h-6 text-blue-600 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"/></svg>
            <p>01723447229</p>
          </div>
        </div>
      </div>
      <div class="space-y-6">
        <h5 class="font-black text-blue-500 uppercase tracking-widest text-xs">${state.language === 'bn' ? 'নিউজলেটার' : 'Newsletter'}</h5>
        <div class="flex bg-slate-800 p-2 rounded-2xl">
          <input type="email" placeholder="আপনার ইমেইল..." class="bg-transparent px-4 py-3 text-sm outline-none w-full font-bold" />
          <button class="bg-blue-600 text-white px-6 py-3 rounded-xl text-xs font-black hover:bg-blue-700 transition-colors">পাঠান</button>
        </div>
      </div>
    </div>
    <div class="max-w-7xl mx-auto pt-10 border-t border-slate-800 text-center">
      <p class="text-slate-500 text-xs font-black uppercase tracking-[0.2em]">© ${new Date().getFullYear()} ইকো ডেইরি ফার্ম (Eco Dairy Farm). All rights reserved.</p>
    </div>
  </footer>
`;

// --- Rendering Engine ---
const render = () => {
  const root = document.getElementById('root');
  const hash = window.location.hash.replace('#', '') || 'home';
  
  let content = Navbar();

  if (hash === 'login') {
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
  } else if (hash === 'order') {
    content += OrderForm();
  } else {
    content += Home();
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
      notify(state.language === 'bn' ? 'লগইন সফল হয়েছে!' : 'Login successful!');
      render();
    });
  }

  const orderForm = document.getElementById('orderForm');
  if (orderForm) {
    orderForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const formData = new FormData(orderForm);
      const orderDetails = Object.fromEntries(formData.entries());
      console.log('Order Received:', orderDetails);
      notify(t('order.success'));
      orderForm.reset();
      setTimeout(() => {
        handleNavClick('home');
      }, 3000);
    });
  }

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
  console.log("EcoDairy Farm App - Modern Visitor View Initialized");
});
