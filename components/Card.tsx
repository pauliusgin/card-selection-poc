"use client";

import { motion } from "framer-motion";
import type { CardData } from "@/lib/cards";

type CardProps = {
  data: CardData;
  faceUp: boolean;
  onClick?: () => void;
  selectable?: boolean;
};

export default function Card({
  data,
  faceUp,
  onClick,
  selectable = false,
}: CardProps) {
  return (
    <motion.button
      type="button"
      layoutId={`card-${data.id}`}
      onClick={onClick}
      aria-label={faceUp ? data.label : "Face-down card"}
      whileHover={selectable ? { y: -10 } : undefined}
      whileTap={selectable ? { scale: 0.96 } : undefined}
      transition={{
        layout: { type: "spring", stiffness: 90, damping: 22 },
        default: { type: "spring", stiffness: 180, damping: 26 },
      }}
      style={{
        width: 116,
        height: 162,
        padding: 0,
        border: "none",
        background: "transparent",
        cursor: selectable ? "pointer" : "default",
        perspective: 900,
      }}
    >
      <div
        style={{
          position: "relative",
          width: "100%",
          height: "100%",
          transformStyle: "preserve-3d",
          transition: "transform 0.9s cubic-bezier(0.4, 0, 0.2, 1)",
          transform: faceUp ? "rotateY(180deg)" : "rotateY(0deg)",
        }}
      >
        {/* Back */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            borderRadius: 14,
            boxShadow: "0 6px 16px rgba(74,70,63,0.18)",
            background:
              "repeating-linear-gradient(45deg, var(--card-back) 0 10px, var(--card-back-2) 10px 20px)",
            border: "3px solid #cfc7b6",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 10,
              borderRadius: 8,
              border: "1.5px solid rgba(255,255,255,0.35)",
            }}
          />
        </div>

        {/* Front */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            backfaceVisibility: "hidden",
            WebkitBackfaceVisibility: "hidden",
            transform: "rotateY(180deg)",
            borderRadius: 14,
            overflow: "hidden",
            boxShadow: "0 6px 16px rgba(74,70,63,0.22)",
            border: "3px solid #fff",
            background: "#fff",
          }}
        >
          <img
            src={data.front}
            alt={data.label}
            draggable={false}
            style={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              display: "block",
            }}
          />
        </div>
      </div>
    </motion.button>
  );
}
