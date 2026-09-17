// Card data. Fronts come from lib/card-links.ts, one card per link in order.

import cardLinks from "./card-links";

export type CardData = {
  id: number;
  front: string; // image URL or path shown when the card is face up / selected
  label: string;
};

export const CARDS: CardData[] = cardLinks.map((front, index) => {
  const number = index + 1;
  return {
    id: number,
    label: `Card ${number}`,
    front,
  };
});

// Base footprint of a card on the table. The tray renders the same card at
// SELECTED_CARD_SCALE, so every layout that reserves space for a card derives
// its box from these instead of repeating the numbers.
export const CARD_WIDTH = 116;
export const CARD_HEIGHT = 162;
export const SELECTED_CARD_SCALE = 2;
