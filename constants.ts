
import { Artist, AuctionType, PaintingCard } from './types';

export const ARTISTS_ORDER: Artist[] = [
  Artist.MANUEL_CARVALHO,
  Artist.SIGRID_THALER,
  Artist.DANIEL_MELIM,
  Artist.RAMON_MARTINS,
  Artist.RAFAEL_SILVEIRA,
];

export const ARTIST_COLORS: Record<Artist, string> = {
  [Artist.MANUEL_CARVALHO]: 'bg-yellow-500',
  [Artist.SIGRID_THALER]: 'bg-gray-400',
  [Artist.DANIEL_MELIM]: 'bg-red-600',
  [Artist.RAMON_MARTINS]: 'bg-green-500',
  [Artist.RAFAEL_SILVEIRA]: 'bg-blue-500',
};

const CARD_DEFINITIONS: { artist: Artist; counts: Record<AuctionType, number> }[] = [
  { artist: Artist.MANUEL_CARVALHO, counts: { [AuctionType.OPEN]: 3, [AuctionType.ONE_OFFER]: 3, [AuctionType.HIDDEN]: 2, [AuctionType.FIXED_PRICE]: 2, [AuctionType.DOUBLE]: 2 } }, // 12
  { artist: Artist.SIGRID_THALER, counts: { [AuctionType.OPEN]: 3, [AuctionType.ONE_OFFER]: 3, [AuctionType.HIDDEN]: 3, [AuctionType.FIXED_PRICE]: 2, [AuctionType.DOUBLE]: 2 } }, // 13
  { artist: Artist.DANIEL_MELIM, counts: { [AuctionType.OPEN]: 4, [AuctionType.ONE_OFFER]: 3, [AuctionType.HIDDEN]: 3, [AuctionType.FIXED_PRICE]: 3, [AuctionType.DOUBLE]: 2 } }, // 15
  { artist: Artist.RAMON_MARTINS, counts: { [AuctionType.OPEN]: 4, [AuctionType.ONE_OFFER]: 3, [AuctionType.HIDDEN]: 3, [AuctionType.FIXED_PRICE]: 3, [AuctionType.DOUBLE]: 2 } }, // 15
  { artist: Artist.RAFAEL_SILVEIRA, counts: { [AuctionType.OPEN]: 4, [AuctionType.ONE_OFFER]: 4, [AuctionType.HIDDEN]: 3, [AuctionType.FIXED_PRICE]: 2, [AuctionType.DOUBLE]: 2 } }, // 15
]; // Total 70

export const INITIAL_DECK: PaintingCard[] = CARD_DEFINITIONS.flatMap(({ artist, counts }) => {
  let cards: PaintingCard[] = [];
  let cardIndex = 0;
  for (const [auctionType, count] of Object.entries(counts)) {
    for (let i = 0; i < count; i++) {
      const artistSlug = artist.toLowerCase().replace(/\s/g, '-');
      cards.push({
        id: `${artist}-${auctionType}-${i}`,
        artist: artist,
        auctionType: auctionType as AuctionType,
        imageUrl: `https://picsum.photos/seed/${artistSlug}_${cardIndex++}/200/300`,
      });
    }
  }
  return cards;
});

export const DEAL_RULES: Record<number, { rounds: number[] }> = {
  3: { rounds: [10, 6, 6, 0] },
  4: { rounds: [9, 4, 4, 0] },
  5: { rounds: [8, 3, 3, 0] },
};

export const INITIAL_MONEY = 100;
export const ROUND_END_PAINTING_COUNT = 5;

export const ROUND_VALUE_BONUS = [30, 20, 10];

export const generateRoomCode = (): string => {
    return Math.random().toString(36).substring(2, 6).toUpperCase();
};
