import {
  motion,
  useScroll,
  useTransform,
} from "framer-motion";
import { useRef } from "react";

export default function MagazineIntro() {
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // COVER ANIMATION
  const coverOpacity = useTransform(
    scrollYProgress,
    [0, 0.25],
    [1, 0]
  );

  const coverScale = useTransform(
    scrollYProgress,
    [0, 0.25],
    [1, 1.1]
  );

  // SPREAD APPEARS
  const spreadOpacity = useTransform(
    scrollYProgress,
    [0.15, 0.35],
    [0, 1]
  );

  // PAGE SPLIT
  const leftPageX = useTransform(
    scrollYProgress,
    [0.55, 0.85],
    ["0%", "-120%"]
  );

  const rightPageX = useTransform(
    scrollYProgress,
    [0.55, 0.85],
    ["0%", "120%"]
  );

  return (
    <section
      ref={containerRef}
      style={{
        height: "300vh",
        position: "relative",
      }}
    >
      <div
        style={{
          position: "sticky",
          top: 0,
          height: "100vh",
          overflow: "hidden",
          background: "#f5f0e8",
        }}
      >
        {/* COVER */}
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            opacity: coverOpacity,
            scale: coverScale,
            zIndex: 30,
          }}
        >
          <img
            src="/Magazine/magazine-cover.png" 
            alt=""
            style={{
              width: "min(550px, 80vw)",
              height: "auto",
              objectFit: "contain",
            }}
          />
        </motion.div>

        {/* MAGAZINE SPREAD */}
        <motion.div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            opacity: spreadOpacity,
            zIndex: 20,
          }}
        >
          {/* LEFT PAGE */}
          <motion.div
            style={{
              width: "50%",
              height: "100%",
              x: leftPageX,
              overflow: "hidden",
            }}
          >
            <img
              src="/Magazine/cover-left.png"
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </motion.div>

          {/* RIGHT PAGE */}
          <motion.div
            style={{
              width: "50%",
              height: "100%",
              x: rightPageX,
              overflow: "hidden",
            }}
          >
            <img
              src="/Magazine/cover-right.png"
              alt=""
              style={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
              }}
            />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}