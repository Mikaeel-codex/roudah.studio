import { useState } from "react";
import { Link } from "react-router-dom";
import { C, WA, Img, useBannerOffset } from "../shared.jsx";

function InputField({ label, type = "text", value, onChange, placeholder, half = false }) {
  const [focused, setFocused] = useState(false);
  return (
    <div style={{ marginBottom: "1.25rem", flex: half ? "1 1 calc(50% - 0.4rem)" : "1 1 100%" }}>
      <label style={{
        display: "block",
        color: C.espresso, fontSize: "0.52rem",
        letterSpacing: "0.28em", textTransform: "uppercase",
        fontFamily: "Arial", marginBottom: "0.5rem", opacity: 0.75,
      }}>
        {label}
      </label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          width: "100%",
          backgroundColor: "transparent",
          border: "none",
          borderBottom: `1px solid ${focused ? C.terracotta : "rgba(62,28,10,0.25)"}`,
          padding: "0.6rem 0",
          fontSize: "0.88rem",
          fontFamily: "Georgia,serif",
          color: C.espresso,
          fontWeight: 300,
          outline: "none",
          transition: "border-color 250ms",
        }}
      />
    </div>
  );
}

export default function Register() {
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", password: "", confirm: "",
  });
  const [showPass, setShowPass]   = useState(false);
  const [agreed, setAgreed]       = useState(false);
  const bannerOffset = useBannerOffset();

  const set = key => e => setForm(f => ({ ...f, [key]: e.target.value }));

  const passwordsMatch = form.password === form.confirm || form.confirm === "";
  const strong = form.password.length >= 8;

  const handleSubmit = e => {
    e.preventDefault();
  };

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "1fr 1fr",
      minHeight: "100vh",
      paddingTop: `${64 + bannerOffset}px`,
    }}
    className="r-auth-grid"
    >
      {/* ── Left image panel ─────────────────────────────────────────────── */}
      <div style={{ position: "relative", overflow: "hidden" }} className="r-auth-img">
        <Img
          file={WA(16)} fallbackSeed="register-img"
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }}
        />
        <div style={{
          position: "absolute", inset: 0,
          background: `linear-gradient(135deg, rgba(62,28,10,0.80) 0%, rgba(62,28,10,0.32) 100%)`,
        }} />
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column",
          justifyContent: "flex-end", padding: "3rem",
        }}>
          <p style={{ color: C.gold, fontSize: "0.52rem", letterSpacing: "0.44em", textTransform: "uppercase", fontFamily: "Arial", marginBottom: "1rem", opacity: 0.8 }}>
            ✦ Join Roudah
          </p>
          <p style={{
            fontFamily: "Georgia,serif", fontSize: "clamp(1.4rem,2.5vw,2rem)",
            color: C.white, fontWeight: 300, letterSpacing: "0.08em",
            lineHeight: 1.45, marginBottom: "2rem",
          }}>
            "Dressed with<br />intention."
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem", marginBottom: "2rem" }}>
            {["Early access to new arrivals", "Order history & tracking", "Exclusive member pricing"].map(benefit => (
              <div key={benefit} style={{ display: "flex", alignItems: "center", gap: "0.65rem" }}>
                <span style={{ color: C.gold, fontSize: "0.55rem" }}>✦</span>
                <span style={{ color: "rgba(255,255,255,0.7)", fontSize: "0.58rem", fontFamily: "Arial", letterSpacing: "0.1em" }}>{benefit}</span>
              </div>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <div style={{ height: "1px", width: "32px", backgroundColor: C.gold, opacity: 0.45 }} />
            <span style={{ color: C.sand, fontSize: "0.8rem", fontFamily: "Georgia", opacity: 0.65 }}>روضة</span>
          </div>
        </div>
      </div>

      {/* ── Right form panel ─────────────────────────────────────────────── */}
      <div style={{
        backgroundColor: C.white,
        display: "flex", flexDirection: "column",
        justifyContent: "center", alignItems: "center",
        padding: "4rem 3rem",
        overflowY: "auto",
      }}>
        <div style={{ width: "100%", maxWidth: "400px" }}>

          <Link to="/" style={{ textDecoration: "none" }}>
            <p style={{
              fontFamily: "Georgia,serif", fontSize: "1.1rem",
              letterSpacing: "0.52em", color: C.espresso,
              fontWeight: 300, textTransform: "uppercase",
              textAlign: "center", marginBottom: "3rem",
            }}>
              ROUDAH
            </p>
          </Link>

          <p style={{ color: C.terracotta, fontSize: "0.52rem", letterSpacing: "0.4em", textTransform: "uppercase", fontFamily: "Arial", marginBottom: "0.6rem" }}>
            Create Account
          </p>
          <h1 style={{
            fontFamily: "Georgia,serif", fontSize: "clamp(1.4rem,3vw,2rem)",
            color: C.espresso, fontWeight: 300,
            letterSpacing: "0.06em", marginBottom: "0.6rem",
          }}>
            Join the atelier
          </h1>
          <p style={{ color: C.sand, fontSize: "0.62rem", fontFamily: "Arial", fontWeight: 300, marginBottom: "2.5rem" }}>
            Create your account to shop and track your orders.
          </p>

          <form onSubmit={handleSubmit}>
            <div style={{ display: "flex", gap: "0.8rem", flexWrap: "wrap" }}>
              <InputField label="First Name" value={form.firstName} onChange={set("firstName")} placeholder="Noor" half />
              <InputField label="Last Name"  value={form.lastName}  onChange={set("lastName")}  placeholder="Al-Rashid" half />
            </div>

            <InputField label="Email Address" type="email" value={form.email} onChange={set("email")} placeholder="you@example.com" />

            <InputField label="Password" type={showPass ? "text" : "password"} value={form.password} onChange={set("password")} placeholder="Min. 8 characters" />

            {form.password && (
              <div style={{ marginTop: "-0.8rem", marginBottom: "1rem" }}>
                <div style={{ height: "2px", borderRadius: "1px", backgroundColor: "rgba(192,171,140,0.2)", marginBottom: "0.3rem", overflow: "hidden" }}>
                  <div style={{
                    height: "100%", borderRadius: "1px",
                    width: form.password.length >= 12 ? "100%" : form.password.length >= 8 ? "66%" : "33%",
                    backgroundColor: form.password.length >= 12 ? C.sage : form.password.length >= 8 ? C.gold : C.terracotta,
                    transition: "width 300ms, background-color 300ms",
                  }} />
                </div>
                <p style={{ fontSize: "0.5rem", fontFamily: "Arial", color: strong ? C.sage : C.terracotta, letterSpacing: "0.1em" }}>
                  {form.password.length >= 12 ? "Strong" : form.password.length >= 8 ? "Good" : "Too short"}
                </p>
              </div>
            )}

            <InputField
              label="Confirm Password"
              type={showPass ? "text" : "password"}
              value={form.confirm}
              onChange={set("confirm")}
              placeholder="Repeat password"
            />

            {!passwordsMatch && (
              <p style={{ fontSize: "0.52rem", fontFamily: "Arial", color: C.terracotta, marginTop: "-0.8rem", marginBottom: "1rem", letterSpacing: "0.08em" }}>
                Passwords do not match
              </p>
            )}

            <label style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem", cursor: "pointer", marginBottom: "2rem" }}>
              <input
                type="checkbox"
                checked={showPass}
                onChange={e => setShowPass(e.target.checked)}
                style={{ accentColor: C.terracotta, width: "12px", height: "12px", marginTop: "2px", flexShrink: 0 }}
              />
              <span style={{ color: C.espresso, fontSize: "0.54rem", fontFamily: "Arial", opacity: 0.65 }}>Show passwords</span>
            </label>

            <label style={{ display: "flex", alignItems: "flex-start", gap: "0.6rem", cursor: "pointer", marginBottom: "2rem" }}>
              <input
                type="checkbox"
                checked={agreed}
                onChange={e => setAgreed(e.target.checked)}
                style={{ accentColor: C.terracotta, width: "12px", height: "12px", marginTop: "2px", flexShrink: 0 }}
              />
              <span style={{ color: C.espresso, fontSize: "0.54rem", fontFamily: "Arial", opacity: 0.65, lineHeight: 1.6 }}>
                I agree to the{" "}
                <a href="#" style={{ color: C.terracotta, textDecoration: "none" }}>Terms & Conditions</a>
                {" "}and{" "}
                <a href="#" style={{ color: C.terracotta, textDecoration: "none" }}>Privacy Policy</a>
              </span>
            </label>

            <button
              type="submit"
              disabled={!agreed || !passwordsMatch || !strong}
              style={{
                width: "100%",
                backgroundColor: agreed && passwordsMatch && strong ? C.terracotta : "rgba(192,171,140,0.35)",
                color: agreed && passwordsMatch && strong ? C.white : C.sand,
                border: "none", padding: "0.9rem",
                fontSize: "0.58rem", letterSpacing: "0.28em",
                textTransform: "uppercase", fontFamily: "Arial",
                fontWeight: 400,
                cursor: agreed && passwordsMatch && strong ? "pointer" : "not-allowed",
                marginBottom: "1.25rem",
                transition: "background-color 250ms",
              }}
              onMouseEnter={e => { if (agreed && passwordsMatch && strong) e.currentTarget.style.backgroundColor = C.espresso; }}
              onMouseLeave={e => { if (agreed && passwordsMatch && strong) e.currentTarget.style.backgroundColor = C.terracotta; }}
            >
              Create Account
            </button>

            <div style={{ display: "flex", alignItems: "center", gap: "1rem", marginBottom: "1.25rem" }}>
              <div style={{ flex: 1, height: "1px", backgroundColor: "rgba(192,171,140,0.35)" }} />
              <span style={{ color: C.sand, fontSize: "0.52rem", fontFamily: "Arial", letterSpacing: "0.12em" }}>or</span>
              <div style={{ flex: 1, height: "1px", backgroundColor: "rgba(192,171,140,0.35)" }} />
            </div>

            <button
              type="button"
              style={{
                width: "100%",
                backgroundColor: "transparent", color: C.espresso,
                border: `1px solid rgba(62,28,10,0.22)`,
                padding: "0.9rem",
                fontSize: "0.58rem", letterSpacing: "0.18em",
                textTransform: "uppercase", fontFamily: "Arial",
                fontWeight: 300, cursor: "pointer",
                display: "flex", alignItems: "center", justifyContent: "center", gap: "0.7rem",
                transition: "background-color 200ms",
              }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = C.parchment; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = "transparent"; }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/>
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              </svg>
              Sign up with Google
            </button>
          </form>

          <p style={{ textAlign: "center", marginTop: "2.5rem", color: C.espresso, fontSize: "0.58rem", fontFamily: "Arial", opacity: 0.65 }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: C.terracotta, textDecoration: "none", fontWeight: 400 }}>
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
