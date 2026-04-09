import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Eye, EyeOff, User, Mail, Phone, Lock } from "lucide-react";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, register } = useAuth();
  const from = location.state?.from || "/";

  const [tab, setTab] = useState("login"); // "login" | "register"
  const [showPass, setShowPass] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [regForm, setRegForm] = useState({ name: "", email: "", phone: "", password: "" });

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(loginForm.email, loginForm.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await register(regForm.name, regForm.email, regForm.phone, regForm.password);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        {/* Brand */}
        <div className="auth-card__brand" onClick={() => navigate("/")}>
          Matru Krupa Enterprise
        </div>
        <p className="auth-card__tagline">India's trusted electronics destination</p>

        {/* Tabs */}
        <div className="auth-tabs">
          <button
            className={`auth-tab ${tab === "login" ? "auth-tab--active" : ""}`}
            onClick={() => { setTab("login"); setError(""); }}
          >
            Login
          </button>
          <button
            className={`auth-tab ${tab === "register" ? "auth-tab--active" : ""}`}
            onClick={() => { setTab("register"); setError(""); }}
          >
            Register
          </button>
        </div>

        {error && <div className="auth-error">{error}</div>}

        {tab === "login" ? (
          <form className="auth-form" onSubmit={handleLogin}>
            <div className="auth-field">
              <Mail size={16} className="auth-field__icon" />
              <input
                type="email"
                placeholder="Email address"
                className="auth-field__input"
                value={loginForm.email}
                onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                required
              />
            </div>
            <div className="auth-field">
              <Lock size={16} className="auth-field__icon" />
              <input
                type={showPass ? "text" : "password"}
                placeholder="Password"
                className="auth-field__input"
                value={loginForm.password}
                onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                required
              />
              <button type="button" className="auth-field__toggle" onClick={() => setShowPass(!showPass)}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
            <p className="auth-switch">
              New here?{" "}
              <button type="button" onClick={() => setTab("register")}>Create account</button>
            </p>
          </form>
        ) : (
          <form className="auth-form" onSubmit={handleRegister}>
            <div className="auth-field">
              <User size={16} className="auth-field__icon" />
              <input
                type="text"
                placeholder="Full name"
                className="auth-field__input"
                value={regForm.name}
                onChange={(e) => setRegForm({ ...regForm, name: e.target.value })}
                required
              />
            </div>
            <div className="auth-field">
              <Mail size={16} className="auth-field__icon" />
              <input
                type="email"
                placeholder="Email address"
                className="auth-field__input"
                value={regForm.email}
                onChange={(e) => setRegForm({ ...regForm, email: e.target.value })}
                required
              />
            </div>
            <div className="auth-field">
              <Phone size={16} className="auth-field__icon" />
              <input
                type="tel"
                placeholder="Phone number"
                className="auth-field__input"
                value={regForm.phone}
                onChange={(e) => setRegForm({ ...regForm, phone: e.target.value })}
              />
            </div>
            <div className="auth-field">
              <Lock size={16} className="auth-field__icon" />
              <input
                type={showPass ? "text" : "password"}
                placeholder="Password (min 6 chars)"
                className="auth-field__input"
                value={regForm.password}
                onChange={(e) => setRegForm({ ...regForm, password: e.target.value })}
                minLength={6}
                required
              />
              <button type="button" className="auth-field__toggle" onClick={() => setShowPass(!showPass)}>
                {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
            <button type="submit" className="auth-submit" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
            </button>
            <p className="auth-switch">
              Already registered?{" "}
              <button type="button" onClick={() => setTab("login")}>Sign in</button>
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
