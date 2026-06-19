import { useState, useEffect, useRef } from "react";

// ─── User auth helpers ─────────────────────────────────────────────────────────
const USER_KEY = "roudah_user_v1";
export const isUserSignedIn = () => !!localStorage.getItem(USER_KEY);
export const userSignIn     = (email) => {
  localStorage.setItem(USER_KEY, email);
  window.dispatchEvent(new Event("roudah:auth"));
};
export const userSignOut    = () => {
  localStorage.removeItem(USER_KEY);
  window.dispatchEvent(new Event("roudah:auth"));
};

// ─── Maintenance mode helpers ───────────────────────────────────────────────────
// `enabled`  → hard site-wide takeover: visitors see ONLY the maintenance page.
// `notice`   → advance heads-up (banner/popup) about a future scheduled date, site stays live.
const MAINTENANCE_KEY = "roudah_maintenance_v1";
const MAINTENANCE_DEFAULT = {
  enabled: false,
  message: "We're currently performing scheduled maintenance. We'll be back online shortly.",
  notice: {
    enabled: false,
    type: "banner", // "banner" | "popup"
    message: "We'll be undergoing scheduled maintenance.",
    date: "",
    time: "",
  },
};

export const getMaintenance = () => {
  try {
    const raw = localStorage.getItem(MAINTENANCE_KEY);
    const parsed = raw ? JSON.parse(raw) : {};
    return {
      ...MAINTENANCE_DEFAULT,
      ...parsed,
      notice: { ...MAINTENANCE_DEFAULT.notice, ...(parsed.notice || {}) },
    };
  } catch {
    return MAINTENANCE_DEFAULT;
  }
};

export const setMaintenance = (settings) => {
  localStorage.setItem(MAINTENANCE_KEY, JSON.stringify(settings));
  window.dispatchEvent(new Event("roudah:maintenance"));
};

export const BANNER_HEIGHT = 38;

export function useMaintenance() {
  const [m, setM] = useState(getMaintenance());
  useEffect(() => {
    const update = () => setM(getMaintenance());
    window.addEventListener("roudah:maintenance", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("roudah:maintenance", update);
      window.removeEventListener("storage", update);
    };
  }, []);
  return m;
}

export function useBannerOffset() {
  const m = useMaintenance();
  return !m.enabled && m.notice.enabled && m.notice.type === "banner" ? BANNER_HEIGHT : 0;
}

export function formatNoticeDate(dateStr, timeStr) {
  if (!dateStr) return "";
  const d = new Date(`${dateStr}T${timeStr || "00:00"}`);
  if (isNaN(d.getTime())) return "";
  const dateLabel = d.toLocaleDateString("en-ZA", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
  const timeLabel = timeStr ? d.toLocaleTimeString("en-ZA", { hour: "2-digit", minute: "2-digit" }) : "";
  return timeLabel ? `${dateLabel} at ${timeLabel}` : dateLabel;
}

export function composeNoticeMessage(notice) {
  const dateLabel = formatNoticeDate(notice.date, notice.time);
  return dateLabel ? `${notice.message} Scheduled for ${dateLabel}.` : notice.message;
}

// ─── Colour palette ────────────────────────────────────────────────────────────
export const C = {
  cream:      "#EDE8DF",
  parchment:  "#E4DDD2",
  sand:       "#C0AB8C",
  sage:       "#6B7048",
  charcoal:   "#1A1A18",
  terracotta: "#B85428",
  espresso:   "#3E1C0A",
  gold:       "#C8961C",
  forest:     "#253420",
  marble:     "#16161C",
  copper:     "#8A4428",
  white:      "#F8F4EE",
};

// ─── Image helper ──────────────────────────────────────────────────────────────
export const WA = (n) => `IMG-20260526-WA${String(n).padStart(4, "0")}.jpg`;

export function Img({ file, fallbackSeed, w = 600, h = 800, style = {}, alt = "" }) {
  return (
    <img
      src={`/images/${file}`}
      alt={alt}
      onError={e => { e.target.onerror = null; e.target.src = `https://picsum.photos/seed/${fallbackSeed}/${w}/${h}`; }}
      style={{ display: "block", ...style }}
    />
  );
}

// ─── Hooks ────────────────────────────────────────────────────────────────────
export function useReveal(threshold = 0.12) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const obs = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setVisible(true); },
      { threshold }
    );
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

export function useCountUp(target, duration = 2000, shouldStart = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!shouldStart) return;
    let start = null;
    const tick = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setCount(Math.round(ease * target));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [shouldStart, target, duration]);
  return count;
}

// ─── Reveal wrapper ────────────────────────────────────────────────────────────
export function Reveal({ children, dir = "bottom", delay = 0, style: extStyle = {} }) {
  const [ref, visible] = useReveal();
  const transforms = {
    bottom: "translateY(48px)",
    left:   "translateX(-48px)",
    right:  "translateX(48px)",
    scale:  "scale(0.92)",
  };
  return (
    <div ref={ref} style={{
      opacity: visible ? 1 : 0,
      transform: visible ? "none" : transforms[dir],
      transition: `opacity 900ms cubic-bezier(.22,1,.36,1) ${delay}ms, transform 900ms cubic-bezier(.22,1,.36,1) ${delay}ms`,
      willChange: "opacity, transform",
      ...extStyle,
    }}>
      {children}
    </div>
  );
}

// ─── Stat counter ──────────────────────────────────────────────────────────────
export function StatCounter({ target, suffix = "", label }) {
  const [ref, visible] = useReveal(0.3);
  const count = useCountUp(target, 2200, visible);
  return (
    <div ref={ref} style={{ textAlign: "center" }}>
      <p style={{ fontFamily: "Georgia,serif", fontSize: "clamp(2.2rem,4vw,3.2rem)", color: C.white, fontWeight: 300, letterSpacing: "0.04em" }}>
        {count.toLocaleString()}{suffix}
      </p>
      <p style={{ color: C.sand, fontSize: "0.55rem", letterSpacing: "0.32em", textTransform: "uppercase", fontFamily: "Arial", marginTop: "0.65rem", opacity: 0.75 }}>{label}</p>
    </div>
  );
}

// ─── Data ─────────────────────────────────────────────────────────────────────
export const PINS = [
  { type: "product", file: WA(0),  fallback: "p1", name: "The Sahara Cape",       fabric: "Sage Silk · Hand-embroidered",   price: "R 4,850", tag: "New Arrival", saves: 847,  scarcity: "Only 3 left"    },
  { type: "quote",   text: '"Dressed with intention."',                            bg: C.terracotta, textColor: C.white },
  { type: "product", file: WA(1),  fallback: "p2", name: "Noor Embroidered Abaya",fabric: "Forest Linen · Floral beadwork", price: "R 6,200", tag: "Bestseller",  saves: 1243, scarcity: "Only 2 left"    },
  { type: "product", file: WA(13), fallback: "p3", name: "Al Rimal Floral Abaya", fabric: "Ivory Organza · Hand-stitched",  price: "R 7,450", tag: "Limited",     saves: 632,  scarcity: "Last piece"     },
  { type: "tag",     color: C.sage,    label: "The Oasis Edit", subtitle: "2025 Collection"             },
  { type: "product", file: WA(3),  fallback: "p4", name: "The Oasis Silhouette",  fabric: "Pearl Crepe · Veil overlay",    price: "R 8,100", tag: "Exclusive",   saves: 934,  scarcity: "Only 2 left"    },
  { type: "product", file: WA(18), fallback: "p5", name: "The Velvet Co-ord",     fabric: "Chocolate Crepe · Beaded trim", price: "R 5,600", tag: "New Arrival", saves: 521,  scarcity: "Only 4 left"    },
  { type: "quote",   text: '"Every piece begins as a feeling."',                   bg: C.charcoal, textColor: C.sand },
  { type: "product", file: WA(20), fallback: "p6", name: "Dusk Wrap in Mocha",    fabric: "Duchess Satin · Crystal fringe",price: "R 5,300", tag: "Limited",     saves: 412,  scarcity: "Limited pieces" },
  { type: "product", file: WA(25), fallback: "p7", name: "Layla Satin Abaya",     fabric: "Taupe Charmeuse · Bell cuff",   price: "R 3,950", tag: "Bestseller",  saves: 1089, scarcity: "Only 3 left"    },
  { type: "tag",     color: C.espresso, label: "Handcrafted",    subtitle: "Each piece individually tagged" },
  { type: "product", file: WA(27), fallback: "p8", name: "The Ivory Cape Set",    fabric: "Ivory Satin · Gold tassel tie", price: "R 6,900", tag: "New Arrival", saves: 728,  scarcity: "Only 5 left"    },
];

export const CATEGORIES = [
  { label: "Abayas",   file: WA(1)  },
  { label: "Capes",    file: WA(2)  },
  { label: "Gowns",    file: WA(0)  },
  { label: "Sets",     file: WA(18) },
  { label: "Wraps",    file: WA(20) },
  { label: "Lookbook", file: WA(4)  },
  { label: "New In",   file: WA(27) },
];

export const TRENDING = [
  { file: WA(8),  fallback: "t1", name: "Al Rimal Desert Abaya",  price: "R 5,200", tag: "New Arrival" },
  { file: WA(15), fallback: "t2", name: "Garden Hour Abaya",       price: "R 4,600", tag: "Bestseller"  },
  { file: WA(1),  fallback: "t3", name: "Noor Embroidered Abaya",  price: "R 6,200", tag: "Limited"     },
  { file: WA(25), fallback: "t4", name: "Layla Satin Abaya",       price: "R 3,950", tag: "Bestseller"  },
  { file: WA(27), fallback: "t5", name: "The Ivory Cape Set",      price: "R 6,900", tag: "New Arrival" },
  { file: WA(13), fallback: "t6", name: "Al Rimal Floral Abaya",   price: "R 7,450", tag: "Limited"     },
];

// ─── Product catalog (shared source of truth: storefront + admin) ─────────────
const PRODUCTS_KEY = "roudah_products_v1";

export const PRODUCT_CATEGORIES = ["Abayas", "Capes", "Gowns", "Sets", "Wraps"];
export const PRODUCT_TAGS = ["New Arrival", "Bestseller", "Limited", "Exclusive"];

const PRODUCTS_SEED = [
  { id: 1,  file: WA(1),  name: "Noor Embroidered Abaya",    fabric: "Forest Linen · Floral beadwork",   price: 6200, tag: "Bestseller",  category: "Abayas", saves: 1243, stock: 2 },
  { id: 2,  file: WA(13), name: "Al Rimal Floral Abaya",     fabric: "Ivory Organza · Hand-stitched",    price: 7450, tag: "Limited",     category: "Abayas", saves: 632,  stock: 1 },
  { id: 3,  file: WA(8),  name: "Al Rimal Desert Abaya",     fabric: "Sand Crepe · Velvet trim",         price: 5200, tag: "New Arrival", category: "Abayas", saves: 891,  stock: 4 },
  { id: 4,  file: WA(15), name: "Garden Hour Abaya",         fabric: "Sage Linen · Embroidered hem",     price: 4600, tag: "Bestseller",  category: "Abayas", saves: 1104, stock: 3 },
  { id: 5,  file: WA(25), name: "Layla Satin Abaya",         fabric: "Taupe Charmeuse · Bell cuff",      price: 3950, tag: "Bestseller",  category: "Abayas", saves: 1089, stock: 3 },
  { id: 6,  file: WA(7),  name: "Midnight Abaya",            fabric: "Black Crepe · Gold chain detail",  price: 5800, tag: "Exclusive",   category: "Abayas", saves: 734,  stock: 2 },
  { id: 7,  file: WA(10), name: "Rose Petal Abaya",          fabric: "Dusty Rose Silk · Pearl cuffs",    price: 5900, tag: "New Arrival", category: "Abayas", saves: 677,  stock: 4 },
  { id: 8,  file: WA(0),  name: "The Sahara Cape",           fabric: "Sage Silk · Hand-embroidered",     price: 4850, tag: "New Arrival", category: "Capes",  saves: 847,  stock: 3 },
  { id: 9,  file: WA(2),  name: "Crescent Cape",             fabric: "Ivory Crepe · Pearl buttons",      price: 3800, tag: "New Arrival", category: "Capes",  saves: 562,  stock: 5 },
  { id: 10, file: WA(11), name: "Dusk Cape in Blush",        fabric: "Blush Silk · Crystal fringe",      price: 4200, tag: "Limited",     category: "Capes",  saves: 489,  stock: 2 },
  { id: 11, file: WA(12), name: "Azalea Evening Cape",       fabric: "Lilac Organza · Crystal hem",      price: 4300, tag: "Limited",     category: "Capes",  saves: 531,  stock: 2 },
  { id: 12, file: WA(4),  name: "The Oasis Gown",            fabric: "Pearl Organza · Veil overlay",     price: 9200, tag: "Exclusive",   category: "Gowns",  saves: 1542, stock: 1 },
  { id: 13, file: WA(9),  name: "Blossom Evening Gown",      fabric: "Blush Tulle · Floral appliqué",    price: 8400, tag: "Limited",     category: "Gowns",  saves: 923,  stock: 2 },
  { id: 14, file: WA(16), name: "Saffron Column Gown",       fabric: "Marigold Satin · Crystal trim",    price: 7800, tag: "Exclusive",   category: "Gowns",  saves: 811,  stock: 3 },
  { id: 15, file: WA(14), name: "Desert Sand Gown",          fabric: "Warm Ivory Crepe · Beaded neck",   price: 8800, tag: "Exclusive",   category: "Gowns",  saves: 1021, stock: 1 },
  { id: 16, file: WA(18), name: "The Velvet Co-ord",         fabric: "Chocolate Crepe · Beaded trim",    price: 5600, tag: "New Arrival", category: "Sets",   saves: 521,  stock: 4 },
  { id: 17, file: WA(27), name: "The Ivory Cape Set",        fabric: "Ivory Satin · Gold tassel tie",    price: 6900, tag: "New Arrival", category: "Sets",   saves: 728,  stock: 5 },
  { id: 18, file: WA(22), name: "Pearl Two-Piece Set",       fabric: "Pearl Crepe · Veil panel",         price: 6100, tag: "Bestseller",  category: "Sets",   saves: 944,  stock: 2 },
  { id: 19, file: WA(5),  name: "The Lace Overlay Set",      fabric: "Ivory Lace · Silk underlay",       price: 7200, tag: "Exclusive",   category: "Sets",   saves: 856,  stock: 2 },
  { id: 20, file: WA(19), name: "Marigold Embroidered Set",  fabric: "Golden Crepe · Hand-beaded",       price: 6500, tag: "Limited",     category: "Sets",   saves: 643,  stock: 3 },
  { id: 21, file: WA(20), name: "Dusk Wrap in Mocha",        fabric: "Duchess Satin · Crystal fringe",   price: 5300, tag: "Limited",     category: "Wraps",  saves: 412,  stock: 0 },
  { id: 22, file: WA(3),  name: "The Oasis Silhouette",      fabric: "Pearl Crepe · Veil overlay",       price: 8100, tag: "Exclusive",   category: "Wraps",  saves: 934,  stock: 2 },
  { id: 23, file: WA(24), name: "Amber Wrap Coat",           fabric: "Camel Wool · Silk lining",         price: 6700, tag: "New Arrival", category: "Wraps",  saves: 603,  stock: 3 },
  { id: 24, file: WA(17), name: "Sage Kimono Wrap",          fabric: "Sage Silk · Hand-dyed",            price: 3600, tag: "Bestseller",  category: "Wraps",  saves: 789,  stock: 5 },
];

export const formatPrice = (price) => `R ${Number(price).toLocaleString()}`;

export const getScarcity = (stock) => {
  if (stock === 0) return "Sold Out";
  if (stock === 1) return "Last piece";
  return `Only ${stock} left`;
};

export const getProducts = () => {
  try {
    const raw = localStorage.getItem(PRODUCTS_KEY);
    return raw ? JSON.parse(raw) : PRODUCTS_SEED;
  } catch {
    return PRODUCTS_SEED;
  }
};

export const setProductsStore = (list) => {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(list));
  window.dispatchEvent(new Event("roudah:products"));
};

export function useProducts() {
  const [products, setLocal] = useState(getProducts());

  useEffect(() => {
    const update = () => setLocal(getProducts());
    window.addEventListener("roudah:products", update);
    window.addEventListener("storage", update);
    return () => {
      window.removeEventListener("roudah:products", update);
      window.removeEventListener("storage", update);
    };
  }, []);

  const update = (updater) => {
    const next = typeof updater === "function" ? updater(getProducts()) : updater;
    setProductsStore(next);
    setLocal(next);
  };

  return [products, update];
}

// ─── Small UI ─────────────────────────────────────────────────────────────────
export function Chip({ children, active, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ padding: "0.38rem 1rem", border: `1px solid ${active ? C.terracotta : "rgba(184,164,140,0.45)"}`, backgroundColor: active ? C.terracotta : hov ? C.parchment : "transparent", color: active ? C.white : C.espresso, fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", fontFamily: "Arial", fontWeight: 300, cursor: "pointer", transition: "all 300ms", whiteSpace: "nowrap" }}>
      {children}
    </button>
  );
}

export function GhostBtn({ children, href = "#" }) {
  const [hov, setHov] = useState(false);
  return (
    <a href={href} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ color: C.terracotta, fontSize: "0.65rem", letterSpacing: "0.22em", textTransform: "uppercase", fontFamily: "Arial", fontWeight: 300, textDecoration: "none", borderBottom: `1px solid ${hov ? C.terracotta : "transparent"}`, paddingBottom: "2px", transition: "border-color 300ms", display: "inline-block" }}>
      {children}
    </a>
  );
}

// ─── Pin card ─────────────────────────────────────────────────────────────────
export function PinCard({ pin }) {
  const [hov, setHov] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  if (pin.type === "quote") {
    return (
      <div style={{ backgroundColor: pin.bg, padding: "2.75rem 2rem", breakInside: "avoid", marginBottom: "12px" }}>
        <p style={{ fontFamily: "Georgia,serif", fontStyle: "italic", fontSize: "1.05rem", color: pin.textColor, lineHeight: 1.65 }}>{pin.text}</p>
        <p style={{ color: pin.textColor, opacity: 0.45, fontSize: "0.55rem", letterSpacing: "0.3em", textTransform: "uppercase", fontFamily: "Arial", marginTop: "1.25rem" }}>— ROUDAH®</p>
      </div>
    );
  }
  if (pin.type === "tag") {
    return (
      <div style={{ backgroundColor: pin.color, padding: "2rem 1.75rem", breakInside: "avoid", marginBottom: "12px" }}>
        <p style={{ color: C.white, fontSize: "1.25rem", fontFamily: "Georgia,serif", fontWeight: 300, letterSpacing: "0.06em", marginBottom: "0.4rem" }}>{pin.label}</p>
        <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "0.58rem", letterSpacing: "0.22em", textTransform: "uppercase", fontFamily: "Arial" }}>{pin.subtitle}</p>
        <div style={{ width: "24px", height: "1px", backgroundColor: C.gold, marginTop: "1.25rem", opacity: 0.6 }} />
      </div>
    );
  }

  const tagBg = pin.tag === "Limited" ? C.terracotta : pin.tag === "Exclusive" ? C.espresso : C.sage;
  return (
    <div style={{ breakInside: "avoid", marginBottom: "12px" }}>
    <div ref={cardRef}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => { setHov(false); setTilt({ x: 0, y: 0 }); }}
      onMouseMove={e => {
        if (!cardRef.current) return;
        const rect = cardRef.current.getBoundingClientRect();
        const x = (e.clientX - rect.left) / rect.width - 0.5;
        const y = (e.clientY - rect.top) / rect.height - 0.5;
        setTilt({ x: y * 6, y: x * -6 });
      }}
      style={{
        position: "relative", overflow: "hidden", cursor: "pointer",
        transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${hov ? 1.02 : 1})`,
        transition: hov ? "transform 80ms ease" : "transform 700ms cubic-bezier(.22,1,.36,1)",
        boxShadow: hov ? "0 24px 56px rgba(22,16,10,0.24)" : "none",
      }}>
      <div style={{ position: "absolute", top: "10px", left: "10px", zIndex: 10, backgroundColor: tagBg, padding: "3px 9px" }}>
        <span style={{ color: C.white, fontSize: "0.52rem", letterSpacing: "0.15em", textTransform: "uppercase", fontFamily: "Arial" }}>{pin.tag}</span>
      </div>
      <div style={{ position: "absolute", top: "10px", right: "10px", zIndex: 10, backgroundColor: "rgba(26,26,24,0.65)", padding: "4px 8px", display: "flex", alignItems: "center", gap: "4px" }}>
        <span style={{ color: C.gold, fontSize: "0.55rem" }}>✦</span>
        <span style={{ color: C.white, fontSize: "0.55rem", fontFamily: "Arial" }}>{pin.saves.toLocaleString()}</span>
      </div>
      <Img file={pin.file} fallbackSeed={pin.fallback}
        style={{ width: "100%", height: "auto", transition: "transform 600ms ease", transform: hov ? "scale(1.04)" : "scale(1)" }} />
      <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(26,26,24,0.92) 0%, rgba(26,26,24,0.3) 45%, transparent 70%)", opacity: hov ? 1 : 0, transition: "opacity 400ms ease", display: "flex", flexDirection: "column", justifyContent: "flex-end", padding: "1.25rem" }}>
        <p style={{ color: C.white, fontFamily: "Georgia,serif", fontSize: "0.92rem", letterSpacing: "0.04em", marginBottom: "0.2rem", fontWeight: 300 }}>{pin.name}</p>
        <p style={{ color: C.sand, fontSize: "0.57rem", letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "Arial", marginBottom: "0.5rem" }}>{pin.fabric}</p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <p style={{ color: C.gold, fontSize: "0.85rem", fontFamily: "Georgia,serif" }}>{pin.price}</p>
          <p style={{ color: "rgba(255,255,255,0.65)", fontSize: "0.58rem", fontStyle: "italic", fontFamily: "Georgia,serif" }}>{pin.scarcity}</p>
        </div>
      </div>
    </div>
    </div>
  );
}

// ─── Trending card ─────────────────────────────────────────────────────────────
export function TrendingCard({ item }) {
  const [hov, setHov] = useState(false);
  const tagBg = item.tag === "Limited" ? C.terracotta : item.tag === "Bestseller" ? C.copper : C.sage;
  return (
    <div onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ flexShrink: 0, width: "200px", cursor: "pointer" }}>
      <div style={{ position: "relative", overflow: "hidden" }}>
        <Img file={item.file} fallbackSeed={item.fallback} w={400} h={500}
          style={{ width: "100%", aspectRatio: "4/5", objectFit: "cover", transition: "transform 600ms", transform: hov ? "scale(1.05)" : "scale(1)" }} />
        <div style={{ position: "absolute", top: "8px", left: "8px", backgroundColor: tagBg, padding: "3px 7px" }}>
          <p style={{ color: C.white, fontSize: "0.5rem", letterSpacing: "0.14em", textTransform: "uppercase", fontFamily: "Arial" }}>{item.tag}</p>
        </div>
      </div>
      <div style={{ paddingTop: "0.75rem" }}>
        <p style={{ fontFamily: "Georgia,serif", fontSize: "0.82rem", color: C.espresso, marginBottom: "0.2rem", fontWeight: 300 }}>{item.name}</p>
        <p style={{ color: C.gold, fontSize: "0.8rem", fontFamily: "Georgia,serif" }}>{item.price}</p>
      </div>
    </div>
  );
}
