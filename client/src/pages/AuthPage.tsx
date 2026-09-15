import React, { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import {
  Lock,
  Mail,
  User,
  Shield,
  KeyRound,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Cpu,
} from "lucide-react";

type AuthMode = "LOGIN" | "REGISTER" | "FORGOT_PASSWORD" | "RESET_PASSWORD";

export const AuthPage: React.FC = () => {
  const { login, register, forgotPassword, resetPassword } = useAuth();

  const [mode, setMode] = useState<AuthMode>("LOGIN");

  // Form Fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"USER" | "ADMIN" | "TEAM_MEMBER">("USER");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Auto-detect ?resetToken= in URL search parameters
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tokenFromUrl = params.get("resetToken");
    if (tokenFromUrl) {
      setResetToken(tokenFromUrl);
      setMode("RESET_PASSWORD");
      setSuccessMessage("Password reset token detected from email link. Enter your new password below.");
    }
  }, []);

  const clearAlerts = () => {
    setErrorMessage(null);
    setSuccessMessage(null);
  };

  const handleModeChange = (newMode: AuthMode) => {
    clearAlerts();
    setMode(newMode);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearAlerts();
    setLoading(true);

    try {
      if (mode === "LOGIN") {
        await login(email, password);
      } else if (mode === "REGISTER") {
        if (!name.trim()) {
          throw new Error("Full name is required.");
        }
        await register(name, email, password, role);
      } else if (mode === "FORGOT_PASSWORD") {
        const res = await forgotPassword(email);
        setSuccessMessage(res.message);
        if (res.resetToken) {
          setResetToken(res.resetToken);
          // Suggest resetting directly
          setTimeout(() => {
            setMode("RESET_PASSWORD");
            setSuccessMessage("Token received! Enter your new password below.");
          }, 1500);
        }
      } else if (mode === "RESET_PASSWORD") {
        if (!resetToken.trim()) {
          throw new Error("Password reset token is required.");
        }
        if (!newPassword || newPassword.length < 6) {
          throw new Error("New password must be at least 6 characters long.");
        }
        const res = await resetPassword(resetToken.trim(), newPassword);
        setSuccessMessage(res.message);
        setTimeout(() => {
          handleModeChange("LOGIN");
          setPassword(newPassword);
        }, 2000);
      }
    } catch (err: any) {
      setErrorMessage(err.message || "An error occurred during authentication.");
    } finally {
      setLoading(false);
    }
  };

  // Quick Demo fill helpers
  const handleQuickDemoAdmin = () => {
    setEmail("admin@brand-os.ai");
    setPassword("DemoAdminPass123!");
    setMode("LOGIN");
    clearAlerts();
  };

  const handleQuickDemoUser = () => {
    setName("Demo Engineer");
    setEmail("user@brand-os.ai");
    setPassword("DemoUserPass123!");
    setRole("USER");
    setMode("REGISTER");
    clearAlerts();
  };

  return (
    <div className="min-h-screen w-screen bg-slate-950 text-slate-100 flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-indigo-500 selection:text-white">
      {/* Background Animated Gradients */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none animate-pulse" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-cyan-600/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Main Container */}
      <div className="w-full max-w-md bg-slate-900/80 backdrop-blur-2xl border border-slate-800/80 rounded-2xl shadow-2xl p-6 sm:p-8 relative z-10 transition-all duration-300">
        {/* Header Branding */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-indigo-500 via-purple-500 to-cyan-400 p-0.5 shadow-lg shadow-indigo-500/20 mb-3 flex items-center justify-center">
            <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <Cpu className="h-6 w-6 text-indigo-400" />
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
            Personal Brand OS
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Autonomous Multi-Agent AI Platform Authentication & RBAC
          </p>
        </div>

        {/* Mode Selector Tabs */}
        <div className="grid grid-cols-3 p-1 bg-slate-950/70 border border-slate-800/60 rounded-xl mb-6 text-xs font-medium">
          <button
            type="button"
            onClick={() => handleModeChange("LOGIN")}
            className={`py-2 rounded-lg transition-all ${
              mode === "LOGIN"
                ? "bg-indigo-600 text-white shadow-md font-semibold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => handleModeChange("REGISTER")}
            className={`py-2 rounded-lg transition-all ${
              mode === "REGISTER"
                ? "bg-indigo-600 text-white shadow-md font-semibold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Create Account
          </button>
          <button
            type="button"
            onClick={() => handleModeChange("RESET_PASSWORD")}
            className={`py-2 rounded-lg transition-all ${
              mode === "RESET_PASSWORD" || mode === "FORGOT_PASSWORD"
                ? "bg-indigo-600 text-white shadow-md font-semibold"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Reset Password
          </button>
        </div>

        {/* Alert Notifications */}
        {errorMessage && (
          <div className="mb-4 p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-rose-200 text-xs flex items-start gap-2 animate-in fade-in slide-in-from-top-2">
            <AlertCircle className="h-4 w-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{errorMessage}</span>
          </div>
        )}

        {successMessage && (
          <div className="mb-4 p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-200 text-xs flex items-start gap-2 animate-in fade-in slide-in-from-top-2">
            <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{successMessage}</span>
          </div>
        )}

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* REGISTER: Name Input */}
          {mode === "REGISTER" && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <User className="h-4 w-4" />
                </div>
                <input
                  type="text"
                  required
                  placeholder="Alex Mercer"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>
          )}

          {/* LOGIN / REGISTER / FORGOT: Email Input */}
          {mode !== "RESET_PASSWORD" && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Mail className="h-4 w-4" />
                </div>
                <input
                  type="email"
                  required
                  placeholder="user@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
              </div>
            </div>
          )}

          {/* LOGIN / REGISTER: Password Input */}
          {(mode === "LOGIN" || mode === "REGISTER") && (
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-medium text-slate-300">
                  Password
                </label>
                {mode === "LOGIN" && (
                  <button
                    type="button"
                    onClick={() => handleModeChange("FORGOT_PASSWORD")}
                    className="text-[11px] text-indigo-400 hover:text-indigo-300 hover:underline font-medium"
                  >
                    Forgot password?
                  </button>
                )}
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-10 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          )}

          {/* REGISTER: Role Selection */}
          {mode === "REGISTER" && (
            <div>
              <label className="block text-xs font-medium text-slate-300 mb-1.5">
                Role Authorization (RBAC)
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(["USER", "TEAM_MEMBER", "ADMIN"] as const).map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setRole(r)}
                    className={`py-2 px-1 rounded-xl text-[11px] font-semibold border transition-all flex flex-col items-center justify-center gap-1 ${
                      role === r
                        ? "bg-indigo-600/20 border-indigo-500 text-indigo-300"
                        : "bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700"
                    }`}
                  >
                    <Shield className="h-3.5 w-3.5" />
                    <span>{r.replace("_", " ")}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* RESET_PASSWORD: Token & New Password */}
          {mode === "RESET_PASSWORD" && (
            <>
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Reset Token (from Email)
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <KeyRound className="h-4 w-4" />
                  </div>
                  <input
                    type="text"
                    required
                    placeholder="Paste reset token from your email"
                    value={resetToken}
                    onChange={(e) => setResetToken(e.target.value)}
                    className="w-full pl-9 pr-4 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-indigo-300 font-mono placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  New Password
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-500">
                    <Lock className="h-4 w-4" />
                  </div>
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="Enter your new password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2.5 bg-slate-950/80 border border-slate-800 rounded-xl text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-500 hover:text-slate-300"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </>
          )}

          {/* FORGOT_PASSWORD: Helper Notice */}
          {mode === "FORGOT_PASSWORD" && (
            <div className="space-y-3">
              <p className="text-[11px] text-slate-400 bg-slate-950/50 p-3 rounded-xl border border-slate-800/80 leading-relaxed">
                Enter your registered email address above. An automated reset token link will be dispatched to your inbox via Resend.
              </p>
              <button
                type="button"
                onClick={() => handleModeChange("RESET_PASSWORD")}
                className="w-full py-2 px-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-indigo-400 hover:text-indigo-300 hover:border-slate-700 font-medium transition-all"
              >
                Already have a reset token? Reset Password Now →
              </button>
            </div>
          )}

          {/* Submit Action Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 px-4 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {loading ? (
              <span className="inline-block animate-spin border-2 border-white/20 border-t-white rounded-full h-4 w-4" />
            ) : (
              <>
                <span>
                  {mode === "LOGIN" && "Sign In to Platform"}
                  {mode === "REGISTER" && "Create New Account"}
                  {mode === "FORGOT_PASSWORD" && "Send Reset Token"}
                  {mode === "RESET_PASSWORD" && "Set New Password"}
                </span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </form>

        {/* Alternative Actions for Forgot & Reset */}
        {(mode === "FORGOT_PASSWORD" || mode === "RESET_PASSWORD") && (
          <div className="mt-4 text-center">
            <button
              type="button"
              onClick={() => handleModeChange("LOGIN")}
              className="text-xs text-slate-400 hover:text-indigo-400 transition-colors"
            >
              Back to Sign In
            </button>
          </div>
        )}

        {/* Quick Demo Pre-fill Bar */}
        <div className="mt-6 pt-4 border-t border-slate-800/80">
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mb-2 font-medium">
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Quick Test Credentials</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={handleQuickDemoAdmin}
              className="py-1.5 px-2 bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 rounded-lg text-[10px] text-slate-300 font-mono text-left truncate transition-all"
            >
              👑 Admin Demo
            </button>
            <button
              type="button"
              onClick={handleQuickDemoUser}
              className="py-1.5 px-2 bg-slate-950/80 hover:bg-slate-800/80 border border-slate-800 rounded-lg text-[10px] text-slate-300 font-mono text-left truncate transition-all"
            >
              👤 New User Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
