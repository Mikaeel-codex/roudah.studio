import { motion } from "framer-motion";

const textVariant = {
  hidden: {
    opacity: 0,
    x: -80,
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 1.2,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

const imageVariant = {
  hidden: {
    opacity: 0,
    scale: 1.08,
    x: 80,
  },
  visible: {
    opacity: 1,
    scale: 1,
    x: 0,
    transition: {
      duration: 1.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function StorySection() {
  return (
    <>
      <style>{`
        .story-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          width: 100%;
          background-color: #F5F0E8;
        }
        .story-text {
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding: 3rem 4rem;
          order: 1;
        }
        .story-image-wrap {
          overflow: hidden;
          height: 510px;
          order: 2;
        }

        .story-image-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 45%;
          display: block;
        }
        @media (max-width: 768px) {
          .story-grid {
            grid-template-columns: 1fr;
          }
          .story-image-wrap {
            order: 1;
            min-height: 45vw;
          }
          .story-text {
            order: 2;
            padding: 3rem 2rem 3.5rem;
          }
        }
      `}</style>

      <section className="story-grid">
        {/* Left: Text */}
        <motion.div
          className="story-text"
          variants={textVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.35 }}
        >
          <p
            style={{
              color: "#B38A3D",
              fontSize: "0.62rem",
              letterSpacing: "0.52em",
              textTransform: "uppercase",
              fontFamily: "Arial, sans-serif",
              fontWeight: 400,
              marginBottom: "1.2rem",
              marginTop: 0,
            }}
          >
            Our Story
          </p>

          <h2
            style={{
              fontFamily: "Cormorant Garamond, Georgia, serif",
              fontSize: "clamp(2rem, 3.5vw, 3.6rem)",
              color: "#2B1A12",
              fontWeight: 300,
              lineHeight: 1.08,
              letterSpacing: "0.015em",
              marginBottom: "1.4rem",
              marginTop: 0,
            }}
          >
            The Art of
            <br />
            Timeless Modesty
          </h2>

          <div
            style={{
              width: "48px",
              height: "1px",
              backgroundColor: "#B38A3D",
              marginBottom: "1.6rem",
            }}
          />

          <p
            style={{
              color: "#2B1A12",
              opacity: 0.72,
              fontSize: "0.85rem",
              lineHeight: 1.9,
              fontFamily: "Arial, sans-serif",
              fontWeight: 300,
              marginBottom: "1rem",
              marginTop: 0,
              maxWidth: "400px",
            }}
          >
            Every thread, every bead, every detail is thoughtfully crafted to
            celebrate elegance, femininity and faith.
          </p>

          <p
            style={{
              color: "#2B1A12",
              opacity: 0.72,
              fontSize: "0.85rem",
              lineHeight: 1.9,
              fontFamily: "Arial, sans-serif",
              fontWeight: 300,
              marginBottom: "2rem",
              marginTop: 0,
              maxWidth: "400px",
            }}
          >
            Designed for women who value beauty with purpose, ROUDAH pieces
            blend modest silhouettes with couture-inspired craftsmanship.
          </p>

          <button
            style={{
              alignSelf: "flex-start",
              background: "transparent",
              border: "none",
              borderBottom: "1px solid #B38A3D",
              color: "#2B1A12",
              paddingBottom: "0.4rem",
              fontSize: "0.68rem",
              letterSpacing: "0.32em",
              textTransform: "uppercase",
              cursor: "pointer",
              fontFamily: "Arial, sans-serif",
              fontWeight: 400,
            }}
          >
            Learn More →
          </button>
        </motion.div>

        {/* Right: Image */}
        <motion.div
          className="story-image-wrap"
          variants={imageVariant}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.35 }}
        >
          <img src="/images/story1.jpg" alt="ROUDAH gold tags" />
        </motion.div>
      </section>
    </>
  );
}
