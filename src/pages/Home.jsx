import { useLayoutEffect, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import * as THREE from "three";
import { C, WA, Img, Reveal, GhostBtn, Chip, PinCard, TrendingCard, PINS, TRENDING } from "../shared.jsx";
import {motion} from "framer-motion";
import StorySection from "./StorySection.jsx";

gsap.registerPlugin(ScrollTrigger);

function GoldDust() {
  const mountRef = useRef(null);

  useEffect(() => {
    const el = mountRef.current;
    if (!el) return;

    const w = el.clientWidth, h = el.clientHeight;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(60, w / h, 0.1, 100);
    camera.position.z = 5;

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: false });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(w, h);
    renderer.setClearColor(0x000000, 0);
    el.appendChild(renderer.domElement);

    const count = 200;
    const positions = new Float32Array(count * 3);
    const speeds    = new Float32Array(count);
    const offsets   = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      positions[i * 3]     = (Math.random() - 0.5) * 12;
      positions[i * 3 + 1] = (Math.random() - 0.5) * 9;
      positions[i * 3 + 2] = (Math.random() - 0.5) * 3;
      speeds[i]  = 0.0015 + Math.random() * 0.003;
      offsets[i] = Math.random() * Math.PI * 2;
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));

    const mat = new THREE.PointsMaterial({
      color: 0xd4a347,
      size: 0.035,
      transparent: true,
      opacity: 0.5,
      sizeAttenuation: true,
    });

    scene.add(new THREE.Points(geo, mat));

    let raf, t = 0;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      t += 0.001;
      const pos = geo.attributes.position.array;
      for (let i = 0; i < count; i++) {
        pos[i * 3 + 1] += speeds[i];
        pos[i * 3]     += Math.sin(t + offsets[i]) * 0.0008;
        if (pos[i * 3 + 1] > 4.5) pos[i * 3 + 1] = -4.5;
      }
      geo.attributes.position.needsUpdate = true;
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      const w2 = el.clientWidth, h2 = el.clientHeight;
      camera.aspect = w2 / h2;
      camera.updateProjectionMatrix();
      renderer.setSize(w2, h2);
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
      geo.dispose();
      mat.dispose();
      renderer.dispose();
      if (el.contains(renderer.domElement)) el.removeChild(renderer.domElement);
    };
  }, []);

  return (
    <div ref={mountRef} style={{ position: "absolute", inset: 0, zIndex: 8, pointerEvents: "none" }} />
  );
}

const MAGAZINE_VIDEO_SOURCES = [
  "/Magazine/ROUDAH_magazine_opening.mp4",
  "/Magazine/ROUDAH_magazine_opening.mp4",
  "/Magazine/ROUDAH_magazine_opening.mp4",
];

function MagazineVideoReveal({ children }) {
  const sectionRef = useRef(null);
  const videoRef = useRef(null);
  const leftPanelRef = useRef(null);
  const rightPanelRef = useRef(null);
  const shadeRef = useRef(null);
  const cueRef = useRef(null);
  const seamRef = useRef(null);
  const heroRevealTimerRef = useRef(null);
  const [canReveal, setCanReveal] = useState(false);
  const [showSplitPages, setShowSplitPages] = useState(false);
  const [videoHidden, setVideoHidden] = useState(false);
  const [heroVisible, setHeroVisible] = useState(false);

  const showSplitReveal = () => {
    if (showSplitPages) return;

    setVideoHidden(true);
    setShowSplitPages(true);
    setCanReveal(true);

    heroRevealTimerRef.current = window.setTimeout(() => {
      setHeroVisible(true);
    }, 0);
  };

  useLayoutEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }

    window.scrollTo(0, 0);

    const video = videoRef.current;
    if (video) {
      video.currentTime = 0;
    }

    return undefined;
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return undefined;

    video.pause();
    video.currentTime = 0;

    const playDelay = window.setTimeout(() => {
      video.play().catch(() => {});
    }, 2000);

    return () => {
      window.clearTimeout(playDelay);
      window.clearTimeout(heroRevealTimerRef.current);
    };
  }, []);

  useEffect(() => {
    if (showSplitPages) return;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [showSplitPages]);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    const leftPanel = leftPanelRef.current;
    const rightPanel = rightPanelRef.current;
    const shade = shadeRef.current;
    const cue = cueRef.current;
    const seam = seamRef.current;
    const revealReady = showSplitPages && canReveal;

    if (!section || !leftPanel || !rightPanel || !shade || !cue || !seam) return;

    const ctx = gsap.context(() => {
      gsap.set([leftPanel, rightPanel], { xPercent: 0 });
      gsap.set(cue, { opacity: 0, y: 12 });

      gsap.to([leftPanel, rightPanel, seam], {
        autoAlpha: showSplitPages ? 1 : 0,
        duration: 0,
      });

      gsap.to(shade, {
        opacity: 0,
        duration: 0,
      });

      gsap.to(cue, {
        opacity: revealReady ? 1 : 0,
        y: revealReady ? 0 : 12,
        duration: 1,
        delay: showSplitPages ? 1.4 : 0,
        ease: "power2.out",
      });

      if (!revealReady) return;

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: "+=115%",
          scrub: 0.9,
          pin: true,
          anticipatePin: 1,
        },
      });

      tl.to(leftPanel, { xPercent: -102, ease: "none" }, 0)
        .to(rightPanel, { xPercent: 102, ease: "none" }, 0)
        .to(shade, { opacity: 0, ease: "none" }, 0)
        .to(cue, { opacity: 0, y: -18, ease: "none" }, 0)
        .to(seam, { autoAlpha: 0, ease: "none" }, 0);
    }, section);

    return () => ctx.revert();
  }, [canReveal, showSplitPages]);

  return (
    <section
      ref={sectionRef}
      aria-label="Roudah magazine opening"
      style={{
        position: "relative",
        height: "100vh",
        overflow: "hidden",
        background: "#0b0705",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          zIndex: 1,
          opacity: heroVisible ? 1 : 0,
          visibility: heroVisible ? "visible" : "hidden",
          transition: "opacity 1.2s ease, visibility 1.2s ease",
        }}
      >
        {children}
      </div>

      <video
        ref={videoRef}
        muted
        playsInline
        preload="auto"
        onLoadedData={(event) => {
          event.currentTarget.currentTime = 0;
        }}
        onEnded={showSplitReveal}
        onError={(event) => {
          const currentSource = event.currentTarget.currentSrc || "Magazine video";
          console.warn(`${currentSource} could not be loaded.`);
          showSplitReveal();
        }}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          background: "#0b0705",
          zIndex: videoHidden ? 0 : 60,
          opacity: videoHidden ? 0 : 1,
          visibility: videoHidden ? "hidden" : "visible",
          transition: "opacity 1.2s ease, visibility 1.2s ease",
        }}
      >
        {MAGAZINE_VIDEO_SOURCES.map((src) => (
          <source key={src} src={src} type="video/mp4" />
        ))}
      </video>

      <div
        ref={shadeRef}
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at center, rgba(255,244,224,0.12), rgba(9,5,3,0.76) 72%)",
          zIndex: 30,
          pointerEvents: "none",
          opacity: 0,
        }}
      />

      <div
        ref={leftPanelRef}
        style={{
          position: "absolute",
          left: 0,
          top: 0,
          width: "50.08%",
          height: "100%",
          backgroundImage:
            "linear-gradient(90deg, rgba(0,0,0,0.2), rgba(0,0,0,0.02)), url('/Magazine/cover-left.png')",
          backgroundSize: "cover",
          backgroundPosition: "right center",
          zIndex: 40,
          transformOrigin: "right center",
          boxShadow: "18px 0 38px rgba(0,0,0,0.28)",
          opacity: 0,
          visibility: "hidden",
        }}
      />

      <div
        ref={rightPanelRef}
        style={{
          position: "absolute",
          right: 0,
          top: 0,
          width: "50.08%",
          height: "100%",
          backgroundImage:
            "linear-gradient(270deg, rgba(0,0,0,0.2), rgba(0,0,0,0.02)), url('/Magazine/cover-right.png')",
          backgroundSize: "cover",
          backgroundPosition: "left center",
          zIndex: 40,
          transformOrigin: "left center",
          boxShadow: "-18px 0 38px rgba(0,0,0,0.28)",
          opacity: 0,
          visibility: "hidden",
        }}
      />

      <div
        ref={seamRef}
        style={{
          position: "absolute",
          left: "50%",
          top: 0,
          width: "1px",
          height: "100%",
          background:
            "linear-gradient(to bottom, transparent, rgba(245,232,216,0.58), transparent)",
          zIndex: 45,
          transform: "translateX(-50%)",
          pointerEvents: "none",
          opacity: 0,
          visibility: "hidden",
        }}
      />

      <p
        ref={cueRef}
        style={{
          position: "absolute",
          left: "50%",
          bottom: "2rem",
          transform: "translateX(-50%)",
          margin: 0,
          color: "#F5E8D8",
          fontSize: "0.68rem",
          letterSpacing: "0.32em",
          textTransform: "uppercase",
          zIndex: 50,
          pointerEvents: "none",
          whiteSpace: "nowrap",
        }}
      >
        Scroll to enter
      </p>
    </section>
  );
}

function AssetHero() {
  const heroRef = useRef(null);
  const bgRef = useRef(null);
  const embroideryRef = useRef(null);
  const dressRef = useRef(null);
  const contentRef = useRef(null);
  const [mousePosition, setMousePosition] = useState({
  x: 0,
  y: 0,
});
const handleMouseMove = (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 2;
  const y = (e.clientY / window.innerHeight - 0.5) * 2;

  setMousePosition({ x, y });
};

  useLayoutEffect(() => {
    const hero = heroRef.current;
    if (!hero) return;

    const ctx = gsap.context(() => {
      gsap.to(bgRef.current, {
        yPercent: -7,
        scale: 1.06,
        ease: "none",
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: 1.1,
        },
      });

      gsap.to(embroideryRef.current, {
        yPercent: -14,
        scale: 1.28,
        ease: "none",
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });

      gsap.to(dressRef.current, {
        yPercent: 7,
        scale: 1.04,
        ease: "none",
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: 1.2,
        },
      });

      gsap.to(contentRef.current, {
        yPercent: -10,
        ease: "none",
        scrollTrigger: {
          trigger: hero,
          start: "top top",
          end: "bottom top",
          scrub: 1,
        },
      });
    }, hero);

    return () => ctx.revert();
  }, []);

  return (
    <section
    ref={heroRef}
    onMouseMove={handleMouseMove}
      style={{
        position: "relative",
        height: "100vh",
        overflow: "hidden",
        background: "#df9254d0",
      }}
    >
      {/* Background Room */}
      <div
          ref={bgRef}
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
          }}
        >
      <motion.img
          src="/Hero page/Background-room.png"
          alt=""
          animate={{
            x: mousePosition.x * 4,
            y: mousePosition.y * 2,
          }}
          transition={{
            type: "spring",
            stiffness: 20,
            damping: 20,
          }}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            objectPosition: "center right",
            
            filter: "brightness(0.35)",
          }}
        />
      </div>

      {/* Embroidery Closeup */}
        <div
          ref={embroideryRef}
          style={{
            position: "absolute",
            left: "-12%",
            top: 0,
            width: "58%",
            height: "100%",
            zIndex: 2,
            pointerEvents: "none",
          }}
        >
        <motion.img
          src="/Hero page/embroidery-detail.png"
          alt=""
          animate={{
            x: mousePosition.x * 12,
            y: mousePosition.y * 8,
            scale: [1.15, 1.22, 1.15],
          }}
          transition={{
            x: {
              type: "spring",
              stiffness: 40,
              damping: 20,
            },
            y: {
              type: "spring",
              stiffness: 40,
              damping: 20,
            },
            scale: {
              duration: 14,
              repeat: Infinity,
              ease: "easeInOut",
            },
          }}
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
            objectFit: "cover",
            opacity: 0.70,
            //transform: "scale(1.15)",

            WebkitMaskImage:
              "linear-gradient(to right, black 0%, black 70%, transparent 100%)",
            maskImage:
              "linear-gradient(to right, black 0%, black 70%, transparent 100%)",
          }}
        />
        </div>

      {/* Dark Overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
                    "linear-gradient(90deg, rgba(0,0,0,.45) 0%, rgba(0,0,0,.18) 40%, transparent 100%)",
          zIndex: 3,
        }}
      />

      {/* Spotlight */}
      <img
        src="/Hero page/spotlight-overlay.png"
        alt=""
        style={{
          position: "absolute",
          right: "-10%",
          top: "50%",
          transform: "translateY(-50%)",
          width: "57vw",
          opacity: 0.01,
          zIndex: 4,
          pointerEvents: "none",
        }}
      />


      {/* Dress */}
      <div
        ref={dressRef}
        style={{
          position: "absolute",
          right: "5%",
          bottom: 0,
          height: "104vh",
          zIndex: 7,
          pointerEvents: "none",
        }}
      >
      <motion.img
        src="/Hero page/hero-dress.png"
        alt=""
        initial={{
          opacity: 0,
          y: 100,
          scale: 0.95,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
          x: mousePosition.x * 6,
        }}
        transition={{
          delay: 0.5,
          duration: 1.8,
          ease: "easeOut",
          x:{
            type: "spring",
            stiffness: 35,
            damping: 18,
          }
        }}
        style={{
          display: "block",
          height: "100%",
        }}
      />
      </div>
      <div
        style={{
          position: "absolute",
          right: "6%",
          top: "40%",
          width: "700px",
          height: "750px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(230, 178, 80, 0.23), transparent 60%)",
          transform: "translateY(-50%)",
          zIndex: 4,
          filter: "blur(40px)",
        }}
      />

      {/* Grain */}
      <img
        src="/Hero page/paper-grain.png"
        alt=""
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: "cover",
          opacity: 0.03,
          mixBlendMode: "overlay",
          zIndex: 8,
          pointerEvents: "none",
        }}
      /> 

      {/* Dust 
      <GoldDust /> */}

      {/* Content */}
      <div
        ref={contentRef}
        style={{
          position: "absolute",
          left: "7%",
          top: "50%",
          transform: "translateY(-50%)",
          zIndex: 10,
          maxWidth: "600px",
        }}
      >
        <motion.p
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 1.2,
            duration: 0.8,
          }}
          style={{
            color: "#D9C3A3",
            letterSpacing: "0.45em",
            fontSize: ".8rem",
            marginBottom: "1rem",
            textTransform: "uppercase",
          }}
        >
          Crafted For Grace
        </motion.p>

        <motion.h1
          initial={{
            opacity: 0,
            y: 40,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 1.5,
            duration: 1,
          }}
          style={{
            fontFamily: "Cormorant Garamond, serif",
            fontSize: "clamp(4rem,8vw,8rem)",
            color: "#F5E8D8",
            fontWeight: 300,
            lineHeight: 0.9,
            marginBottom: "1rem",
          }}
        >
          ROUDAH
        </motion.h1>

        <motion.div
        initial={{
            opacity: 0,
            y: 40,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 1.8,
            duration: 1,
          }}
          style={{
            width: "180px",
            height: "1px",
            background: "#B9965B",
            marginBottom: "2rem",
          }}
        />

        <motion.p
        initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 2.1,
            duration: 0.8,
          }}
          style={{
            color: "#E8DCC9",
            fontSize: "1rem",
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            marginBottom: "2rem",
          }}
        >
          Timeless Modesty
          <br />
          Modern Elegance
        </motion.p>

        <motion.button
          initial={{
            opacity: 0,
            y: 20,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            delay: 2.4,
            duration: 0.8,
          }}
          style={{
            background: "transparent",
            border: "none",
            borderBottom: "1px solid #B9965B",
            color: "#F5E8D8",
            paddingBottom: ".5rem",
            fontSize: ".85rem",
            letterSpacing: ".2em",
            textTransform: "uppercase",
            cursor: "pointer",
          }}
        >
          Discover Collection →
        </motion.button>
      </div> 

      <div
        style={{
          position: "absolute",
          right: "57%",
          top: "45%",
          width: "870px",
          height: "750px",
          borderRadius: "50%",
          background:
            "radial-gradient(circle, rgba(10, 10, 10, 0.81), transparent 90%)",
          transform: "translateY(-50%)",
          zIndex: 4,
          filter: "blur(60px)",
        }}
      />

      {/* Scroll Line */}
        <div
          style={{
            position: "absolute",
            right: "4%",
            top: "35%",
            height: "220px",
            width: "1px",
            background: "rgba(255,255,255,.25)",
            zIndex: 20,
          }}
        /> 

        {/* Scroll Text */}
        <p
          style={{
            position: "absolute",
            right: "3%",
            bottom: "15%",
            color: "#D8C6A0",
            letterSpacing: ".4em",
            writingMode: "vertical-rl",
            textTransform: "uppercase",
            fontSize: ".7rem",
            zIndex: 20,
            margin: 0,
          }}
        >
          Scroll
        </p>
    </section>
  );
}

export default function Home() {
  const masonRef   = useRef(null);
  const trendingRef = useRef(null);

  // Stagger-in masonry cards once
  useEffect(() => {
    if (!masonRef.current) return;
    const cards = Array.from(masonRef.current.children);
    gsap.fromTo(cards,
      { opacity: 0, y: 36 },
      {
        opacity: 1, y: 0,
        duration: 0.72, ease: "power2.out",
        stagger: 0.055,
        scrollTrigger: { trigger: masonRef.current, start: "top 88%", once: true },
      }
    );
  }, []);

  // Stagger-in trending cards once
  useEffect(() => {
    if (!trendingRef.current) return;
    const cards = Array.from(trendingRef.current.children);
    gsap.fromTo(cards,
      { opacity: 0, x: 32 },
      {
        opacity: 1, x: 0,
        duration: 0.65, ease: "power2.out",
        stagger: 0.08,
        scrollTrigger: { trigger: trendingRef.current, start: "top 90%", once: true },
      }
    );
  }, []);

  return (
    <div style={{ backgroundColor: C.cream, color: C.charcoal }}>
      <MagazineVideoReveal>
        <AssetHero />
      </MagazineVideoReveal>
      <StorySection />

      {/* Page header */}
      <section style={{ backgroundColor: C.parchment, padding: "5rem 2.5rem 3rem", textAlign: "center", borderBottom: `1px solid rgba(192,171,140,0.25)` }}>
        <Reveal dir="bottom">
          <p style={{ color: C.terracotta, fontSize: "0.56rem", letterSpacing: "0.48em", textTransform: "uppercase", fontFamily: "Arial", marginBottom: "1rem" }}>✦ 2025 Season</p>
          <h1 style={{ fontFamily: "Georgia,serif", fontSize: "clamp(2rem,5vw,3.5rem)", color: C.espresso, fontWeight: 300, letterSpacing: "0.12em", textTransform: "uppercase", marginBottom: "1.25rem" }}>
            The Collection
          </h1>
          <div style={{ width: "48px", height: "1px", backgroundColor: C.gold, margin: "0 auto", opacity: 0.6 }} />
        </Reveal>
      </section>

      {/* Masonry pin grid */}
      <section style={{ backgroundColor: C.cream, padding: "4rem 1.5rem" }}>
        <div ref={masonRef} className="r-mason" style={{ columnCount: 3, columnGap: "12px", maxWidth: "1400px", margin: "0 auto" }}>
          {PINS.map((pin, i) => <PinCard key={i} pin={pin} />)}
        </div>
        <Reveal dir="bottom">
          <div style={{ textAlign: "center", marginTop: "3rem" }}>
            <GhostBtn>View All Pieces →</GhostBtn>
          </div>
        </Reveal>
      </section>

      {/* Trending Now */}
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
        <div ref={trendingRef} style={{ display: "flex", gap: "1.25rem", overflowX: "auto", paddingBottom: "0.5rem" }}>
          {TRENDING.map((item, i) => <TrendingCard key={i} item={item} />)}
        </div>
      </section>

      {/* Scarcity banner */}
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
    </div>
  );
}
