import { useState, useRef, useEffect } from 'react';

// 1. Data Constants
const AVAILABLE_PORTS = [
  'Chennai', 'Dubai', 'Hamburg', 'Los Angeles', 'New York', 
  'Rotterdam', 'Shanghai', 'Singapore', 'Sydney', 'Tokyo'
].sort();

const CARGO_TYPES = [
  'Electronics', 'Textiles', 'Machinery', 
  'Chemicals', 'Auto Parts', 'FMCG'
];

const DEFAULT_FORM_STATE = {
  origin: 'Chennai',
  destination: 'Rotterdam',
  cargo_type: 'Electronics',
  containers: 10
};

const QUOTATION_TEMPLATES = [
  { id: 1, name: 'Trans-Pacific Tech', icon: '💻', data: { origin: 'Tokyo', destination: 'Los Angeles', cargo_type: 'Electronics', containers: 45 } },
  { id: 2, name: 'Euro Heavy Machinery', icon: '🏗️', data: { origin: 'Hamburg', destination: 'Shanghai', cargo_type: 'Machinery', containers: 12 } },
  { id: 3, name: 'Middle East Textiles', icon: '🧶', data: { origin: 'Dubai', destination: 'Sydney', cargo_type: 'Textiles', containers: 25 } }
];

// 2. Premium Split-Screen Auth Page
const AuthPage = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const endpoint = isLogin ? '/api/login' : '/api/signup';
    const payload = isLogin 
      ? { email: formData.email, password: formData.password }
      : { name: formData.name, email: formData.email, password: formData.password };

    try {
      const response = await fetch(`http://127.0.0.1:8000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      
      const data = await response.json();
      
      if (response.ok) {
        onAuthSuccess(data.name || formData.email.split('@')[0]);
      } else {
        setError(data.detail || "Authentication failed.");
      }
    } catch (err) {
      setError("Failed to connect to the backend server.");
    }
    setLoading(false);
  };

  return (
    <div className="flex h-screen w-full bg-[#020617] font-sans text-slate-200 overflow-hidden">
      
      {/* Left Panel - Visual Branding (Hidden on small screens) */}
      <div className="hidden lg:flex w-1/2 relative flex-col justify-between p-12 overflow-hidden shadow-2xl">
        {/* Dynamic Maritime Image Background */}
        <div 
          className="absolute inset-0 z-0 bg-cover bg-center scale-105 animate-pulse" 
          style={{ 
            backgroundImage: "url('https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=2000&q=80')",
            animationDuration: '20s'
          }}
        ></div>
        
        {/* Deep Gradient Overlays for Readability */}
        <div className="absolute inset-0 z-10 bg-gradient-to-br from-indigo-900/90 via-[#020617]/80 to-[#020617] backdrop-blur-[2px]"></div>
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-transparent to-[#020617]"></div>

        {/* Brand Header */}
        <div className="relative z-20 flex items-center gap-3.5">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)] border border-indigo-400/30">
            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
          </div>
          <div>
            <h1 className="text-xl font-black tracking-wide text-white drop-shadow-md">Maritime</h1>
            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-0.5 drop-shadow-[0_0_5px_rgba(99,102,241,0.5)]">Brokerage AI</p>
          </div>
        </div>

        {/* Floating AI Status Card */}
        <div className="relative z-20 mb-10">
          <h2 className="text-5xl font-black text-white leading-tight mb-6 drop-shadow-xl">
            Intelligent freight <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">routing engine.</span>
          </h2>
          <p className="text-lg text-slate-300 font-medium max-w-md leading-relaxed mb-8">
            Deploy autonomous agents to instantly compare transit times, score maritime pathways, and generate optimized pricing structures.
          </p>
          
          <div className="flex gap-4">
             <div className="bg-slate-900/60 backdrop-blur-md border border-slate-700/50 p-4 rounded-2xl shadow-xl flex items-center gap-4">
               <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500/30">
                 <span className="text-emerald-400 text-lg">⚡</span>
               </div>
               <div>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Dataset Active</p>
                 <p className="font-black text-white text-sm">2,000+ Port Nodes</p>
               </div>
             </div>
             
             <div className="bg-slate-900/60 backdrop-blur-md border border-slate-700/50 p-4 rounded-2xl shadow-xl flex items-center gap-4">
               <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center border border-blue-500/30">
                 <span className="text-blue-400 text-lg">⚓</span>
               </div>
               <div>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Agent Status</p>
                 <p className="font-black text-white text-sm">Online & Scoring</p>
               </div>
             </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        
        {/* Ambient background glow for right side */}
        <div className="absolute top-[10%] right-[20%] w-[300px] h-[300px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="w-full max-w-[420px] relative z-10 animate-fade-in-up">
          
          {/* Mobile Logo Fallback */}
          <div className="lg:hidden flex items-center justify-center gap-3 mb-10">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)] border border-indigo-400/30">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-wide text-white">Maritime AI</h1>
            </div>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-black tracking-tight text-white mb-2">
              {isLogin ? 'Welcome back' : 'Initialize workspace'}
            </h2>
            <p className="text-[14px] text-slate-400 font-medium">
              {isLogin ? 'Enter your credentials to access the Route Agent.' : 'Set up your broker profile to begin optimization.'}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg className="w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                </div>
                <input type="text" required className="w-full bg-slate-900/50 border border-slate-700/60 text-slate-200 text-sm font-semibold rounded-2xl focus:bg-slate-800 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50 block pl-11 p-4 transition-all outline-none shadow-sm" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} placeholder="Full Name" />
              </div>
            )}
            
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path></svg>
              </div>
              <input type="email" required className="w-full bg-slate-900/50 border border-slate-700/60 text-slate-200 text-sm font-semibold rounded-2xl focus:bg-slate-800 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50 block pl-11 p-4 transition-all outline-none shadow-sm" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="Email Address" />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"></path></svg>
              </div>
              <input type="password" required minLength="6" className="w-full bg-slate-900/50 border border-slate-700/60 text-slate-200 text-sm font-semibold rounded-2xl focus:bg-slate-800 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50 block pl-11 p-4 transition-all outline-none shadow-sm" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} placeholder="Password" />
            </div>

            {error && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs font-semibold flex items-center gap-3 animate-fade-in shadow-sm">
                <span className="bg-rose-500/20 rounded-full w-6 h-6 flex items-center justify-center border border-rose-500/30 shrink-0">⚠️</span> 
                {error}
              </div>
            )}

            <button type="submit" disabled={loading} className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-sm hover:bg-indigo-500 hover:shadow-[0_0_30px_rgba(79,70,229,0.4)] active:scale-[0.98] transition-all flex justify-center items-center gap-2 mt-4 disabled:opacity-50 border border-indigo-400/50">
              {loading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  Authenticating...
                </>
              ) : (isLogin ? 'Sign In →' : 'Create Access Key →')}
            </button>
          </form>

          <div className="mt-8 text-center lg:text-left">
            <p className="text-[13px] font-medium text-slate-400">
              {isLogin ? "Don't have an account?" : "Already an agent?"}
              <button type="button" onClick={() => { setIsLogin(!isLogin); setError(null); }} className="ml-2 text-indigo-400 font-bold hover:text-indigo-300 hover:underline transition-all">
                {isLogin ? 'Deploy Workspace' : 'Sign in'}
              </button>
            </p>
          </div>
          
        </div>
      </div>
    </div>
  );
};

// 3. Futuristic Dark Dropdown Component
const ModernDropdown = ({ label, value, options, onChange, icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative ${isOpen ? 'z-[100]' : 'z-10'}`} ref={dropdownRef}>
      <label className="block text-[11px] font-bold text-slate-400 mb-2.5 tracking-widest uppercase">{label}</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-4 rounded-2xl text-sm transition-all duration-300 text-left outline-none border backdrop-blur-md ${
          isOpen 
            ? 'border-indigo-500/50 bg-slate-800/80 ring-4 ring-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.2)]' 
            : 'border-slate-700/60 bg-slate-800/40 hover:bg-slate-800/80 hover:border-indigo-500/30'
        }`}
      >
        <span className="flex items-center gap-3.5 text-slate-100 font-bold">
          <span className="text-lg drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">{icon}</span>
          <span>{value}</span>
        </span>
        <svg className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isOpen ? 'rotate-180 text-indigo-400' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 9l-7 7-7-7"></path>
        </svg>
      </button>

      {isOpen && (
        <div className="absolute z-[100] w-full mt-2 bg-slate-900/95 backdrop-blur-3xl border border-slate-700/80 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] max-h-60 overflow-y-auto animate-fade-in custom-scrollbar">
          <ul className="p-2 flex flex-col gap-1">
            {options.map((option) => {
              const isSelected = value === option;
              return (
                <li key={option}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(option);
                      setIsOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all duration-200 flex items-center justify-between ${
                      isSelected 
                        ? 'bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/20' 
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white font-medium'
                    }`}
                  >
                    <span className="flex items-center gap-2">{option}</span>
                    {isSelected && (
                      <svg className="w-4 h-4 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path>
                      </svg>
                    )}
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );
};

// 4. Functional Templates Action
const TemplatesDropdown = ({ onSelectTemplate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative z-50" ref={dropdownRef}>
      <button 
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="px-5 py-2.5 rounded-xl text-sm font-bold text-indigo-300 bg-indigo-500/10 border border-indigo-500/30 hover:bg-indigo-500/20 hover:shadow-[0_0_15px_rgba(99,102,241,0.2)] active:scale-95 transition-all flex items-center gap-2.5 backdrop-blur-md"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
        Templates
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-slate-900/95 backdrop-blur-3xl border border-slate-700/80 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] animate-fade-in p-2 z-50">
          <div className="px-3 py-2 border-b border-slate-800 mb-1">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Quick Scenarios</p>
          </div>
          <div className="flex flex-col gap-1">
            {QUOTATION_TEMPLATES.map((tpl) => (
              <button key={tpl.id} onClick={() => { onSelectTemplate(tpl.data); setIsOpen(false); }} className="w-full flex items-center gap-3.5 px-3 py-3 rounded-xl text-left hover:bg-slate-800/80 transition-colors group">
                <span className="text-xl bg-slate-800 border border-slate-700 w-11 h-11 flex items-center justify-center rounded-xl group-hover:border-indigo-500/50 group-hover:shadow-[0_0_10px_rgba(99,102,241,0.2)] transition-all">{tpl.icon}</span>
                <div>
                  <p className="text-sm font-bold text-slate-200 group-hover:text-white">{tpl.name}</p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">{tpl.data.origin} → {tpl.data.destination}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// 5. Functional Profile Dropdown
const ProfileDropdown = ({ userName, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative z-50" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 shadow-sm outline-none focus:ring-4 focus:ring-indigo-500/20 backdrop-blur-md uppercase ${
          isOpen 
            ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)] border border-indigo-400 scale-105' 
            : 'bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white hover:border-slate-500 active:scale-95'
        }`}
      >
        {userName.substring(0, 2)}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-64 bg-slate-900/95 backdrop-blur-3xl border border-slate-700/80 rounded-2xl shadow-[0_20px_70px_rgba(0,0,0,0.6)] animate-fade-in p-2 z-50 origin-top-right">
          <div className="px-3 py-3 border-b border-slate-800 mb-1">
            <p className="text-sm font-extrabold text-white tracking-tight capitalize">{userName}</p>
            <p className="text-[11px] font-semibold text-slate-400 mt-0.5 tracking-wide">Broker Workspace</p>
          </div>
          <div className="flex flex-col gap-1">
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors group">
              <svg className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
              My Profile
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors group">
              <svg className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
              Workspace Settings
            </button>
            <div className="h-px bg-slate-800 my-1"></div>
            <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// 6. Main App Component
export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState('');
  
  const [activeTab, setActiveTab] = useState('new_quotation');
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [formData, setFormData] = useState(DEFAULT_FORM_STATE);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isExporting, setIsExporting] = useState(false);
  const [isBooking, setIsBooking] = useState(false);

  // Intercept unauthenticated users
  if (!isAuthenticated) {
    return <AuthPage onAuthSuccess={(name) => {
      setCurrentUser(name);
      setIsAuthenticated(true);
    }} />;
  }

  const handleReset = () => {
    setFormData(DEFAULT_FORM_STATE);
    setResult(null);
    setError(null);
  };

  const handleApplyTemplate = (templateData) => {
    setFormData(templateData);
    setResult(null);
    setError(null);
  };

  const handleAnalyze = async () => {
    if (formData.origin === formData.destination) {
      setError("Origin and destination ports cannot be the same.");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);
    
    try {
      const response = await fetch('http://127.0.0.1:8000/api/routes/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await response.json();
      
      if (data.status === 'success') {
        setResult(data);
      } else {
        setError(data.message || "No optimal route found for these parameters.");
      }
    } catch (err) {
      setError("Failed to connect to the Route Agent. Is the FastAPI server running?");
    }
    setLoading(false);
  };

  const handleExportPDF = () => {
    setIsExporting(true);
    setTimeout(() => {
      window.print();
      setIsExporting(false);
    }, 800);
  };

  const handleProceedToBooking = () => {
    setIsBooking(true);
    setTimeout(() => {
      setIsBooking(false);
      alert(`Booking initiated for ${result.recommended_route.origin} to ${result.recommended_route.destination}.`);
    }, 1200);
  };

  return (
    <div className="flex h-screen w-full bg-[#020617] font-sans text-slate-200 overflow-hidden">
      
      {/* Dynamic Sidebar Navigation */}
      <div className={`${isSidebarOpen ? 'w-64' : 'w-[5.5rem]'} bg-[#060B19] flex flex-col z-30 shrink-0 border-r border-slate-800/60 relative overflow-hidden shadow-2xl transition-all duration-300 ease-in-out`}>
        
        <div className="p-4 relative z-10 flex-1 flex flex-col">
          {/* Logo Section */}
          <div className={`flex items-center ${isSidebarOpen ? 'gap-3.5 mb-10 mt-2 px-2' : 'justify-center mb-10 mt-2'} transition-all duration-300`}>
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(99,102,241,0.4)] border border-indigo-400/30">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
            </div>
            <div className={`overflow-hidden transition-all duration-300 ${isSidebarOpen ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}>
              <h1 className="text-xl font-black tracking-wide text-white drop-shadow-md whitespace-nowrap">Maritime</h1>
              <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-0.5 drop-shadow-[0_0_5px_rgba(99,102,241,0.5)] whitespace-nowrap">Brokerage AI</p>
            </div>
          </div>

          {/* AI Engine Status */}
          <div className={`bg-slate-900/60 backdrop-blur-md rounded-2xl mb-8 border border-slate-800/80 shadow-inner flex items-center justify-center ${isSidebarOpen ? 'p-4' : 'p-3'} transition-all duration-300`}>
            {isSidebarOpen ? (
              <div className="w-full">
                <div className="flex items-center gap-3 mb-1.5">
                  <div className="relative flex h-2 w-2 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"></span>
                  </div>
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider whitespace-nowrap">AI Engine Online</span>
                </div>
                <p className="text-[11px] font-medium text-slate-500 whitespace-nowrap">Route Intelligence active</p>
              </div>
            ) : (
              <div className="relative flex h-3 w-3 shrink-0" title="AI Engine Online">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"></span>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <div className={`text-[10px] font-black text-slate-600 tracking-widest mb-4 uppercase transition-all duration-300 ${isSidebarOpen ? 'ml-2 opacity-100' : 'opacity-0 h-0 mb-0 overflow-hidden'}`}>Workspace</div>
          <nav className="space-y-2">
            {[
              { id: 'dashboard', icon: '⊞', label: 'Dashboard' },
              { id: 'new_quotation', icon: '+', label: 'New Quotation' },
              { id: 'route_intel', icon: '⇄', label: 'Route Intelligence' },
              { id: 'quotations', icon: '☰', label: 'Quotations' },
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)} 
                title={!isSidebarOpen ? tab.label : ""}
                className={`flex items-center rounded-2xl transition-all duration-300 active:scale-[0.98] ${
                  isSidebarOpen ? 'w-full gap-3.5 px-4 py-3.5' : 'w-12 h-12 justify-center mx-auto'
                } ${
                  activeTab === tab.id 
                    ? 'bg-indigo-600/10 text-indigo-300 shadow-[inset_0_0_20px_rgba(99,102,241,0.15)] font-bold border border-indigo-500/20' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 font-medium border border-transparent'
                }`}
              >
                <span className={`text-lg shrink-0 ${activeTab === tab.id ? 'text-indigo-400' : 'opacity-70'}`}>{tab.icon}</span> 
                <span className={`overflow-hidden transition-all duration-300 whitespace-nowrap ${isSidebarOpen ? 'w-auto opacity-100' : 'w-0 opacity-0'}`}>
                  {tab.label}
                </span>
              </button>
            ))}
          </nav>
        </div>

        {/* Sidebar Toggle Button */}
        <div className="p-4 border-t border-slate-800/60 flex justify-center">
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="w-full h-10 rounded-xl bg-slate-800/40 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all"
          >
            <svg className={`w-5 h-5 transition-transform duration-300 ${!isSidebarOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
          </button>
        </div>

      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col relative z-0">
        
        {/* Ambient Deep Space Gradients */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
          <div className="absolute -top-[20%] -left-[10%] w-[60%] h-[60%] rounded-full bg-indigo-600/10 blur-[150px]"></div>
          <div className="absolute top-[30%] -right-[10%] w-[50%] h-[50%] rounded-full bg-purple-600/5 blur-[120px]"></div>
          <div className="absolute bottom-[-10%] left-[20%] w-[40%] h-[40%] rounded-full bg-blue-600/5 blur-[100px]"></div>
        </div>
        
        {/* Top Navbar */}
        <header className="bg-slate-950/60 backdrop-blur-2xl border-b border-slate-800/60 h-[76px] flex items-center px-10 justify-between shrink-0 sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <span className="text-[11px] font-bold text-slate-500 tracking-widest uppercase hidden sm:block">Maritime Brokerage AI</span>
            <span className="text-slate-600 font-light hidden sm:block">/</span>
            <span className="text-xs font-black text-slate-200 uppercase tracking-widest">
              {activeTab.replace('_', ' ')}
            </span>
          </div>
          
          <div className="flex items-center gap-7">
            <div className="relative group flex items-center">
              <svg className="w-4 h-4 absolute left-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
              </svg>
              <input 
                type="text" 
                placeholder="Search quotations..." 
                className="bg-slate-900/60 backdrop-blur-md border border-slate-700/60 rounded-full pl-11 pr-5 py-2.5 text-sm w-48 sm:w-72 focus:bg-slate-800 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all duration-300 outline-none font-medium text-slate-200 placeholder:text-slate-500" 
              />
            </div>
            
            <ProfileDropdown userName={currentUser} onLogout={() => setIsAuthenticated(false)} />
            
          </div>
        </header>

        {/* Dynamic Workspace */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 scroll-smooth relative z-10 custom-scrollbar">
          
          {activeTab !== 'new_quotation' ? (
            <div className="flex items-center justify-center h-full text-slate-400 flex-col gap-6 animate-fade-in">
              <div className="w-24 h-24 bg-slate-900/60 backdrop-blur-xl rounded-[2rem] flex items-center justify-center text-4xl shadow-xl border border-slate-800">🏗️</div>
              <div className="text-center">
                <h2 className="text-2xl font-black text-slate-200 mb-2">Module under construction</h2>
                <p className="text-sm font-medium text-slate-500">Navigate to <span className="text-indigo-400 font-bold cursor-pointer hover:underline" onClick={() => setActiveTab('new_quotation')}>New Quotation</span> to use the Route Agent.</p>
              </div>
            </div>
          ) : (
            <div className="max-w-6xl mx-auto animate-fade-in">
              
              {/* Header Section */}
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 relative z-30">
                <div>
                  <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-[10px] font-black tracking-widest uppercase mb-5 shadow-[0_0_15px_rgba(99,102,241,0.15)] backdrop-blur-md">
                    <span className="animate-pulse text-indigo-400 drop-shadow-[0_0_5px_rgba(99,102,241,0.8)]">✦</span> Route Intelligence Active
                  </div>
                  <h2 className="text-4xl md:text-[2.75rem] font-black tracking-tight text-white mb-2 leading-tight drop-shadow-md">
                    New freight quotation
                  </h2>
                  <p className="text-slate-400 font-medium text-lg max-w-xl">
                    Configure shipment parameters and let the Route Agent compute the optimal maritime pathway.
                  </p>
                </div>
                
                <div className="flex items-center gap-4 pb-1">
                  <button 
                    type="button"
                    onClick={handleReset}
                    className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-300 bg-slate-800/60 backdrop-blur-md border border-slate-700 hover:bg-slate-700 hover:text-white hover:border-slate-600 transition-all active:scale-[0.97] flex items-center gap-2.5 group"
                  >
                    <svg className="w-4 h-4 text-slate-400 group-hover:text-slate-300 group-hover:-rotate-180 transition-all duration-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                    </svg>
                    Reset Data
                  </button>
                  <TemplatesDropdown onSelectTemplate={handleApplyTemplate} />
                </div>
              </div>
              
              {/* Form & Sidebar Grid */}
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8 items-start relative z-20">
                
                {/* Route Details Card */}
                <div className="xl:col-span-2 relative z-40 bg-slate-900/50 backdrop-blur-2xl p-8 md:p-10 rounded-[2.5rem] shadow-2xl border border-slate-800/60 overflow-visible h-fit">
                  <div className="flex items-center gap-5 mb-10 relative z-20">
                    <div className="w-14 h-14 bg-slate-800/80 text-rose-400 rounded-2xl flex items-center justify-center font-bold text-2xl shadow-inner border border-slate-700 shrink-0">
                      <span className="drop-shadow-[0_0_10px_rgba(244,63,94,0.3)]">📍</span>
                    </div>
                    <div>
                      <h3 className="font-black text-white text-xl md:text-2xl tracking-tight mb-1 flex items-center gap-3">
                        Route details
                        <span className="w-2 h-2 rounded-full bg-indigo-500 mt-1 shadow-[0_0_10px_rgba(99,102,241,0.8)]"></span>
                      </h3>
                      <p className="text-sm text-slate-400 font-medium">Configure origin, destination, and cargo specs.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8 mb-10 relative z-50">
                     <ModernDropdown label="Origin port" value={formData.origin} options={AVAILABLE_PORTS} onChange={(val) => setFormData({...formData, origin: val})} icon="🚢" />
                     <ModernDropdown label="Destination port" value={formData.destination} options={AVAILABLE_PORTS} onChange={(val) => setFormData({...formData, destination: val})} icon="⚓" />
                     <ModernDropdown label="Cargo type" value={formData.cargo_type} options={CARGO_TYPES} onChange={(val) => setFormData({...formData, cargo_type: val})} icon="📦" />
                     
                     <div className="relative z-10">
                       <label className="block text-[11px] font-bold text-slate-400 mb-2.5 tracking-widest uppercase">Container quantity</label>
                       <div className="relative flex items-center">
                         <span className="absolute left-4 text-lg opacity-90 drop-shadow-sm pointer-events-none">🏗️</span>
                         <input 
                           type="number" 
                           min="1" 
                           className="w-full border border-slate-700/60 bg-slate-800/40 p-4 pl-[3.25rem] rounded-2xl text-sm text-slate-100 font-bold hover:bg-slate-800 hover:border-indigo-500/30 focus:bg-slate-800 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all duration-300 outline-none backdrop-blur-md [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none m-0" 
                           value={formData.containers} 
                           onChange={e => setFormData({...formData, containers: parseInt(e.target.value) || 1})} 
                         />
                       </div>
                     </div>
                  </div>

                  <button 
                    onClick={handleAnalyze}
                    disabled={loading}
                    className="relative z-0 w-full bg-indigo-600 text-white py-5 rounded-2xl font-bold text-lg hover:bg-indigo-500 hover:shadow-[0_0_30px_rgba(79,70,229,0.4)] active:scale-[0.99] transition-all duration-300 flex justify-center items-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed border border-indigo-400/50"
                  >
                    {loading ? (
                      <span className="flex items-center gap-3">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Analyzing Routes...
                      </span>
                    ) : "+ Analyze route & generate quote →"}
                  </button>

                  {error && (
                    <div className="mt-6 p-4 bg-rose-500/10 backdrop-blur-md border border-rose-500/20 text-rose-400 rounded-2xl text-sm font-semibold flex items-center gap-3.5 animate-fade-in relative z-10 shadow-sm">
                      <span className="bg-rose-500/20 rounded-full w-7 h-7 flex items-center justify-center border border-rose-500/30 shrink-0">⚠️</span> 
                      {error}
                    </div>
                  )}
                </div>

                {/* Route Agent Sidebar */}
                <div className="bg-slate-900/50 backdrop-blur-2xl p-8 md:p-10 rounded-[2.5rem] shadow-2xl border border-slate-800/60 flex flex-col relative overflow-hidden h-full z-10">
                   <div className="w-14 h-14 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl flex items-center justify-center text-indigo-400 text-2xl font-bold mb-8 relative z-10 shadow-[inset_0_0_15px_rgba(99,102,241,0.2)] shrink-0">✦</div>
                   <h3 className="font-black text-white text-2xl tracking-tight mb-3 relative z-10">Route Agent</h3>
                   <p className="text-slate-400 font-medium mb-10 leading-relaxed relative z-10 text-[15px]">
                     The AI agent compares maritime route alternatives and scores them using transit time, distance, transshipment, and historical efficiency factors.
                   </p>
                   
                   <div className="space-y-5 w-full relative z-10 mt-auto">
                     {[
                       'Find available routes',
                       'Estimate transit time',
                       'Compare alternatives',
                       'Recommend best route'
                     ].map((step, i) => (
                       <div key={i} className="flex items-center gap-4 group cursor-default">
                         <div className="text-indigo-300 font-bold text-xs bg-indigo-500/10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-indigo-500/30 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-400 group-hover:shadow-[0_0_15px_rgba(79,70,229,0.5)] transition-all duration-300">{i + 1}</div>
                         <span className="text-sm font-bold text-slate-400 group-hover:text-slate-200 transition-colors">{step}</span>
                       </div>
                     ))}
                   </div>
                </div>

              </div>

              {/* Results Dashboard */}
              {result && (
                <div className="bg-slate-900/60 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_20px_60px_rgba(0,0,0,0.4)] border border-slate-700/60 p-8 md:p-10 mt-8 animate-fade-in-up relative overflow-hidden z-10">
                  
                  <div className="flex flex-col items-center justify-center mb-10 relative z-10 text-center">
                    <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-black tracking-widest uppercase mb-5 shadow-[0_0_15px_rgba(16,185,129,0.15)]">
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span> Route Intelligence Analysis Complete
                    </div>
                    <h3 className="text-3xl md:text-5xl font-black text-white flex flex-col md:flex-row items-center gap-3 md:gap-5 tracking-tight drop-shadow-md">
                      {result.recommended_route.origin}
                      <svg className="w-8 h-8 text-indigo-400 stroke-[3px] drop-shadow-[0_0_8px_rgba(99,102,241,0.5)] rotate-90 md:rotate-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3"></path></svg>
                      {result.recommended_route.destination}
                    </h3>
                  </div>
                  
                  {/* 4-Column Aligned Grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10 relative z-10">
                    <div className="p-4 md:p-6 bg-slate-800/40 rounded-3xl text-center border border-slate-700/50 hover:bg-slate-800/80 hover:border-blue-500/30 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all duration-300 group flex flex-col justify-center">
                      <div className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-3 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2"><span className="text-blue-400 text-base md:text-lg drop-shadow-[0_0_5px_rgba(59,130,246,0.5)]">⏱️</span> Transit Time</div>
                      <div className="text-3xl md:text-4xl font-black text-white mb-1">{result.recommended_route.transit_days}</div>
                      <div className="text-xs font-bold text-slate-500">days</div>
                    </div>
                    
                    <div className="p-4 md:p-6 bg-slate-800/40 rounded-3xl text-center border border-slate-700/50 hover:bg-slate-800/80 hover:border-indigo-500/30 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all duration-300 group flex flex-col justify-center">
                      <div className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-3 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2"><span className="text-indigo-400 text-base md:text-lg drop-shadow-[0_0_5px_rgba(99,102,241,0.5)]">📏</span> Distance</div>
                      <div className="text-3xl md:text-4xl font-black text-white mb-1">{result.recommended_route.distance_nm.toLocaleString()}</div>
                      <div className="text-xs font-bold text-slate-500">NM</div>
                    </div>
                    
                    <div className="p-4 md:p-6 bg-slate-800/40 rounded-3xl text-center border border-slate-700/50 hover:bg-slate-800/80 hover:border-purple-500/30 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] transition-all duration-300 group flex flex-col justify-center">
                      <div className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-3 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2"><span className="text-purple-400 text-base md:text-lg drop-shadow-[0_0_5px_rgba(168,85,247,0.5)]">⚓</span> Stops</div>
                      <div className="text-3xl md:text-4xl font-black text-white mb-1">{result.recommended_route.transshipments}</div>
                      <div className="text-xs font-bold text-slate-500">transshipments</div>
                    </div>
                    
                    <div className="p-4 md:p-6 bg-emerald-500/10 rounded-3xl text-center border border-emerald-500/20 shadow-[inset_0_0_20px_rgba(16,185,129,0.05)] hover:border-emerald-400/40 hover:shadow-[0_0_25px_rgba(16,185,129,0.2)] transition-all duration-300 flex flex-col justify-center">
                      <div className="text-[9px] md:text-[10px] text-emerald-400 font-bold uppercase tracking-widest mb-3">Route Score</div>
                      <div className="text-3xl md:text-4xl font-black text-emerald-400 mb-1 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]">{result.recommended_route.route_score.toFixed(1)}</div>
                      <div className="text-xs font-bold text-emerald-500/70">/ 10</div>
                    </div>
                  </div>

                  <div className="bg-slate-800/40 rounded-3xl p-6 md:p-8 border border-slate-700/50 shadow-inner relative z-10">
                    <h4 className="font-bold text-slate-200 mb-5 flex items-center gap-3 text-[11px] uppercase tracking-widest">
                      <span className="text-indigo-400 bg-indigo-500/10 p-1.5 rounded-lg border border-indigo-500/20 shadow-[0_0_10px_rgba(99,102,241,0.2)]">✦</span> Route Intelligence Breakdown
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {result.explanation.map((exp, index) => (
                        <div key={index} className="flex items-center gap-3 text-sm font-bold text-slate-300 bg-slate-900/80 px-4 py-3.5 rounded-xl border border-slate-700 hover:border-slate-600 transition-colors">
                          <span className="text-emerald-400 bg-emerald-500/10 p-0.5 rounded-full flex items-center justify-center border border-emerald-500/20 shrink-0">
                            <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                          </span> 
                          {exp}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Functional Action Buttons */}
                  <div className="mt-8 flex flex-col sm:flex-row items-center justify-end gap-4 relative z-10 pt-6 border-t border-slate-800">
                    <button 
                      onClick={handleExportPDF}
                      disabled={isExporting}
                      className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-sm font-bold text-slate-300 bg-slate-800 border border-slate-700 hover:bg-slate-700 hover:text-white active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                      {isExporting ? "Preparing PDF..." : (
                        <>
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                          Export PDF
                        </>
                      )}
                    </button>
                    
                    <button 
                      onClick={handleProceedToBooking}
                      disabled={isBooking}
                      className="w-full sm:w-auto px-8 py-3.5 rounded-xl text-sm font-bold text-white bg-indigo-600 shadow-[0_0_20px_rgba(79,70,229,0.4)] hover:bg-indigo-500 active:scale-[0.98] transition-all flex items-center justify-center gap-2 border border-indigo-400/50"
                    >
                      {isBooking ? (
                        <span className="flex items-center gap-2">
                          <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                          Processing...
                        </span>
                      ) : (
                        <>
                          Proceed to Booking
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                        </>
                      )}
                    </button>
                  </div>

                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}