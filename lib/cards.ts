// Card data. Fronts come from lib/card-links.ts (mapped by the number in each
// image's filename). Any card without a matching link falls back to a numbered
// placeholder so gaps are obvious.

import cardLinks from "./card-links";

export type CardData = {
  id: number;
  front: string; // image URL or path shown when the card is face up / selected
  label: string;
};

// Map: card number -> image URL, parsed from the `cards%2F<N>.jpg` path.
const linkByNumber = new Map<number, string>();
for (const url of cardLinks) {
  const match = url.match(/cards%2F(\d+)\.jpg/);
  if (match) {
    linkByNumber.set(Number(match[1]), url);
  }
}

const palette = [
  "#7d9b76",
  "#a8846b",
  "#6f8fa3",
  "#b08a9e",
  "#8f8779",
  "#9c7b6a",
  "#6a8f88",
  "#a39264",
  "#84759c",
  "#7a94a0",
];

function placeholder(index: number, color: string): string {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="420" viewBox="0 0 300 420">
    <rect width="300" height="420" rx="18" fill="${color}"/>
    <rect x="14" y="14" width="272" height="392" rx="12" fill="none" stroke="rgba(255,255,255,0.35)" stroke-width="2"/>
    <text x="150" y="230" font-family="Georgia, serif" font-size="120" fill="rgba(255,255,255,0.9)" text-anchor="middle">${index}</text>
  </svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export const CARDS: CardData[] = Array.from({ length: 34 }, (_, i) => {
  const number = i + 1;
  const link = linkByNumber.get(number);
  return {
    id: number,
    label: `Card ${number}`,
    front: link ?? placeholder(number, palette[i % palette.length]),
  };
});
