
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  Settings, 
  LayoutDashboard, 
  FileText, 
  Image as ImageIcon,
  MoreVertical,
  CheckCircle,
  XCircle,
  TrendingUp,
  UserPlus,
  Clock,
  Check,
  X,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  ArrowUpRight,
  PieChart as PieChartIcon,
  BarChart3
} from 'lucide-react';
import { MOCK_USERS } from '../constants.ts';
import { useLanguage } from '../contexts/LanguageContext.tsx';
import { useToast } from '../contexts/ToastContext.tsx';

interface ApprovalRequest {
  id: string;
  entrepreneurId: string;
  entrepreneurName: string;
  type: 'BUSINESS_UPDATE' | 'NID_UPDATE' | 'PRODUCT_ADD';
  details: any;
  timestamp: string;
}

const SimpleLineChart = ({ data }: { data: number[] }) => {
  const max = Math.max(...data);
  const points = data.map((val, i) => `${(i / (data.length - 1)) * 100},${100 - (val / max) * 100}`).join(' ');
  
  return (
    <svg viewBox="0 0 100 100" className="w-full h-24 overflow-visible">
      <defs>
        <linearGradient id="lineGradient" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2563eb" stopOpacity="0.2" />
          <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path
        d={`M 0 100 L ${points} L 100 100 Z`}
        fill="url(#lineGradient)"
      />
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

const ExpandableMetricCard = ({ title, summary, details, icon, value, change, chart }: any) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  return (
    <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden transition-all duration-300">
      <div 
        className="p-6 cursor-pointer hover:bg-slate-50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="p-3 bg-slate-50 rounded-2xl">{icon}</div>
          <div className="flex flex-col items-end">
            <span className={`text-sm font-bold flex items-center gap-1 ${change.includes('+') ? 'text-green-600' : 'text-orange-500'}`}>
              {change} {change.includes('+') ? <ArrowUpRight size={14} /> : null}
            </span>
            {isExpanded ? <ChevronUp size={16} className="text-slate-400 mt-1" /> : <ChevronDown size={16} className="text-slate-400 mt-1" />}
          </div>
        </div>
        <p className="text-slate-500 text-sm font-medium">{title}</p>
        <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
        <p className="text-xs text-slate-400 mt-2 line-clamp-1">{summary}</p>
      </div>
      
      <div className={`transition-all duration-500 ease-in-out overflow-hidden ${isExpanded ? 'max-height-96 border-t border-slate-100 p-6' : 'max-height-0 p-0'}`} style={{ maxHeight: isExpanded ? '500px' : '0px' }}>
        <div className="space-y-4">
          <div className="bg-slate-50 p-4 rounded-2xl">
            <p className="text-sm text-slate-600 mb-2 font-bold">Trend Analysis</p>
            {chart}
          </div>
          <p className="text-sm text-slate-600 leading-relaxed">{details}</p>
        </div>
      </div>
    </div>
  );
};

const AdminDashboard: React.FC = () => {
  const { language } = useLanguage();
  const { showToast } = useToast();
  const [activeTab, setActiveTab] = useState('overview');
  const [approvals, setApprovals] = useState<ApprovalRequest[]>([]);

  useEffect(() => {
    const handleExternalTabChange = (e: any) => {
      if (e.detail) setActiveTab(e.detail);
    };
    window.addEventListener('changeTab', handleExternalTabChange);

    const loadApprovals = () => {
      const stored = localStorage.getItem('pending_approvals');
      if (stored) setApprovals(JSON.parse(stored));
    };
    loadApprovals();
    window.addEventListener('storage', loadApprovals);
    return () => {
      window.removeEventListener('changeTab', handleExternalTabChange);
      window.removeEventListener('storage', loadApprovals);
    };
  }, []);

  const handleAction = (requestId: string, approved: boolean) => {
    const request = approvals.find(a => a.id === requestId);
    if (!request) return;

    if (approved) {
      const currentData = JSON.parse(localStorage.getItem(`user_profile_${request.entrepreneurId}`) || '{}');
      const newData = { ...currentData, ...request.details };
      localStorage.setItem(`user_profile_${request.entrepreneurId}`, JSON.stringify(newData));
      showToast(`Request Approved: ${request.type} for ${request.entrepreneurName}`, 'SUCCESS');
    } else {
      showToast(`Request Rejected: ${request.type} for ${request.entrepreneurName}`, 'ERROR');
    }

    const updated = approvals.filter(a => a.id !== requestId);
    localStorage.setItem('pending_approvals', JSON.stringify(updated));
    setApprovals(updated);
    window.dispatchEvent(new Event('storage'));
  };

  const metricData = [
    { 
      id: 'users',
      label: 'Total Users', 
      value: '1,284', 
      change: '+12%', 
      summary: 'Growth across all categories this month.',
      details: 'Customer acquisition is up by 15%, while entrepreneur registrations saw a steady 8% increase compared to last quarter.',
      icon: <Users className="text-blue-600" />,
      chart: <SimpleLineChart data={[30, 45, 35, 60, 55, 80, 75]} />
    },
    { 
      id: 'approvals',
      label: 'Pending Approvals', 
      value: approvals.length.toString(), 
      change: approvals.length > 5 ? '-2%' : 'All Clear', 
      summary: 'Action required on pending requests.',
      details: 'There are currently several high-priority NID verification requests. Typical processing time is down to 4 hours.',
      icon: <Clock className="text-orange-500" />,
      chart: <SimpleLineChart data={[10, 5, 8, 3, 12, 7, approvals.length]} />
    },
    { 
      id: 'transactions',
      label: 'Transactions', 
      value: '$42,500', 
      change: '+5%', 
      summary: 'Revenue from enterprise subscriptions.',
      details: 'Primary growth drivers include basic entrepreneur plans and custom enterprise solutions for larger farms.',
      icon: <BarChart3 className="text-green-600" />,
      chart: <SimpleLineChart data={[40000, 41000, 39500, 42000, 41500, 43000, 42500]} />
    },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <aside className="lg:w-64 shrink-0">
            <div className="bg-white rounded-3xl border border-slate-200 p-4 shadow-sm sticky top-28">
              <nav className="space-y-1">
                <button 
                  onClick={() => setActiveTab('overview')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'overview' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <LayoutDashboard size={20} />
                  Overview
                </button>
                <button 
                  onClick={() => setActiveTab('approvals')}
                  className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'approvals' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <div className="flex items-center gap-3">
                    <Clock size={20} />
                    Approvals
                  </div>
                  {approvals.length > 0 && (
                    <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === 'approvals' ? 'bg-white text-blue-600' : 'bg-orange-500 text-white'}`}>
                      {approvals.length}
                    </span>
                  )}
                </button>
                <button 
                  onClick={() => setActiveTab('users')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'users' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <Users size={20} />
                  User Management
                </button>
                <button 
                  onClick={() => setActiveTab('content')}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === 'content' ? 'bg-blue-600 text-white shadow-lg shadow-blue-200' : 'text-slate-600 hover:bg-slate-50'}`}
                >
                  <FileText size={20} />
                  Content Management
                </button>
              </nav>
            </div>
          </aside>

          {/* Main Panel */}
          <main className="flex-1 space-y-8">
            {activeTab === 'overview' && (
              <div className="animate-in fade-in duration-500">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  {metricData.map((stat) => (
                    <ExpandableMetricCard 
                      key={stat.id}
                      title={stat.label}
                      value={stat.value}
                      change={stat.change}
                      summary={stat.summary}
                      details={stat.details}
                      icon={stat.icon}
                      chart={stat.chart}
                    />
                  ))}
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
                    <div className="flex items-center gap-3 mb-6">
                      <PieChartIcon className="text-blue-600" />
                      <h3 className="text-xl font-bold text-slate-900">User Distribution</h3>
                    </div>
                    <div className="flex flex-col md:flex-row items-center gap-8">
                      <div className="w-40 h-40">
                        <SimpleDonutChart segments={[
                          { color: '#2563eb', value: 750 },
                          { color: '#0ea5e9', value: 400 },
                          { color: '#f59e0b', value: 134 }
                        ]} />
                      </div>
                      <div className="space-y-3">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-blue-600"></div>
                          <span className="text-sm font-medium text-slate-600">Customers (750)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-sky-500"></div>
                          <span className="text-sm font-medium text-slate-600">Entrepreneurs (400)</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                          <span className="text-sm font-medium text-slate-600">Admin (134)</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
                    <h3 className="text-xl font-bold text-slate-900 mb-6">Recent Signups</h3>
                    <div className="space-y-4">
                      {MOCK_USERS.slice(0, 3).map(user => (
                        <div key={user.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center font-bold">
                              {user.name[0]}
                            </div>
                            <div>
                              <p className="font-bold text-slate-900">{user.name}</p>
                              <p className="text-xs text-slate-500">{user.email}</p>
                            </div>
                          </div>
                          <span className="px-3 py-1 bg-white border border-slate-200 rounded-full text-xs font-bold text-slate-600">{user.role}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'approvals' && (
              <div className="animate-in slide-in-from-bottom-4 duration-500">
                <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-8 border-b border-slate-100">
                    <h3 className="text-xl font-bold text-slate-900">Pending Approvals</h3>
                    <p className="text-slate-500 text-sm mt-1">Review sensitive actions requested by entrepreneurs.</p>
                  </div>
                  
                  {approvals.length === 0 ? (
                    <div className="p-20 text-center">
                      <div className="w-16 h-16 bg-slate-50 text-slate-300 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <CheckCircle size={32} />
                      </div>
                      <p className="text-slate-500 font-medium">No pending approval requests.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {approvals.map((req) => (
                        <div key={req.id} className="p-8 flex flex-col md:flex-row justify-between gap-6 hover:bg-slate-50/50 transition-colors">
                          <div className="flex gap-4">
                            <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shrink-0">
                              <AlertCircle size={24} />
                            </div>
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <span className="font-bold text-slate-900">{req.entrepreneurName}</span>
                                <span className="text-xs font-bold uppercase tracking-widest text-blue-500 bg-blue-50 px-2 py-0.5 rounded">
                                  {req.type.replace('_', ' ')}
                                </span>
                              </div>
                              <div className="text-sm text-slate-500 bg-white border border-slate-100 p-3 rounded-xl mt-3">
                                {Object.entries(req.details).map(([k, v]) => (
                                  <div key={k} className="flex gap-2">
                                    <span className="font-bold text-slate-400 capitalize">{k}:</span>
                                    <span className="text-slate-700">{typeof v === 'string' && v.startsWith('data:') ? 'Document/Image' : v as string}</span>
                                  </div>
                                ))}
                              </div>
                              <p className="text-[10px] text-slate-400 mt-2 font-medium">Requested on: {new Date(req.timestamp).toLocaleString()}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-3 shrink-0">
                            <button 
                              onClick={() => handleAction(req.id, false)}
                              className="flex items-center gap-2 px-5 py-2.5 bg-white border border-red-200 text-red-600 rounded-xl font-bold hover:bg-red-50 transition-all"
                            >
                              <X size={18} /> Reject
                            </button>
                            <button 
                              onClick={() => handleAction(req.id, true)}
                              className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all"
                            >
                              <Check size={18} /> Approve
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'users' && (
              <div className="bg-white rounded-[32px] border border-slate-200 shadow-sm overflow-hidden animate-in slide-in-from-bottom-4 duration-500">
                <div className="p-8 border-b border-slate-100 flex justify-between items-center">
                  <h3 className="text-xl font-bold text-slate-900">User Management</h3>
                  <button className="bg-blue-600 text-white px-4 py-2 rounded-xl text-sm font-bold flex items-center gap-2 hover:bg-blue-700 transition-colors">
                    <UserPlus size={18} /> Add User
                  </button>
                </div>
                <table className="w-full text-left">
                  <thead>
                    <tr className="bg-slate-50 text-slate-500 text-xs font-bold uppercase tracking-wider">
                      <th className="px-8 py-4">Name</th>
                      <th className="px-8 py-4">Role</th>
                      <th className="px-8 py-4">Status</th>
                      <th className="px-8 py-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {MOCK_USERS.map(user => (
                      <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-8 py-6">
                          <div className="font-bold text-slate-900">{user.name}</div>
                          <div className="text-xs text-slate-500">{user.email}</div>
                        </td>
                        <td className="px-8 py-6">
                          <span className="text-sm font-medium text-slate-600">{user.role}</span>
                        </td>
                        <td className="px-8 py-6">
                          <span className={`px-2 py-1 rounded-lg text-[10px] font-bold uppercase ${user.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                            {user.status}
                          </span>
                        </td>
                        <td className="px-8 py-6 text-right">
                          <button className="p-2 text-slate-400 hover:text-blue-600 transition-colors"><MoreVertical size={18} /></button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'content' && (
              <div className="grid md:grid-cols-2 gap-6 animate-in fade-in duration-500">
                <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <ImageIcon className="text-blue-600" />
                    <h3 className="text-xl font-bold text-slate-900">Gallery Control</h3>
                  </div>
                  <p className="text-slate-500 text-sm mb-6">Upload or remove public/private gallery items.</p>
                  <button className="w-full py-4 border-2 border-dashed border-slate-200 rounded-2xl text-slate-400 font-bold hover:border-blue-400 hover:text-blue-600 transition-all">
                    + Add New Image
                  </button>
                </div>
                <div className="bg-white p-8 rounded-[32px] border border-slate-200 shadow-sm">
                  <div className="flex items-center gap-3 mb-6">
                    <FileText className="text-blue-600" />
                    <h3 className="text-xl font-bold text-slate-900">Article Posts</h3>
                  </div>
                  <p className="text-slate-500 text-sm mb-6">Review AI generated content or draft new ones.</p>
                  <button className="w-full py-4 bg-blue-50 text-blue-600 rounded-2xl font-bold hover:bg-blue-100 transition-all">
                    Manage Articles
                  </button>
                </div>
              </div>
            )}
          </main>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
