import { useState, useEffect } from "react";

const USERS = [
  { email: "alex@flowdesk.io",  password: "demo123", name: "Alex Morgan", role: "Head of Product",      initials: "AM" },
  { email: "sarah@flowdesk.io", password: "demo123", name: "Sarah Chen",  role: "Engineering Manager", initials: "SC" },
];

const TESTIMONIALS = [
  { text: "Flowdesk cut our planning time in half." },
  { text: "Finally, a command center that just works." },
  { text: "The clarity we always needed." },
];

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
  </svg>
);

const MicrosoftIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.4 2H2v9.4h9.4V2z" fill="#F25022"/>
    <path d="M22 2h-9.4v9.4H22V2z" fill="#7FBA00"/>
    <path d="M11.4 12.6H2V22h9.4v-9.4z" fill="#00A4EF"/>
    <path d="M22 12.6h-9.4V22H22v-9.4z" fill="#FFB900"/>
  </svg>
);

export default function LoginPage({ onLogin }) {
  const [em, setEm] = useState("");
  const [pw, setPw] = useState("");
  const [err, setErr] = useState("");
  const [loading, setLoading] = useState(false);
  const [tick, setTick] = useState(0);
  const [fade, setFade] = useState(true);

  useEffect(() => {
    const id = setInterval(() => {
      setFade(false);
      setTimeout(() => {
        setTick((t) => (t + 1) % TESTIMONIALS.length);
        setFade(true);
      }, 300);
    }, 3500);
    return () => clearInterval(id);
  }, []);

  const go = () => {
    if (!em || !pw) { setErr("Please enter your email and password."); return; }
    setLoading(true); setErr("");
    setTimeout(() => {
      const u = USERS.find((u) => u.email === em && u.password === pw);
      if (u) { onLogin(u); }
      else { setErr("Invalid credentials. Try: alex@flowdesk.io / demo123"); setLoading(false); }
    }, 900);
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:wght@300;400;500;600&display=swap');

        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        .lp-wrap {
          display: flex;
          min-height: 100vh;
          font-family: 'DM Sans', sans-serif;
          background: #f6f5f2;
        }

        .lp-left {
          position: relative;
          width: 420px;
          flex-shrink: 0;
          background: #0d0b14;
          overflow: hidden;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 52px 44px;
        }

        .lp-blob {
          position: absolute;
          border-radius: 50%;
          filter: blur(80px);
          opacity: 0.45;
          pointer-events: none;
        }
        .lp-blob-1 {
          width: 340px; height: 340px;
          background: radial-gradient(circle, #7c4dff 0%, #3d1fa5 60%, transparent 100%);
          top: -80px; left: -100px;
          animation: blobFloat 8s ease-in-out infinite;
        }
        .lp-blob-2 {
          width: 260px; height: 260px;
          background: radial-gradient(circle, #ff4d9d 0%, #a0136d 60%, transparent 100%);
          bottom: 60px; right: -80px;
          animation: blobFloat 10s ease-in-out infinite reverse;
        }
        .lp-blob-3 {
          width: 180px; height: 180px;
          background: radial-gradient(circle, #00cfff 0%, #006fa8 60%, transparent 100%);
          bottom: 200px; left: 20px;
          animation: blobFloat 12s ease-in-out infinite 2s;
        }
        @keyframes blobFloat {
          0%, 100% { transform: translate(0,0) scale(1); }
          33%       { transform: translate(12px,-18px) scale(1.05); }
          66%       { transform: translate(-10px,12px) scale(0.97); }
        }

        .lp-grid {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
          background-size: 40px 40px;
          pointer-events: none;
        }

        .lp-noise {
          position: absolute; inset: 0; opacity: 0.06;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
          background-size: 200px 200px;
          pointer-events: none;
        }

        .lp-logo { position: relative; z-index: 2; }
        .lp-logo-mark {
          display: inline-flex; align-items: center; justify-content: center;
          width: 44px; height: 44px;
          background: linear-gradient(135deg, #7c4dff, #ff4d9d);
          border-radius: 12px; margin-bottom: 16px;
          box-shadow: 0 0 24px rgba(124,77,255,0.5);
        }
        .lp-logo-mark svg { width: 22px; height: 22px; }
        .lp-wordmark {
          font-family: 'DM Serif Display', serif;
          font-size: 30px; color: #fff; letter-spacing: 0.5px; line-height: 1;
        }
        .lp-tagline {
          margin-top: 8px; font-size: 13px;
          color: rgba(255,255,255,0.4); font-weight: 300; letter-spacing: 0.5px;
        }

        .lp-headline { position: relative; z-index: 2; }
        .lp-headline h1 {
          font-family: 'DM Serif Display', serif;
          font-size: 42px; line-height: 1.15; color: #fff;
        }
        .lp-headline h1 em {
          font-style: italic;
          background: linear-gradient(90deg, #a78bfa, #f472b6, #67e8f9);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .lp-testimonial { position: relative; z-index: 2; }
        .lp-testimonial-inner {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px;
          padding: 22px 24px;
          backdrop-filter: blur(6px);
        }
        .lp-quote-wrap {
          display: flex; gap: 10px; align-items: flex-start;
        }
        .lp-quote-mark {
          font-family: 'DM Serif Display', serif;
          font-size: 38px; line-height: 1;
          color: #a78bfa; flex-shrink: 0; margin-top: -6px;
        }
        .lp-quote {
          font-size: 14px;
          color: rgba(255,255,255,0.85);
          line-height: 1.65;
          transition: opacity 0.3s ease;
          min-height: 46px;
        }
        .lp-quote.faded { opacity: 0; }

        .lp-right {
          flex: 1; display: flex; align-items: center;
          justify-content: center; padding: 40px 24px; background: #f6f5f2;
        }
        .lp-form-box { width: 100%; max-width: 400px; }
        .lp-form-title {
          font-family: 'DM Serif Display', serif;
          font-size: 30px; font-weight: 400; color: #0d0b14; margin-bottom: 6px;
        }
        .lp-form-sub { font-size: 13.5px; color: #888; margin-bottom: 28px; }

        .oauth-btn {
          width: 100%; padding: 11px 18px;
          border: 1.5px solid #e2e0dc; background: #fff;
          border-radius: 10px; font-family: 'DM Sans', sans-serif;
          font-size: 13.5px; font-weight: 500; color: #333;
          cursor: pointer; margin-bottom: 10px;
          transition: border-color 0.2s, box-shadow 0.2s;
          display: flex; align-items: center; justify-content: center; gap: 10px;
        }
        .oauth-btn:hover {
          border-color: #a78bfa;
          box-shadow: 0 0 0 3px rgba(167,139,250,0.12);
        }

        .lp-divider {
          display: flex; align-items: center; gap: 12px;
          color: #bbb; font-size: 12px; margin: 18px 0;
        }
        .lp-divider::before, .lp-divider::after {
          content: ''; flex: 1; height: 1px; background: #e2e0dc;
        }

        .form-label {
          display: block; font-size: 12.5px; font-weight: 600;
          color: #555; margin-bottom: 6px; letter-spacing: 0.3px;
        }
        .form-input {
          width: 100%; padding: 11px 14px;
          border: 1.5px solid #e2e0dc; border-radius: 10px;
          font-family: 'DM Sans', sans-serif; font-size: 14px;
          background: #fff; color: #0d0b14; outline: none;
          transition: border-color 0.2s, box-shadow 0.2s; margin-bottom: 14px;
        }
        .form-input::placeholder { color: #bbb; }
        .form-input:focus {
          border-color: #7c4dff;
          box-shadow: 0 0 0 3px rgba(124,77,255,0.1);
        }

        .err-box {
          background: #fff1f3; border: 1px solid #fecdd3;
          border-radius: 8px; padding: 10px 14px;
          font-size: 13px; color: #be123c; margin-bottom: 14px;
        }

        .login-btn {
          width: 100%; padding: 13px;
          background: linear-gradient(135deg, #7c4dff, #a855f7);
          color: #fff; border: none; border-radius: 10px;
          font-family: 'DM Sans', sans-serif;
          font-size: 14.5px; font-weight: 600; cursor: pointer;
          letter-spacing: 0.3px;
          transition: opacity 0.2s, transform 0.15s, box-shadow 0.2s;
          box-shadow: 0 4px 20px rgba(124,77,255,0.35); margin-top: 4px;
        }
        .login-btn:hover:not(:disabled) {
          opacity: 0.92; transform: translateY(-1px);
          box-shadow: 0 6px 28px rgba(124,77,255,0.45);
        }
        .login-btn:active:not(:disabled) { transform: translateY(0); }
        .login-btn:disabled { opacity: 0.6; cursor: not-allowed; }

        .lp-footer-note {
          text-align: center; margin-top: 20px; font-size: 12px; color: #aaa;
        }

        @media (max-width: 768px) { .lp-left { display: none; } }
      `}</style>

      <div className="lp-wrap">

        <div className="lp-left">
          <div className="lp-blob lp-blob-1" />
          <div className="lp-blob lp-blob-2" />
          <div className="lp-blob lp-blob-3" />
          <div className="lp-grid" />
          <div className="lp-noise" />

          <div className="lp-logo">
            <div className="lp-logo-mark">
              <svg viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" rx="1.5"/>
                <rect x="14" y="3" width="7" height="7" rx="1.5"/>
                <rect x="3" y="14" width="7" height="7" rx="1.5"/>
                <path d="M14 17.5h7M17.5 14v7"/>
              </svg>
            </div>
            <div className="lp-wordmark">Flowdesk</div>
            <div className="lp-tagline">Intelligence, organized.</div>
          </div>

          <div className="lp-headline">
            <h1>Your day,<br /><em>intelligently</em><br />organized.</h1>
          </div>

          <div className="lp-testimonial">
            <div className="lp-testimonial-inner">
              <div className="lp-quote-wrap">
                <span className="lp-quote-mark">"</span>
                <p className={`lp-quote${fade ? "" : " faded"}`}>
                  {TESTIMONIALS[tick].text}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="lp-right">
          <div className="lp-form-box">
            <h2 className="lp-form-title">Sign in to Flowdesk</h2>
            <p className="lp-form-sub">Access your personalized command center.</p>

            <button className="oauth-btn"><GoogleIcon /> Continue with Google</button>
            <button className="oauth-btn"><MicrosoftIcon /> Continue with Microsoft SSO</button>

            <div className="lp-divider">or sign in with email</div>

            {err && <div className="err-box">{err}</div>}

            <label className="form-label">Work email</label>
            <input className="form-input" type="email" placeholder="you@company.com"
              value={em} onChange={(e) => setEm(e.target.value)} onKeyDown={(e) => e.key === "Enter" && go()} />

            <label className="form-label">Password</label>
            <input className="form-input" type="password" placeholder="••••••••"
              value={pw} onChange={(e) => setPw(e.target.value)} onKeyDown={(e) => e.key === "Enter" && go()} />

            <button className="login-btn" onClick={go} disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </button>

            <p className="lp-footer-note">By signing in you agree to our Terms & Privacy Policy.</p>
          </div>
        </div>

      </div>
    </>
  );
}