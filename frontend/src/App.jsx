import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import CustomerDashboard from './CustomerDashboard';
import AdminDashboard from './AdminDashboard';

const AuthPage = ({ setAuth }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const endpoint = isLogin ? "/api/login" : "/api/signup";
    const payload = { 
        email: formData.email, 
        password: formData.password 
    };

    try {
      const response = await fetch(`http://127.0.0.1:8000${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem('role', data.role);
        localStorage.setItem('user_id', data.user_id);
        setAuth({ isAuthenticated: true, role: data.role });
        navigate(data.role === 'admin' ? '/admin' : '/dashboard');
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

const App = () => {
  const [auth, setAuth] = useState({
    isAuthenticated: !!localStorage.getItem('role'),
    role: localStorage.getItem('role') || null
  });

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/"
          element={
            !auth.isAuthenticated ? (
              <AuthPage setAuth={setAuth} />
            ) : (
              <Navigate to={auth.role === 'admin' ? '/admin' : '/dashboard'} replace />
            )
          }
        />
        <Route
          path="/admin"
          element={
            auth.isAuthenticated && auth.role === 'admin' ? (
              <AdminDashboard />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            auth.isAuthenticated && auth.role === 'customer' ? (
              <CustomerDashboard />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </BrowserRouter>
  );
};

export default App;