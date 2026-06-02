import { useState, useEffect, useRef } from "react";

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
        position: "relative", breakInside: "avoid", marginBottom: "12px", overflow: "hidden", cursor: "pointer",
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
