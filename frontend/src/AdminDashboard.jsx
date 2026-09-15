import React, { useState, useEffect, useRef } from 'react';

// --- ENTERPRISE PROFILE DROPDOWN ---
const AdminProfileDropdown = ({ onLogout, onNavigate }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative z-50" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-10 h-10 rounded-full flex items-center justify-center font-bold shadow-[0_0_15px_rgba(244,63,94,0.4)] border transition-all duration-300 ${
                    isOpen 
                    ? 'bg-rose-500 text-white border-rose-400 scale-105' 
                    : 'bg-rose-600 text-white border-rose-500 hover:bg-rose-500'
                }`}
            >
                SA
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-3 w-64 bg-slate-900/95 backdrop-blur-3xl border border-slate-700/80 rounded-2xl shadow-[0_20px_70px_rgba(0,0,0,0.6)] animate-fade-in p-2 z-50 origin-top-right">
                    <div className="px-3 py-3 border-b border-slate-800 mb-1">
                        <p className="text-sm font-extrabold text-white tracking-tight">System Administrator</p>
                        <p className="text-[11px] font-semibold text-emerald-400 mt-0.5 tracking-wide flex items-center gap-1.5">
                            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                            Network Online
                        </p>
                    </div>
                    <div className="flex flex-col gap-1">
                        <button 
                            onClick={() => { onNavigate("settings"); setIsOpen(false); }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors group"
                        >
                            <svg className="w-4 h-4 text-slate-500 group-hover:text-rose-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                            Global Settings
                        </button>
                        <button 
                            onClick={() => { onNavigate("logs"); setIsOpen(false); }}
                            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors group"
                        >
                            <svg className="w-4 h-4 text-slate-500 group-hover:text-rose-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                            Live Access Logs
                        </button>
                        <div className="h-px bg-slate-800 my-1"></div>
                        <button onClick={onLogout} className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                            Log out Network
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

// --- MAIN DASHBOARD COMPONENT ---
const AdminDashboard = () => {
    const [quotations, setQuotations] = useState([]);
    const [stats, setStats] = useState({ total: 0, pending: 0, profit: 0, revenue: 0 });
    const [activeTab, setActiveTab] = useState("overview");
    const [searchTerm, setSearchTerm] = useState("");
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    
    // Global Settings Mock State
    const [settingsToggle, setSettingsToggle] = useState({ autoApprove: false, strictEcoRouting: true, loadBalancing: true });
    
    // Live Server Logs State
    const [serverLogs, setServerLogs] = useState([
        `[SYSTEM] FastAPI Agentic Backend Initialized on Port 8000`,
        `[SYSTEM] SQLite Connection Established successfully`,
        `[AUTH] Super Admin authentication verified`
    ]);

    // Live Server Terminal Simulation
    useEffect(() => {
        if (activeTab !== "logs") return;
        
        const generateLog = () => {
            const ips = ['192.168.1.45', '10.0.0.12', '172.16.254.1', '8.8.8.8', '198.51.100.14'];
            const methods = ['GET /api/routes/analyze', 'POST /api/quotations/save', 'GET /api/quotations/list', 'OPTIONS /api/login'];
            const statuses = ['200 OK', '201 Created', '200 OK', '200 OK', '403 Forbidden'];
            
            const randomIp = ips[Math.floor(Math.random() * ips.length)];
            const randomMethod = methods[Math.floor(Math.random() * methods.length)];
            const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
            const ms = Math.floor(Math.random() * 120) + 12; // ping time
            
            const timestamp = new Date().toISOString().split('T')[1].slice(0, 8);
            
            setServerLogs(prev => [...prev, `[${timestamp}] ${randomIp} - ${randomMethod} - ${randomStatus} - ${ms}ms`].slice(-15));
        };

        const interval = setInterval(generateLog, 2500); 
        return () => clearInterval(interval);
    }, [activeTab]);

    const fetchAllQuotations = async () => {
        try {
            const res = await fetch('http://127.0.0.1:8000/api/quotations/admin');
            const data = await res.json();
            if (data.quotations) {
                setQuotations(data.quotations);
                
                const pendingCount = data.quotations.filter(q => q.status === 'pending').length;
                const approvedQuotes = data.quotations.filter(q => q.status === 'approved');
                
                const totalProfit = approvedQuotes.reduce((sum, q) => sum + q.margin, 0);
                const totalRevenue = approvedQuotes.reduce((sum, q) => sum + q.total_price, 0);

                setStats({
                    total: data.quotations.length,
                    pending: pendingCount,
                    profit: totalProfit,
                    revenue: totalRevenue
                });
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        fetchAllQuotations();
    }, []);

    const handleStatusUpdate = async (id, newStatus) => {
        try {
            await fetch(`http://127.0.0.1:8000/api/quotations/admin/status/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ status: newStatus })
            });
            fetchAllQuotations();
        } catch (err) {
            console.error(err);
        }
    };

    const handleLogout = () => {
      localStorage.removeItem('role');
      localStorage.removeItem('user_id');
      window.location.replace('/');
  };

    // --- CSV EXPORT ---
    const handleExportCSV = () => {
        const headers = ["Quote ID", "Origin", "Destination", "Cargo Type", "TEUs", "Total Revenue (USD)", "Profit Margin (USD)", "Status", "Date"];
        const csvRows = [headers.join(",")];
        
        quotations.forEach(q => {
            const row = [
                `Q-${q.id}`,
                `"${q.route_data.origin}"`,
                `"${q.route_data.destination}"`,
                `"${q.route_data.cargo_type}"`,
                q.route_data.containers,
                q.total_price,
                q.margin,
                q.status.toUpperCase(),
                new Date(q.created_at).toLocaleDateString()
            ];
            csvRows.push(row.join(","));
        });

        const csvString = csvRows.join("\n");
        const blob = new Blob([csvString], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.setAttribute('hidden', '');
        a.setAttribute('href', url);
        a.setAttribute('download', `Maritime_Platform_Ledger_${new Date().toISOString().slice(0,10)}.csv`);
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
    };

    const filteredQuotes = quotations.filter(q => {
        const searchString = `Q-${q.id} ${q.route_data.origin} ${q.route_data.destination} ${q.route_data.cargo_type}`.toLowerCase();
        return searchString.includes(searchTerm.toLowerCase());
    });

    const getTopCorridors = () => {
        const corridors = {};
        const approvedQuotes = quotations.filter(q => q.status === 'approved');
        if (approvedQuotes.length === 0) return [];
        let totalApprovedProfit = 0;
        approvedQuotes.forEach(q => {
            const routeName = `${q.route_data.origin} → ${q.route_data.destination}`;
            corridors[routeName] = (corridors[routeName] || 0) + q.margin;
            totalApprovedProfit += q.margin;
        });
        return Object.entries(corridors)
            .map(([route, profit]) => ({
                route,
                profit,
                percentage: Math.round((profit / totalApprovedProfit) * 100)
            }))
            .sort((a, b) => b.profit - a.profit)
            .slice(0, 3);
    };

    const getRecentActivity = () => {
        return [...quotations]
            .sort((a, b) => b.id - a.id)
            .slice(0, 3);
    };

    const topCorridors = getTopCorridors();
    const recentActivity = getRecentActivity();

    return (
        <div className="flex h-screen w-full bg-[#020617] font-sans text-slate-200 overflow-hidden">
            {/* --- COLLAPSIBLE SIDEBAR --- */}
            <div className={`${isSidebarOpen ? "w-64" : "w-[5.5rem]"} bg-[#060B19] border-r border-slate-800/60 flex flex-col z-30 shrink-0 shadow-2xl transition-all duration-300 ease-in-out`}>
                <div className="p-4 relative z-10 flex-1 flex flex-col">
                    {/* CLICKABLE LOGO FOR NAVIGATION */}
                    <div 
                        onClick={() => setActiveTab("overview")}
                        className={`flex items-center ${isSidebarOpen ? "gap-3" : "justify-center"} mb-10 mt-2 transition-all duration-300 cursor-pointer group`}
                    >
                        <div className="w-10 h-10 bg-gradient-to-br from-rose-500 to-orange-600 rounded-xl flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(244,63,94,0.4)] border border-rose-400/30 group-hover:scale-105 transition-transform">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"></path>
                            </svg>
                        </div>
                        <div className={`overflow-hidden transition-all duration-300 ${isSidebarOpen ? "w-auto opacity-100" : "w-0 opacity-0"}`}>
                            <h1 className="text-xl font-black text-white tracking-wide whitespace-nowrap group-hover:text-rose-100 transition-colors">Admin Core</h1>
                            <p className="text-[10px] font-bold text-rose-400 uppercase tracking-widest mt-0.5 whitespace-nowrap">Control Center</p>
                        </div>
                    </div>

                    <div className={`text-[10px] font-black text-slate-600 tracking-widest mb-4 uppercase transition-all duration-300 ${isSidebarOpen ? "ml-2 opacity-100" : "opacity-0 h-0 mb-0 overflow-hidden"}`}>
                        Modules
                    </div>
                    <nav className="space-y-2">
                        <button onClick={() => setActiveTab("overview")} title={!isSidebarOpen ? "System Overview" : ""} className={`flex items-center rounded-2xl transition-all duration-300 active:scale-[0.98] ${isSidebarOpen ? "w-full gap-3 px-4 py-3" : "w-12 h-12 justify-center mx-auto"} ${activeTab === "overview" ? "bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-[inset_0_0_20px_rgba(244,63,94,0.1)] font-bold" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent font-medium"}`}>
                            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"></path></svg>
                            <span className={`overflow-hidden transition-all duration-300 whitespace-nowrap ${isSidebarOpen ? "w-auto opacity-100" : "w-0 opacity-0"}`}>System Overview</span>
                        </button>
                        <button onClick={() => setActiveTab("quotations")} title={!isSidebarOpen ? "Quotation Ledger" : ""} className={`flex items-center rounded-2xl transition-all duration-300 active:scale-[0.98] ${isSidebarOpen ? "w-full justify-between px-4 py-3" : "w-12 h-12 justify-center mx-auto relative"} ${activeTab === "quotations" ? "bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-[inset_0_0_20px_rgba(244,63,94,0.1)] font-bold" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent font-medium"}`}>
                            <div className="flex items-center gap-3">
                                <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
                                <span className={`overflow-hidden transition-all duration-300 whitespace-nowrap ${isSidebarOpen ? "w-auto opacity-100" : "w-0 opacity-0"}`}>Quotation Ledger</span>
                            </div>
                            {stats.pending > 0 && (
                                <span className={`bg-rose-500 text-white rounded-full flex items-center justify-center font-bold ${isSidebarOpen ? "text-[10px] px-2 py-0.5" : "absolute -top-1 -right-1 w-4 h-4 text-[8px]"}`}>{stats.pending}</span>
                            )}
                        </button>
                        <button onClick={() => setActiveTab("settings")} title={!isSidebarOpen ? "Global Settings" : ""} className={`flex items-center rounded-2xl transition-all duration-300 active:scale-[0.98] ${isSidebarOpen ? "w-full gap-3 px-4 py-3" : "w-12 h-12 justify-center mx-auto"} ${activeTab === "settings" ? "bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-[inset_0_0_20px_rgba(244,63,94,0.1)] font-bold" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent font-medium"}`}>
                            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path></svg>
                            <span className={`overflow-hidden transition-all duration-300 whitespace-nowrap ${isSidebarOpen ? "w-auto opacity-100" : "w-0 opacity-0"}`}>Global Settings</span>
                        </button>
                        <button onClick={() => setActiveTab("logs")} title={!isSidebarOpen ? "Live Logs" : ""} className={`flex items-center rounded-2xl transition-all duration-300 active:scale-[0.98] ${isSidebarOpen ? "w-full gap-3 px-4 py-3" : "w-12 h-12 justify-center mx-auto"} ${activeTab === "logs" ? "bg-rose-500/10 text-rose-400 border border-rose-500/20 shadow-[inset_0_0_20px_rgba(244,63,94,0.1)] font-bold" : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 border border-transparent font-medium"}`}>
                            <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 9l3 3-3 3m5 0h3M5 20h14a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
                            <span className={`overflow-hidden transition-all duration-300 whitespace-nowrap ${isSidebarOpen ? "w-auto opacity-100" : "w-0 opacity-0"}`}>Live Access Logs</span>
                        </button>
                    </nav>
                </div>

                <div className="mt-auto border-t border-slate-800/60">
                    <div className="p-4 flex justify-center border-b border-slate-800/60">
                        <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="w-full h-10 rounded-xl bg-slate-800/40 border border-slate-700/50 flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-700 transition-all">
                            <svg className={`w-5 h-5 transition-transform duration-300 ${!isSidebarOpen ? "rotate-180" : ""}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path></svg>
                        </button>
                    </div>
                    <div className="p-4">
                        <button onClick={handleLogout} title={!isSidebarOpen ? "Logout Network" : ""} className={`flex items-center justify-center rounded-xl font-bold transition-all shadow-sm ${isSidebarOpen ? "w-full gap-2 px-4 py-3 bg-slate-800/50 hover:bg-rose-600 border border-slate-700 hover:border-rose-500 text-slate-300 hover:text-white" : "w-12 h-12 mx-auto bg-slate-800/50 hover:bg-rose-600 border border-slate-700 hover:border-rose-500 text-slate-300 hover:text-white"}`}>
                            <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path></svg>
                            <span className={`overflow-hidden transition-all duration-300 whitespace-nowrap ${isSidebarOpen ? "w-auto opacity-100" : "w-0 opacity-0"}`}>Logout Network</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="flex-1 flex flex-col relative z-0">
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
                    <div className="absolute -top-[20%] right-[10%] w-[50%] h-[50%] rounded-full bg-rose-600/5 blur-[120px]"></div>
                    <div className="absolute bottom-[10%] left-[20%] w-[40%] h-[40%] rounded-full bg-indigo-600/5 blur-[100px]"></div>
                </div>

                <header className="bg-slate-950/60 backdrop-blur-2xl border-b border-slate-800/60 h-[76px] flex items-center px-10 justify-between shrink-0 sticky top-0 z-40">
                    <div className="flex items-center gap-3">
                        {/* CLICKABLE BREADCRUMB */}
                        <button 
                            onClick={() => setActiveTab("overview")}
                            className="text-[11px] font-bold text-slate-500 hover:text-rose-400 tracking-widest uppercase transition-colors outline-none cursor-pointer"
                        >
                            Super Admin Access
                        </button>
                        <span className="text-slate-600 font-light">/</span>
                        <span className="text-xs font-black text-slate-200 uppercase tracking-widest">{activeTab.replace('_', ' ')}</span>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden md:block">
                            <p className="text-sm font-bold text-white">System Administrator</p>
                            <p className="text-[10px] font-bold text-emerald-400 uppercase tracking-widest">Network Online</p>
                        </div>
                        <AdminProfileDropdown onLogout={handleLogout} onNavigate={setActiveTab} />
                    </div>
                </header>

                <div className="flex-1 overflow-y-auto p-6 md:p-10 relative z-10 custom-scrollbar">
                    {activeTab === "overview" && (
                        <div className="max-w-6xl mx-auto animate-fade-in-up">
                            <div className="mb-8">
                                <h2 className="text-3xl font-black text-white tracking-tight">Platform Analytics</h2>
                                <p className="text-slate-400 font-medium mt-1">Live overview of agent performance and financial metrics.</p>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
                                <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-700/50 shadow-lg backdrop-blur-md">
                                    <h3 className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <span className="text-blue-400 text-lg">📄</span> Total Queries
                                    </h3>
                                    <div className="text-4xl font-black text-white">{stats.total}</div>
                                </div>
                                <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-700/50 shadow-lg backdrop-blur-md">
                                    <h3 className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <span className="text-amber-400 text-lg">⏳</span> Pending Actions
                                    </h3>
                                    <div className="text-4xl font-black text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.3)]">{stats.pending}</div>
                                </div>
                                <div className="bg-slate-900/60 p-6 rounded-3xl border border-slate-700/50 shadow-lg backdrop-blur-md">
                                    <h3 className="text-slate-400 text-[11px] font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <span className="text-indigo-400 text-lg">📈</span> Processed Revenue
                                    </h3>
                                    <div className="text-4xl font-black text-white">${stats.revenue.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}</div>
                                </div>
                                <div className="bg-emerald-500/10 p-6 rounded-3xl border border-emerald-500/20 shadow-[inset_0_0_20px_rgba(16,185,129,0.05)] backdrop-blur-md relative overflow-hidden">
                                    <h3 className="text-emerald-400 text-[11px] font-bold uppercase tracking-widest mb-2 flex items-center gap-2">
                                        <span className="text-emerald-400 text-lg">💵</span> Net Profit Margin
                                    </h3>
                                    <div className="text-4xl font-black text-emerald-400 drop-shadow-[0_0_15px_rgba(16,185,129,0.3)]">
                                        ${stats.profit.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}
                                    </div>
                                </div>
                            </div>

                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                <div className="bg-slate-900/60 rounded-3xl border border-slate-700/50 p-8 shadow-lg">
                                    <h3 className="text-lg font-black text-white tracking-tight mb-6 flex items-center gap-3">
                                        <span className="text-indigo-400 bg-indigo-500/10 p-2 rounded-xl border border-indigo-500/20">🧠</span>
                                        Live System Log
                                    </h3>
                                    <div className="space-y-4">
                                        {recentActivity.length > 0 ? (
                                            recentActivity.map((activity) => (
                                                <div key={activity.id} className="flex gap-4 items-start p-4 bg-slate-800/40 rounded-2xl border border-slate-700/50 hover:bg-slate-800/60 transition-colors">
                                                    <div className={`w-2 h-2 mt-1.5 rounded-full shadow-[0_0_8px_currentColor] shrink-0 ${
                                                        activity.status === 'approved' ? 'bg-emerald-500 text-emerald-500' :
                                                        activity.status === 'rejected' ? 'bg-rose-500 text-rose-500' :
                                                        'bg-amber-500 text-amber-500'
                                                    }`}></div>
                                                    <div>
                                                        <p className="text-sm font-bold text-slate-200">
                                                            Quotation Q-{activity.id} {activity.status === 'pending' ? 'Generated' : activity.status.charAt(0).toUpperCase() + activity.status.slice(1)}
                                                        </p>
                                                        <p className="text-xs text-slate-500 mt-1">
                                                            User #{activity.user_id} requested {activity.route_data.origin} to {activity.route_data.destination}.
                                                        </p>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-4 text-center text-slate-500 text-sm font-bold border border-slate-800 rounded-2xl bg-slate-800/20">No recent system activity detected.</div>
                                        )}
                                    </div>
                                </div>
                                <div className="bg-slate-900/60 rounded-3xl border border-slate-700/50 p-8 shadow-lg">
                                    <h3 className="text-lg font-black text-white tracking-tight mb-6 flex items-center gap-3">
                                        <span className="text-rose-400 bg-rose-500/10 p-2 rounded-xl border border-rose-500/20">📍</span>
                                        Highest Yield Corridors
                                    </h3>
                                    <div className="space-y-6">
                                        {topCorridors.length > 0 ? (
                                            topCorridors.map((corridor, idx) => (
                                                <div key={idx} className="group">
                                                    <div className="flex justify-between text-sm font-bold text-slate-300 mb-2 group-hover:text-white transition-colors">
                                                        <span>{corridor.route}</span>
                                                        <span className="text-emerald-400">{corridor.percentage}% of Profit</span>
                                                    </div>
                                                    <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
                                                        <div className="bg-gradient-to-r from-emerald-600 to-emerald-400 h-2 rounded-full transition-all duration-1000 ease-out" style={{width: `${corridor.percentage}%`}}></div>
                                                    </div>
                                                </div>
                                            ))
                                        ) : (
                                            <div className="p-4 text-center text-slate-500 text-sm font-bold border border-slate-800 rounded-2xl bg-slate-800/20">Approve quotations to generate corridor data.</div>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "quotations" && (
                        <div className="max-w-7xl mx-auto animate-fade-in-up">
                            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
                                <div>
                                    <h2 className="text-3xl font-black text-white tracking-tight">Quotation Ledger</h2>
                                    <p className="text-slate-400 font-medium mt-1">Review, approve, or reject maritime freight quotations generated by customers.</p>
                                </div>
                                <div className="flex items-center gap-4 w-full md:w-auto">
                                    <div className="relative w-full md:w-80">
                                        <svg className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                                        <input
                                            type="text"
                                            placeholder="Search by Port, Cargo, or ID..."
                                            value={searchTerm}
                                            onChange={(e) => setSearchTerm(e.target.value)}
                                            className="w-full bg-slate-900/80 border border-slate-700/60 rounded-xl pl-11 pr-4 py-3 text-sm font-medium text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-rose-500/50 focus:ring-2 focus:ring-rose-500/20 transition-all"
                                        />
                                    </div>
                                    <button 
                                        onClick={handleExportCSV}
                                        className="px-5 py-3 bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 rounded-xl font-bold hover:bg-emerald-600 hover:text-white transition-all flex items-center gap-2 whitespace-nowrap shadow-sm"
                                    >
                                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg>
                                        Export CSV
                                    </button>
                                </div>
                            </div>

                            <div className="bg-slate-900/60 rounded-[2rem] border border-slate-700/50 shadow-2xl overflow-hidden backdrop-blur-md">
                                <div className="overflow-x-auto custom-scrollbar">
                                    <table className="w-full text-left whitespace-nowrap">
                                        <thead className="bg-slate-800/40 border-b border-slate-700/50">
                                            <tr>
                                                <th className="p-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Quote ID</th>
                                                <th className="p-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Route Data</th>
                                                <th className="p-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Client ID</th>
                                                <th className="p-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Invoice</th>
                                                <th className="p-6 text-[10px] font-bold text-emerald-400 uppercase tracking-widest bg-emerald-500/5">Profit Margin</th>
                                                <th className="p-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Status</th>
                                                <th className="p-6 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Action Required</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-800/60 text-sm font-medium">
                                            {filteredQuotes.map(q => (
                                                <tr key={q.id} className="hover:bg-slate-800/40 transition-colors">
                                                    <td className="p-6 font-black text-rose-400">Q-{q.id}</td>
                                                    <td className="p-6">
                                                        <div className="text-white font-bold">{q.route_data.origin} → {q.route_data.destination}</div>
                                                        <div className="text-xs text-slate-500 mt-1">{q.route_data.cargo_type} | {q.route_data.containers} TEUs</div>
                                                    </td>
                                                    <td className="p-6 text-slate-400 font-bold">User #{q.user_id}</td>
                                                    <td className="p-6 font-black text-white text-base">${q.total_price.toLocaleString()}</td>
                                                    <td className="p-6 font-black text-emerald-400 bg-emerald-500/5">${q.margin.toLocaleString(undefined, {minimumFractionDigits: 0, maximumFractionDigits: 0})}</td>
                                                    <td className="p-6">
                                                        <span className={`px-3 py-1.5 text-[10px] uppercase tracking-widest font-bold rounded-lg border ${
                                                            q.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                                                            q.status === 'rejected' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 
                                                            'bg-amber-500/10 text-amber-400 border-amber-500/20'
                                                        }`}>
                                                            {q.status}
                                                        </span>
                                                    </td>
                                                    <td className="p-6">
                                                        {q.status === 'pending' ? (
                                                            <div className="flex gap-2">
                                                                <button onClick={() => handleStatusUpdate(q.id, 'approved')} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-[10px] uppercase tracking-wider font-bold rounded-lg shadow-lg shadow-emerald-900/20 transition-all active:scale-95">Approve</button>
                                                                <button onClick={() => handleStatusUpdate(q.id, 'rejected')} className="px-4 py-2 bg-slate-800 border border-slate-600 hover:bg-rose-600 hover:border-rose-500 text-white text-[10px] uppercase tracking-wider font-bold rounded-lg shadow transition-all active:scale-95">Reject</button>
                                                            </div>
                                                        ) : (
                                                            <span className="text-slate-600 text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5">
                                                                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                                                                Processed
                                                            </span>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                            {filteredQuotes.length === 0 && (
                                                <tr>
                                                    <td colSpan="7" className="p-16 text-center text-slate-500 font-medium">
                                                        <div className="text-5xl mb-4 opacity-30">📭</div>
                                                        <div className="text-lg text-slate-400">No data matches your query.</div>
                                                    </td>
                                                </tr>
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "settings" && (
                        <div className="max-w-4xl mx-auto animate-fade-in-up">
                            <div className="mb-8">
                                <h2 className="text-3xl font-black text-white tracking-tight">Global Routing Constraints</h2>
                                <p className="text-slate-400 font-medium mt-1">Modify the backend behavior of the AI Route Agent and Pricing algorithms.</p>
                            </div>
                            
                            <div className="bg-slate-900/60 rounded-[2rem] border border-slate-700/50 shadow-2xl p-8 backdrop-blur-md space-y-8">
                                <div className="flex items-center justify-between border-b border-slate-800 pb-6">
                                    <div>
                                        <h3 className="text-white font-bold text-lg">Auto-Approve Micro-Margins</h3>
                                        <p className="text-slate-400 text-sm mt-1">Automatically approve quotations with a profit margin under $500.</p>
                                    </div>
                                    <button 
                                        onClick={() => setSettingsToggle({...settingsToggle, autoApprove: !settingsToggle.autoApprove})}
                                        className={`w-14 h-8 rounded-full flex items-center transition-all px-1 ${settingsToggle.autoApprove ? 'bg-emerald-500' : 'bg-slate-700'}`}
                                    >
                                        <div className={`w-6 h-6 rounded-full bg-white transition-transform ${settingsToggle.autoApprove ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                    </button>
                                </div>

                                <div className="flex items-center justify-between border-b border-slate-800 pb-6">
                                    <div>
                                        <h3 className="text-white font-bold text-lg">Strict Eco-Steaming Protocol</h3>
                                        <p className="text-slate-400 text-sm mt-1">Force the Route Agent to prioritize low-emission routes over faster transits.</p>
                                    </div>
                                    <button 
                                        onClick={() => setSettingsToggle({...settingsToggle, strictEcoRouting: !settingsToggle.strictEcoRouting})}
                                        className={`w-14 h-8 rounded-full flex items-center transition-all px-1 ${settingsToggle.strictEcoRouting ? 'bg-emerald-500' : 'bg-slate-700'}`}
                                    >
                                        <div className={`w-6 h-6 rounded-full bg-white transition-transform ${settingsToggle.strictEcoRouting ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                    </button>
                                </div>

                                <div className="flex items-center justify-between">
                                    <div>
                                        <h3 className="text-white font-bold text-lg">Agent Load Balancing</h3>
                                        <p className="text-slate-400 text-sm mt-1">Distribute route calculation queries across multiple backend nodes.</p>
                                    </div>
                                    <button 
                                        onClick={() => setSettingsToggle({...settingsToggle, loadBalancing: !settingsToggle.loadBalancing})}
                                        className={`w-14 h-8 rounded-full flex items-center transition-all px-1 ${settingsToggle.loadBalancing ? 'bg-emerald-500' : 'bg-slate-700'}`}
                                    >
                                        <div className={`w-6 h-6 rounded-full bg-white transition-transform ${settingsToggle.loadBalancing ? 'translate-x-6' : 'translate-x-0'}`}></div>
                                    </button>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === "logs" && (
                        <div className="max-w-6xl mx-auto animate-fade-in-up h-full flex flex-col pb-8">
                            <div className="mb-8 shrink-0">
                                <h2 className="text-3xl font-black text-white tracking-tight">Live Network Traffic</h2>
                                <p className="text-slate-400 font-medium mt-1">Real-time simulation of global API requests passing through the platform.</p>
                            </div>
                            
                            <div className="bg-[#0D1117] rounded-xl border border-slate-700/80 shadow-2xl flex-1 flex flex-col overflow-hidden font-mono">
                                <div className="bg-slate-800/80 px-4 py-3 flex gap-2 border-b border-slate-700">
                                    <div className="w-3 h-3 rounded-full bg-rose-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-amber-500"></div>
                                    <div className="w-3 h-3 rounded-full bg-emerald-500"></div>
                                    <div className="text-[10px] text-slate-400 font-bold ml-4 tracking-widest uppercase flex items-center gap-2">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                                        syslog@agentic-core
                                    </div>
                                </div>
                                <div className="p-6 overflow-y-auto flex-1 text-sm text-slate-300 space-y-2">
                                    {serverLogs.map((log, index) => (
                                        <div key={index} className="flex gap-4 opacity-90 animate-fade-in">
                                            <span className="text-slate-500 shrink-0">~</span>
                                            <span dangerouslySetInnerHTML={{
                                                __html: log
                                                    .replace(/\[\d{2}:\d{2}:\d{2}\]/, match => `<span class="text-indigo-400">${match}</span>`)
                                                    .replace(/200 OK|201 Created/, match => `<span class="text-emerald-400">${match}</span>`)
                                                    .replace(/403 Forbidden/, match => `<span class="text-rose-400">${match}</span>`)
                                            }}></span>
                                        </div>
                                    ))}
                                    <div className="flex gap-4 animate-pulse mt-4">
                                        <span className="text-slate-500">~</span>
                                        <span className="w-2 h-4 bg-slate-500"></span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;