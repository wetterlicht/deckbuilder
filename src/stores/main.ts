import { computed, ref, watch, type ComputedRef, type Ref, toRaw } from 'vue'
import { defineStore } from 'pinia'
import type { AppData, CardData, DeckData, DeckDataWithCards, SetData } from '@/types';
import { v4 } from "uuid"

const DB_NAME = 'lorcana-deckbuilder';
const API_DATA_STORE_NAME = 'api-data'
const USER_DATA_STORE_NAME = 'user-data';

export const useMainStore = defineStore('main', () => {

  // API Data
  const sets = ref({})
  const cards: Ref<Array<CardData>> = ref([]);

  // Decks
  const decksData: Ref<Array<DeckData>> = ref([]);
  const decksWithCards: ComputedRef<Array<DeckDataWithCards>> = computed(() => {
    return decksData.value.map(deckData => {
      const cards: Array<{
        id: string,
        quantity: number,
        data: CardData
      }> = deckData.cards.map(cardEntry => {
        return {
          ...cardEntry,
          data: getCardById(cardEntry.id)
        }
      }).filter((card): card is { id: string, quantity: number; data: CardData } => card !== undefined)

      const inks = Array.from(cards.reduce((acc, cur) => {
        cur.data.inks.forEach(ink => acc.add(ink))
        return acc;
      }, new Set<string>())).sort();

      return {
        ...deckData, cards, inks
      }
    })
  });

  async function loadData() {
    try {
      await loadAPIData();
      await loadUserData();
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

  async function loadAPIData() {
    const db = await openDB(DB_NAME);
    const metaResponse = await fetch('/lorcana-api/files/current/en/metadata.json');
    if (!metaResponse.ok) {
      throw new Error('Failed to fetch metadata');
    }
    const metadata = await metaResponse.json();
    const storedVersion = await idbGet<string>(db, API_DATA_STORE_NAME, 'version');

    let data;
    if (storedVersion !== metadata.formatVersion) {
      const dataRes = await fetch('/lorcana-api/files/current/en/allCards.json');
      if (!dataRes.ok) throw new Error('Failed to fetch cards data');
      data = await dataRes.json();
      await idbSet(db, API_DATA_STORE_NAME, 'data', adaptApiData(data));
      await idbSet(db, API_DATA_STORE_NAME, 'version', metadata.formatVersion);
    } else {
      data = await idbGet(db, API_DATA_STORE_NAME, 'data');
    }

    sets.value = data.sets;
    cards.value = data.cards;
  }

  async function loadUserData() {
    try {
      const db = await openDB(DB_NAME);
      const loadedDecks = await idbGet<Array<DeckData>>(db, USER_DATA_STORE_NAME, 'decks');
      if (loadedDecks) {
        decksData.value = loadedDecks;
      }
    } catch (err) {
      console.error('Failed to load user data:', err);
    }
  }

  async function saveDecks() {
    try {
      const db = await openDB(DB_NAME);
      await idbSet(db, USER_DATA_STORE_NAME, 'decks', structuredClone(toRaw(decksData.value)));
    } catch (err) {
      console.error('Failed to save decks:', err);
    }
  }

  const debouncedSaveDecks = debounce(saveDecks, 300);
  watch(decksData, () => debouncedSaveDecks(), { deep: true });

  const currentDeckWithCards: ComputedRef<DeckDataWithCards> = computed(() => {
    return decksWithCards.value.find(deck => deck.id === currentDeckId.value) as DeckDataWithCards;
  });

  function getCardById(id: string): CardData | undefined {
    return cards.value.find(card => card.id === id);
  }

  const searchTerm = ref('')

  const filteredCards: ComputedRef<Array<CardData>> = computed(() => {
    const term = searchTerm.value.toLowerCase();
    const result = cards.value.filter(card => card.fullName.toLowerCase().includes(term));
    return result.sort((a, b) => a.fullName.localeCompare(b.fullName));
  });

  const isSearching = computed(() => {
    return searchTerm.value ? true : false
  })

  const currentDeckId: Ref<string | undefined> = ref();

  const currentDeck: ComputedRef<DeckData | undefined> = computed(() => {
    return decksData.value.find(deck => deck.id === currentDeckId.value);
  });


  function setCurrentDeck(id: string) {
    currentDeckId.value = id
  }

  function addCardToCurrentDeck(id: string) {
    if (currentDeck.value) {
      let index = currentDeck.value.cards.findIndex(card => card.id === id)
      if (index >= 0) {
        currentDeck.value.cards[index]!.quantity += 1
      } else {
        currentDeck.value.cards.push({ id, quantity: 1 })
      }
    }
  }

  function removeCardFromCurrentDeck(id: string) {
    if (currentDeck.value) {
      let index = currentDeck.value.cards.findIndex(card => card.id === id)
      if (index >= 0) {
        const card = currentDeck.value.cards[index];
        if (card && card.quantity) {
          currentDeck.value.cards[index]!.quantity -= 1
          if (currentDeck.value.cards[index]!.quantity === 0) {
            currentDeck.value.cards.splice(index, 1)
          }
        }
      }
    }
  }

  function addDeck(name: string): string {
    const deckData: DeckData = {
      id: v4(),
      name,
      cards: []
    }
    decksData.value.push(deckData)
    return deckData.id;
  }


  return {
    loadData,
    decksWithCards,
    addDeck,
    currentDeck,
    currentDeckWithCards,
    searchTerm,
    isSearching,
    filteredCards,
    setCurrentDeck,
    addCardToCurrentDeck,
    removeCardFromCurrentDeck
  }
})

function adaptApiData(apiData: any): AppData {
  const cards: Array<CardData> = apiData.cards.map((apiCardData: any): CardData => {
    const card: CardData = {
      id: apiCardData.fullIdentifier,
      name: apiCardData.name,
      version: apiCardData.version,
      fullName: apiCardData.fullName,
      inks: apiCardData.colors ? apiCardData.colors : [apiCardData.color],
      cost: apiCardData.cost,
      inkwell: apiCardData.inkwell,
      types: [apiCardData.type],
      images: {
        full: apiCardData.images.full,
        small: apiCardData.images.thumbnail
      }
    }
    return card;
  })
  const sets: Array<SetData> = [];

  return {
    cards,
    sets,
  };
}

function openDB(dbName: string): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(dbName, 1);

    request.onerror = () => reject(request.error);
    request.onsuccess = () => resolve(request.result);

    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(API_DATA_STORE_NAME)) {
        db.createObjectStore(API_DATA_STORE_NAME);
      }
      if (!db.objectStoreNames.contains(USER_DATA_STORE_NAME)) {
        db.createObjectStore(USER_DATA_STORE_NAME);
      }
    };
  });
}
function idbGet<T = unknown>(db: IDBDatabase, storeName: string, key: IDBValidKey): Promise<T | undefined> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readonly');
    const store = tx.objectStore(storeName);
    const req = store.get(key);
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error);
  });
}

function idbSet(db: IDBDatabase, storeName: string, key: IDBValidKey, value: any): Promise<void> {
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, 'readwrite');
    const store = tx.objectStore(storeName);
    const req = store.put(value, key);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}

function debounce(fn: (...args: any[]) => void, delay = 300) {
  let timer: ReturnType<typeof setTimeout>;
  return (...args: any[]) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}
