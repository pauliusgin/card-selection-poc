"use client";

import { useEffect, useRef, useState } from "react";
import { LayoutGroup } from "framer-motion";
import { CARDS } from "@/lib/cards";
import Card from "@/components/Card";

type Phase = "deck" | "spread";

export default function Home() {
  const [phase, setPhase] = useState<Phase>("deck");
  const [faceUp, setFaceUp] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Measure the fixed tray so the board can reserve exactly its height and
  // never sits underneath it, however many rows the selected cards wrap into.
  const trayRef = useRef<HTMLDivElement>(null);
  const [trayHeight, setTrayHeight] = useState(0);

  useEffect(() => {
    const tray = trayRef.current;
    if (!tray) {
      return;
    }
    const observer = new ResizeObserver(() => {
      setTrayHeight(tray.offsetHeight);
    });
    observer.observe(tray);
    return () => {
      observer.disconnect();
    };
  }, []);

  const tableCards = CARDS.filter((card) => {
    return !selectedIds.includes(card.id);
  });

  const selectedCards = selectedIds
    .map((id) => {
      return CARDS.find((card) => {
        return card.id === id;
      });
    })
    .filter((card): card is (typeof CARDS)[number] => {
      return Boolean(card);
    });

  function spread(open: boolean) {
    setFaceUp(open);
    setPhase("spread");
  }

  function selectCard(id: number) {
    setSelectedIds((prev) => {
      return [...prev, id];
    });
  }

  function deselectCard(id: number) {
    setSelectedIds((prev) => {
      return prev.filter((selectedId) => {
        return selectedId !== id;
      });
    });
  }

  function reset() {
    setPhase("deck");
    setFaceUp(false);
    setSelectedIds([]);
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: `40px 20px ${trayHeight + 24}px`,
      }}
    >
      <header style={{ textAlign: "center", marginBottom: 28 }}>
        <h1
          style={{
            margin: 0,
            fontWeight: 600,
            letterSpacing: "0.5px",
            fontSize: 30,
            color: "var(--ink)",
          }}
        >
          Card Selection
        </h1>
        <p
          style={{ margin: "8px 0 0", color: "var(--ink-soft)", fontSize: 15 }}
        >
          Spread the deck, then pick your cards.
        </p>
      </header>

      {/* Controls */}
      <div
        style={{
          display: "flex",
          gap: 12,
          alignItems: "center",
          marginBottom: 40,
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            display: "inline-flex",
            background: "rgba(255,255,255,0.55)",
            borderRadius: 999,
            padding: 4,
            boxShadow: "inset 0 0 0 1px var(--card-edge)",
          }}
        >
          <ToggleOption
            label="Closed cards"
            active={phase === "spread" && !faceUp}
            onClick={() => {
              return spread(false);
            }}
          />
          <ToggleOption
            label="Open cards"
            active={phase === "spread" && faceUp}
            onClick={() => {
              return spread(true);
            }}
          />
        </div>

        <button
          type="button"
          onClick={reset}
          style={{
            border: "none",
            borderRadius: 999,
            padding: "11px 22px",
            fontSize: 14,
            fontWeight: 600,
            cursor: "pointer",
            color: "var(--ink)",
            background: "rgba(255,255,255,0.55)",
            boxShadow: "inset 0 0 0 1px var(--card-edge)",
          }}
        >
          Reset
        </button>
      </div>

      <LayoutGroup>
        {/* Table area: deck pile (real cards) or spread grid.
            Every card is a single layoutId element, so deck->grid,
            grid->tray and tray->grid all animate with the same glide. */}
        {phase === "deck" ? (
          <div
            style={{
              position: "relative",
              width: 116,
              height: 162,
              marginTop: 30,
            }}
          >
            {tableCards.map((card, index) => {
              const offset = Math.min(index, 8) * 1.5;
              return (
                <div
                  key={card.id}
                  style={{
                    position: "absolute",
                    inset: 0,
                    transform: `translate(${offset}px, ${-offset}px)`,
                    zIndex: index,
                  }}
                >
                  <Card data={card} faceUp={false} />
                </div>
              );
            })}
          </div>
        ) : (
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, 116px)",
              gap: 18,
              justifyContent: "center",
              width: "100%",
              maxWidth: 1200,
            }}
          >
            {CARDS.map((card) => {
              // Keep a fixed cell per card. A selected card leaves an empty
              // slot instead of the rest reflowing, so neighbours never move.
              if (selectedIds.includes(card.id)) {
                return (
                  <div key={card.id} style={{ width: 116, height: 162 }} />
                );
              }
              return (
                <Card
                  key={card.id}
                  data={card}
                  faceUp={faceUp}
                  selectable
                  onClick={() => {
                    return selectCard(card.id);
                  }}
                />
              );
            })}
          </div>
        )}

        {/* Selected tray — fixed to the viewport bottom (always visible). The
            board reserves `trayHeight` of bottom padding so they never overlap. */}
        <div
          ref={trayRef}
          style={{
            position: "fixed",
            left: 0,
            right: 0,
            bottom: 0,
            padding: "16px 20px",
            background:
              "linear-gradient(to top, rgba(226,220,207,0.97) 70%, rgba(226,220,207,0))",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "flex-end",
            gap: 12,
            minHeight: 200,
          }}
        >
          {/* Divider between selectable and selected cards */}
          <div
            style={{
              flexBasis: "100%",
              display: "flex",
              alignItems: "center",
              gap: 14,
              marginBottom: 4,
              color: "var(--ink-soft)",
              fontSize: 12,
              fontWeight: 600,
              letterSpacing: "1px",
              textTransform: "uppercase",
            }}
          >
            <span
              style={{ flex: 1, height: 1, background: "var(--card-edge)" }}
            />
            Selected
            <span
              style={{ flex: 1, height: 1, background: "var(--card-edge)" }}
            />
          </div>

          {selectedCards.length === 0 ? (
            <span
              style={{
                color: "var(--ink-soft)",
                fontSize: 14,
                paddingBottom: 24,
              }}
            >
              Selected cards appear here.
            </span>
          ) : (
            selectedCards.map((card) => {
              return (
                <Card
                  key={card.id}
                  data={card}
                  faceUp
                  selectable
                  onClick={() => {
                    return deselectCard(card.id);
                  }}
                />
              );
            })
          )}
        </div>
      </LayoutGroup>
    </main>
  );
}

function ToggleOption({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        border: "none",
        borderRadius: 999,
        padding: "9px 18px",
        fontSize: 14,
        fontWeight: 600,
        cursor: "pointer",
        color: active ? "#fff" : "var(--ink-soft)",
        background: active ? "var(--accent)" : "transparent",
        transition: "background 0.2s, color 0.2s",
      }}
    >
      {label}
    </button>
  );
}
