import { useState } from "react";

const USERS = [
  { email: "alex@flowdesk.io",  password: "demo123", name: "Alex Morgan", role: "Head of Product",      initials: "AM" },
  { email: "sarah@flowdesk.io", password: "demo123", name: "Sarah Chen",  role: "Engineering Manager", initials: "SC" },
];

export default function LoginPage({ onLogin }) {
  const [em, setEm] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);

  const go = () => {
    if (!em || !pw) { setErr("Please enter your email and password."); return; }
    setLoading(true);
    setErr("");
    setTimeout(() => {
      const u = USERS.find((u) => u.email === em && u.password === pw);
      if (u) {
        onLogin(u);
      } else {
        setErr("Invalid credentials. Try: alex@flowdesk.io / demo123");
        setLoading(false);
      }
    }, 900);
  };

  return (
    <div className="login-wrap">
      {/* LEFT PANEL */}
      <div className="login-left">
        <div>
          <div className="wordmark">Flowdesk<span> · Command Center</span></div>
        </div>

        <div>
          <div className="login-tagline">
            Your day,<br /><em>intelligently</em><br />organized.
          </div>
          <div style={{ marginTop: 28, fontSize: 12, color: "rgba(255,255,255,0.28)", letterSpacing: "0.3px" }}>
            Triaged across Urgent · Important · Later
          </div>
        </div>

        <div>
          {[
            { icon: "🔴", title: "Urgent items always surface first",   desc: "Deadlines and critical alerts are never buried by noise." },
            { icon: "📊", title: "One unified daily brief",             desc: "Email, Slack, calendar, and tasks — intelligently consolidated." },
            { icon: "⚡", title: "Priority-aware inbox",               desc: "Every message is triaged before you see it." },
          ].map((f, i) => (
            <div key={i} className="feat">
              <div className="feat-icon">{f.icon}</div>
              <div className="feat-text">
                <strong>{f.title}</strong>
                <p>{f.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT PANEL */}
      <div className="login-right">
        <div className="login-form-box">
          <div style={{ marginBottom: 30 }}>
            <h2 style={{ fontFamily: "'Instrument Serif',serif", fontSize: 28, fontWeight: 400, marginBottom: 6 }}>
              Sign in to Flowdesk
            </h2>
            <p style={{ fontSize: 13.5, color: "var(--text2)" }}>Access your personalized command center.</p>
          </div>

          {/* OAuth buttons */}
          <button className="oauth-btn">
            <svg width="15" height="15" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            Continue with Google
          </button>

          <button className="oauth-btn">
            <svg width="15" height="15" viewBox="0 0 88 88" fill="var(--text2)">
              <rect width="40" height="40"/><rect x="48" width="40" height="40"/>
              <rect y="48" width="40" height="40"/><rect x="48" y="48" width="40" height="40"/>
            </svg>
            Continue with Microsoft SSO
          </button>

          <div className="divider-row">or sign in with email</div>

          {err && <div className="err-box">{err}</div>}

          <div style={{ marginBottom: 14 }}>
            <label className="form-label">Work email</label>
            <input
              className="form-input"
              type="email"
              placeholder="you@company.com"
              value={em}
              onChange={(e) => setEm(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && go()}
            />
          </div>

          <div style={{ marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
              <label className="form-label" style={{ margin: 0 }}>Password</label>
              <span style={{ fontSize: 12, color: "var(--accent)", cursor: "pointer" }}>Forgot password?</span>
            </div>
            <input
              className="form-input"
              type="password"
              placeholder="••••••••"
              value={pw}
              onChange={(e) => setPw(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && go()}
            />
          </div>

          <button className="login-btn" onClick={go} disabled={loading}>
            {loading ? <span><span className="spin">↻</span> Signing in…</span> : "Sign in"}
          </button>

          <div style={{ marginTop: 18, textAlign: "center", fontSize: 12, color: "var(--text3)" }}>
            Demo: <b style={{ color: "var(--text2)" }}>alex@flowdesk.io</b> / <b style={{ color: "var(--text2)" }}>demo123</b>
          </div>

          <div style={{ marginTop: 26, padding: "14px 16px", background: "var(--surface2)", borderRadius: 10, border: "1px solid var(--border)" }}>
            <div style={{ fontSize: 10.5, fontWeight: 600, color: "var(--text3)", letterSpacing: "1.4px", textTransform: "uppercase", marginBottom: 5 }}>Enterprise</div>
            <p style={{ fontSize: 12, color: "var(--text2)", lineHeight: 1.55 }}>
              SSO, audit logs, custom data retention, and SAML 2.0 available on the Enterprise plan.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}