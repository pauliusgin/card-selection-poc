"use client";

import { motion } from "framer-motion";
import { CARD_HEIGHT, CARD_WIDTH, type CardData } from "@/lib/cards";

type CardProps = {
  data: CardData;
  faceUp: boolean;
  onClick?: () => void;
  selectable?: boolean;
  scale?: number;
};

export default function Card({
  data,
  faceUp,
  onClick,
  selectable = false,
  scale = 1,
}: CardProps) {
  const width = CARD_WIDTH * scale;
  const height = CARD_HEIGHT * scale;
  const cornerRadius = 14 * scale;
  const borderWidth = 3 * scale;
  const innerInset = 10 * scale;

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
        width,
        height,
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
            borderRadius: cornerRadius,
            boxShadow: "0 6px 16px rgba(74,70,63,0.18)",
            background:
              "repeating-linear-gradient(45deg, var(--card-back) 0 10px, var(--card-back-2) 10px 20px)",
            border: `${borderWidth}px solid #cfc7b6`,
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: innerInset,
              borderRadius: 8 * scale,
              border: `${1.5 * scale}px solid rgba(255,255,255,0.35)`,
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
            borderRadius: cornerRadius,
            overflow: "hidden",
            boxShadow: "0 6px 16px rgba(74,70,63,0.22)",
            border: `${borderWidth}px solid #fff`,
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
