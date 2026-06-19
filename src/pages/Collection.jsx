import { useState, useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { C, WA, Img, Reveal, Chip, useBannerOffset, useProducts, formatPrice, getScarcity } from "../shared.jsx";

gsap.registerPlugin(ScrollTrigger);

const FILTERS = ["All", "Abayas", "Capes", "Gowns", "Sets", "Wraps"];
const SORT_OPTIONS = ["Featured", "Price: Low to High", "Price: High to Low", "Most Saved"];

const TAG_COLORS = {
  "Limited":     C.terracotta,
  "Exclusive":   C.espresso,
  "Bestseller":  C.sage,
  "New Arrival": C.copper,
};

function ProductCard({ product }) {
  const [hov, setHov] = useState(false);
  const [saved, setSaved] = useState(false);
  const cardRef = useRef(null);

  return (
    <div style={{ breakInside: "avoid", marginBottom: "12px" }}>
    <div
      ref={cardRef}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
        transform: hov ? "translateY(-3px)" : "translateY(0)",
        transition: "transform 500ms cubic-bezier(.22,1,.36,1), box-shadow 500ms cubic-bezier(.22,1,.36,1)",
        boxShadow: hov ? "0 22px 52px rgba(22,12,4,0.22)" : "0 2px 10px rgba(22,12,4,0.06)",
      }}
    >
      {/* Tag badge */}
      <div style={{
        position: "absolute", top: "10px", left: "10px", zIndex: 10,
        backgroundColor: TAG_COLORS[product.tag] || C.sage,
        padding: "3px 9px",
      }}>
        <span style={{ color: C.white, fontSize: "0.5rem", letterSpacing: "0.16em", textTransform: "uppercase", fontFamily: "Arial" }}>
          {product.tag}
        </span>
      </div>

      {/* Save button */}
      <button
        onClick={e => { e.stopPropagation(); setSaved(s => !s); }}
        style={{
          position: "absolute", top: "10px", right: "10px", zIndex: 10,
          backgroundColor: saved ? C.terracotta : "rgba(26,20,14,0.55)",
          border: "none", cursor: "pointer",
          padding: "5px 9px",
          display: "flex", alignItems: "center", gap: "4px",
          opacity: hov || saved ? 1 : 0,
          transition: "opacity 280ms, background-color 200ms",
          backdropFilter: "blur(4px)",
        }}
      >
        <span style={{ color: C.white, fontSize: "0.6rem" }}>{saved ? "✦" : "♡"}</span>
        <span style={{ color: C.white, fontSize: "0.5rem", fontFamily: "Arial", letterSpacing: "0.06em" }}>
          {(product.saves + (saved ? 1 : 0)).toLocaleString()}
        </span>
      </button>

      {/* Image */}
      <Img
        file={product.file}
        fallbackSeed={`product-${product.id}`}
        style={{
          width: "100%",
          height: "auto",
          display: "block",
          transition: "transform 700ms cubic-bezier(.22,1,.36,1)",
          transform: hov ? "scale(1.05)" : "scale(1)",
        }}
      />

      {/* Hover info overlay */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to top, rgba(20,10,4,0.96) 0%, rgba(20,10,4,0.45) 48%, transparent 72%)",
        opacity: hov ? 1 : 0,
        transition: "opacity 380ms ease",
        display: "flex", flexDirection: "column", justifyContent: "flex-end",
        padding: "1.1rem",
        transform: hov ? "translateY(0)" : "translateY(8px)",
      }}>
        <p style={{
          color: C.white, fontFamily: "Georgia,serif",
          fontSize: "0.88rem", letterSpacing: "0.04em",
          marginBottom: "0.2rem", fontWeight: 300,
        }}>
          {product.name}
        </p>
        <p style={{
          color: C.sand, fontSize: "0.52rem",
          letterSpacing: "0.12em", textTransform: "uppercase",
          fontFamily: "Arial", marginBottom: "0.7rem", opacity: 0.85,
        }}>
          {product.fabric}
        </p>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "0.8rem" }}>
          <p style={{ color: C.gold, fontSize: "0.88rem", fontFamily: "Georgia,serif", letterSpacing: "0.04em" }}>
            {formatPrice(product.price)}
          </p>
          <p style={{ color: "rgba(255,255,255,0.55)", fontSize: "0.52rem", fontStyle: "italic", fontFamily: "Georgia,serif" }}>
            {getScarcity(product.stock)}
          </p>
        </div>
        <button
          onClick={e => e.stopPropagation()}
          style={{
            backgroundColor: C.terracotta, color: C.white,
            border: "none", padding: "0.6rem 1rem",
            cursor: "pointer", width: "100%",
            fontSize: "0.54rem", letterSpacing: "0.24em",
            textTransform: "uppercase", fontFamily: "Arial", fontWeight: 400,
          }}
          onMouseEnter={e => { e.currentTarget.style.backgroundColor = C.espresso; }}
          onMouseLeave={e => { e.currentTarget.style.backgroundColor = C.terracotta; }}
        >
          Add to Bag
        </button>
      </div>
    </div>
    </div>
  );
}

export default function Collection() {
  const [activeFilter, setActiveFilter] = useState("All");
  const [sort, setSort]                 = useState("Featured");
  const [sortOpen, setSortOpen]         = useState(false);
  const [filterStuck, setFilterStuck]   = useState(false);
  const gridRef      = useRef(null);
  const filterBarRef = useRef(null);
  const bannerOffset = useBannerOffset();
  const stickyTop     = 63 + bannerOffset;
  const [products]    = useProducts();

  const filtered = activeFilter === "All" ? products : products.filter(p => p.category === activeFilter);

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "Price: Low to High") return a.price - b.price;
    if (sort === "Price: High to Low") return b.price - a.price;
    if (sort === "Most Saved")         return b.saves - a.saves;
    return 0;
  });

  useEffect(() => {
    if (!gridRef.current) return;
    const cards = Array.from(gridRef.current.children);
    gsap.fromTo(
      cards,
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.55, ease: "power2.out", stagger: 0.038, clearProps: "all" }
    );
  }, [activeFilter, sort]);

  useEffect(() => {
    const fn = () => {
      if (!filterBarRef.current) return;
      setFilterStuck(filterBarRef.current.getBoundingClientRect().top <= stickyTop);
    };
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, [stickyTop]);

  useEffect(() => {
    const close = () => setSortOpen(false);
    if (sortOpen) window.addEventListener("click", close);
    return () => window.removeEventListener("click", close);
  }, [sortOpen]);

  return (
    <div style={{ backgroundColor: C.cream, color: C.charcoal, paddingTop: `${64 + bannerOffset}px` }}>

      {/* ── Hero banner ─────────────────────────────────────────────────────── */}
      <section style={{
        position: "relative",
        backgroundColor: C.espresso,
        padding: "6rem 2.5rem 5rem",
        textAlign: "center",
        overflow: "hidden",
      }}>
        <div style={{ position: "absolute", inset: 0, overflow: "hidden" }}>
          <Img
            file={WA(4)} fallbackSeed="col-hero"
            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.14, filter: "blur(6px)", transform: "scale(1.06)" }}
          />
          <div style={{ position: "absolute", inset: 0, background: `linear-gradient(to bottom, ${C.espresso}CC, ${C.espresso}EE)` }} />
        </div>

        <div style={{ position: "relative", zIndex: 1 }}>
          <Reveal dir="bottom">
            <p style={{ color: C.gold, fontSize: "0.54rem", letterSpacing: "0.52em", textTransform: "uppercase", fontFamily: "Arial", marginBottom: "1.3rem", opacity: 0.82 }}>
              ✦ 2025 Season
            </p>
            <h1 style={{
              fontFamily: "Georgia,serif",
              fontSize: "clamp(2.6rem,6vw,5rem)",
              color: C.white, fontWeight: 300,
              letterSpacing: "0.2em", textTransform: "uppercase",
              marginBottom: "1.4rem", lineHeight: 1.1,
            }}>
              The Collection
            </h1>
            <p style={{ color: C.sand, fontSize: "0.58rem", letterSpacing: "0.3em", textTransform: "uppercase", fontFamily: "Arial", marginBottom: "2.2rem", opacity: 0.65 }}>
              {products.length} Pieces · Handcrafted · Limited Quantities
            </p>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "1.5rem" }}>
              <div style={{ height: "1px", width: "40px", backgroundColor: C.gold, opacity: 0.4 }} />
              <span style={{ color: C.gold, fontSize: "0.55rem", opacity: 0.6 }}>روضة</span>
              <div style={{ height: "1px", width: "40px", backgroundColor: C.gold, opacity: 0.4 }} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Sticky filter + sort bar ─────────────────────────────────────────── */}
      <div
        ref={filterBarRef}
        onClick={e => e.stopPropagation()}
        style={{
          position: "sticky", top: `${stickyTop}px`, zIndex: 100,
          backgroundColor: filterStuck ? C.white : C.parchment,
          borderBottom: `1px solid rgba(192,171,140,${filterStuck ? 0.4 : 0.22})`,
          padding: "0.75rem 2.5rem",
          display: "flex", alignItems: "center",
          justifyContent: "space-between", gap: "1rem",
          flexWrap: "wrap",
          boxShadow: filterStuck ? "0 4px 20px rgba(22,16,10,0.06)" : "none",
          transition: "background-color 300ms, box-shadow 300ms",
        }}
      >
        <div style={{ display: "flex", gap: "0.45rem", flexWrap: "wrap", alignItems: "center" }}>
          <span style={{
            color: C.sand, fontSize: "0.52rem", letterSpacing: "0.22em",
            textTransform: "uppercase", fontFamily: "Arial",
            marginRight: "0.35rem", whiteSpace: "nowrap",
          }}>
            {sorted.length} pieces
          </span>
          {FILTERS.map(f => (
            <Chip key={f} active={activeFilter === f} onClick={() => setActiveFilter(f)}>{f}</Chip>
          ))}
        </div>

        <div style={{ position: "relative" }} onClick={e => e.stopPropagation()}>
          <button
            onClick={() => setSortOpen(o => !o)}
            style={{
              display: "flex", alignItems: "center", gap: "0.55rem",
              backgroundColor: "transparent",
              border: `1px solid rgba(184,164,140,0.45)`,
              padding: "0.38rem 1rem", cursor: "pointer",
              fontSize: "0.58rem", letterSpacing: "0.18em", textTransform: "uppercase",
              fontFamily: "Arial", color: C.espresso, fontWeight: 300,
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ opacity: 0.45, fontSize: "0.5rem" }}>Sort:</span> {sort}
            <span style={{ fontSize: "0.44rem", opacity: 0.5 }}>{sortOpen ? "▲" : "▼"}</span>
          </button>
          {sortOpen && (
            <div style={{
              position: "absolute", right: 0, top: "calc(100% + 5px)",
              zIndex: 200, backgroundColor: C.white,
              border: `1px solid rgba(192,171,140,0.28)`,
              minWidth: "190px",
              boxShadow: "0 10px 40px rgba(22,12,4,0.14)",
            }}>
              {SORT_OPTIONS.map(opt => (
                <button
                  key={opt}
                  onClick={() => { setSort(opt); setSortOpen(false); }}
                  style={{
                    display: "block", width: "100%", textAlign: "left",
                    padding: "0.7rem 1.1rem",
                    backgroundColor: sort === opt ? C.parchment : "transparent",
                    border: "none", borderBottom: `1px solid rgba(192,171,140,0.12)`,
                    cursor: "pointer",
                    fontSize: "0.56rem", letterSpacing: "0.14em", textTransform: "uppercase",
                    fontFamily: "Arial",
                    color: sort === opt ? C.terracotta : C.espresso,
                    fontWeight: sort === opt ? 400 : 300,
                  }}
                >
                  {opt}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* ── Masonry grid ─────────────────────────────────────────────────────── */}
      <section style={{ backgroundColor: C.cream, padding: "2.5rem 1.5rem 6rem" }}>
        <div
          ref={gridRef}
          className="r-mason r-mason-4"
          style={{ columnCount: 4, columnGap: "12px", maxWidth: "1600px", margin: "0 auto" }}
        >
          {sorted.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {sorted.length === 0 && (
          <div style={{ textAlign: "center", padding: "6rem 2rem" }}>
            <p style={{ color: C.sand, fontSize: "0.6rem", letterSpacing: "0.28em", textTransform: "uppercase", fontFamily: "Arial" }}>
              No pieces in this category yet
            </p>
          </div>
        )}
      </section>

      {/* ── Scarcity strip ───────────────────────────────────────────────────── */}
      <section style={{
        backgroundColor: C.espresso,
        padding: "4.5rem 2rem",
        textAlign: "center",
        borderTop: `1px solid rgba(200,150,28,0.15)`,
      }}>
        <Reveal dir="bottom">
          <p style={{ color: C.gold, fontSize: "0.54rem", letterSpacing: "0.44em", textTransform: "uppercase", fontFamily: "Arial", marginBottom: "1rem", opacity: 0.8 }}>
            Limited Availability
          </p>
          <p style={{
            fontFamily: "Georgia,serif", fontSize: "clamp(1.2rem,3vw,2rem)",
            color: C.white, fontWeight: 300, letterSpacing: "0.08em",
            marginBottom: "0.6rem",
          }}>
            Every piece is made in limited quantities.
          </p>
          <p style={{ color: C.sand, fontSize: "0.58rem", letterSpacing: "0.2em", textTransform: "uppercase", fontFamily: "Arial", opacity: 0.6 }}>
            Once it's gone — it's gone.
          </p>
        </Reveal>
      </section>
    </div>
  );
}
