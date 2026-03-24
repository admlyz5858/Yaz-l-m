import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

import { SEED_DECKS, type FlashCardContent } from '@/data/flashcardDecks';
import {
  initialSchedule,
  scheduleAfterReview,
  type CardSchedule,
  type FsrsRating,
} from '@/lib/fsrsLite';

export type DeckState = {
  deck_id: string;
  başlık: string;
  sınav_etiketi: string;
  kart_ids: string[];
};

export type TrackedCard = FlashCardContent & {
  deck_id: string;
  schedule: CardSchedule;
};

type FlashcardState = {
  decks: DeckState[];
  cards: Record<string, TrackedCard>;
  seedIfEmpty: () => void;
  getDueCountForDeck: (deckId: string) => number;
  getDueCountTotal: () => number;
  getStudyQueue: (deckId: string) => TrackedCard[];
  rateCard: (cardId: string, rating: FsrsRating) => void;
};

function buildFromSeed(): Pick<FlashcardState, 'decks' | 'cards'> {
  const decks: DeckState[] = [];
  const cards: Record<string, TrackedCard> = {};

  for (const d of SEED_DECKS) {
    decks.push({
      deck_id: d.deck_id,
      başlık: d.başlık,
      sınav_etiketi: d.sınav_etiketi,
      kart_ids: d.kartlar.map((c) => c.id),
    });
    for (const c of d.kartlar) {
      cards[c.id] = {
        ...c,
        deck_id: d.deck_id,
        schedule: initialSchedule(),
      };
    }
  }

  return { decks, cards };
}

export const useFlashcardStore = create<FlashcardState>()(
  persist(
    (set, get) => ({
      decks: [],
      cards: {},

      seedIfEmpty: () => {
        if (Object.keys(get().cards).length > 0) return;
        const { decks, cards } = buildFromSeed();
        set({ decks, cards });
      },

      getDueCountForDeck: (deckId) => {
        const now = Date.now();
        const deck = get().decks.find((d) => d.deck_id === deckId);
        if (!deck) return 0;
        return deck.kart_ids.filter((id) => {
          const c = get().cards[id];
          return c && c.schedule.due <= now;
        }).length;
      },

      getDueCountTotal: () => {
        const now = Date.now();
        return Object.values(get().cards).filter((c) => c.schedule.due <= now).length;
      },

      getStudyQueue: (deckId) => {
        const now = Date.now();
        const deck = get().decks.find((d) => d.deck_id === deckId);
        if (!deck) return [];
        return deck.kart_ids
          .map((id) => get().cards[id])
          .filter(Boolean)
          .filter((c) => c.schedule.due <= now)
          .sort((a, b) => a.schedule.due - b.schedule.due);
      },

      rateCard: (cardId, rating) =>
        set((s) => {
          const c = s.cards[cardId];
          if (!c) return s;
          const next = scheduleAfterReview(c.schedule, rating);
          return {
            cards: {
              ...s.cards,
              [cardId]: { ...c, schedule: next },
            },
          };
        }),
    }),
    {
      name: 'zeka-akademi-flashcards',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (s) => ({ decks: s.decks, cards: s.cards }),
    },
  ),
);
