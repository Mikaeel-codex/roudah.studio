import { useState, useEffect } from "react";
import { C, WA, Img, Reveal, GhostBtn, StatCounter } from "../shared.jsx";

function CinematicAbout() {
  return (
    <div>
      {/* Chapter 1 — Desert origin */}
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
        <div style={{ position: "absolute", right: "2.5rem", bottom: "2.5rem", display: "flex", flexDirection: "column", alignItems: "center", gap: "0.5rem" }}>
          <p style={{ color: C.sand, fontSize: "0.48rem", letterSpacing: "0.3em", textTransform: "uppercase", fontFamily: "Arial", writingMode: "vertical-rl", opacity: 0.5 }}>Scroll</p>
          <div style={{ width: "1px", height: "38px", backgroundColor: C.gold, opacity: 0.4 }} />
        </div>
      </section>

      {/* Chapter 2 — Story text */}
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

      {/* Chapter 3 — Stats */}
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

      {/* Chapter 4 — Portrait + quote */}
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
    <section style={{ position: "relative", backgroundColor: C.marble, padding: "5rem 0 4rem", overflow: "hidden" }}>
      <Reveal dir="bottom">
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <p style={{ color: C.gold, fontSize: "0.56rem", letterSpacing: "0.42em", textTransform: "uppercase", fontFamily: "Arial", marginBottom: "0.6rem" }}>Oasis Collection 2025</p>
          <h2 style={{ fontFamily: "Georgia,serif", color: C.white, fontWeight: 300, fontSize: "clamp(1.2rem,2.5vw,1.8rem)", letterSpacing: "0.3em", textTransform: "uppercase" }}>Lookbook</h2>
          <div style={{ width: "40px", height: "1px", backgroundColor: C.gold, margin: "1.2rem auto 0", opacity: 0.45 }} />
        </div>
      </Reveal>

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
                transform: isCenter ? "rotateY(0deg) scale(1)" : isLeft ? "rotateY(36deg) scale(0.78)" : "rotateY(-36deg) scale(0.78)",
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
                    {`${String(curr + 1).padStart(2, "0")} / ${String(n).padStart(2, "0")}`}
                  </p>
                  <p style={{ color: C.white, fontFamily: "Georgia,serif", fontSize: "0.95rem", fontWeight: 300 }}>{slide.name}</p>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div style={{ display: "flex", justifyContent: "center", gap: "8px", marginTop: "2.5rem" }}>
        {SLIDES.map((_, i) => (
          <div key={i} onClick={() => setCurr(i)}
            style={{ width: i === curr ? "22px" : "6px", height: "2px", backgroundColor: i === curr ? C.gold : "rgba(200,150,28,0.3)", transition: "all 400ms", cursor: "pointer" }} />
        ))}
      </div>

      {[{ d: -1, label: "‹", pos: "left" }, { d: 1, label: "›", pos: "right" }].map(({ d, label, pos }) => (
        <button key={pos} onClick={() => setCurr(mod(curr + d))}
          style={{ position: "absolute", [pos]: "2rem", top: "52%", transform: "translateY(-50%)", background: "rgba(200,150,28,0.1)", border: "1px solid rgba(200,150,28,0.3)", color: C.gold, width: "42px", height: "42px", cursor: "pointer", fontSize: "1.4rem", display: "flex", alignItems: "center", justifyContent: "center" }}>
          {label}
        </button>
      ))}
    </section>
  );
}

export default function About() {
  return (
    <div>
      <CinematicAbout />
      <LookbookSlider3D />

      {/* Testimonials */}
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
    </div>
  );
}
