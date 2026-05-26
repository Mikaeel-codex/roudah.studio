import { useState, useEffect, useRef } from "react";

// ─── Colour palette ────────────────────────────────────────────────────────────
const C = {
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
const WA = (n) => `IMG-20260526-WA${String(n).padStart(4,"0")}.jpg`;

function Img({ file, fallbackSeed, w = 600, h = 800, style = {}, alt = "" }) {
  return (
    <img
      src={`/images/${file}`}
      alt={alt}
      onError={e => { e.target.onerror = null; e.target.src = `https://picsum.photos/seed/${fallbackSeed}/${w}/${h}`; }}
      style={{ display: "block", ...style }}
    />
  );
}

// ─── Hooks ─────────────────────────────────────────────────────────────────────
function useReveal(threshold = 0.12) {
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

function useCountUp(target, duration = 2000, shouldStart = false) {
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
function Reveal({ children, dir = "bottom", delay = 0, style: extStyle = {} }) {
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
function StatCounter({ target, suffix = "", label }) {
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

// ─── Pin / product data ────────────────────────────────────────────────────────
const PINS = [
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

const CATEGORIES = [
  { label: "Abayas",   file: WA(1)  },
  { label: "Capes",    file: WA(2)  },
  { label: "Gowns",    file: WA(0)  },
  { label: "Sets",     file: WA(18) },
  { label: "Wraps",    file: WA(20) },
  { label: "Lookbook", file: WA(4)  },
  { label: "New In",   file: WA(27) },
];

const TRENDING = [
  { file: WA(8),  fallback: "t1", name: "Al Rimal Desert Abaya",  price: "R 5,200", tag: "New Arrival" },
  { file: WA(15), fallback: "t2", name: "Garden Hour Abaya",       price: "R 4,600", tag: "Bestseller"  },
  { file: WA(1),  fallback: "t3", name: "Noor Embroidered Abaya",  price: "R 6,200", tag: "Limited"     },
  { file: WA(25), fallback: "t4", name: "Layla Satin Abaya",       price: "R 3,950", tag: "Bestseller"  },
  { file: WA(27), fallback: "t5", name: "The Ivory Cape Set",      price: "R 6,900", tag: "New Arrival" },
  { file: WA(13), fallback: "t6", name: "Al Rimal Floral Abaya",   price: "R 7,450", tag: "Limited"     },
];

// ─── Small UI ─────────────────────────────────────────────────────────────────
function Chip({ children, active, onClick }) {
  const [hov, setHov] = useState(false);
  return (
    <button onClick={onClick} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ padding: "0.38rem 1rem", border: `1px solid ${active ? C.terracotta : "rgba(184,164,140,0.45)"}`, backgroundColor: active ? C.terracotta : hov ? C.parchment : "transparent", color: active ? C.white : C.espresso, fontSize: "0.6rem", letterSpacing: "0.18em", textTransform: "uppercase", fontFamily: "Arial", fontWeight: 300, cursor: "pointer", transition: "all 300ms", whiteSpace: "nowrap" }}>
      {children}
    </button>
  );
}

function GhostBtn({ children, href = "#" }) {
  const [hov, setHov] = useState(false);
  return (
    <a href={href} onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ color: C.terracotta, fontSize: "0.65rem", letterSpacing: "0.22em", textTransform: "uppercase", fontFamily: "Arial", fontWeight: 300, textDecoration: "none", borderBottom: `1px solid ${hov ? C.terracotta : "transparent"}`, paddingBottom: "2px", transition: "border-color 300ms", display: "inline-block" }}>
      {children}
    </a>
  );
}

function HeroBtn({ children, filled = false }) {
  const [hov, setHov] = useState(false);
  return (
    <button onMouseEnter={() => setHov(true)} onMouseLeave={() => setHov(false)}
      style={{ backgroundColor: filled ? C.espresso : "transparent", color: filled ? C.white : C.espresso, padding: "0.85rem 2.25rem", fontSize: "0.62rem", letterSpacing: "0.22em", textTransform: "uppercase", fontFamily: "Arial", border: filled ? "none" : `1px solid ${C.espresso}`, cursor: "pointer", fontWeight: 300, opacity: hov ? 0.75 : 1, transition: "opacity 400ms" }}>
      {children}
    </button>
  );
}

// ─── Pin card with 3D tilt ─────────────────────────────────────────────────────
function PinCard({ pin }) {
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
function TrendingCard({ item }) {
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

// ─── 3D Lookbook Slider ────────────────────────────────────────────────────────
function LookbookSlider3D() {
  const SLIDES = [
    { file: WA(2),  name: "The Pearl Cape"    },
    { file: WA(9),  name: "AlUla Desert Edit" },
    { file: WA(22), name: "Canyon Silhouette" },
    { file: WA(47), name: "Coastal Pearl"     },
    { file: WA(15), name: "Garden Hour"       },
    { file: WA(0),  name: "The Sage Cape"     },
    { file: WA(4),  name: "The Oasis Set"     },
  ];
  const n = SLIDES.length;
  const [curr, setCurr] = useState(0);
  const mod = (a) => ((a % n) + n) % n;

  useEffect(() => {
    const t = setInterval(() => setCurr(c => mod(c + 1)), 4200);
    return () => clearInterval(t);
  }, []);

  return (
    <section id="lookbook" style={{ position: "relative", backgroundColor: C.marble, padding: "5rem 0 4rem", overflow: "hidden" }}>
      <Reveal dir="bottom">
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <p style={{ color: C.gold, fontSize: "0.56rem", letterSpacing: "0.42em", textTransform: "uppercase", fontFamily: "Arial", marginBottom: "0.6rem" }}>Oasis Collection 2025</p>
          <h2 style={{ fontFamily: "Georgia,serif", color: C.white, fontWeight: 300, fontSize: "clamp(1.2rem,2.5vw,1.8rem)", letterSpacing: "0.3em", textTransform: "uppercase" }}>Lookbook</h2>
          <div style={{ width: "40px", height: "1px", backgroundColor: C.gold, margin: "1.2rem auto 0", opacity: 0.45 }} />
        </div>
      </Reveal>

      {/* 3D stage */}
      <div style={{ position: "relative", height: "500px", perspective: "1400px", perspectiveOrigin: "50% 50%", maxWidth: "900px", margin: "0 auto" }}>
        {[-1, 0, 1].map(offset => {
          const idx = mod(curr + offset);
          const slide = SLIDES[idx];
          const isCenter = offset === 0;
          const isLeft   = offset === -1;
          return (
            <div key={`${curr}-${offset}`}
              onClick={() => !isCenter && setCurr(mod(curr + offset))}
              style={{
                position: "absolute",
                top: "50%", left: "50%",
                width:  isCenter ? "290px" : "210px",
                height: isCenter ? "440px" : "320px",
                marginLeft: isCenter ? "-145px" : isLeft ? "-365px" : "155px",
                marginTop:  isCenter ? "-220px" : "-160px",
                transform: isCenter
                  ? "rotateY(0deg) scale(1)"
                  : isLeft
                    ? "rotateY(36deg) scale(0.78)"
                    : "rotateY(-36deg) scale(0.78)",
                opacity: isCenter ? 1 : 0.48,
                transition: "all 750ms cubic-bezier(.22,1,.36,1)",
                boxShadow: isCenter ? "0 40px 90px rgba(0,0,0,0.7)" : "0 12px 32px rgba(0,0,0,0.35)",
                cursor: isCenter ? "default" : "pointer",
                zIndex: isCenter ? 10 : 5,
                overflow: "hidden",
              }}>
              <Img file={slide.file} fallbackSeed={`look${idx}`} w={600} h={900}
                style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              {isCenter && (
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, background: "linear-gradient(to top, rgba(0,0,0,0.9) 0%, transparent 60%)", padding: "1.75rem 1.25rem" }}>
                  <p style={{ color: C.gold, fontSize: "0.5rem", letterSpacing: "0.3em", textTransform: "uppercase", fontFamily: "Arial", marginBottom: "0.35rem" }}>
                    {`${String(curr + 1).padStart(2,"0")} / ${String(n).padStart(2,"0")}`}
                  </p>
                  <p style={{ color: C.white, fontFamily: "Georgia,serif", fontSize: "0.95rem", fontWeight: 300 }}>{slide.name}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Dot indicators */}
      <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "2.5rem" }}>
        {SLIDES.map((_, i) => (
          <div key={i} onClick={() => setCurr(i)}
            style={{ width: i === curr ? "22px" : "6px", height: "2px", backgroundColor: i === curr ? C.gold : "rgba(200,150,28,0.3)", transition: "all 400ms", cursor: "pointer" }} />
        ))}
      </div>

      {/* Arrow buttons */}
      {[{ d: -1, label: "‹", pos: "left" }, { d: 1, label: "›", pos: "right" }].map(({ d, label, pos }) => (
        <button key={pos} onClick={() => setCurr(mod(curr + d))}
          style={{ position: "absolute", [pos]: "2rem", top: "52%", transform: "translateY(-50%)", background: "rgba(200,150,28,0.1)", border: "1px solid rgba(200,150,28,0.3)", color: C.gold, width: "42px", height: "42px", cursor: "pointer", fontSize: "1.4rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {label}
        </button>
      ))}
    </section>
  );
}

// ─── Cinematic About — 4 chapters ─────────────────────────────────────────────
function CinematicAbout() {
  return (
    <div id="about">

      {/* Chapter 1 — Desert origin, Ken Burns */}
      <section style={{ position: "relative", height: "100vh", overflow: "hidden", display: "flex", alignItems: "flex-end" }}>
        <Img file={WA(9)} fallbackSeed="about-ch1" w={1400} h={900}
          style={{ position: "absolute", inset: 0, width: "100%", height: "115%", objectFit: "cover", objectPosition: "center", animation: "kenBurns 18s ease-in-out infinite alternate" }} />
        <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to top, ${C.marble} 0%, rgba(22,16,10,0.5) 55%, rgba(22,16,10,0.12) 100%)` }} />
        <div style={{ position: "relative", padding: "0 3.5rem 5.5rem", maxWidth: "700px" }}>
          <Reveal dir="bottom" delay={0}>
            <p style={{ color: C.gold, fontSize: "0.55rem", letterSpacing: "0.48em", textTransform: "uppercase", fontFamily: "Arial", marginBottom: "1.75rem" }}>
              Our Story · Est. 2019
            </p>
          </Reveal>
          <Reveal dir="bottom" delay={200}>
            <h2 style={{ fontFamily: "Georgia,serif", fontWeight: 300, color: C.white, fontSize: "clamp(2.6rem,6vw,5.2rem)", lineHeight: 1.08, letterSpacing: "0.06em" }}>
              Born from<br />the desert.
            </h2>
          </Reveal>
          <Reveal dir="bottom" delay={480}>
            <div style={{ width: "72px", height: "1px", backgroundColor: C.gold, marginTop: "2.25rem", opacity: 0.75 }} />
          </Reveal>
        </div>
        {/* Scroll indicator */}
        <div style={{ position: "absolute", right: "2.5rem", bottom: "2.5rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
          <p style={{ color: C.sand, fontSize: "0.48rem", letterSpacing: "0.3em", textTransform: "uppercase", fontFamily: "Arial", writingMode: "vertical-rl", opacity: 0.5 }}>Scroll</p>
          <div style={{ width: "1px", height: "38px", backgroundColor: C.gold, opacity: 0.4 }} />
        </div>
      </section>

      {/* Chapter 2 — Story text, split layout */}
      <section style={{ backgroundColor: C.parchment, padding: "8rem 2.5rem", overflow: "hidden" }}>
        <div className="r-story" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "5rem", maxWidth: "1100px", margin: "0 auto", alignItems: "center" }}>
          <Reveal dir="left" style={{ position: "relative", paddingBottom: "4rem" }}>
            <Img file={WA(4)} fallbackSeed="about-ch2" w={700} h={900} style={{ width: "82%", display: "block" }} />
            <div style={{ position: "absolute", bottom: 0, right: 0, width: "50%", border: `4px solid ${C.white}` }}>
              <Img file={WA(16)} fallbackSeed="atelier-hands" w={400} h={500} style={{ width: "100%", display: "block" }} />
            </div>
          </Reveal>
          <div>
            <Reveal dir="right" delay={80}>
              <p style={{ color: C.gold, fontSize: "0.56rem", letterSpacing: "0.38em", textTransform: "uppercase", fontFamily: "Arial", marginBottom: "1.5rem" }}>Our Story</p>
            </Reveal>
            <Reveal dir="right" delay={200}>
              <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(1.5rem,3vw,2.2rem)", color: C.espresso, fontWeight: 300, lineHeight: 1.35, marginBottom: "1.5rem" }}>
                Refined by<br />intention.
              </h2>
            </Reveal>
            <Reveal dir="right" delay={360}>
              <p style={{ color: C.charcoal, fontSize: "0.86rem", lineHeight: 1.95, fontFamily: "Arial", fontWeight: 300, marginBottom: "2rem", opacity: 0.82 }}>
                ROUDAH began with a simple belief — that modest wear should never mean compromise. Each piece is thoughtfully designed for the woman who desires elegance without excess, beauty without noise. Rooted in Arabic heritage, sewn with quiet precision.
              </p>
            </Reveal>
            <Reveal dir="right" delay={500}>
              <div style={{ height: "1px", backgroundColor: C.gold, opacity: 0.28, marginBottom: "2rem" }} />
              <GhostBtn>Discover Our World →</GhostBtn>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Chapter 3 — Stats, count-up */}
      <section style={{ backgroundColor: C.espresso, padding: "7rem 2.5rem" }}>
        <Reveal dir="bottom">
          <p style={{ textAlign: "center", color: C.gold, fontSize: "0.56rem", letterSpacing: "0.42em", textTransform: "uppercase", fontFamily: "Arial", marginBottom: "4.5rem", opacity: 0.7 }}>By the numbers</p>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: "3rem", maxWidth: "860px", margin: "0 auto" }}>
          {[
            { target: 847, suffix: "+", label: "Pieces Saved",    delay: 0   },
            { target: 100, suffix: "%", label: "Natural Fabrics", delay: 180 },
            { target: 5,   suffix: "+", label: "Years Crafting",  delay: 360 },
          ].map(({ target, suffix, label, delay }) => (
            <Reveal key={label} dir="scale" delay={delay}>
              <StatCounter target={target} suffix={suffix} label={label} />
            </Reveal>
          ))}
        </div>
        <Reveal dir="bottom" delay={540}>
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", justifyContent: "center", marginTop: "5rem" }}>
            <div style={{ height: "1px", flex: 1, maxWidth: "75px", backgroundColor: C.gold, opacity: 0.22 }} />
            <p style={{ fontFamily: "Georgia,serif", fontStyle: "italic", color: C.sand, fontSize: "0.9rem", opacity: 0.65 }}>"Made with intention."</p>
            <div style={{ height: "1px", flex: 1, maxWidth: "75px", backgroundColor: C.gold, opacity: 0.22 }} />
          </div>
        </Reveal>
      </section>

      {/* Chapter 4 — Portrait + floating quote */}
      <section style={{ position: "relative", overflow: "hidden", minHeight: "88vh", display: "flex", alignItems: "center" }}>
        <Img file={WA(3)} fallbackSeed="about-ch4" w={900} h={1200}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to right, rgba(22,16,10,0.02) 0%, rgba(22,16,10,0.75) 50%, rgba(22,16,10,0.92) 100%)" }} />
        <div style={{ position: "relative", marginLeft: "auto", padding: "4rem 3.5rem", maxWidth: "480px", width: "100%" }}>
          <Reveal dir="right">
            <div style={{ width: "36px", height: "1px", backgroundColor: C.gold, marginBottom: "2rem", opacity: 0.7 }} />
            <p style={{ fontFamily: "Georgia,serif", fontStyle: "italic", color: C.white, fontSize: "clamp(1.1rem,2.5vw,1.65rem)", lineHeight: 1.6, fontWeight: 300, marginBottom: "2rem" }}>
              "The woman who wears ROUDAH has already arrived."
            </p>
            <p style={{ color: C.gold, fontSize: "0.54rem", letterSpacing: "0.38em", textTransform: "uppercase", fontFamily: "Arial", opacity: 0.72 }}>— ROUDAH® ATELIER</p>
          </Reveal>
        </div>
      </section>

    </div>
  );
}

// ─── Main ──────────────────────────────────────────────────────────────────────
export default function Roudah() {
  const [scrolled,       setScrolled]       = useState(false);
  const [activeCategory, setActiveCategory] = useState("All");
  const [mobileOpen,     setMobileOpen]     = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [heroParallax,   setHeroParallax]   = useState(0);

  useEffect(() => {
    const fn = () => {
      const y = window.scrollY;
      setScrolled(y > 55);
      setHeroParallax(y * 0.35);
      const max = document.body.scrollHeight - window.innerHeight;
      setScrollProgress(max > 0 ? (y / max) * 100 : 0);
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  return (
    <div style={{ backgroundColor: C.cream, color: C.charcoal, fontFamily: "Georgia,'Times New Roman',serif", overflowX: "hidden" }}>
      <style>{`
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        input::placeholder { color: rgba(192,171,140,0.55); }
        ::-webkit-scrollbar { height: 4px; width: 4px; background: transparent; }
        ::-webkit-scrollbar-thumb { background: ${C.sand}; }
        @keyframes fadeUp    { from { opacity:0; transform:translateY(40px);  } to { opacity:1; transform:translateY(0);  } }
        @keyframes fadeRight { from { opacity:0; transform:translateX(40px);  } to { opacity:1; transform:translateX(0);  } }
        @keyframes scaleIn   { from { opacity:0; transform:scale(0.88);       } to { opacity:1; transform:scale(1);       } }
        @keyframes goldGrow  { from { width:0; opacity:0; }                     to { width:80px; opacity:0.75; }           }
        @keyframes kenBurns  { 0%   { transform:scale(1) translateX(0); }       100% { transform:scale(1.09) translateX(-2%); } }
        @keyframes pulseGold { 0%,100% { opacity:0.55; }                         50%  { opacity:1; }                       }
        @media (max-width: 900px) {
          .r-hero  { grid-template-columns: 1fr !important; }
          .r-story { grid-template-columns: 1fr !important; }
          .r-craft { grid-template-columns: 1fr !important; }
          .r-mason { column-count: 2 !important; }
          .r-navlinks { display: none !important; }
        }
        @media (max-width: 580px) {
          .r-mason { column-count: 1 !important; }
        }
      `}</style>

      {/* Scroll progress bar */}
      <div style={{ position: "fixed", top: 0, left: 0, width: `${scrollProgress}%`, height: "2px", backgroundColor: C.gold, zIndex: 300, transition: "width 80ms linear", boxShadow: `0 0 8px ${C.gold}66`, pointerEvents: "none" }} />

      {/* ══ NAVBAR ══════════════════════════════════════════════════════════════ */}
      <nav style={{ position: "sticky", top: 0, zIndex: 200, backgroundColor: scrolled ? C.white : "transparent", borderBottom: `1px solid ${scrolled ? "rgba(192,171,140,0.28)" : "transparent"}`, transition: "background-color 500ms, border-color 500ms", padding: "1rem 2.5rem", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "2rem" }}>
        <div style={{ fontFamily: "Georgia,serif", fontSize: "1rem", letterSpacing: "0.52em", color: C.espresso, fontWeight: 300, textTransform: "uppercase", userSelect: "none", flexShrink: 0 }}>ROUDAH</div>
        <div className="r-navlinks" style={{ display: "flex", gap: "2rem" }}>
          {["Collection","About","Lookbook","Contact"].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} style={{ color: C.espresso, fontSize: "0.6rem", letterSpacing: "0.22em", textTransform: "uppercase", fontFamily: "Arial", fontWeight: 300, textDecoration: "none" }}>{l}</a>
          ))}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: "1.35rem", flexShrink: 0 }}>
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
        </div>
      </nav>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div style={{ position: "fixed", inset: 0, zIndex: 190, backgroundColor: C.espresso, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: "2.5rem" }}>
          {["Collection","About","Lookbook","Contact"].map(l => (
            <a key={l} href={`#${l.toLowerCase()}`} onClick={() => setMobileOpen(false)}
              style={{ color: C.sand, fontSize: "0.72rem", letterSpacing: "0.4em", textTransform: "uppercase", fontFamily: "Arial", textDecoration: "none" }}>{l}</a>
          ))}
        </div>
      )}

      {/* ══ HERO ════════════════════════════════════════════════════════════════ */}
      <section style={{ minHeight: "100vh", display: "grid", gridTemplateColumns: "1fr 1fr", backgroundColor: C.white }} className="r-hero">
        {/* Image side — parallax */}
        <div style={{ position: "relative", overflow: "hidden", minHeight: "600px" }}>
          <Img file={WA(2)} fallbackSeed="roudah-hero" w={800} h={1100}
            style={{ width: "100%", height: "115%", objectFit: "cover", objectPosition: "center top", transform: `translateY(${heroParallax}px)`, willChange: "transform" }} />
          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, height: "50%", background: `linear-gradient(to top, ${C.espresso}f0, transparent)` }} />
          {/* Season badge */}
          <div style={{ position: "absolute", top: "1.75rem", right: "1.75rem", backgroundColor: C.terracotta, padding: "0.35rem 0.85rem", animation: "scaleIn 600ms ease both 1.2s", opacity: 0 }}>
            <p style={{ color: C.white, fontSize: "0.55rem", letterSpacing: "0.22em", textTransform: "uppercase", fontFamily: "Arial" }}>SS 2025</p>
          </div>
          {/* Save count */}
          <div style={{ position: "absolute", top: "1.75rem", left: "1.75rem", backgroundColor: "rgba(26,26,24,0.62)", padding: "0.4rem 0.75rem", display: "flex", alignItems: "center", gap: "6px", animation: "scaleIn 600ms ease both 1.4s", opacity: 0 }}>
            <span style={{ color: C.gold, fontSize: "0.7rem", animation: "pulseGold 2.5s ease infinite" }}>✦</span>
            <span style={{ color: C.white, fontSize: "0.58rem", fontFamily: "Arial", letterSpacing: "0.08em" }}>2,847 saves</span>
          </div>
          {/* Floating product card */}
          <div style={{ position: "absolute", bottom: "2.25rem", left: "1.75rem", backgroundColor: C.white, padding: "1rem 1.4rem", borderLeft: `3px solid ${C.gold}`, maxWidth: "210px", animation: "fadeUp 800ms ease both 1.6s", opacity: 0 }}>
            <p style={{ color: C.copper, fontSize: "0.55rem", letterSpacing: "0.22em", textTransform: "uppercase", fontFamily: "Arial", marginBottom: "0.3rem" }}>Featured Piece</p>
            <p style={{ color: C.espresso, fontFamily: "Georgia,serif", fontSize: "0.9rem", marginBottom: "0.2rem", fontWeight: 300 }}>The Pearl Cape</p>
            <p style={{ color: C.gold, fontSize: "0.85rem", fontFamily: "Georgia,serif" }}>R 8,200</p>
          </div>
        </div>

        {/* Text side */}
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "5rem 4rem", backgroundColor: C.cream }}>
          <div style={{ display: "flex", alignItems: "center", gap: "0.85rem", marginBottom: "2rem", animation: "fadeRight 900ms ease both 0.3s", opacity: 0 }}>
            <div style={{ width: "28px", height: "1px", backgroundColor: C.gold }} />
            <p style={{ color: C.gold, fontSize: "0.56rem", letterSpacing: "0.38em", textTransform: "uppercase", fontFamily: "Arial", fontWeight: 300 }}>New Collection — 2025</p>
          </div>
          <h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(2.2rem,5vw,4rem)", color: C.espresso, fontWeight: 300, letterSpacing: "0.1em", textTransform: "uppercase", lineHeight: 1.15, marginBottom: "1.5rem", animation: "fadeRight 1s ease both 0.55s", opacity: 0 }}>
            A Place<br />of Quiet<br />Beauty
          </h1>
          <p style={{ fontFamily: "Georgia,serif", fontStyle: "italic", color: C.copper, fontSize: "0.88rem", lineHeight: 1.8, marginBottom: "2.5rem", maxWidth: "340px", animation: "fadeRight 1s ease both 0.75s", opacity: 0 }}>
            "Crafted for the woman who moves through the world with intention"
          </p>
          <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginBottom: "2.5rem", animation: "fadeRight 1s ease both 0.95s", opacity: 0 }}>
            {["All","Abayas","Capes","Gowns","Sets"].map(cat => (
              <Chip key={cat} active={activeCategory === cat} onClick={() => setActiveCategory(cat)}>{cat}</Chip>
            ))}
          </div>
          <div style={{ display: "flex", gap: "0.85rem", flexWrap: "wrap", animation: "fadeRight 900ms ease both 1.1s", opacity: 0 }}>
            <HeroBtn filled>Explore Collection</HeroBtn>
            <HeroBtn>Our Story</HeroBtn>
          </div>
          <div style={{ display: "flex", gap: "2.5rem", marginTop: "3rem", paddingTop: "2rem", borderTop: "1px solid rgba(192,171,140,0.28)", animation: "fadeUp 900ms ease both 1.3s", opacity: 0 }}>
            {[["847+","Pieces Saved"],["100%","Natural Fabrics"],["Atelier","Handcrafted"]].map(([n,l]) => (
              <div key={l}>
                <p style={{ fontFamily: "Georgia,serif", fontSize: "1.3rem", color: C.espresso, fontWeight: 300, marginBottom: "0.2rem" }}>{n}</p>
                <p style={{ color: C.copper, fontSize: "0.55rem", letterSpacing: "0.18em", textTransform: "uppercase", fontFamily: "Arial" }}>{l}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ══ STORY CIRCLES ═══════════════════════════════════════════════════════ */}
      <section style={{ backgroundColor: C.white, padding: "2rem 2.5rem 0", borderBottom: `1px solid rgba(192,171,140,0.2)` }}>
        <div style={{ display: "flex", gap: "1.85rem", overflowX: "auto", paddingBottom: "1.75rem" }}>
          {CATEGORIES.map(({ label, file }, i) => (
            <div key={label} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem", flexShrink: 0, cursor: "pointer", animation: `scaleIn 600ms ease both ${300 + i * 75}ms`, opacity: 0 }}>
              <div style={{ width: "66px", height: "66px", borderRadius: "50%", border: `2px solid ${C.terracotta}`, overflow: "hidden" }}>
                <Img file={file} fallbackSeed={label} w={200} h={200}
                  style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center top" }} />
              </div>
              <p style={{ color: C.espresso, fontSize: "0.56rem", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "Arial", fontWeight: 300, whiteSpace: "nowrap" }}>{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ══ MASONRY PIN GRID ════════════════════════════════════════════════════ */}
      <section id="collection" style={{ backgroundColor: C.cream, padding: "4rem 1.5rem" }}>
        <Reveal dir="bottom">
          <div style={{ textAlign: "center", marginBottom: "2.75rem" }}>
            <p style={{ color: C.terracotta, fontSize: "0.58rem", letterSpacing: "0.4em", textTransform: "uppercase", fontFamily: "Arial", marginBottom: "0.5rem" }}>✦ Curated for you</p>
            <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(1rem,2.5vw,1.55rem)", color: C.espresso, letterSpacing: "0.38em", textTransform: "uppercase", fontWeight: 300 }}>The Oasis Edit</h2>
          </div>
        </Reveal>
        <div className="r-mason" style={{ columnCount: 3, columnGap: "12px", maxWidth: "1400px", margin: "0 auto" }}>
          {PINS.map((pin, i) => <PinCard key={i} pin={pin} />)}
        </div>
        <Reveal dir="bottom">
          <div style={{ textAlign: "center", marginTop: "3rem" }}>
            <GhostBtn>View All Pieces →</GhostBtn>
          </div>
        </Reveal>
      </section>

      {/* ══ EDITORIAL BAND ══════════════════════════════════════════════════════ */}
      <section style={{ position: "relative", overflow: "hidden", height: "300px", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <Img file={WA(10)} fallbackSeed="roudah-band" w={1400} h={600}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center" }} />
        <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(22,16,10,0.76)" }} />
        <Reveal dir="scale" style={{ position: "relative", textAlign: "center", padding: "0 2rem" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "1.5rem", justifyContent: "center" }}>
            <div style={{ width: "55px", height: "1px", backgroundColor: C.gold, opacity: 0.6 }} />
            <p style={{ fontFamily: "Georgia,serif", fontStyle: "italic", color: C.white, fontSize: "clamp(1rem,2.5vw,1.55rem)", fontWeight: 300, letterSpacing: "0.04em" }}>
              "Every piece begins as a feeling."
            </p>
            <div style={{ width: "55px", height: "1px", backgroundColor: C.gold, opacity: 0.6 }} />
          </div>
          <p style={{ color: C.sand, fontSize: "0.55rem", letterSpacing: "0.38em", textTransform: "uppercase", fontFamily: "Arial", marginTop: "1.25rem", opacity: 0.7 }}>— ROUDAH® ATELIER</p>
        </Reveal>
      </section>

      {/* ══ TRENDING NOW ════════════════════════════════════════════════════════ */}
      <section style={{ backgroundColor: C.white, padding: "4rem 2.5rem" }}>
        <Reveal dir="bottom">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "2rem" }}>
            <div>
              <p style={{ color: C.terracotta, fontSize: "0.56rem", letterSpacing: "0.35em", textTransform: "uppercase", fontFamily: "Arial", marginBottom: "0.4rem" }}>Most Saved</p>
              <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(1rem,2vw,1.35rem)", color: C.espresso, letterSpacing: "0.32em", textTransform: "uppercase", fontWeight: 300 }}>Trending Now</h2>
            </div>
            <GhostBtn>See All →</GhostBtn>
          </div>
        </Reveal>
        <div style={{ display: "flex", gap: "1.25rem", overflowX: "auto", paddingBottom: "0.5rem" }}>
          {TRENDING.map((item, i) => <TrendingCard key={i} item={item} />)}
        </div>
      </section>

      {/* ══ CINEMATIC ABOUT ════════════════════════════════════════════════════ */}
      <CinematicAbout />

      {/* ══ 3D LOOKBOOK SLIDER ══════════════════════════════════════════════════ */}
      <LookbookSlider3D />

      {/* ══ CRAFT / DETAIL ══════════════════════════════════════════════════════ */}
      <section style={{ backgroundColor: C.parchment, padding: "6rem 2.5rem" }}>
        <div className="r-craft" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4rem", maxWidth: "1100px", margin: "0 auto", alignItems: "center" }}>
          <Reveal dir="left" style={{ display: "grid", gridTemplateRows: "auto auto", gap: "12px" }}>
            <Img file={WA(30)} fallbackSeed="roudah-tags"       w={800} h={500} style={{ width: "100%", display: "block" }} />
            <Img file={WA(12)} fallbackSeed="roudah-embroidery" w={800} h={400} style={{ width: "100%", display: "block" }} />
          </Reveal>
          <div>
            <Reveal dir="right" delay={100}>
              <p style={{ color: C.gold, fontSize: "0.56rem", letterSpacing: "0.38em", textTransform: "uppercase", fontFamily: "Arial", marginBottom: "1.5rem" }}>Made With Intention</p>
            </Reveal>
            <Reveal dir="right" delay={250}>
              <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(1.4rem,3vw,2.1rem)", color: C.espresso, fontWeight: 300, lineHeight: 1.3, marginBottom: "1.5rem" }}>
                Every bead placed<br />by hand.
              </h2>
            </Reveal>
            <Reveal dir="right" delay={400}>
              <p style={{ color: C.charcoal, fontSize: "0.86rem", lineHeight: 1.95, fontFamily: "Arial", fontWeight: 300, marginBottom: "2rem", opacity: 0.82 }}>
                From the embroidered florals to the hand-stitched pearl constellations, each ROUDAH piece carries hours of artisan craft. We work with a small atelier — never mass-produced, always considered.
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "0.65rem" }}>
                {["Hand-embellished beadwork","Limited run per style","Natural & luxury fabrics only","Each piece individually tagged"].map(item => (
                  <p key={item} style={{ color: C.charcoal, fontSize: "0.8rem", fontFamily: "Arial", fontWeight: 300, opacity: 0.75 }}>— {item}</p>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ══ SCARCITY BANNER ════════════════════════════════════════════════════ */}
      <section style={{ backgroundColor: C.terracotta, padding: "5rem 2rem", textAlign: "center" }}>
        <Reveal dir="bottom">
          <p style={{ color: "rgba(255,255,255,0.62)", fontSize: "0.56rem", letterSpacing: "0.4em", textTransform: "uppercase", fontFamily: "Arial", marginBottom: "1rem" }}>Limited Availability</p>
          <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(1.5rem,3.5vw,2.3rem)", color: C.white, fontWeight: 300, letterSpacing: "0.08em", marginBottom: "1rem" }}>
            The Noor Collection is almost gone.
          </h2>
          <p style={{ color: "rgba(255,255,255,0.62)", fontSize: "0.65rem", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "Arial", marginBottom: "2.5rem" }}>
            12 pieces remaining across all styles
          </p>
          <button style={{ backgroundColor: C.gold, color: C.espresso, padding: "0.9rem 2.5rem", fontSize: "0.62rem", letterSpacing: "0.25em", textTransform: "uppercase", fontFamily: "Arial", border: "none", cursor: "pointer", fontWeight: 600 }}>
            Shop Before It's Gone
          </button>
        </Reveal>
      </section>

      {/* ══ TESTIMONIALS ═══════════════════════════════════════════════════════ */}
      <section style={{ backgroundColor: C.cream, padding: "6rem 2.5rem" }}>
        <Reveal dir="bottom">
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <p style={{ color: C.espresso, fontSize: "0.58rem", letterSpacing: "0.42em", textTransform: "uppercase", fontFamily: "Arial" }}>Worn With Love</p>
            <div style={{ width: "34px", height: "1px", backgroundColor: C.gold, margin: "1.2rem auto 0", opacity: 0.55 }} />
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: "1.5rem", maxWidth: "1100px", margin: "0 auto" }}>
          {[
            { quote: "I wore the Sahara Cape to a walima and felt like I had arrived.",             person: "Fatima R.", city: "Johannesburg", saves: 342, delay: 0   },
            { quote: "The quality is unlike anything I've found locally. Each seam is considered.", person: "Nadia K.",  city: "Cape Town",    saves: 218, delay: 160 },
            { quote: "Timeless. I will wear this for years. ROUDAH understands a woman.",           person: "Ilham S.",  city: "Durban",       saves: 501, delay: 320 },
          ].map(({ quote, person, city, saves, delay }) => (
            <Reveal key={person} dir="bottom" delay={delay}>
              <div style={{ backgroundColor: C.white, padding: "2.25rem", border: "1px solid rgba(192,171,140,0.28)", position: "relative", height: "100%" }}>
                <div style={{ position: "absolute", top: "1rem", right: "1rem", display: "flex", alignItems: "center", gap: "4px" }}>
                  <span style={{ color: C.gold, fontSize: "0.56rem" }}>✦</span>
                  <span style={{ color: C.copper, fontSize: "0.56rem", fontFamily: "Arial" }}>{saves}</span>
                </div>
                <p style={{ fontFamily: "Georgia,serif", fontSize: "2.8rem", color: C.gold, lineHeight: 0.8, marginBottom: "1rem", opacity: 0.6 }}>"</p>
                <p style={{ fontFamily: "Georgia,serif", fontStyle: "italic", color: C.espresso, fontSize: "0.88rem", lineHeight: 1.85, marginBottom: "1.5rem", fontWeight: 300 }}>{quote}</p>
                <p style={{ color: C.copper, fontSize: "0.56rem", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "Arial" }}>— {person}, {city}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ══ NEWSLETTER ═════════════════════════════════════════════════════════ */}
      <section style={{ position: "relative", overflow: "hidden" }}>
        <Img file={WA(45)} fallbackSeed="roudah-newsletter" w={1400} h={800}
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover" }} />
        <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(62,28,10,0.82)" }} />
        <div style={{ position: "relative", padding: "7rem 2rem", textAlign: "center" }}>
          <Reveal dir="bottom">
            <div style={{ maxWidth: "500px", margin: "0 auto" }}>
              <div style={{ height: "1px", backgroundColor: C.gold, opacity: 0.28, marginBottom: "3.5rem" }} />
              <h2 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(1.8rem,4vw,2.6rem)", color: C.white, fontWeight: 300, letterSpacing: "0.08em", marginBottom: "1.2rem" }}>Enter the Oasis.</h2>
              <p style={{ color: C.sand, fontSize: "0.78rem", lineHeight: 1.85, fontFamily: "Arial", fontWeight: 300, marginBottom: "2.5rem", opacity: 0.82 }}>
                "Be first to hear of new arrivals, exclusive edits, and quiet moments from ROUDAH."
              </p>
              <div style={{ display: "flex", border: "1px solid rgba(192,171,140,0.32)" }}>
                <input type="email" placeholder="your@email.com"
                  style={{ flex: 1, padding: "0.9rem 1.25rem", backgroundColor: "transparent", border: "none", color: C.white, fontSize: "0.76rem", fontFamily: "Arial", outline: "none", fontWeight: 300 }} />
                <button style={{ backgroundColor: C.gold, color: C.espresso, padding: "0.9rem 1.75rem", border: "none", fontSize: "0.6rem", letterSpacing: "0.25em", textTransform: "uppercase", fontFamily: "Arial", cursor: "pointer", fontWeight: 600 }}>Join</button>
              </div>
              <p style={{ color: C.sand, fontSize: "0.56rem", letterSpacing: "0.1em", fontFamily: "Arial", marginTop: "1.2rem", opacity: 0.45 }}>We send rarely. Only when it matters.</p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ══ FOOTER ═════════════════════════════════════════════════════════════ */}
      <footer id="contact" style={{ backgroundColor: C.marble, padding: "4.5rem 2.5rem 2.5rem", borderTop: "1px solid rgba(200,150,28,0.12)" }}>
        <Reveal dir="bottom">
          <div style={{ textAlign: "center", marginBottom: "3.5rem" }}>
            <Img file={WA(35)} fallbackSeed="roudah-logo" w={400} h={300}
              style={{ height: "80px", width: "auto", margin: "0 auto", opacity: 0.85, filter: "brightness(1.1)" }} />
          </div>
        </Reveal>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))", gap: "2.5rem", maxWidth: "900px", margin: "0 auto 3.5rem" }}>
          {[
            { title: "Collection",    links: ["The Oasis Edit","New Arrivals","Bestsellers","Archive"]    },
            { title: "About",         links: ["Our Story","The Atelier","Sustainability","Press"]         },
            { title: "Customer Care", links: ["Sizing Guide","Shipping","Returns","FAQs"]                 },
            { title: "Follow",        links: ["Instagram","Pinterest","Newsletter","Lookbook"]            },
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
          <div />
          <p style={{ color: C.sand, fontSize: "0.56rem", letterSpacing: "0.18em", fontFamily: "Arial", opacity: 0.48 }}>© 2025 ROUDAH®. All rights reserved.</p>
          <p style={{ color: C.sand, fontSize: "0.82rem", fontFamily: "Georgia", opacity: 0.42 }}>روضة</p>
        </div>
      </footer>
    </div>
  );
}
