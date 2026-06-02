import { C, WA, Img, Reveal } from "../shared.jsx";

export default function Contact() {
  return (
    <div style={{ backgroundColor: C.cream, color: C.charcoal }}>

      {/* Page header */}
      <section style={{ backgroundColor: C.marble, padding: "6rem 2.5rem 5rem", textAlign: "center" }}>
        <Reveal dir="bottom">
          <p style={{ color: C.gold, fontSize: "0.55rem", letterSpacing: "0.48em", textTransform: "uppercase", fontFamily: "Arial", marginBottom: "1.25rem", opacity: 0.8 }}>Get in Touch</p>
          <h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(2rem,5vw,3.5rem)", color: C.white, fontWeight: 300, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "1.5rem" }}>
            Contact
          </h1>
          <div style={{ width: "48px", height: "1px", backgroundColor: C.gold, margin: "0 auto", opacity: 0.5 }} />
        </Reveal>
      </section>

      {/* Contact info + social */}
      <section style={{ backgroundColor: C.parchment, padding: "5rem 2.5rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(240px,1fr))", gap: "3.5rem", maxWidth: "900px", margin: "0 auto" }}>
          {[
            {
              title: "Email Us",
              lines: ["hello@roudah.co.za", "orders@roudah.co.za"],
              icon: "✉",
            },
            {
              title: "Visit Us",
              lines: ["By appointment only", "Johannesburg, South Africa"],
              icon: "◎",
            },
            {
              title: "Follow Along",
              lines: ["@roudah.atelier", "Instagram · Pinterest"],
              icon: "✦",
            },
            {
              title: "Customer Care",
              lines: ["Mon – Fri, 9am – 5pm", "Response within 24 hours"],
              icon: "◇",
            },
          ].map(({ title, lines, icon }, i) => (
            <Reveal key={title} dir="bottom" delay={i * 100}>
              <div style={{ borderTop: `1px solid rgba(192,171,140,0.35)`, paddingTop: "2rem" }}>
                <p style={{ color: C.gold, fontSize: "1.2rem", marginBottom: "0.85rem" }}>{icon}</p>
                <p style={{ color: C.espresso, fontSize: "0.56rem", letterSpacing: "0.32em", textTransform: "uppercase", fontFamily: "Arial", marginBottom: "0.85rem" }}>{title}</p>
                {lines.map(l => (
                  <p key={l} style={{ color: C.charcoal, fontSize: "0.88rem", fontFamily: "Arial", fontWeight: 300, opacity: 0.72, marginBottom: "0.3rem" }}>{l}</p>
                ))}
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Newsletter */}
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
    </div>
  );
}
