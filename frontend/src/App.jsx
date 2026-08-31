import { useState, useRef, useEffect } from 'react';

// 1. Define the dynamic arrays matching your backend dataset exactly
const AVAILABLE_PORTS = [
  'Chennai', 'Dubai', 'Hamburg', 'Los Angeles', 'New York', 
  'Rotterdam', 'Shanghai', 'Singapore', 'Sydney', 'Tokyo'
].sort();

const CARGO_TYPES = [
  'Electronics', 'Textiles', 'Machinery', 
  'Chemicals', 'Auto Parts', 'FMCG'
];

// 2. Custom UI Component for Modern Dropdowns
const ModernDropdown = ({ label, value, options, onChange, icon }) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
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
    <div className="relative" ref={dropdownRef}>
      <label className="block text-sm font-semibold text-slate-700 mb-2">{label}</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between border border-slate-200 bg-white p-3.5 rounded-xl text-slate-700 hover:border-blue-400 focus:ring-4 focus:ring-blue-500/10 transition-all duration-200 text-left shadow-sm"
      >
        <span className="flex items-center gap-2">
          <span className="text-blue-500">{icon}</span>
          <span className="font-medium">{value}</span>
        </span>
        <svg className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
      </button>

      {isOpen && (
        <div className="absolute z-50 w-full mt-2 bg-white border border-slate-100 rounded-xl shadow-xl max-h-60 overflow-y-auto animate-fade-in custom-scrollbar">
          <ul className="p-2">
            {options.map((option) => (
              <li key={option}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(option);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-2.5 rounded-lg text-sm transition-colors duration-150 flex items-center justify-between ${
                    value === option 
                      ? 'bg-blue-50 text-blue-700 font-semibold' 
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'
                  }`}
                >
                  {option}
                  {value === option && <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path></svg>}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};


// 3. Main Application Component
export default function App() {
  const [activeTab, setActiveTab] = useState('new_quotation');

  const [formData, setFormData] = useState({
    origin: 'Chennai',
    destination: 'Rotterdam',
    cargo_type: 'Electronics',
    containers: 10
  });
  
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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

  return (
    <div className="flex h-screen w-full bg-[#f8fafc] font-sans">
      
      {/* Sidebar Navigation */}
      <div className="w-64 bg-[#0B1120] text-white flex flex-col shadow-2xl z-20 shrink-0">
        <div className="p-6">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"></path></svg>
            </div>
            <div>
              <h1 className="text-xl font-bold tracking-wide">Maritime</h1>
              <p className="text-[11px] font-medium text-blue-400 uppercase tracking-wider mt-0.5">Brokerage AI</p>
            </div>
          </div>

          <div className="bg-[#1e293b]/50 backdrop-blur-md rounded-xl p-4 mb-8 border border-white/5">
            <div className="flex items-center gap-2 mb-1">
              <div className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </div>
              <span className="text-sm font-semibold text-slate-200">AI Engine Online</span>
            </div>
            <p className="text-xs text-slate-400">Route Intelligence active</p>
          </div>

          <div className="text-xs font-bold text-slate-500 tracking-widest mb-4 ml-2">WORKSPACE</div>
          <nav className="space-y-1.5">
            {[
              { id: 'dashboard', icon: '⊞', label: 'Dashboard' },
              { id: 'new_quotation', icon: '+', label: 'New Quotation' },
              { id: 'route_intel', icon: '⇄', label: 'Route Intelligence' },
              { id: 'quotations', icon: '☰', label: 'Quotations' },
            ].map((tab) => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)} 
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  activeTab === tab.id 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/20 font-medium' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/50 font-medium'
                }`}
              >
                <span className={`text-lg ${activeTab === tab.id ? 'opacity-100' : 'opacity-70'}`}>{tab.icon}</span> 
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden relative">
        {/* Top Navbar */}
        <header className="bg-white/80 backdrop-blur-md border-b border-slate-200/60 h-16 flex items-center px-8 justify-between shrink-0 sticky top-0 z-10">
          <div className="text-sm text-slate-500 font-medium">Maritime Brokerage AI / <span className="font-bold text-slate-800 capitalize">{activeTab.replace('_', ' ')}</span></div>
          <div className="flex items-center gap-5">
            <div className="relative">
              <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
              <input type="text" placeholder="Search quotations..." className="bg-slate-100/80 border-none rounded-full pl-9 pr-4 py-2 text-sm w-64 focus:ring-2 focus:ring-blue-500/20 focus:bg-white transition-all outline-none font-medium placeholder:text-slate-400" />
            </div>
            <div className="w-9 h-9 bg-gradient-to-tr from-blue-100 to-indigo-50 text-blue-700 rounded-full flex items-center justify-center text-sm font-bold shadow-sm border border-blue-200/50 cursor-pointer hover:shadow-md transition-shadow">KV</div>
          </div>
        </header>

        {/* Dynamic Workspace Rendering */}
        <div className="flex-1 overflow-y-auto p-10 scroll-smooth">
          
          {activeTab !== 'new_quotation' ? (
            <div className="flex items-center justify-center h-full text-slate-400 flex-col gap-5 animate-fade-in">
              <div className="w-20 h-20 bg-slate-100 rounded-2xl flex items-center justify-center text-4xl shadow-sm border border-slate-200">🏗️</div>
              <div className="text-center">
                <h2 className="text-xl font-bold text-slate-700 mb-1">Module under construction</h2>
                <p className="text-sm font-medium">Navigate to <span className="text-blue-600 font-semibold cursor-pointer" onClick={() => setActiveTab('new_quotation')}>New Quotation</span> to use the Route Agent.</p>
              </div>
            </div>
          ) : (
            <div className="max-w-6xl mx-auto animate-fade-in">
              {/* Header */}
              <div className="text-center mb-12">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-600 text-xs font-bold tracking-widest uppercase mb-4">
                  <span className="text-blue-500">✦</span> Route Intelligence
                </div>
                <h2 className="text-4xl font-black text-slate-900 mb-3 tracking-tight">New freight quotation</h2>
                <p className="text-slate-500 font-medium text-lg">Enter shipment details and let the Route Agent analyze the best maritime route.</p>
              </div>
              
              <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 mb-8">
                
                {/* Input Form */}
                <div className="xl:col-span-2 bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/40 border border-slate-100">
                  <div className="flex items-center gap-4 mb-8">
                    <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center font-bold text-2xl shadow-sm">📍</div>
                    <div>
                      <h3 className="font-bold text-slate-900 text-xl">Route details</h3>
                      <p className="text-sm text-slate-500 font-medium">Configure origin, destination, and cargo specs.</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-8 mb-8">
                     <ModernDropdown 
                        label="Origin port" 
                        value={formData.origin} 
                        options={AVAILABLE_PORTS}
                        onChange={(val) => setFormData({...formData, origin: val})}
                        icon="🚢"
                     />
                     <ModernDropdown 
                        label="Destination port" 
                        value={formData.destination} 
                        options={AVAILABLE_PORTS}
                        onChange={(val) => setFormData({...formData, destination: val})}
                        icon="⚓"
                     />
                     <ModernDropdown 
                        label="Cargo type" 
                        value={formData.cargo_type} 
                        options={CARGO_TYPES}
                        onChange={(val) => setFormData({...formData, cargo_type: val})}
                        icon="📦"
                     />
                     
                     <div className="relative">
                       <label className="block text-sm font-semibold text-slate-700 mb-2">Container quantity</label>
                       <div className="relative flex items-center">
                         <span className="absolute left-4 text-blue-500">🏗️</span>
                         <input 
                           type="number" 
                           min="1" 
                           className="w-full border border-slate-200 bg-white p-3.5 pl-12 rounded-xl text-slate-700 font-medium hover:border-blue-400 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all duration-200 outline-none shadow-sm" 
                           value={formData.containers} 
                           onChange={e => setFormData({...formData, containers: parseInt(e.target.value) || 1})} 
                         />
                       </div>
                     </div>
                  </div>

                  <button 
                    onClick={handleAnalyze}
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-4 rounded-xl font-bold text-lg hover:bg-blue-700 hover:shadow-xl hover:shadow-blue-600/20 active:scale-[0.99] transition-all duration-200 flex justify-center items-center gap-2 disabled:bg-slate-300 disabled:shadow-none disabled:active:scale-100 disabled:cursor-not-allowed"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                        Analyzing Routes...
                      </span>
                    ) : "+ Analyze route & generate quote →"}
                  </button>

                  {/* Error State UI */}
                  {error && (
                    <div className="mt-5 p-4 bg-red-50/80 border border-red-200/60 text-red-700 rounded-xl text-sm font-semibold flex items-center gap-3 animate-fade-in shadow-sm">
                      <span className="text-red-500 bg-white rounded-full w-6 h-6 flex items-center justify-center shadow-sm">⚠️</span> 
                      {error}
                    </div>
                  )}
                </div>

                {/* AI Agent Info Sidebar */}
                <div className="bg-gradient-to-b from-slate-50 to-white p-8 rounded-3xl border border-slate-200 shadow-sm flex flex-col">
                   <div className="w-12 h-12 bg-white shadow-md shadow-blue-900/5 border border-slate-100 rounded-2xl flex items-center justify-center text-blue-600 text-2xl font-bold mb-6">✦</div>
                   <h3 className="font-bold text-slate-900 text-xl mb-3">Route Agent</h3>
                   <p className="text-slate-500 font-medium mb-8 leading-relaxed">
                     The AI agent compares maritime route alternatives and scores them using transit time, distance, transshipment, and historical efficiency factors.
                   </p>
                   
                   <div className="space-y-4 w-full">
                     {[
                       'Find available routes',
                       'Estimate transit time',
                       'Compare alternatives',
                       'Recommend best route'
                     ].map((step, i) => (
                       <div key={i} className="flex items-center gap-4 p-3 rounded-xl bg-white border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
                         <div className="text-blue-600 font-bold text-sm bg-blue-50 w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border border-blue-100">{i + 1}</div>
                         <span className="text-sm font-semibold text-slate-700">{step}</span>
                       </div>
                     ))}
                   </div>
                </div>

              </div>

              {/* Results Dashboard */}
              {result && (
                <div className="bg-white rounded-3xl shadow-xl shadow-emerald-900/5 border border-emerald-100 p-10 mt-8 animate-fade-in-up">
                  
                  <div className="flex flex-col items-center justify-center mb-10 relative">
                    <div className="absolute right-0 top-0 bg-emerald-50 text-emerald-700 px-5 py-2 rounded-full text-sm font-bold border border-emerald-200 shadow-sm flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span> Recommended
                    </div>
                    <h3 className="text-4xl font-black text-slate-900 mb-3 flex items-center gap-6 tracking-tight">
                      {result.recommended_route.origin} 
                      <span className="text-slate-300 font-light">→</span> 
                      {result.recommended_route.destination}
                    </h3>
                    <p className="text-slate-500 font-medium">Recommended route selected based on optimal algorithmic scoring.</p>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-10">
                    <div className="p-6 bg-slate-50/50 rounded-2xl text-center border border-slate-200 shadow-sm hover:border-blue-300 hover:shadow-md transition-all duration-200 group">
                      <div className="text-[11px] text-slate-500 font-bold uppercase tracking-widest mb-3 group-hover:text-blue-600 transition-colors">Transit Time</div>
                      <div className="text-5xl font-black text-slate-800 mb-1">{result.recommended_route.transit_days}</div>
                      <div className="text-sm font-medium text-slate-400">days</div>
                    </div>
                    <div className="p-6 bg-slate-50/50 rounded-2xl text-center border border-slate-200 shadow-sm hover:border-blue-300 hover:shadow-md transition-all duration-200 group">
                      <div className="text-[11px] text-slate-500 font-bold uppercase tracking-widest mb-3 group-hover:text-blue-600 transition-colors">Distance</div>
                      <div className="text-5xl font-black text-slate-800 mb-1">{result.recommended_route.distance_nm.toLocaleString()}</div>
                      <div className="text-sm font-medium text-slate-400">NM</div>
                    </div>
                    <div className="p-6 bg-slate-50/50 rounded-2xl text-center border border-slate-200 shadow-sm hover:border-blue-300 hover:shadow-md transition-all duration-200 group">
                      <div className="text-[11px] text-slate-500 font-bold uppercase tracking-widest mb-3 group-hover:text-blue-600 transition-colors">Transshipments</div>
                      <div className="text-5xl font-black text-slate-800 mb-1">{result.recommended_route.transshipments}</div>
                      <div className="text-sm font-medium text-slate-400">stops</div>
                    </div>
                    <div className="p-6 bg-emerald-50/30 rounded-2xl text-center border border-emerald-200 shadow-sm hover:border-emerald-400 hover:shadow-md transition-all duration-200 group">
                      <div className="text-[11px] text-emerald-600 font-bold uppercase tracking-widest mb-3">Route Score</div>
                      <div className="text-5xl font-black text-emerald-600 mb-1">{result.recommended_route.route_score.toFixed(1)}</div>
                      <div className="text-sm font-medium text-emerald-500/70">/ 10</div>
                    </div>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50/50 rounded-2xl p-6 border border-blue-100 shadow-inner">
                    <h4 className="text-center font-bold text-blue-900 mb-5 flex items-center justify-center gap-2">
                      <span className="bg-white p-1.5 rounded-lg shadow-sm text-yellow-500">💡</span> Why this route?
                    </h4>
                    <div className="flex flex-wrap justify-center gap-x-8 gap-y-4">
                      {result.explanation.map((exp, index) => (
                        <div key={index} className="flex items-center gap-2.5 text-sm font-semibold text-slate-700 bg-white/60 px-4 py-2 rounded-xl border border-white">
                          <span className="text-emerald-500 bg-emerald-100 p-0.5 rounded-full flex items-center justify-center">
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"></path></svg>
                          </span> 
                          {exp}
                        </div>
                      ))}
                    </div>
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