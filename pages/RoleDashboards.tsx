
import React, { useState, useEffect } from 'react';
import { 
  User as UserIcon, 
  Settings, 
  Download, 
  ImageIcon, 
  Save, 
  Bell,
  Heart,
  Package,
  History,
  Store,
  FileUp,
  MapPin,
  Clock,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  TrendingUp,
  PieChart as PieChartIcon
} from 'lucide-react';
import { UserRole } from '../types.ts';
import { PRIVATE_GALLERY } from '../constants.ts';
import { useToast } from '../contexts/ToastContext.tsx';

interface RoleDashboardProps {
  role: UserRole;
  user: any;
}

const SimpleLineChart = ({ data }: { data: number[] }) => {
  const max = Math.max(...data);
  const points = data.map((val, i) => `${(i / (data.length - 1)) * 100},${100 - (val / max) * 100}`).join(' ');
  
  return (
    <svg viewBox="0 0 100 100" className="w-full h-24 overflow-visible">
      <defs>
        <linearGradient id="lineGradientRole" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2563eb" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={`M 0 100 L ${points} L 100 100 Z`} fill="url(#lineGradientRole)" />
      <polyline
        fill="none"
        stroke="#2563eb"
        strokeWidth="2"
        points={points}
        strokeLinejoin="round"
        strokeLinecap="round"
      />
    </svg>
  );
};

const SimpleDonutChart = ({ segments }: { segments: { color: string, value: number }[] }) => {
  const total = segments.reduce((acc, s) => acc + s.value, 0);
  let currentPos = 0;
  
  return (
    <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
      {segments.map((s, i) => {
        const dashArray = (s.value / total) * 283;
        const dashOffset = -currentPos;
        currentPos += dashArray;
        return (
          <circle
            key={i}
            cx="50"
            cy="50"
            r="45"
            fill="transparent"
            stroke={s.color}
            strokeWidth="10"
            strokeDasharray={`${dashArray} 283`}
            strokeDashoffset={dashOffset}
            className="transition-all duration-1000"
          />
        );
      })}
      <circle cx="50" cy="50" r="35" fill="white" />
    </svg>
  );
};

const ExpandableMetricCard = ({ title, summary, details, icon, value, chart }: any) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden transition-all duration-300">
      <div 
        className="p-6 cursor-pointer hover:bg-slate-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-slate-50 rounded-2xl">{icon}</div>
          {isExpanded ? <ChevronUp size={16} className="text-slate-400 mt-1" /> : <ChevronDown size={16} className="text-slate-400 mt-1" />}
        </div>
        <p className="text-slate-500 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
        <p className="text-xs text-slate-400 mt-2 line-clamp-1">{summary}</p>
      </div>
      
      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-height-96 border-t border-slate-100 p-6' : 'max-height-0 p-0'}`} style={{ maxHeight: isExpanded ? '500px' : '0px' }}>
        <div className="space-y-4">
          <div className="bg-slate-50 p-4 rounded-2xl">
            {chart}
          </div>
          <p className="text-sm text-slate-600 leading-relaxed font-medium">{details}</p>
        </div>
      </div>
    </div>
  );
};

const RoleDashboard: React.FC<RoleDashboardProps> = ({ role, user }) => {
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('insights');
  const [profileData, setProfileData] = useState(user);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);

  const entrepreneurId = user.id || 'muktarul_123';

  useEffect(() => {
    const handleExternalTabChange = (e: any) => {
      if (e.detail) setActiveTab(e.detail);
    };
    window.addEventListener('changeTab', handleExternalTabChange);

    const loadData = () => {
      const storedProfile = localStorage.getItem(`user_profile_${entrepreneurId}`);
      if (storedProfile) setProfileData(JSON.parse(storedProfile));
      
      const storedApprovals = localStorage.getItem('pending_approvals');
      if (storedApprovals) {
        const allPending = JSON.parse(storedApprovals);
        setPendingRequests(allPending.filter((r: any) => r.entrepreneurId === entrepreneurId));
      }
    };
    loadData();
    window.addEventListener('storage', loadData);
    return () => {
      window.removeEventListener('changeTab', handleExternalTabChange);
      window.removeEventListener('storage', loadData);
    };
  }, [entrepreneurId]);

  const requestSensitiveAction = (type: string, details: any) => {
    const newRequest = {
      id: `req_${Date.now()}`,
      entrepreneurId,
      entrepreneurName: profileData.name || 'Entrepreneur',
      type,
      details,
      timestamp: new Date().toISOString()
    };

    const currentPending = JSON.parse(localStorage.getItem('pending_approvals') || '[]');
    if (currentPending.some((r: any) => r.entrepreneurId === entrepreneurId && r.type === type)) {
      showToast('You already have a pending request of this type. Please wait for Admin approval.', 'ERROR');
      return;
    }

    const updatedPending = [...currentPending, newRequest];
    localStorage.setItem('pending_approvals', JSON.stringify(updatedPending));
    setPendingRequests(updatedPending.filter((r: any) => r.entrepreneurId === entrepreneurId));
    window.dispatchEvent(new Event('storage'));
    showToast('Request submitted for Admin approval.', 'SUCCESS');
  };

  const handleUpdateProfile = () => {
    try {
      localStorage.setItem(`user_profile_${entrepreneurId}`, JSON.stringify(profileData));
      showToast('Personal information updated successfully.', 'SUCCESS');
    } catch (e) {
      showToast('Failed to update profile. Please check inputs.', 'ERROR');
    }
  };

  const handleBusinessUpdate = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const data = {
      businessName: formData.get('businessName'),
      businessAddress: formData.get('businessAddress'),
    };
    if (!data.businessName || !data.businessAddress) {
      showToast('Please fill in all business details.', 'ERROR');
      return;
    }
    requestSensitiveAction('BUSINESS_UPDATE', data);
  };

  const handleNIDUpload = (e: React.ChangeEvent<HTMLInputElement>, side: 'front' | 'back') => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        requestSensitiveAction('NID_UPDATE', { [side]: reader.result });
      };
      reader.readAsDataURL(file);
    } else {
      showToast('File upload failed. Please try again.', 'ERROR');
    }
  };

  const tabs = [
    { id: 'insights', label: 'Insights', icon: <TrendingUp size={20} /> },
    { id: 'profile', label: 'Profile', icon: <UserIcon size={20} /> },
    { id: 'business', label: 'Business Profile', icon: <Store size={20} />, hidden: role !== 'ENTREPRENEUR' },
    { id: 'content', label: role === 'ENTREPRENEUR' ? 'Business Docs' : 'My Content', icon: role === 'ENTREPRENEUR' ? <Package size={20} /> : <Heart size={20} /> },
    { id: 'history', label: 'Order History', icon: <History size={20} /> },
    { id: 'settings', label: 'Settings', icon: <Settings size={20} /> },
  ].filter(t => !t.hidden);

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-10">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-blue-600 text-white rounded-[24px] flex items-center justify-center text-2xl font-bold shadow-lg shadow-blue-200">
              {profileData?.name?.[0] || role[0]}
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-900">Welcome, {profileData?.name || 'User'}</h1>
              <p className="text-slate-500 text-sm font-medium">Logged in as {role.toLowerCase()}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-3 bg-white border border-slate-200 rounded-xl text-slate-500 hover:text-blue-600 transition-colors">
              <Bell size={20} />
            </button>
            <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-colors">
              New Request
            </button>
          </div>
        </header>

        {pendingRequests.length > 0 && (
          <div className="mb-8 p-4 bg-orange-50 border border-orange-100 rounded-2xl flex items-center gap-3 text-orange-700 animate-in slide-in-from-top duration-500">
            <Clock size={20} className="shrink-0" />
            <div className="text-sm font-bold uppercase tracking-wider">
              You have {pendingRequests.length} update{pendingRequests.length > 1 ? 's' : ''} pending Admin approval
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Tabs */}
          <nav className="lg:w-64 shrink-0 flex lg:flex-col gap-2 overflow-x-auto pb-4 lg:pb-0">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`whitespace-nowrap flex items-center gap-3 px-6 py-3.5 rounded-2xl font-bold transition-all ${
                  activeTab === tab.id ? 'bg-white text-blue-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-500 hover:bg-white/50'
                }`}
              >
                {tab.icon}
                {tab.label}
              </button>
            ))}
          </nav>

          {/* Panel */}
          <main className="flex-1">
            <div className="bg-white rounded-[40px] border border-slate-200 shadow-sm p-8 md:p-12 animate-in fade-in duration-500">
              
              {activeTab === 'insights' && (
                <div className="space-y-8 animate-in fade-in duration-500">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ExpandableMetricCard 
                      title={role === 'ENTREPRENEUR' ? "Business Growth" : "Order Activity"}
                      value={role === 'ENTREPRENEUR' ? "4.2x" : "28 Orders"}
                      summary="Track your progress over time."
                      details={role === 'ENTREPRENEUR' 
                        ? "Your business profile views and product inquiries have increased by 30% compared to last month. Keep your documents updated for maximum trust." 
                        : "You have been more active this month. Most of your purchases were in the 'Premium Milk' category."}
                      icon={<TrendingUp className="text-blue-600" />}
                      chart={<SimpleLineChart data={[10, 20, 15, 30, 25, 45, 42]} />}
                    />
                    <ExpandableMetricCard 
                      title="Approval Status"
                      value={pendingRequests.length > 0 ? "Pending" : "Cleared"}
                      summary="Current state of your sensitive requests."
                      details="Administrative reviews are processed in batches. If your request is pending, it should be resolved within 24-48 business hours."
                      icon={<Clock className="text-orange-500" />}
                      chart={
                        <div className="w-24 h-24 mx-auto">
                          <SimpleDonutChart segments={[
                            { color: '#2563eb', value: 80 },
                            { color: '#f59e0b', value: 15 },
                            { color: '#ef4444', value: 5 }
                          ]} />
                        </div>
                      }
                    />
                  </div>
                </div>
              )}

              {activeTab === 'profile' && (
                <div className="max-w-2xl space-y-8">
                  <h3 className="text-2xl font-bold text-slate-900">Personal Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Full Name</label>
                      <input type="text" value={profileData?.name || ''} onChange={(e) => setProfileData({...profileData, name: e.target.value})} className="w-full px-5 py-3.5 rounded-xl border border-slate-100 bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-bold text-slate-700">Email Address</label>
                      <input type="email" value={profileData?.email || ''} onChange={(e) => setProfileData({...profileData, email: e.target.value})} className="w-full px-5 py-3.5 rounded-xl border border-slate-100 bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                    </div>
                  </div>
                  <button onClick={handleUpdateProfile} className="bg-slate-900 text-white px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 hover:bg-slate-800 transition-colors">
                    <Save size={18} /> Update Profile
                  </button>
                </div>
              )}

              {activeTab === 'business' && (
                <div className="space-y-10">
                  <div className="flex items-center gap-4 border-b border-slate-100 pb-6">
                    <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center">
                      <Store size={24} />
                    </div>
                    <div>
                      <h3 className="text-2xl font-bold text-slate-900">Business Details</h3>
                      <p className="text-slate-500 text-sm">Sensitive info updates require Admin verification.</p>
                    </div>
                  </div>

                  <form onSubmit={handleBusinessUpdate} className="space-y-8 max-w-2xl">
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Business Name</label>
                        <input 
                          name="businessName" 
                          type="text" 
                          defaultValue={profileData?.businessName || ''} 
                          className="w-full px-5 py-3.5 rounded-xl border border-slate-100 bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                          placeholder="My Dairy Farm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-bold text-slate-700">Business Address</label>
                        <div className="relative">
                          <MapPin size={18} className="absolute left-4 top-4 text-slate-400" />
                          <input 
                            name="businessAddress" 
                            type="text" 
                            defaultValue={profileData?.businessAddress || ''} 
                            className="w-full pl-12 pr-5 py-3.5 rounded-xl border border-slate-100 bg-slate-50 focus:ring-2 focus:ring-blue-500 outline-none transition-all" 
                            placeholder="Street, City"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8">
                      <div className="space-y-3">
                        <label className="text-sm font-bold text-slate-700">NID Front Side</label>
                        <label className="w-full flex flex-col items-center gap-3 py-10 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all">
                          <FileUp size={32} className="text-slate-400" />
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Update NID Front</span>
                          <input type="file" className="hidden" onChange={(e) => handleNIDUpload(e, 'front')} />
                        </label>
                      </div>
                      <div className="space-y-3">
                        <label className="text-sm font-bold text-slate-700">NID Back Side</label>
                        <label className="w-full flex flex-col items-center gap-3 py-10 bg-slate-50 border-2 border-dashed border-slate-200 rounded-3xl cursor-pointer hover:bg-blue-50 hover:border-blue-300 transition-all">
                          <FileUp size={32} className="text-slate-400" />
                          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Update NID Back</span>
                          <input type="file" className="hidden" onChange={(e) => handleNIDUpload(e, 'back')} />
                        </label>
                      </div>
                    </div>

                    <div className="pt-4 flex flex-col sm:flex-row items-center gap-4">
                      <button type="submit" className="w-full sm:w-auto bg-blue-600 text-white px-10 py-4 rounded-xl font-bold shadow-lg shadow-blue-100 hover:bg-blue-700 transition-all flex items-center justify-center gap-2">
                        <Save size={18} /> Request Changes
                      </button>
                      <div className="flex items-center gap-2 text-orange-500 text-xs font-bold uppercase tracking-widest">
                        <ShieldAlert size={14} />
                        Requires Admin Review
                      </div>
                    </div>
                  </form>
                </div>
              )}

              {activeTab === 'content' && (
                <div className="space-y-8">
                  <h3 className="text-2xl font-bold text-slate-900">Exclusive Content</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    {PRIVATE_GALLERY.map(item => (
                      <div key={item.id} className="group relative rounded-3xl overflow-hidden aspect-video border border-slate-100">
                        <img src={item.url} alt="Private" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <button className="bg-white p-4 rounded-2xl text-blue-600 shadow-xl"><Download size={24} /></button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'history' && (
                <div className="text-center py-20">
                  <div className="w-20 h-20 bg-slate-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-slate-300">
                    <History size={40} />
                  </div>
                  <h4 className="text-xl font-bold text-slate-900 mb-2">No activity yet</h4>
                  <p className="text-slate-500">Your recent orders and requests will appear here.</p>
                </div>
              )}

              {activeTab === 'settings' && (
                <div className="space-y-6">
                  <h3 className="text-2xl font-bold text-slate-900">Security & Notifications</h3>
                  <div className="space-y-4">
                    <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100/80 transition-colors">
                      <input type="checkbox" defaultChecked className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                      <span className="font-bold text-slate-700">Email notifications for orders</span>
                    </label>
                    <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-2xl cursor-pointer hover:bg-slate-100/80 transition-colors">
                      <input type="checkbox" className="w-5 h-5 rounded border-slate-300 text-blue-600 focus:ring-blue-500" />
                      <span className="font-bold text-slate-700">Enable Two-Factor Authentication</span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};

export default RoleDashboard;
