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
