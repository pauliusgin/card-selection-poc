"use client";

import { useEffect, useRef, useState } from "react";
import { LayoutGroup } from "framer-motion";
import {
  CARDS,
  CARD_HEIGHT,
  CARD_WIDTH,
  SELECTED_CARD_SCALE,
} from "@/lib/cards";
import Card from "@/components/Card";

type Phase = "deck" | "spread";

export default function Home() {
  const [phase, setPhase] = useState<Phase>("deck");
  const [faceUp, setFaceUp] = useState(false);
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Spreading the deck scrolls the board pane past its own heading, handing the
  // whole viewport to the cards; scrolling the pane back up returns to it.
  const boardPaneRef = useRef<HTMLDivElement>(null);
  const boardHeadRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const pane = boardPaneRef.current;
    const head = boardHeadRef.current;
    if (!pane || !head) {
      return;
    }
    const top = phase === "spread" ? head.offsetHeight : 0;
    // Wait a frame so the grid that just mounted is laid out and the pane can
    // actually scroll that far. Assigning scrollTop rather than scrollTo with
    // `behavior: "smooth"` — the smooth variant is dropped on this container
    // while the cards' layout animation is running, leaving it at the top.
    const frame = requestAnimationFrame(() => {
      pane.scrollTop = top;
    });
    return () => {
      cancelAnimationFrame(frame);
    };
  }, [phase]);

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
        height: "100vh",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <LayoutGroup>
        {/* Board pane — scrolls on its own so a deck too tall for the viewport
            never pushes the tray off screen. Its heading scrolls away with the
            cards rather than sitting fixed above them. Table area holds the
            deck pile (real cards) or the spread grid. Every card is a single
            layoutId element, so deck->grid, grid->tray and tray->grid all
            animate with the same glide. */}
        <div
          ref={boardPaneRef}
          style={{
            flex: 1,
            minHeight: 0,
            width: "100%",
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            padding: "0 20px 24px",
          }}
        >
          <div
            ref={boardHeadRef}
            style={{
              flexShrink: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              paddingTop: 40,
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
                Metaphoric Cards
              </h1>
              <p
                style={{
                  margin: "8px 0 0",
                  color: "var(--ink-soft)",
                  fontSize: 15,
                }}
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
          </div>

          {phase === "deck" ? (
            <div
              style={{
                position: "relative",
                flexShrink: 0,
                width: CARD_WIDTH,
                height: CARD_HEIGHT,
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
                flexShrink: 0,
                gridTemplateColumns: `repeat(auto-fit, ${CARD_WIDTH}px)`,
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
                    <div
                      key={card.id}
                      style={{ width: CARD_WIDTH, height: CARD_HEIGHT }}
                    />
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
        </div>

        {/* Selected tray — only mounted once something is selected, so an
            empty tray never eats a card row's worth of the board. Pinned to the
            foot of the viewport, one card row tall whatever the count; further
            rows scroll inside the tray, so the board pane above keeps its own
            scroll position untouched. */}
        {selectedCards.length > 0 && (
          <div
            style={{
              flexShrink: 0,
              width: "100%",
              padding: "12px 20px 16px",
              background: "var(--bg)",
              boxShadow: "0 -14px 24px 6px var(--bg)",
            }}
          >
            {/* Divider between selectable and selected cards */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 14,
                marginBottom: 10,
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

            <div
              style={{
                height: CARD_HEIGHT * SELECTED_CARD_SCALE + 16,
                overflowY: "auto",
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "center",
                alignContent: "flex-start",
                gap: 12,
                paddingTop: 8,
              }}
            >
              {selectedCards.map((card) => {
                return (
                  <Card
                    key={card.id}
                    data={card}
                    faceUp
                    selectable
                    scale={SELECTED_CARD_SCALE}
                    onClick={() => {
                      return deselectCard(card.id);
                    }}
                  />
                );
              })}
            </div>
          </div>
        )}
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
