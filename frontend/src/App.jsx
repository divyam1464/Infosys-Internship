import React, { useState, useRef, useEffect } from "react";
import RouteSelector from "./components/RouteSelector";

// 1. Data Constants
const AVAILABLE_PORTS = [
  "Chennai",
  "Dubai",
  "Hamburg",
  "Los Angeles",
  "New York",
  "Rotterdam",
  "Shanghai",
  "Singapore",
  "Sydney",
  "Tokyo",
].sort();

const CARGO_TYPES = [
  "Electronics",
  "Textiles",
  "Machinery",
  "Chemicals",
  "Auto Parts",
  "FMCG",
];

const DEFAULT_FORM_STATE = {
  origin: "Chennai",
  destination: "Rotterdam",
  cargo_type: "Electronics",
  containers: 10,
};

const QUOTATION_TEMPLATES = [
  {
    id: 1,
    name: "Trans-Pacific Tech",
    icon: "💻",
    data: {
      origin: "Tokyo",
      destination: "Los Angeles",
      cargo_type: "Electronics",
      containers: 45,
    },
  },
  {
    id: 2,
    name: "Euro Heavy Machinery",
    icon: "🏗️",
    data: {
      origin: "Hamburg",
      destination: "Shanghai",
      cargo_type: "Machinery",
      containers: 12,
    },
  },
  {
    id: 3,
    name: "Middle East Textiles",
    icon: "🧶",
    data: {
      origin: "Dubai",
      destination: "Sydney",
      cargo_type: "Textiles",
      containers: 25,
    },
  },
];

// 2. Premium Split-Screen Auth Page
const AuthPage = ({ onAuthSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const endpoint = isLogin ? "/api/login" : "/api/signup";
    const payload = isLogin
      ? { email: formData.email, password: formData.password }
      : {
          name: formData.name,
          email: formData.email,
          password: formData.password,
        };

    try {
      const response = await fetch(`http://127.0.0.1:8000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        onAuthSuccess(data.name || formData.email.split("@")[0]);
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
        <div
          className="absolute inset-0 z-0 bg-cover bg-center scale-105 animate-pulse"
          style={{
            backgroundImage:
              "url('https://images.unsplash.com/photo-1578575437130-527eed3abbec?auto=format&fit=crop&w=2000&q=80')",
            animationDuration: "20s",
          }}
        ></div>

        <div className="absolute inset-0 z-10 bg-gradient-to-br from-indigo-900/90 via-[#020617]/80 to-[#020617] backdrop-blur-[2px]"></div>
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-transparent to-[#020617]"></div>

        <div className="relative z-20 flex items-center gap-3.5">
          <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)] border border-indigo-400/30">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
              ></path>
            </svg>
          </div>
          <div>
            <h1 className="text-xl font-black tracking-wide text-white drop-shadow-md">
              Maritime
            </h1>
            <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-0.5 drop-shadow-[0_0_5px_rgba(99,102,241,0.5)]">
              Brokerage AI
            </p>
          </div>
        </div>

        <div className="relative z-20 mb-10">
          <h2 className="text-5xl font-black text-white leading-tight mb-6 drop-shadow-xl">
            Intelligent freight <br />{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">
              routing engine.
            </span>
          </h2>
          <p className="text-lg text-slate-300 font-medium max-w-md leading-relaxed mb-8">
            Deploy autonomous agents to instantly compare transit times, score
            maritime pathways, and generate optimized pricing structures.
          </p>

          <div className="flex gap-4">
            <div className="bg-slate-900/60 backdrop-blur-md border border-slate-700/50 p-4 rounded-2xl shadow-xl flex items-center gap-4">
              <div className="w-10 h-10 bg-emerald-500/20 rounded-full flex items-center justify-center border border-emerald-500/30">
                <span className="text-emerald-400 text-lg">⚡</span>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Dataset Active
                </p>
                <p className="font-black text-white text-sm">
                  2,000+ Port Nodes
                </p>
              </div>
            </div>

            <div className="bg-slate-900/60 backdrop-blur-md border border-slate-700/50 p-4 rounded-2xl shadow-xl flex items-center gap-4">
              <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center border border-blue-500/30">
                <span className="text-blue-400 text-lg">⚓</span>
              </div>
              <div>
                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  Agent Status
                </p>
                <p className="font-black text-white text-sm">
                  Online & Scoring
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Auth Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 sm:p-12 relative">
        <div className="absolute top-[10%] right-[20%] w-[300px] h-[300px] bg-indigo-600/10 rounded-full blur-[100px] pointer-events-none"></div>

        <div className="w-full max-w-[420px] relative z-10 animate-fade-in-up">
          <div className="lg:hidden flex items-center justify-center gap-3 mb-10">
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-[0_0_20px_rgba(99,102,241,0.4)] border border-indigo-400/30">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                ></path>
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-black tracking-wide text-white">
                Maritime AI
              </h1>
            </div>
          </div>

          <div className="mb-10 text-center lg:text-left">
            <h2 className="text-3xl font-black tracking-tight text-white mb-2">
              {isLogin ? "Welcome back" : "Initialize workspace"}
            </h2>
            <p className="text-[14px] text-slate-400 font-medium">
              {isLogin
                ? "Enter your credentials to access the Route Agent."
                : "Set up your broker profile to begin optimization."}
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {!isLogin && (
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                  <svg
                    className="w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    ></path>
                  </svg>
                </div>
                <input
                  type="text"
                  required
                  className="w-full bg-slate-900/50 border border-slate-700/60 text-slate-200 text-sm font-semibold rounded-2xl focus:bg-slate-800 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50 block pl-11 p-4 transition-all outline-none shadow-sm"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Full Name"
                />
              </div>
            )}

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg
                  className="w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                  ></path>
                </svg>
              </div>
              <input
                type="email"
                required
                className="w-full bg-slate-900/50 border border-slate-700/60 text-slate-200 text-sm font-semibold rounded-2xl focus:bg-slate-800 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50 block pl-11 p-4 transition-all outline-none shadow-sm"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="Email Address"
              />
            </div>

            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg
                  className="w-5 h-5 text-slate-500 group-focus-within:text-indigo-400 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  ></path>
                </svg>
              </div>
              <input
                type="password"
                required
                minLength="6"
                className="w-full bg-slate-900/50 border border-slate-700/60 text-slate-200 text-sm font-semibold rounded-2xl focus:bg-slate-800 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50 block pl-11 p-4 transition-all outline-none shadow-sm"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="Password"
              />
            </div>

            {error && (
              <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-400 rounded-xl text-xs font-semibold flex items-center gap-3 animate-fade-in shadow-sm">
                <span className="bg-rose-500/20 rounded-full w-6 h-6 flex items-center justify-center border border-rose-500/30 shrink-0">
                  ⚠️
                </span>
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-4 rounded-2xl font-bold text-sm hover:bg-indigo-500 hover:shadow-[0_0_30px_rgba(79,70,229,0.4)] active:scale-[0.98] transition-all flex justify-center items-center gap-2 mt-4 disabled:opacity-50 border border-indigo-400/50"
            >
              {loading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Authenticating...
                </>
              ) : isLogin ? (
                "Sign In →"
              ) : (
                "Create Access Key →"
              )}
            </button>
          </form>

          <div className="mt-8 text-center lg:text-left">
            <p className="text-[13px] font-medium text-slate-400">
              {isLogin ? "Don't have an account?" : "Already an agent?"}
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setError(null);
                }}
                className="ml-2 text-indigo-400 font-bold hover:text-indigo-300 hover:underline transition-all"
              >
                {isLogin ? "Deploy Workspace" : "Sign in"}
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
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div
      className={`relative ${isOpen ? "z-[100]" : "z-10"}`}
      ref={dropdownRef}
    >
      <label className="block text-[11px] font-bold text-slate-400 mb-2.5 tracking-widest uppercase">
        {label}
      </label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={`w-full flex items-center justify-between p-4 rounded-2xl text-sm transition-all duration-300 text-left outline-none border backdrop-blur-md ${
          isOpen
            ? "border-indigo-500/50 bg-slate-800/80 ring-4 ring-indigo-500/20 shadow-[0_0_20px_rgba(99,102,241,0.2)]"
            : "border-slate-700/60 bg-slate-800/40 hover:bg-slate-800/80 hover:border-indigo-500/30"
        }`}
      >
        <span className="flex items-center gap-3.5 text-slate-100 font-bold">
          <span className="text-lg drop-shadow-[0_0_8px_rgba(255,255,255,0.2)]">
            {icon}
          </span>
          <span>{value}</span>
        </span>
        <svg
          className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180 text-indigo-400" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            d="M19 9l-7 7-7-7"
          ></path>
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
                        ? "bg-indigo-500/20 text-indigo-300 font-bold border border-indigo-500/20"
                        : "text-slate-300 hover:bg-slate-800 hover:text-white font-medium"
                    }`}
                  >
                    <span className="flex items-center gap-2">{option}</span>
                    {isSelected && (
                      <svg
                        className="w-4 h-4 text-indigo-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="3"
                          d="M5 13l4 4L19 7"
                        ></path>
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
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative z-50" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="px-5 py-2.5 rounded-xl text-sm font-bold text-indigo-300 bg-indigo-500/10 border border-indigo-500/30 hover:bg-indigo-500/20 hover:shadow-[0_0_15px_rgba(99,102,241,0.2)] active:scale-95 transition-all flex items-center gap-2.5 backdrop-blur-md"
      >
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="2.5"
            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
          ></path>
        </svg>
        Templates
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-80 bg-slate-900/95 backdrop-blur-3xl border border-slate-700/80 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.8)] animate-fade-in p-2 z-50">
          <div className="px-3 py-2 border-b border-slate-800 mb-1">
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">
              Quick Scenarios
            </p>
          </div>
          <div className="flex flex-col gap-1">
            {QUOTATION_TEMPLATES.map((tpl) => (
              <button
                key={tpl.id}
                onClick={() => {
                  onSelectTemplate(tpl.data);
                  setIsOpen(false);
                }}
                className="w-full flex items-center gap-3.5 px-3 py-3 rounded-xl text-left hover:bg-slate-800/80 transition-colors group"
              >
                <span className="text-xl bg-slate-800 border border-slate-700 w-11 h-11 flex items-center justify-center rounded-xl group-hover:border-indigo-500/50 group-hover:shadow-[0_0_10px_rgba(99,102,241,0.2)] transition-all">
                  {tpl.icon}
                </span>
                <div>
                  <p className="text-sm font-bold text-slate-200 group-hover:text-white">
                    {tpl.name}
                  </p>
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">
                    {tpl.data.origin} → {tpl.data.destination}
                  </p>
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
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative z-50" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold transition-all duration-300 shadow-sm outline-none focus:ring-4 focus:ring-indigo-500/20 backdrop-blur-md uppercase ${
          isOpen
            ? "bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.4)] border border-indigo-400 scale-105"
            : "bg-slate-800 border border-slate-700 text-slate-300 hover:bg-slate-700 hover:text-white hover:border-slate-500 active:scale-95"
        }`}
      >
        {userName.substring(0, 2)}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 w-64 bg-slate-900/95 backdrop-blur-3xl border border-slate-700/80 rounded-2xl shadow-[0_20px_70px_rgba(0,0,0,0.6)] animate-fade-in p-2 z-50 origin-top-right">
          <div className="px-3 py-3 border-b border-slate-800 mb-1">
            <p className="text-sm font-extrabold text-white tracking-tight capitalize">
              {userName}
            </p>
            <p className="text-[11px] font-semibold text-slate-400 mt-0.5 tracking-wide">
              Broker Workspace
            </p>
          </div>
          <div className="flex flex-col gap-1">
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors group">
              <svg
                className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                ></path>
              </svg>
              My Profile
            </button>
            <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors group">
              <svg
                className="w-4 h-4 text-slate-500 group-hover:text-indigo-400 transition-colors"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                ></path>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
              </svg>
              Workspace Settings
            </button>
            <div className="h-px bg-slate-800 my-1"></div>
            <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 transition-colors"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                ></path>
              </svg>
              Log out
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

const MOCK_ROUTES = [
  {
    id: "route-1",
    rank: 1,
    is_recommended: true,
    transit_days: 20,
    distance_nm: 8650,
    transshipments: 0,
    route_score: 6.8,
    name: "Direct Suez Express",
    stops: [
      { port: "Chennai", type: "origin" },
      { port: "Suez Canal", type: "waypoint" },
      { port: "Rotterdam", type: "destination" },
    ],
  },
  {
    id: "route-2",
    rank: 2,
    is_recommended: false,
    transit_days: 23,
    distance_nm: 8820,
    transshipments: 1,
    route_score: 6.2,
    name: "Colombo Transshipment",
    stops: [
      { port: "Chennai", type: "origin" },
      { port: "Colombo", type: "transshipment" },
      { port: "Rotterdam", type: "destination" },
    ],
  },
  {
    id: "route-3",
    rank: 3,
    is_recommended: false,
    transit_days: 34,
    distance_nm: 11950,
    transshipments: 0,
    route_score: 4.9,
    name: "Cape of Good Hope Bypass",
    stops: [
      { port: "Chennai", type: "origin" },
      { port: "Cape of Good Hope", type: "waypoint" },
      { port: "Rotterdam", type: "destination" },
    ],
  },
];

const DashboardTab = ({ onNavigate }) => {
  // 1. KPI & Agent State
  const kpis = [
    {
      label: "Active Agents",
      value: "3",
      subtext: "Route, Pricing, Margin",
      icon: "🤖",
      color: "text-indigo-400",
      bg: "bg-indigo-500/10",
      border: "border-indigo-500/20",
    },
    {
      label: "Routes Scored",
      value: "1,452",
      subtext: "Weighted Analysis",
      icon: "🗺️",
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      border: "border-blue-500/20",
    },
    {
      label: "Avg Target Margin",
      value: "15.2%",
      subtext: "0.2% above target",
      icon: "📈",
      color: "text-emerald-400",
      bg: "bg-emerald-500/10",
      border: "border-emerald-500/20",
    },
    {
      label: "Market Demand",
      value: "1.05x",
      subtext: "Global Demand Factor",
      icon: "📊",
      color: "text-purple-400",
      bg: "bg-purple-500/10",
      border: "border-purple-500/20",
    },
  ];

  const initialAgentSwarm = [
    {
      name: "Route Agent",
      status: "Online",
      tasks: "Transit, Distance, Transshipment",
      load: 45,
      color: "emerald",
    },
    {
      name: "Pricing Agent",
      status: "Online",
      tasks: "Fuel, Port, Risk Surcharges",
      load: 32,
      color: "emerald",
    },
    {
      name: "Margin Agent",
      status: "Online",
      tasks: "Profit Optimization",
      load: 28,
      color: "emerald",
    },
    {
      name: "Weather Agent",
      status: "Pending Deploy",
      tasks: "Meteorological Risk",
      load: 0,
      color: "slate",
    },
    {
      name: "Customs Agent",
      status: "Pending Deploy",
      tasks: "Clearance Prediction",
      load: 0,
      color: "slate",
    },
  ];

  // 2. Enhanced Quotation Data
  const initialQuotes = [
    {
      id: "Q-1042",
      origin: "Shanghai",
      destination: "Rotterdam",
      cargo: "Electronics",
      containers: 12,
      status: "Optimized",
      base: 1850,
      margin: "15%",
      date: "10 mins ago",
      details:
        "Direct route selected via Suez Canal. High demand factor applied due to peak season volume.",
    },
    {
      id: "Q-1041",
      origin: "Mumbai",
      destination: "Hamburg",
      cargo: "Auto Parts",
      containers: 4,
      status: "Pending",
      base: 1800,
      margin: "-",
      date: "5 hrs ago",
      details:
        "Awaiting Pricing Agent confirmation on current bunker surcharges in the Red Sea corridor.",
    },
    {
      id: "Q-1040",
      origin: "Chennai",
      destination: "Rotterdam",
      cargo: "Machinery",
      containers: 8,
      status: "Booked",
      base: 1720,
      margin: "15.5%",
      date: "1 day ago",
      details:
        "Customer accepted optimized margin. Transshipment at Colombo added 2 days transit but saved $400/TEU.",
    },
    {
      id: "Q-1039",
      origin: "Singapore",
      destination: "Hamburg",
      cargo: "Textiles",
      containers: 25,
      status: "Optimized",
      base: 1650,
      margin: "14.8%",
      date: "2 days ago",
      details:
        "Eco-steaming pathway selected. Margin slightly below target due to increased port handling fees.",
    },
    {
      id: "Q-1038",
      origin: "Dubai",
      destination: "New York",
      cargo: "Chemicals",
      containers: 15,
      status: "Booked",
      base: 2100,
      margin: "16.2%",
      date: "3 days ago",
      details:
        "Hazardous cargo premium applied. Fast-track customs clearance pre-approved.",
    },
  ];

  // 3. State Management
  const [agents, setAgents] = useState(initialAgentSwarm);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedQuote, setSelectedQuote] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [quotes] = useState(initialQuotes);

  // 4. Live Telemetry Simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setAgents((currentAgents) =>
        currentAgents.map((agent) => {
          if (agent.status !== "Online") return agent;
          const fluctuation = Math.floor(Math.random() * 11) - 5;
          const newLoad = Math.max(10, Math.min(95, agent.load + fluctuation));
          return { ...agent, load: newLoad };
        }),
      );
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  // 5. Feed Refresh Simulation
  const handleRefreshFeed = () => {
    setIsRefreshing(true);
    setTimeout(() => setIsRefreshing(false), 800);
  };

  // 6. Dynamic Filtering Logic
  const filteredQuotes = initialQuotes.filter((q) => {
    const matchesFilter =
      activeFilter === "All" ||
      q.status.toUpperCase() === activeFilter.toUpperCase();
    const searchString =
      `${q.id} ${q.origin} ${q.destination} ${q.cargo}`.toLowerCase();
    const matchesSearch = searchString.includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="max-w-7xl mx-auto animate-fade-in space-y-8 relative z-20 pb-10">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-[10px] font-black tracking-widest uppercase mb-5 shadow-[0_0_15px_rgba(99,102,241,0.15)] backdrop-blur-md">
            <span className="animate-pulse drop-shadow-[0_0_5px_rgba(99,102,241,0.8)]">
              ✦
            </span>
            Agentic Platform: Milestone 2 Active
          </div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-2 drop-shadow-md">
            Executive Dashboard
          </h2>
          <p className="text-slate-400 font-medium text-lg">
            Platform overview tracking operating costs, demand factors, and
            margin optimization.
          </p>
        </div>
        <button
          onClick={() => onNavigate("new_quotation")}
          className="px-6 py-3 rounded-2xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.4)] active:scale-95 transition-all flex items-center justify-center gap-2 border border-indigo-400/50"
        >
          + New Quotation
        </button>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {kpis.map((kpi, idx) => (
          <div
            key={idx}
            className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-3xl p-6 shadow-lg hover:bg-slate-800/60 transition-all duration-300"
          >
            <div className="flex justify-between items-start mb-4">
              <div
                className={`w-12 h-12 rounded-[1.25rem] flex items-center justify-center text-2xl ${kpi.bg} ${kpi.border} border shadow-inner`}
              >
                {kpi.icon}
              </div>
            </div>
            <div>
              <h3 className="text-3xl font-black text-white mb-1 tracking-tight">
                {kpi.value}
              </h3>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-1">
                {kpi.label}
              </p>
              <p className={`text-xs font-semibold ${kpi.color}`}>
                {kpi.subtext}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8 h-[600px]">
        {/* Dynamic Agent Swarm Health Monitor */}
        <div className="xl:col-span-2 bg-slate-900/50 backdrop-blur-xl rounded-[2.5rem] border border-slate-700/50 p-6 sm:p-8 flex flex-col shadow-lg h-full">
          <div className="flex items-center justify-between mb-8 px-2 shrink-0">
            <h3 className="text-xl font-black text-white tracking-tight flex items-center gap-3">
              <span className="text-indigo-400 bg-indigo-500/10 p-2 rounded-xl border border-indigo-500/20">
                🧠
              </span>
              Agent Swarm Health
            </h3>
            <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-4 py-1.5 rounded-full border border-emerald-500/20 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              Live Telemetry
            </span>
          </div>

          <div className="grid grid-cols-1 gap-3.5 overflow-y-auto pr-2 pb-2 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
            {agents.map((agent, i) => (
              <div
                key={i}
                className="flex items-center justify-between bg-slate-800/40 p-5 rounded-[1.5rem] border border-slate-700/50 transition-all duration-500 hover:bg-slate-800/80 hover:border-indigo-500/30"
              >
                <div className="flex items-center gap-5">
                  <div
                    className={`w-2.5 h-2.5 rounded-full bg-${agent.color}-400 shadow-[0_0_8px_currentColor] ${agent.status === "Online" ? "animate-pulse" : "opacity-50"}`}
                  ></div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-200">
                      {agent.name}
                    </h4>
                    <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider mt-0.5">
                      {agent.tasks}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-4 w-40">
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div
                      className={`h-full bg-${agent.color}-500 rounded-full transition-all duration-1000 ease-in-out`}
                      style={{ width: `${agent.load}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-bold text-slate-400 w-10 text-right font-mono transition-all duration-500">
                    {agent.load}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Fully Interactive Recent Activity Feed */}
        <div className="bg-slate-900/50 backdrop-blur-xl rounded-[2.5rem] border border-slate-700/50 flex flex-col shadow-lg overflow-hidden h-full relative">
          {/* Feed Header & Controls */}
          <div className="p-6 sm:p-8 pb-4 border-b border-slate-800/80 bg-slate-900/80 shrink-0">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xl font-black text-white tracking-tight">
                Recent Activity
              </h3>
              <button
                onClick={handleRefreshFeed}
                className="text-slate-400 hover:text-indigo-400 transition-colors bg-slate-800/50 p-2 rounded-xl border border-slate-700/50"
              >
                <svg
                  className={`w-4 h-4 ${isRefreshing ? "animate-spin text-indigo-400" : ""}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                  ></path>
                </svg>
              </button>
            </div>

            {/* Search Bar */}
            <div className="relative mb-5">
              <svg
                className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-slate-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
              <input
                type="text"
                placeholder="Search ID, cargo, or port..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950/50 border border-slate-700/60 rounded-2xl pl-11 pr-4 py-3 text-xs font-medium text-slate-200 placeholder:text-slate-500 focus:outline-none focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20 transition-all"
              />
            </div>

            {/* Filter Pills - Scrollbar Removed, Flex Wrap Added */}
            <div className="flex flex-wrap gap-2.5 pb-2">
              {["All", "Optimized", "Pending", "Booked"].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setActiveFilter(filter)}
                  className={`text-[10px] font-bold px-4 py-2 rounded-full uppercase tracking-wider transition-all shrink-0 ${
                    activeFilter === filter
                      ? "bg-indigo-600 text-white shadow-[0_0_15px_rgba(79,70,229,0.4)] border border-indigo-400/50"
                      : "bg-slate-800/60 text-slate-400 border border-slate-700/80 hover:bg-slate-700 hover:text-slate-200"
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {/* Soft Edged Feed Cards */}
          <div
            className={`flex-1 overflow-y-auto p-5 flex flex-col gap-4 transition-opacity duration-300 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] ${isRefreshing ? "opacity-30" : "opacity-100"}`}
          >
            {filteredQuotes.length > 0 ? (
              filteredQuotes.map((quote) => (
                <div
                  key={quote.id}
                  onClick={() => setSelectedQuote(quote)}
                  className="bg-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-[1.5rem] p-5 hover:bg-slate-800/80 hover:border-indigo-500/40 hover:shadow-[0_8px_30px_rgba(0,0,0,0.3)] transition-all duration-300 group cursor-pointer relative"
                >
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-[10px] font-bold text-indigo-300 uppercase tracking-widest bg-indigo-500/10 px-2.5 py-1 rounded-lg border border-indigo-500/20">
                      {quote.id}
                    </span>
                    <span
                      className={`text-[9px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider border ${
                        quote.status === "Optimized"
                          ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                          : quote.status === "Booked"
                            ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                            : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                      }`}
                    >
                      {quote.status}
                    </span>
                  </div>

                  <div className="flex items-center gap-3 mb-4">
                    <span className="text-sm font-black text-slate-200 group-hover:text-white transition-colors truncate">
                      {quote.origin}
                    </span>
                    <svg
                      className="w-4 h-4 text-slate-500 shrink-0 group-hover:text-indigo-400 transition-colors"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M17 8l4 4m0 0l-4 4m4-4H3"
                      ></path>
                    </svg>
                    <span className="text-sm font-black text-slate-200 group-hover:text-white transition-colors truncate">
                      {quote.destination}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-3 border-t border-slate-700/50">
                    <div className="flex items-center gap-3">
                      <span className="text-[10px] font-medium text-slate-300 flex items-center gap-1.5">
                        <span className="text-slate-500">📦</span> {quote.cargo}
                      </span>
                      <span className="w-1 h-1 rounded-full bg-slate-600"></span>
                      <span className="text-[10px] font-medium text-slate-300 flex items-center gap-1.5">
                        <span className="text-slate-500">🏗️</span>{" "}
                        {quote.containers} TEU
                      </span>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-slate-500">
                <span className="text-4xl mb-4 opacity-50">📭</span>
                <p className="text-sm font-medium text-slate-400">
                  No shipments found.
                </p>
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setActiveFilter("All");
                  }}
                  className="mt-3 text-xs font-bold text-indigo-400 hover:underline"
                >
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Centered, Soft-Edged Glass Modal */}
      {selectedQuote && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
          {/* Blurred Backdrop */}
          <div
            className="absolute inset-0 bg-[#020617]/80 backdrop-blur-md transition-opacity animate-fade-in"
            onClick={() => setSelectedQuote(null)}
          ></div>

          {/* Modal Card - Soft Edges & Centered */}
          <div className="relative w-full max-w-xl bg-slate-900/90 backdrop-blur-2xl border border-slate-700/60 rounded-[2.5rem] shadow-[0_20px_70px_rgba(0,0,0,0.8)] flex flex-col overflow-hidden animate-fade-in-up transform transition-all">
            {/* Soft Glowing Top Border */}
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-emerald-500 opacity-70"></div>

            {/* Modal Header */}
            <div className="px-8 pt-8 pb-6 flex items-center justify-between relative z-10">
              <div className="flex items-center gap-3">
                <span className="text-[11px] font-black text-indigo-400 uppercase tracking-widest bg-indigo-500/10 px-3.5 py-1.5 rounded-xl border border-indigo-500/20 shadow-inner">
                  {selectedQuote.id}
                </span>
                <span
                  className={`text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider border ${
                    selectedQuote.status === "Optimized"
                      ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20"
                      : selectedQuote.status === "Booked"
                        ? "bg-indigo-500/10 text-indigo-400 border-indigo-500/20"
                        : "bg-amber-500/10 text-amber-400 border-amber-500/20"
                  }`}
                >
                  {selectedQuote.status}
                </span>
              </div>
              <button
                onClick={() => setSelectedQuote(null)}
                className="w-10 h-10 flex items-center justify-center rounded-2xl bg-slate-800/50 text-slate-400 hover:bg-slate-700 hover:text-white transition-all border border-slate-700/50 shadow-sm hover:shadow-md"
              >
                <svg
                  className="w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2.5"
                    d="M6 18L18 6M6 6l12 12"
                  ></path>
                </svg>
              </button>
            </div>

            {/* Modal Content */}
            <div className="px-8 pb-8 space-y-8 relative z-10">
              {/* Centered Route Visualization */}
              <div className="flex items-center justify-center gap-4 mb-2">
                <h3 className="text-2xl sm:text-3xl font-black text-white truncate max-w-[140px] sm:max-w-[180px] text-right">
                  {selectedQuote.origin}
                </h3>
                <div className="flex-1 flex items-center max-w-[100px]">
                  <div className="h-[2px] bg-gradient-to-r from-indigo-500/50 to-emerald-500/50 flex-1 rounded-full"></div>
                  <div className="w-10 h-10 rounded-full border-2 border-slate-700 bg-slate-800 flex items-center justify-center text-lg shadow-[0_0_15px_rgba(99,102,241,0.2)] mx-2 shrink-0">
                    🚢
                  </div>
                  <div className="h-[2px] bg-gradient-to-r from-emerald-500/50 to-indigo-500/50 flex-1 rounded-full"></div>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white truncate max-w-[140px] sm:max-w-[180px] text-left">
                  {selectedQuote.destination}
                </h3>
              </div>

              {/* Specs Grid */}
              <div className="grid grid-cols-2 gap-5">
                <div className="bg-slate-800/40 p-5 rounded-3xl border border-slate-700/50 flex flex-col items-center text-center justify-center shadow-inner">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                    Cargo Profile
                  </p>
                  <p className="text-base font-bold text-slate-200 flex items-center gap-2">
                    <span className="text-slate-400">📦</span>{" "}
                    {selectedQuote.cargo}
                  </p>
                </div>
                <div className="bg-slate-800/40 p-5 rounded-3xl border border-slate-700/50 flex flex-col items-center text-center justify-center shadow-inner">
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-1.5">
                    Volume
                  </p>
                  <p className="text-base font-bold text-slate-200 flex items-center gap-2">
                    <span className="text-slate-400">🏗️</span>{" "}
                    {selectedQuote.containers} TEUs
                  </p>
                </div>
              </div>

              {/* Financial Breakdown */}
              <div className="bg-slate-800/40 rounded-3xl border border-slate-700/50 p-6 shadow-inner">
                <h4 className="text-[11px] font-black text-slate-400 uppercase tracking-widest mb-5 flex items-center gap-2">
                  <span className="text-emerald-400 text-lg drop-shadow-md">
                    💵
                  </span>{" "}
                  Financial Breakdown
                </h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400 font-medium">
                      Base Freight Rate
                    </span>
                    <span className="text-sm font-bold text-slate-200">
                      ${selectedQuote.base.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-400 font-medium">
                      Container Count
                    </span>
                    <span className="text-sm font-bold text-slate-200">
                      × {selectedQuote.containers}
                    </span>
                  </div>
                  <div className="h-px bg-slate-700/60 rounded-full"></div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-slate-300 font-bold">
                      Total Operating Cost
                    </span>
                    <span className="text-base font-black text-white">
                      $
                      {(
                        selectedQuote.base * selectedQuote.containers
                      ).toLocaleString()}
                    </span>
                  </div>

                  <div className="flex justify-between items-center bg-gradient-to-r from-emerald-500/10 to-transparent p-4 rounded-2xl border border-emerald-500/20 mt-2 shadow-sm">
                    <div>
                      <span className="text-sm text-emerald-400 font-bold block mb-0.5">
                        Optimized Margin
                      </span>
                      <span className="text-[9px] text-emerald-500/70 font-black uppercase tracking-widest">
                        Brokerage Profit
                      </span>
                    </div>
                    <span className="text-lg font-black text-emerald-400 bg-emerald-500/10 px-3.5 py-1.5 rounded-xl border border-emerald-500/30 shadow-[0_0_15px_rgba(16,185,129,0.2)]">
                      {selectedQuote.margin}
                    </span>
                  </div>
                </div>
              </div>

              {/* Agent Log */}
              <div className="bg-indigo-500/10 p-6 rounded-3xl border border-indigo-500/20 shadow-inner">
                <h4 className="text-[10px] font-black text-indigo-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-500 animate-pulse shadow-[0_0_8px_rgba(99,102,241,0.8)]"></span>
                  Agent Reasoning Log
                </h4>
                <p className="text-sm text-slate-300 leading-relaxed font-medium">
                  {selectedQuote.details}
                </p>
              </div>

              {/* Footer Button */}
              <button
                onClick={() => setSelectedQuote(null)}
                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-2xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.4)] active:scale-[0.98] border border-indigo-400/50 mt-4"
              >
                Close Details
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 7. Quotations Ledger Tab Component
const QuotationsTab = ({ quotes, onRefresh, onNavigate }) => {
  return (
    <div className="max-w-6xl mx-auto animate-fade-in relative z-20 pb-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-[10px] font-black tracking-widest uppercase mb-5 shadow-[0_0_15px_rgba(99,102,241,0.15)] backdrop-blur-md">
            <span className="animate-pulse">✦</span> Quotation Ledger
          </div>
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white mb-2 drop-shadow-md">
            Saved Quotations
          </h2>
          <p className="text-slate-400 font-medium text-lg">
            Manage and review your optimized maritime bookings.
          </p>
        </div>
        <button
          onClick={() => onNavigate("new_quotation")}
          className="px-6 py-3 rounded-2xl font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-[0_0_20px_rgba(79,70,229,0.4)] active:scale-95 transition-all flex items-center justify-center gap-2 border border-indigo-400/50"
        >
          + New Quotation
        </button>
      </div>

      <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-700/50 rounded-[2.5rem] shadow-lg overflow-hidden">
        <div className="p-6 sm:p-8 border-b border-slate-800/80 bg-slate-900/80 flex justify-between items-center">
          <h3 className="text-xl font-black text-white tracking-tight">
            Booking History
          </h3>
          <button
            onClick={onRefresh}
            className="text-slate-400 hover:text-indigo-400 transition-colors p-2 rounded-xl border border-slate-700/50 bg-slate-800/50"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2.5"
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              ></path>
            </svg>
          </button>
        </div>

        <div className="p-0">
          {quotes.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse whitespace-nowrap">
                <thead>
                  <tr className="bg-slate-800/40 border-b border-slate-700/50 text-[10px] uppercase tracking-widest text-slate-400 font-bold">
                    <th className="p-6">Quote ID</th>
                    <th className="p-6">Route</th>
                    <th className="p-6">Cargo Specs</th>
                    <th className="p-6">Efficiency</th>
                    <th className="p-6">Total Cost</th>
                    <th className="p-6">Status</th>
                  </tr>
                </thead>
                <tbody className="text-sm font-medium text-slate-300">
                  {quotes.map((q) => (
                    <tr
                      key={q.quote_id}
                      className="border-b border-slate-700/30 hover:bg-slate-800/40 transition-colors"
                    >
                      <td className="p-6 font-black text-indigo-400">
                        {q.quote_id}
                      </td>
                      <td className="p-6">
                        <div className="flex flex-col">
                          <span className="text-white font-bold">
                            {q.origin} → {q.destination}
                          </span>
                          <span className="text-xs text-slate-500 font-semibold">
                            {q.route_name} ({q.transit_days} days)
                          </span>
                        </div>
                      </td>
                      <td className="p-6">
                        <div className="flex flex-col">
                          <span className="font-bold">{q.cargo_type}</span>
                          <span className="text-xs text-slate-500 font-semibold">
                            {q.containers} TEUs
                          </span>
                        </div>
                      </td>
                      <td className="p-6">
                        <span className="text-emerald-400 font-bold bg-emerald-500/10 px-2.5 py-1 rounded-lg border border-emerald-500/20">
                          {q.route_score} / 10
                        </span>
                      </td>
                      <td className="p-6 font-black text-white text-base">
                        ${q.total_cost_usd.toLocaleString()}
                      </td>
                      <td className="p-6">
                        <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest">
                          {q.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="p-12 flex flex-col items-center justify-center text-slate-500">
              <span className="text-5xl mb-4 opacity-50">📭</span>
              <p className="text-sm font-bold text-slate-400">
                No saved quotations yet.
              </p>
              <p className="text-xs text-slate-500 mt-1">
                Head to New Quotation to generate one.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// 6. Main App Component
export default function App() {
  const [savedQuotes, setSavedQuotes] = useState([]);
  const [notification, setNotification] = useState(null); // Sleek toast notification

  const [routes, setRoutes] = useState(MOCK_ROUTES);
  const [selectedRoute, setSelectedRoute] = useState(MOCK_ROUTES[0]);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState("");

  const [activeTab, setActiveTab] = useState("new_quotation");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [formData, setFormData] = useState(DEFAULT_FORM_STATE);
  const [result, setResult] = useState(null);

  const [pricing, setPricing] = useState(null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [isExporting, setIsExporting] = useState(false);
  const [isBooking, setIsBooking] = useState(false);


  // Fetch when the tab becomes active
  useEffect(() => {
    if (activeTab === "quotations" && currentUser) {
      fetchQuotations();
    }
  }, [activeTab, currentUser]);

  // Intercept unauthenticated users
  if (!isAuthenticated) {
    return (
      <AuthPage
        onAuthSuccess={(name) => {
          setCurrentUser(name);
          setIsAuthenticated(true);
        }}
      />
    );
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
    setPricing(null);

    try {
      const response = await fetch("http://127.0.0.1:8000/api/routes/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (data.status === "success") {
        setResult(data);

        // --- DYNAMIC PRICING GENERATOR ---
        const rec = data.recommended_route;
        const basePricing = data.pricing.breakdown;
        const containers = formData.containers;

        // Route 1: Optimal Direct Pathway
        const bestRoute = {
          id: "route-1",
          rank: 1,
          is_recommended: true,
          transit_days: rec.transit_days,
          distance_nm: rec.distance_nm,
          transshipments: rec.transshipments,
          route_score: rec.route_score,
          name: "Optimal Direct Pathway",
          stops: [
            { port: rec.origin, type: "origin" },
            { port: "Ocean Transit", type: "waypoint" },
            { port: rec.destination, type: "destination" },
          ],
          pricing: {
            breakdown: {
              base_freight: basePricing.base_freight,
              bunker_adjustment: basePricing.bunker_adjustment,
              origin_handling: basePricing.origin_handling,
              destination_handling: basePricing.destination_handling,
              transshipment_fee: 0,
            },
            total_cost_usd: data.pricing.total_cost_usd,
          },
        };

        // Route 2: Transshipment (Discounted freight, higher bunker, added transfer fees)
        const r2_freight = Math.round(basePricing.base_freight * 0.88);
        const r2_bunker = Math.round(basePricing.bunker_adjustment * 1.05);
        const r2_ts_fee = 150 * containers;

        const altRoute1 = {
          id: "route-2",
          rank: 2,
          is_recommended: false,
          transit_days: Math.round(rec.transit_days * 1.2),
          distance_nm: Math.round(rec.distance_nm * 1.05),
          transshipments: rec.transshipments + 1,
          route_score: (rec.route_score - 0.6).toFixed(1),
          name: "Regional Hub Transshipment",
          stops: [
            { port: rec.origin, type: "origin" },
            { port: "Major Hub (TS)", type: "transshipment" },
            { port: rec.destination, type: "destination" },
          ],
          pricing: {
            breakdown: {
              base_freight: r2_freight,
              bunker_adjustment: r2_bunker,
              origin_handling: basePricing.origin_handling,
              destination_handling: basePricing.destination_handling,
              transshipment_fee: r2_ts_fee,
            },
            total_cost_usd:
              r2_freight +
              r2_bunker +
              basePricing.origin_handling +
              basePricing.destination_handling +
              r2_ts_fee,
          },
        };

        // Route 3: Eco-Steaming Multi-Port (Slower, lowest freight, cheapest bunker, higher feeder fees)
        const r3_freight = Math.round(basePricing.base_freight * 0.75);
        const r3_bunker = Math.round(basePricing.bunker_adjustment * 0.85);
        const r3_ts_fee = 220 * containers;

        const altRoute2 = {
          id: "route-3",
          rank: 3,
          is_recommended: false,
          transit_days: Math.round(rec.transit_days * 1.45),
          distance_nm: Math.round(rec.distance_nm * 1.15),
          transshipments: rec.transshipments + 2,
          route_score: (rec.route_score - 1.5).toFixed(1),
          name: "Eco-Steaming Multi-Port",
          stops: [
            { port: rec.origin, type: "origin" },
            { port: "Feeder Port A", type: "waypoint" },
            { port: "Feeder Port B", type: "waypoint" },
            { port: rec.destination, type: "destination" },
          ],
          pricing: {
            breakdown: {
              base_freight: r3_freight,
              bunker_adjustment: r3_bunker,
              origin_handling: basePricing.origin_handling,
              destination_handling: basePricing.destination_handling,
              transshipment_fee: r3_ts_fee,
            },
            total_cost_usd:
              r3_freight +
              r3_bunker +
              basePricing.origin_handling +
              basePricing.destination_handling +
              r3_ts_fee,
          },
        };

        setRoutes([bestRoute, altRoute1, altRoute2]);
        setSelectedRoute(bestRoute);
      } else {
        setError(data.detail || data.message || "No optimal route found for these parameters.");
      }
    } catch (err) {
      setError(
        "Failed to connect to the Route Agent. Is the FastAPI server running?",
      );
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

  const fetchQuotations = async () => {
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/quotations/list?user_name=${currentUser}`,
      );
      const data = await res.json();
      if (data.status === "success") {
        setSavedQuotes(data.data);
      }
    } catch (error) {
      console.error("Failed to fetch quotes:", error);
    }
  };

  

  const handleProceedToBooking = async () => {
    setIsBooking(true);
    try {
      const payload = {
        user_name: currentUser,
        origin: formData.origin,
        destination: formData.destination,
        cargo_type: formData.cargo_type,
        containers: formData.containers,
        route_name: selectedRoute.name,
        route_score: selectedRoute.route_score,
        transit_days: selectedRoute.transit_days,
        total_cost_usd: selectedRoute.pricing.total_cost_usd,
      };

      const res = await fetch("http://127.0.0.1:8000/api/quotations/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (data.status === "success") {
        setNotification(`Quote ${data.quote_id} saved successfully!`);
        setTimeout(() => setNotification(null), 4000);

        // Auto-navigate to the quotations ledger to see it instantly
        setActiveTab("quotations");
      }
    } catch (error) {
      console.error("Failed to save quote:", error);
    }
    setIsBooking(false);
  };

  return (
    <div className="flex h-screen w-full bg-[#020617] font-sans text-slate-200 overflow-hidden">
      {/* Dynamic Sidebar Navigation */}
      <div
        className={`${isSidebarOpen ? "w-64" : "w-[5.5rem]"} bg-[#060B19] flex flex-col z-30 shrink-0 border-r border-slate-800/60 relative overflow-hidden shadow-2xl transition-all duration-300 ease-in-out`}
      >
        <div className="p-4 relative z-10 flex-1 flex flex-col">
          {/* Logo Section */}
          <div
            className={`flex items-center ${isSidebarOpen ? "gap-3.5 mb-10 mt-2 px-2" : "justify-center mb-10 mt-2"} transition-all duration-300`}
          >
            <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shrink-0 shadow-[0_0_20px_rgba(99,102,241,0.4)] border border-indigo-400/30">
              <svg
                className="w-5 h-5 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
                ></path>
              </svg>
            </div>
            <div
              className={`overflow-hidden transition-all duration-300 ${isSidebarOpen ? "w-auto opacity-100" : "w-0 opacity-0"}`}
            >
              <h1 className="text-xl font-black tracking-wide text-white drop-shadow-md whitespace-nowrap">
                Maritime
              </h1>
              <p className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest mt-0.5 drop-shadow-[0_0_5px_rgba(99,102,241,0.5)] whitespace-nowrap">
                Brokerage AI
              </p>
            </div>
          </div>

          {/* AI Engine Status */}
          <div
            className={`bg-slate-900/60 backdrop-blur-md rounded-2xl mb-8 border border-slate-800/80 shadow-inner flex items-center justify-center ${isSidebarOpen ? "p-4" : "p-3"} transition-all duration-300`}
          >
            {isSidebarOpen ? (
              <div className="w-full">
                <div className="flex items-center gap-3 mb-1.5">
                  <div className="relative flex h-2 w-2 shrink-0">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"></span>
                  </div>
                  <span className="text-xs font-bold text-slate-300 uppercase tracking-wider whitespace-nowrap">
                    AI Engine Online
                  </span>
                </div>
                <p className="text-[11px] font-medium text-slate-500 whitespace-nowrap">
                  Route Intelligence active
                </p>
              </div>
            ) : (
              <div
                className="relative flex h-3 w-3 shrink-0"
                title="AI Engine Online"
              >
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.8)]"></span>
              </div>
            )}
          </div>

          {/* Navigation Links */}
          <div
            className={`text-[10px] font-black text-slate-600 tracking-widest mb-4 uppercase transition-all duration-300 ${isSidebarOpen ? "ml-2 opacity-100" : "opacity-0 h-0 mb-0 overflow-hidden"}`}
          >
            Workspace
          </div>
          <nav className="space-y-2">
            {[
              { id: "dashboard", icon: "⊞", label: "Dashboard" },
              { id: "new_quotation", icon: "+", label: "New Quotation" },
              { id: "route_intel", icon: "⇄", label: "Route Intelligence" },
              { id: "quotations", icon: "☰", label: "Quotations" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                title={!isSidebarOpen ? tab.label : ""}
                className={`flex items-center rounded-2xl transition-all duration-300 active:scale-[0.98] ${
                  isSidebarOpen
                    ? "w-full gap-3.5 px-4 py-3.5"
                    : "w-12 h-12 justify-center mx-auto"
                } ${
                  activeTab === tab.id
                    ? "bg-indigo-600/10 text-indigo-300 shadow-[inset_0_0_20px_rgba(99,102,241,0.15)] font-bold border border-indigo-500/20"
                    : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/40 font-medium border border-transparent"
                }`}
              >
                <span
                  className={`text-lg shrink-0 ${activeTab === tab.id ? "text-indigo-400" : "opacity-70"}`}
                >
                  {tab.icon}
                </span>
                <span
                  className={`overflow-hidden transition-all duration-300 whitespace-nowrap ${isSidebarOpen ? "w-auto opacity-100" : "w-0 opacity-0"}`}
                >
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
            <svg
              className={`w-5 h-5 transition-transform duration-300 ${!isSidebarOpen ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M15 19l-7-7 7-7"
              ></path>
            </svg>
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
            <span className="text-[11px] font-bold text-slate-500 tracking-widest uppercase hidden sm:block">
              Maritime Brokerage AI
            </span>
            <span className="text-slate-600 font-light hidden sm:block">/</span>
            <span className="text-xs font-black text-slate-200 uppercase tracking-widest">
              {activeTab.replace("_", " ")}
            </span>
          </div>

          <div className="flex items-center gap-7">
            <div className="relative group flex items-center">
              <svg
                className="w-4 h-4 absolute left-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors duration-300"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
              <input
                type="text"
                placeholder="Search quotations..."
                className="bg-slate-900/60 backdrop-blur-md border border-slate-700/60 rounded-full pl-11 pr-5 py-2.5 text-sm w-48 sm:w-72 focus:bg-slate-800 focus:ring-2 focus:ring-indigo-500/30 focus:border-indigo-500/50 transition-all duration-300 outline-none font-medium text-slate-200 placeholder:text-slate-500"
              />
            </div>

            <ProfileDropdown
              userName={currentUser}
              onLogout={() => setIsAuthenticated(false)}
            />
          </div>
        </header>

        {/* Dynamic Workspace */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10 scroll-smooth relative z-10 custom-scrollbar">
          {/* Dashboard Tab Render */}
          {activeTab === "dashboard" ? (
            <DashboardTab onNavigate={(tab) => setActiveTab(tab)} />
          ) : activeTab === "new_quotation" ? (
            /* New Quotation Render */
            <div className="max-w-6xl mx-auto animate-fade-in">
              {/* Header Section */}
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-6 relative z-30">
                <div>
                  <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 text-[10px] font-black tracking-widest uppercase mb-5 shadow-[0_0_15px_rgba(99,102,241,0.15)] backdrop-blur-md">
                    <span className="animate-pulse text-indigo-400 drop-shadow-[0_0_5px_rgba(99,102,241,0.8)]">
                      ✦
                    </span>{" "}
                    Route Intelligence Active
                  </div>
                  <h2 className="text-4xl md:text-[2.75rem] font-black tracking-tight text-white mb-2 leading-tight drop-shadow-md">
                    New freight quotation
                  </h2>
                  <p className="text-slate-400 font-medium text-lg max-w-xl">
                    Configure shipment parameters and let the Route Agent
                    compute the optimal maritime pathway.
                  </p>
                </div>

                <div className="flex items-center gap-4 pb-1">
                  <button
                    type="button"
                    onClick={handleReset}
                    className="px-5 py-2.5 rounded-xl text-sm font-bold text-slate-300 bg-slate-800/60 backdrop-blur-md border border-slate-700 hover:bg-slate-700 hover:text-white hover:border-slate-600 transition-all active:scale-[0.97] flex items-center gap-2.5 group"
                  >
                    <svg
                      className="w-4 h-4 text-slate-400 group-hover:text-slate-300 group-hover:-rotate-180 transition-all duration-500"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2.5"
                        d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                      ></path>
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
                      <span className="drop-shadow-[0_0_10px_rgba(244,63,94,0.3)]">
                        📍
                      </span>
                    </div>
                    <div>
                      <h3 className="font-black text-white text-xl md:text-2xl tracking-tight mb-1 flex items-center gap-3">
                        Route details
                        <span className="w-2 h-2 rounded-full bg-indigo-500 mt-1 shadow-[0_0_10px_rgba(99,102,241,0.8)]"></span>
                      </h3>
                      <p className="text-sm text-slate-400 font-medium">
                        Configure origin, destination, and cargo specs.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-8 mb-10 relative z-50">
                    <ModernDropdown
                      label="Origin port"
                      value={formData.origin}
                      options={AVAILABLE_PORTS}
                      onChange={(val) =>
                        setFormData({ ...formData, origin: val })
                      }
                      icon="🚢"
                    />
                    <ModernDropdown
                      label="Destination port"
                      value={formData.destination}
                      options={AVAILABLE_PORTS}
                      onChange={(val) =>
                        setFormData({ ...formData, destination: val })
                      }
                      icon="⚓"
                    />
                    <ModernDropdown
                      label="Cargo type"
                      value={formData.cargo_type}
                      options={CARGO_TYPES}
                      onChange={(val) =>
                        setFormData({ ...formData, cargo_type: val })
                      }
                      icon="📦"
                    />

                    <div className="relative z-10">
                      <label className="block text-[11px] font-bold text-slate-400 mb-2.5 tracking-widest uppercase">
                        Container quantity
                      </label>
                      <div className="relative flex items-center">
                        <span className="absolute left-4 text-lg opacity-90 drop-shadow-sm pointer-events-none">
                          🏗️
                        </span>
                        <input
                          type="number"
                          min="1"
                          className="w-full border border-slate-700/60 bg-slate-800/40 p-4 pl-[3.25rem] rounded-2xl text-sm text-slate-100 font-bold hover:bg-slate-800 hover:border-indigo-500/30 focus:bg-slate-800 focus:ring-4 focus:ring-indigo-500/20 focus:border-indigo-500/50 transition-all duration-300 outline-none backdrop-blur-md [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none m-0"
                          value={formData.containers}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              containers: parseInt(e.target.value) || 1,
                            })
                          }
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
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Analyzing Routes...
                      </span>
                    ) : (
                      "+ Analyze route & generate quote →"
                    )}
                  </button>

                  {error && (
                    <div className="mt-6 p-4 bg-rose-500/10 backdrop-blur-md border border-rose-500/20 text-rose-400 rounded-2xl text-sm font-semibold flex items-center gap-3.5 animate-fade-in relative z-10 shadow-sm">
                      <span className="bg-rose-500/20 rounded-full w-7 h-7 flex items-center justify-center border border-rose-500/30 shrink-0">
                        ⚠️
                      </span>
                      {error}
                    </div>
                  )}
                </div>

                {/* Route Agent Sidebar */}
                <div className="bg-slate-900/50 backdrop-blur-2xl p-8 md:p-10 rounded-[2.5rem] shadow-2xl border border-slate-800/60 flex flex-col relative overflow-hidden h-full z-10">
                  <div className="w-14 h-14 bg-indigo-500/10 border border-indigo-500/30 rounded-2xl flex items-center justify-center text-indigo-400 text-2xl font-bold mb-8 relative z-10 shadow-[inset_0_0_15px_rgba(99,102,241,0.2)] shrink-0">
                    ✦
                  </div>
                  <h3 className="font-black text-white text-2xl tracking-tight mb-3 relative z-10">
                    Route Agent
                  </h3>
                  <p className="text-slate-400 font-medium mb-10 leading-relaxed relative z-10 text-[15px]">
                    The AI agent compares maritime route alternatives and scores
                    them using transit time, distance, transshipment, and
                    historical efficiency factors.
                  </p>

                  <div className="space-y-5 w-full relative z-10 mt-auto">
                    {[
                      "Find available routes",
                      "Estimate transit time",
                      "Compare alternatives",
                      "Recommend best route",
                    ].map((step, i) => (
                      <div
                        key={i}
                        className="flex items-center gap-4 group cursor-default"
                      >
                        <div className="text-indigo-300 font-bold text-xs bg-indigo-500/10 w-8 h-8 rounded-full flex items-center justify-center shrink-0 border border-indigo-500/30 group-hover:bg-indigo-600 group-hover:text-white group-hover:border-indigo-400 group-hover:shadow-[0_0_15px_rgba(79,70,229,0.5)] transition-all duration-300">
                          {i + 1}
                        </div>
                        <span className="text-sm font-bold text-slate-400 group-hover:text-slate-200 transition-colors">
                          {step}
                        </span>
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
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_8px_rgba(16,185,129,0.8)]"></span>{" "}
                      Route Intelligence Analysis Complete
                    </div>
                    <h3 className="text-3xl md:text-5xl font-black text-white flex flex-col md:flex-row items-center gap-3 md:gap-5 tracking-tight drop-shadow-md">
                      {result.recommended_route.origin}
                      <svg
                        className="w-8 h-8 text-indigo-400 stroke-[3px] drop-shadow-[0_0_8px_rgba(99,102,241,0.5)] rotate-90 md:rotate-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M17 8l4 4m0 0l-4 4m4-4H3"
                        ></path>
                      </svg>
                      {result.recommended_route.destination}
                    </h3>
                  </div>

                  {/* 4-Column Aligned Grid */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 mb-10 relative z-10">
                    <div className="p-4 md:p-6 bg-slate-800/40 rounded-3xl text-center border border-slate-700/50 hover:bg-slate-800/80 hover:border-blue-500/30 hover:shadow-[0_0_20px_rgba(59,130,246,0.15)] transition-all duration-300 group flex flex-col justify-center">
                      <div className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-3 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2">
                        <span className="text-blue-400 text-base md:text-lg drop-shadow-[0_0_5px_rgba(59,130,246,0.5)]">
                          ⏱️
                        </span>{" "}
                        Transit Time
                      </div>
                      <div className="text-3xl md:text-4xl font-black text-white mb-1">
                        {selectedRoute.transit_days}
                      </div>
                      <div className="text-xs font-bold text-slate-500">
                        days
                      </div>
                    </div>

                    <div className="p-4 md:p-6 bg-slate-800/40 rounded-3xl text-center border border-slate-700/50 hover:bg-slate-800/80 hover:border-indigo-500/30 hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all duration-300 group flex flex-col justify-center">
                      <div className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-3 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2">
                        <span className="text-indigo-400 text-base md:text-lg drop-shadow-[0_0_5px_rgba(99,102,241,0.5)]">
                          📏
                        </span>{" "}
                        Distance
                      </div>
                      <div className="text-3xl md:text-4xl font-black text-white mb-1">
                        {selectedRoute.distance_nm.toLocaleString()}
                      </div>
                      <div className="text-xs font-bold text-slate-500">NM</div>
                    </div>

                    <div className="p-4 md:p-6 bg-slate-800/40 rounded-3xl text-center border border-slate-700/50 hover:bg-slate-800/80 hover:border-purple-500/30 hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] transition-all duration-300 group flex flex-col justify-center">
                      <div className="text-[9px] md:text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-3 flex flex-col md:flex-row items-center justify-center gap-1 md:gap-2">
                        <span className="text-purple-400 text-base md:text-lg drop-shadow-[0_0_5px_rgba(168,85,247,0.5)]">
                          ⚓
                        </span>{" "}
                        Stops
                      </div>
                      <div className="text-3xl md:text-4xl font-black text-white mb-1">
                        {selectedRoute.transshipments}
                      </div>
                      <div className="text-xs font-bold text-slate-500">
                        transshipments
                      </div>
                    </div>

                    <div className="p-4 md:p-6 bg-emerald-500/10 rounded-3xl text-center border border-emerald-500/20 shadow-[inset_0_0_20px_rgba(16,185,129,0.05)] hover:border-emerald-400/40 hover:shadow-[0_0_25px_rgba(16,185,129,0.2)] transition-all duration-300 flex flex-col justify-center">
                      <div className="text-[9px] md:text-[10px] text-emerald-400 font-bold uppercase tracking-widest mb-3">
                        Route Score
                      </div>
                      <div className="text-3xl md:text-4xl font-black text-emerald-400 mb-1 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]">
                        {selectedRoute.route_score}
                      </div>
                      <div className="text-xs font-bold text-emerald-500/70">
                        / 10
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 relative z-10">
                    {/* Route Breakdown Card */}
                    <div className="bg-slate-800/40 rounded-3xl p-6 md:p-8 border border-slate-700/50 shadow-inner h-full">
                      <h4 className="font-bold text-slate-200 mb-5 flex items-center gap-3 text-[11px] uppercase tracking-widest">
                        <span className="text-indigo-400 bg-indigo-500/10 p-1.5 rounded-lg border border-indigo-500/20 shadow-[0_0_10px_rgba(99,102,241,0.2)]">
                          ✦
                        </span>{" "}
                        Route Intelligence Breakdown
                      </h4>
                      <div className="flex flex-col gap-4">
                        {[
                          `Evaluated ${routes.length} distinct maritime pathways from ${formData.origin} to ${formData.destination}.`,
                          selectedRoute.is_recommended
                            ? `Top recommendation selected due to highest efficiency score of ${selectedRoute.route_score}/10.`
                            : `Alternative pathway selected with a lower efficiency score of ${selectedRoute.route_score}/10.`,
                          selectedRoute.transshipments === 0
                            ? "Direct path eliminates excess port dwell time and transfer risks."
                            : `Includes ${selectedRoute.transshipments} transshipment(s), extending transit by approx ${Math.round(selectedRoute.transit_days * 0.2)} days.`,
                          `Total nautical miles computed accurately to ${selectedRoute.distance_nm.toLocaleString()} NM.`,
                        ].map((exp, index) => (
                          <div
                            key={index}
                            className="flex items-center gap-3 text-sm font-bold text-slate-300 bg-slate-900/80 px-4 py-3.5 rounded-xl border border-slate-700 hover:border-slate-600 transition-colors"
                          >
                            <span className="text-emerald-400 bg-emerald-500/10 p-0.5 rounded-full flex items-center justify-center border border-emerald-500/20 shrink-0">
                              <svg
                                className="w-3.5 h-3.5"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                              >
                                <path
                                  strokeLinecap="round"
                                  strokeLinejoin="round"
                                  strokeWidth="3"
                                  d="M5 13l4 4L19 7"
                                ></path>
                              </svg>
                            </span>
                            {exp}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Financial Dashboard Card */}
                    {selectedRoute && selectedRoute.pricing && (
                      <div className="bg-slate-800/40 rounded-3xl p-6 md:p-8 border border-slate-700/50 shadow-inner h-full flex flex-col justify-between">
                        <div>
                          <div className="flex items-center justify-between mb-5">
                            <h4 className="font-bold text-slate-200 flex items-center gap-3 text-[11px] uppercase tracking-widest">
                              <span className="text-emerald-400 bg-emerald-500/10 p-1.5 rounded-lg border border-emerald-500/20 shadow-[0_0_10px_rgba(16,185,129,0.2)]">
                                💵
                              </span>{" "}
                              Financial Breakdown
                            </h4>
                            <span className="text-[10px] font-bold bg-slate-900 px-2 py-1 rounded text-slate-400 border border-slate-700">
                              {formData.containers} Containers
                            </span>
                          </div>

                          <div className="space-y-3 mb-6">
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-slate-400 font-medium">
                                Ocean Freight
                              </span>
                              <span className="text-slate-200 font-bold">
                                $
                                {selectedRoute.pricing.breakdown.base_freight.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-slate-400 font-medium">
                                Bunker Surcharge (BAF)
                              </span>
                              <span className="text-slate-200 font-bold">
                                $
                                {selectedRoute.pricing.breakdown.bunker_adjustment.toLocaleString()}
                              </span>
                            </div>

                            {selectedRoute.pricing.breakdown.transshipment_fee >
                              0 && (
                              <div className="flex justify-between items-center text-sm">
                                <span className="text-amber-400 font-medium">
                                  Transshipment Fees
                                </span>
                                <span className="text-amber-400 font-bold">
                                  + $
                                  {selectedRoute.pricing.breakdown.transshipment_fee.toLocaleString()}
                                </span>
                              </div>
                            )}

                            <div className="flex justify-between items-center text-sm">
                              <span className="text-slate-400 font-medium">
                                Origin Port Handling
                              </span>
                              <span className="text-slate-200 font-bold">
                                $
                                {selectedRoute.pricing.breakdown.origin_handling.toLocaleString()}
                              </span>
                            </div>
                            <div className="flex justify-between items-center text-sm">
                              <span className="text-slate-400 font-medium">
                                Dest. Port Handling
                              </span>
                              <span className="text-slate-200 font-bold">
                                $
                                {selectedRoute.pricing.breakdown.destination_handling.toLocaleString()}
                              </span>
                            </div>
                          </div>
                        </div>

                        <div className="bg-slate-900/80 p-4 rounded-2xl border border-slate-700 mt-auto">
                          <div className="flex justify-between items-end">
                            <div>
                              <p className="text-[10px] uppercase tracking-widest font-bold text-emerald-400 mb-1">
                                Total Quote (USD)
                              </p>
                              <p className="text-xs font-medium text-slate-500">
                                Excludes customs & duties
                              </p>
                            </div>
                            <div className="text-3xl font-black text-emerald-400 tracking-tight drop-shadow-[0_0_8px_rgba(16,185,129,0.3)]">
                              $
                              {selectedRoute.pricing.total_cost_usd.toLocaleString()}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="mt-8 relative z-10">
                    <RouteSelector
                      routes={routes}
                      selectedRoute={selectedRoute}
                      onSelectRoute={(route) => setSelectedRoute(route)}
                    />
                  </div>

                  {/* Functional Action Buttons */}
                  <div className="mt-8 flex flex-col sm:flex-row items-center justify-end gap-4 relative z-10 pt-6 border-t border-slate-800">
                    <button
                      onClick={handleExportPDF}
                      disabled={isExporting}
                      className="w-full sm:w-auto px-6 py-3.5 rounded-xl text-sm font-bold text-slate-300 bg-slate-800 border border-slate-700 hover:bg-slate-700 hover:text-white active:scale-[0.98] transition-all flex items-center justify-center gap-2"
                    >
                      {isExporting ? (
                        "Preparing PDF..."
                      ) : (
                        <>
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2.5"
                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                            ></path>
                          </svg>
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
                          <svg
                            className="animate-spin h-4 w-4 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Processing...
                        </span>
                      ) : (
                        <>
                          Proceed to Booking
                          <svg
                            className="w-4 h-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth="2.5"
                              d="M14 5l7 7m0 0l-7 7m7-7H3"
                            ></path>
                          </svg>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : activeTab === "quotations" ? (
            <QuotationsTab
              quotes={savedQuotes}
              onRefresh={fetchQuotations}
              onNavigate={setActiveTab}
            />
          ) : (
            /* Under Construction Render (Route Intel, Quotations) */
            <div className="flex items-center justify-center h-full text-slate-400 flex-col gap-6 animate-fade-in">
              <div className="w-24 h-24 bg-slate-900/60 backdrop-blur-xl rounded-[2rem] flex items-center justify-center text-4xl shadow-xl border border-slate-800">
                🏗️
              </div>
              <div className="text-center">
                <h2 className="text-2xl font-black text-slate-200 mb-2">
                  Module under construction
                </h2>
                <p className="text-sm font-medium text-slate-500">
                  Navigate to{" "}
                  <span
                    className="text-indigo-400 font-bold cursor-pointer hover:underline"
                    onClick={() => setActiveTab("new_quotation")}
                  >
                    New Quotation
                  </span>{" "}
                  to use the Route Agent.
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Sleek Floating Success Notification */}
      {notification && (
        <div className="fixed bottom-10 right-10 z-[200] bg-emerald-500/10 backdrop-blur-2xl border border-emerald-500/30 text-emerald-400 p-5 rounded-2xl shadow-[0_20px_50px_rgba(16,185,129,0.3)] animate-fade-in-up flex items-center gap-4">
          <div className="bg-emerald-500/20 w-10 h-10 rounded-xl border border-emerald-500/30 flex items-center justify-center text-lg">
            ✅
          </div>
          <div>
            <p className="font-black text-sm text-white tracking-wide">
              Booking Confirmed
            </p>
            <p className="text-xs font-bold mt-0.5">{notification}</p>
          </div>
        </div>
      )}
    </div>
  );
}
