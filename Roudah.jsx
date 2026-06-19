import { useState, useEffect, useLayoutEffect, useRef } from "react";
import { BrowserRouter, Routes, Route, NavLink, Link, useLocation } from "react-router-dom";
import { C, WA, Img, Reveal, isUserSignedIn, userSignOut, useMaintenance, useBannerOffset, BANNER_HEIGHT, composeNoticeMessage } from "./src/shared.jsx";
import Home       from "./src/pages/Home.jsx";
import Collection from "./src/pages/Collection.jsx";
import About      from "./src/pages/About.jsx";
import Contact    from "./src/pages/Contact.jsx";
import Login      from "./src/pages/Login.jsx";
import Register   from "./src/pages/Register.jsx";
import Admin      from "./src/pages/Admin.jsx";

function ScrollToTop() {
  const { pathname } = useLocation();

  useLayoutEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [pathname]);

  return null;
}

function Navbar() {
  const [scrolled,   setScrolled]   = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const [signedIn,   setSignedIn]   = useState(isUserSignedIn());
  const bannerOffset = useBannerOffset();
  const lastScrollY = useRef(0);
  const { pathname } = useLocation();

  useEffect(() => {
    const update = () => setSignedIn(isUserSignedIn());
    window.addEventListener("roudah:auth", update);
    window.addEventListener("storage",     update);
    return () => {
      window.removeEventListener("roudah:auth", update);
      window.removeEventListener("storage",     update);
    };
  }, []);

  useEffect(() => {
    const fn = () => {
      const currentY  = window.scrollY;
      const previousY = lastScrollY.current;
      setScrolled(currentY > 55);
      if (currentY <= 8)           setNavVisible(true);
      else if (currentY > previousY) setNavVisible(false);
      else if (currentY < previousY) setNavVisible(true);
      lastScrollY.current = Math.max(currentY, 0);
    };
    lastScrollY.current = window.scrollY;
    fn();
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
    setNavVisible(true);
  }, [pathname]);

  const linkStyle = (isActive) => ({
    color: isActive ? C.gold : C.espresso,
    fontSize: "0.6rem", letterSpacing: "0.22em",
    textTransform: "uppercase", fontFamily: "Arial",
    fontWeight: 300, textDecoration: "none",
  });

  const handleSignOut = () => {
    userSignOut();
    setMobileOpen(false);
  };

  return (
    <>
      <nav style={{
        position: "fixed", top: `${bannerOffset}px`, left: 0, right: 0, zIndex: 200,
        backgroundColor: scrolled ? C.white : "transparent",
        borderBottom: `1px solid ${scrolled ? "rgba(192,171,140,0.28)" : "transparent"}`,
        transform: navVisible || mobileOpen ? "translateY(0)" : "translateY(-100%)",
        transition: "background-color 500ms, border-color 500ms, transform 320ms ease, top 250ms ease",
        padding: "1rem 2.5rem",
        display: "flex", alignItems: "center", justifyContent: "space-between", gap: "2rem",
      }}>
        <Link to="/" style={{ fontFamily: "Georgia,serif", fontSize: "1rem", letterSpacing: "0.52em", color: C.espresso, fontWeight: 300, textTransform: "uppercase", userSelect: "none", flexShrink: 0, textDecoration: "none" }}>
          ROUDAH
        </Link>

        <div className="r-navlinks" style={{ display: "flex", gap: "2rem" }}>
          {[["Collection", "/collection"], ["About", "/about"], ["Contact", "/contact"]].map(([label, to]) => (
            <NavLink key={label} to={to} style={({ isActive }) => linkStyle(isActive)}>{label}</NavLink>
          ))}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "1.35rem", flexShrink: 0 }}>
          {signedIn ? (
            <>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.espresso} strokeWidth="1.4" strokeLinecap="round" style={{ cursor: "pointer" }}>
                <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
              </svg>
              <div style={{ position: "relative", cursor: "pointer" }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={C.espresso} strokeWidth="1.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/>
                </svg>
                <span style={{ position: "absolute", top: "-7px", right: "-8px", backgroundColor: C.gold, color: C.espresso, fontSize: "0.5rem", width: "14px", height: "14px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Arial", fontWeight: 700 }}>2</span>
              </div>
              <div style={{ cursor: "pointer" }} onClick={() => setMobileOpen(o => !o)}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke={C.espresso} strokeWidth="1.4" strokeLinecap="round">
                  {mobileOpen
                    ? <><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></>
                    : <><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="18" x2="21" y2="18"/></>}
                </svg>
              </div>
            </>
          ) : (
            <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
              <Link to="/login"
                style={{ color: C.espresso, fontSize: "0.58rem", letterSpacing: "0.18em", textTransform: "uppercase", fontFamily: "Arial", fontWeight: 300, textDecoration: "none", whiteSpace: "nowrap" }}>
                Sign In
              </Link>
              <Link to="/register"
                style={{ backgroundColor: C.terracotta, color: C.white, padding: "0.38rem 1rem", fontSize: "0.58rem", letterSpacing: "0.18em", textTransform: "uppercase", fontFamily: "Arial", fontWeight: 300, textDecoration: "none", whiteSpace: "nowrap" }}>
                Register
              </Link>
            </div>
          )}
        </div>
      </nav>

      {signedIn && mobileOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 190, backgroundColor: C.espresso, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "2.5rem" }}>
          {[["Collection", "/collection"], ["About", "/about"], ["Contact", "/contact"]].map(([label, to]) => (
            <Link key={label} to={to}
              style={{ color: C.sand, fontSize: "0.72rem", letterSpacing: "0.4em", textTransform: "uppercase", fontFamily: "Arial", textDecoration: "none" }}>{label}</Link>
          ))}
          <button onClick={handleSignOut}
            style={{ background: "none", border: "1px solid rgba(192,171,140,0.3)", color: C.sand, fontSize: "0.62rem", letterSpacing: "0.3em", textTransform: "uppercase", fontFamily: "Arial", padding: "0.5rem 1.5rem", cursor: "pointer", marginTop: "1rem" }}>
            Sign Out
          </button>
        </div>
      )}
    </>
  );
}

function Footer() {
  return (
    <footer style={{ backgroundColor: C.marble, padding: "4.5rem 2.5rem 2.5rem", borderTop: "1px solid rgba(200,150,28,0.12)" }}>
      <Reveal dir="bottom">
        <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
          <Img file={WA(35)} fallbackSeed="roudah-logo" w={400} h={300}
            style={{ height: "80px", width: "auto", margin: "0 auto", opacity: 0.85, filter: "brightness(1.1)" }} />
        </div>
      </Reveal>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: "2.5rem", maxWidth: "900px", margin: "0 auto 3.5rem" }}>
        {[
          { title: "Collection",    links: ["The Oasis Edit", "New Arrivals", "Bestsellers", "Archive"]    },
          { title: "About",         links: ["Our Story", "The Atelier", "Sustainability", "Press"]         },
          { title: "Customer Care", links: ["Sizing Guide", "Shipping", "Returns", "FAQs"]                 },
          { title: "Follow",        links: ["Instagram", "Pinterest", "Newsletter", "Lookbook"]            },
        ].map(({ title, links }, ci) => (
          <Reveal key={title} dir="bottom" delay={ci * 90}>
            <div>
              <p style={{ color: C.sand, fontSize: "0.56rem", letterSpacing: "0.3em", textTransform: "uppercase", fontFamily: "Arial", marginBottom: "1.25rem" }}>{title}</p>
              {links.map(link => (
                <p key={link} style={{ color: C.white, fontSize: "0.76rem", fontFamily: "Arial", fontWeight: 300, marginBottom: "0.6rem", opacity: 0.52, cursor: "pointer" }}>{link}</p>
              ))}
            </div>
          </Reveal>
        ))}
      </div>
      <div style={{ height: "1px", backgroundColor: C.gold, opacity: 0.14, marginBottom: "1.75rem" }} />
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <Link to="/admin" style={{ color: C.sand, fontSize: "0.48rem", letterSpacing: "0.18em", fontFamily: "Arial", opacity: 0.28, textDecoration: "none" }}>
          Admin
        </Link>
        <p style={{ color: C.sand, fontSize: "0.56rem", letterSpacing: "0.18em", fontFamily: "Arial", opacity: 0.48 }}>© 2025 ROUDAH®. All rights reserved.</p>
        <p style={{ color: C.sand, fontSize: "0.82rem", fontFamily: "Georgia", opacity: 0.42 }}>روضة</p>
      </div>
    </footer>
  );
}

function ScrollProgress() {
  const [pct, setPct] = useState(0);
  useEffect(() => {
    const fn = () => {
      const max = document.body.scrollHeight - window.innerHeight;
      setPct(max > 0 ? (window.scrollY / max) * 100 : 0);
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <div style={{ position: "fixed", top: 0, left: 0, width: `${pct}%`, height: "2px", backgroundColor: C.gold, zIndex: 300, transition: "width 80ms linear", boxShadow: `0 0 8px ${C.gold}66`, pointerEvents: "none" }} />
  );
}

function MaintenanceBanner({ message }) {
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 250,
      height: `${BANNER_HEIGHT}px`,
      backgroundColor: C.terracotta,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "0 1.5rem",
    }}>
      <p style={{ color: C.white, fontSize: "0.62rem", fontFamily: "Arial", letterSpacing: "0.02em", textAlign: "center" }}>
        {message}
      </p>
    </div>
  );
}

function MaintenancePopup({ message }) {
  const [dismissed, setDismissed] = useState(() => sessionStorage.getItem("roudah_maint_popup_dismissed") === "1");

  if (dismissed) return null;

  const dismiss = () => {
    sessionStorage.setItem("roudah_maint_popup_dismissed", "1");
    setDismissed(true);
  };

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 400,
      backgroundColor: "rgba(28,20,16,0.75)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "1.5rem",
    }}>
      <div style={{ backgroundColor: C.white, padding: "2.5rem 2rem", maxWidth: "360px", textAlign: "center", position: "relative" }}>
        <button onClick={dismiss}
          style={{ position: "absolute", top: "0.75rem", right: "0.75rem", background: "none", border: "none", cursor: "pointer", color: C.espresso, opacity: 0.45, fontSize: "0.9rem" }}>
          ✕
        </button>
        <p style={{ color: C.gold, fontSize: "1.3rem", marginBottom: "1rem" }}>✦</p>
        <h2 style={{ fontFamily: "Georgia,serif", fontSize: "1.15rem", color: C.espresso, fontWeight: 300, letterSpacing: "0.04em", marginBottom: "0.85rem" }}>
          We'll be right back
        </h2>
        <p style={{ fontFamily: "Arial", fontSize: "0.68rem", color: C.charcoal, opacity: 0.7, lineHeight: 1.6 }}>
          {message}
        </p>
      </div>
    </div>
  );
}

function MaintenancePage({ message }) {
  const [hov, setHov] = useState(false);
  return (
    <div style={{
      minHeight: "100vh", backgroundColor: C.espresso,
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "2.5rem", textAlign: "center",
    }}>
      <div style={{ maxWidth: "440px" }}>
        <p style={{ fontFamily: "Georgia,serif", fontSize: "1rem", letterSpacing: "0.52em", color: C.white, fontWeight: 300, textTransform: "uppercase", marginBottom: "2.5rem" }}>
          ROUDAH
        </p>
        <p style={{ color: C.gold, fontSize: "1.4rem", marginBottom: "1.5rem", opacity: 0.85 }}>✦</p>
        <h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(1.6rem,4vw,2.3rem)", color: C.white, fontWeight: 300, letterSpacing: "0.08em", textTransform: "uppercase", marginBottom: "1.25rem" }}>
          Under Maintenance
        </h1>
        <p style={{ color: C.sand, fontSize: "0.72rem", fontFamily: "Arial", fontWeight: 300, lineHeight: 1.85, opacity: 0.78, marginBottom: "2.5rem" }}>
          {message}
        </p>
        <div style={{ width: "44px", height: "1px", backgroundColor: C.gold, margin: "0 auto 2.5rem", opacity: 0.5 }} />
        <Link to="/admin"
          onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
          style={{
            display: "inline-block",
            border: `1px solid ${hov ? C.gold : "rgba(255,255,255,0.25)"}`,
            color: C.white, padding: "0.75rem 2.25rem",
            fontSize: "0.56rem", letterSpacing: "0.26em", textTransform: "uppercase",
            fontFamily: "Arial", fontWeight: 300, textDecoration: "none",
            transition: "border-color 200ms",
          }}
        >
          Admin Login
        </Link>
      </div>
    </div>
  );
}

const GLOBAL_STYLES = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  input::placeholder { color: rgba(192,171,140,0.55); }
  ::-webkit-scrollbar { height: 4px; width: 4px; background: transparent; }
  ::-webkit-scrollbar-thumb { background: #C0AB8C; }
  @keyframes fadeUp    { from { opacity:0; transform:translateY(40px);  } to { opacity:1; transform:translateY(0);  } }
  @keyframes scaleIn   { from { opacity:0; transform:scale(0.88);       } to { opacity:1; transform:scale(1);       } }
  @keyframes kenBurns  { 0%   { transform:scale(1) translateX(0); }       100% { transform:scale(1.09) translateX(-2%); } }
  @media (max-width: 1200px) { .r-mason-4 { column-count: 3 !important; } }
  @media (max-width: 720px)  { .r-auth-grid { grid-template-columns: 1fr !important; } .r-auth-img { display: none !important; } }
  @media (max-width: 900px)  { .r-story { grid-template-columns: 1fr !important; } .r-craft { grid-template-columns: 1fr !important; } .r-mason { column-count: 2 !important; } .r-mason-4 { column-count: 2 !important; } .r-navlinks { display: none !important; } }
  @media (max-width: 580px)  { .r-mason { column-count: 1 !important; } .r-mason-4 { column-count: 1 !important; } }
`;

function PublicLayout() {
  const maintenance = useMaintenance();

  if (maintenance.enabled) {
    return <MaintenancePage message={maintenance.message} />;
  }

  const notice = maintenance.notice;

  return (
    <div style={{ backgroundColor: C.cream, color: C.charcoal, fontFamily: "Georgia,'Times New Roman',serif", overflowX: "hidden" }}>
      {notice.enabled && notice.type === "banner" && <MaintenanceBanner message={composeNoticeMessage(notice)} />}
      {notice.enabled && notice.type === "popup"  && <MaintenancePopup  message={composeNoticeMessage(notice)} />}
      <ScrollToTop />
      <ScrollProgress />
      <Navbar />
      <Routes>
        <Route path="/"           element={<Home />} />
        <Route path="/collection" element={<Collection />} />
        <Route path="/about"      element={<About />} />
        <Route path="/contact"    element={<Contact />} />
        <Route path="/login"      element={<Login />} />
        <Route path="/register"   element={<Register />} />
      </Routes>
      <Footer />
    </div>
  );
}

function AppRouter() {
  const { pathname } = useLocation();
  const isAdmin = pathname.startsWith("/admin");

  return (
    <>
      <style>{GLOBAL_STYLES}</style>
      {isAdmin ? (
        <Routes>
          <Route path="/admin" element={<Admin />} />
        </Routes>
      ) : (
        <PublicLayout />
      )}
    </>
  );
}

export default function Roudah() {
  return (
    <BrowserRouter>
      <AppRouter />
    </BrowserRouter>
  );
}
