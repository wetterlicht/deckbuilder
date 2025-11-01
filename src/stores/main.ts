import { computed, ref, watch, type ComputedRef, type Ref, toRaw } from 'vue'
import { defineStore } from 'pinia'
import type { AppData, CardData, DeckData, DeckDataWithCards, FilterGroupByStat, ListStat, NumberStat, SetData, TextStat } from '@/types';
import { stats } from '@/types';
import { v4 } from "uuid"

const DB_NAME = 'lorcana-deckbuilder';
const API_DATA_STORE_NAME = 'api-data'
const USER_DATA_STORE_NAME = 'user-data';

import { createClient, RealtimeChannel } from '@supabase/supabase-js'

const supabase = createClient('https://qdqauljbsttstpolacua.supabase.co', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFkcWF1bGpic3R0c3Rwb2xhY3VhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjE0MTAzNjMsImV4cCI6MjA3Njk4NjM2M30.euW_DhGdeEy1UbXxY-GsRhBPieEC68g1OArVk9a1biI');
let syncChannel: RealtimeChannel;

const CLIENT_ID = crypto.randomUUID();

export const useMainStore = defineStore('main', () => {

  // API Data
  const sets = ref({})
  const cards: Ref<Array<CardData>> = ref([]);

  // Decks
  const decksData: Ref<Array<DeckData>> = ref([]);
  const decksWithCards: ComputedRef<Array<DeckDataWithCards>> = computed(() => {
    return decksData.value.filter(deck => !deck.deleted_at).map(deckData => {
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
    syncDecks();
    syncSubscribe();
  }

  async function loadAPIData() {
    const db = await openDB(DB_NAME);

    let response = await supabase.functions.invoke('lorcanajson-metadata');
    if (response.error) {
      throw new Error('Failed to fetch metadata');
    }
    const metadata = response.data;
    const storedVersion = await idbGet<string>(db, API_DATA_STORE_NAME, 'version');

    if (storedVersion !== metadata.formatVersion) {
      response = await supabase.functions.invoke('lorcanajson-cards');
      if (response.error) throw new Error('Failed to fetch cards data');
      await idbSet(db, API_DATA_STORE_NAME, 'data', adaptApiData(response.data));
      await idbSet(db, API_DATA_STORE_NAME, 'version', metadata.formatVersion);
    } else {
      response.data = await idbGet(db, API_DATA_STORE_NAME, 'data');
    }

    sets.value = response.data.sets;
    cards.value = response.data.cards;
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
    syncDecks();
  }

  const debouncedSaveDecks = debounce(saveDecks, 300);

  async function syncDecks() {
    try {
      const localDecks = decksData.value;
      const remoteDecks = (await supabase.from('decks').select()).data ?? [] as Array<DeckData>;

      const newRemoteDecks = remoteDecks.filter(remoteDeck => {
        return !localDecks.some(localDeck => remoteDeck.id === localDeck.id);
      })
      decksData.value.push(...newRemoteDecks);

      remoteDecks.forEach(remoteDeck => {
        const localDeckIndex = decksData.value.findIndex(localDeck => localDeck.id === remoteDeck.id);
        if (localDeckIndex !== -1 &&
          new Date(decksData.value[localDeckIndex]!.updated_at).getTime() < new Date(remoteDeck.updated_at).getTime()) {
          decksData.value[localDeckIndex] = remoteDeck;
        }
      });

      const newLocalDecks = localDecks.filter(localDeck => {
        return !remoteDecks.some(remoteDeck => remoteDeck.id === localDeck.id);
      })
      if (newLocalDecks.length) {
        await supabase.from('decks').insert(newLocalDecks);
      }

      const updatedLocalDecks = localDecks.filter(localDeck => {
        const remoteDeck = remoteDecks.find(remoteDeck => remoteDeck.id === localDeck.id);
        return remoteDeck && new Date(localDeck.updated_at).getTime() > new Date(remoteDeck.updated_at).getTime()
      })
      for (const deck of updatedLocalDecks) {
        const { error } = await supabase.from('decks').update(deck).eq('id', deck.id);
        if (error) {
          console.log(error);
        }
      }
    } catch (error) {
      console.log(error);
    }
  }

  const debouncedSyncDecks = debounce(syncDecks, 300);

  function syncSubscribe() {
    syncChannel = supabase.channel('db-changes').on('postgres_changes', { event: '*', schema: 'public', table: 'decks', }, (payload) => {
      if ((payload.new as DeckData)?.updated_by_client_id !== CLIENT_ID) {
        debouncedSyncDecks();
      }
    }).subscribe();
  }

  const currentDeckWithCards: ComputedRef<DeckDataWithCards> = computed(() => {
    return decksWithCards.value.find(deck => deck.id === currentDeckId.value) as DeckDataWithCards;
  });

  const inks = computed(() => {
    return ['Amber', 'Amethyst', 'Emerald', 'Ruby', 'Sapphire', 'Steel'];
  })

  const inkFilter = ref({
    inks: [] as Array<string>,
    operator: "<="
  });

  const rarities = computed(() => {
    const rarities = ['Common', 'Uncommon', 'Rare', 'Super Rare', 'Legendary', 'Epic', 'Enchanted', 'Iconic']
    return rarities.filter(rarity => uniqueCards.value.some(card => card.rarity === rarity))
  })

  const rarityFilter = ref({
    rarities: [] as Array<string>,
  });

  const classifications = computed(() => {
    const set = new Set<string>();
    uniqueCards.value.forEach(card => {
      card.classifications?.forEach(classification => {
        set.add(classification)
      })
    })

    return Array.from(set).sort();
  })

  const stories = computed(() => {
    const set = new Set<string>();
    cards.value.forEach(card => {
      if (card.story) {
        set.add(card.story)
      }
    })

    return Array.from(set).sort();
  })

  function getCardById(id: string): CardData | undefined {
    return cards.value.find(card => card.id === id);
  }

  function createEmptyFilterGroups() {
    const result = {} as FilterGroupByStat;
    for (const [statKey, statType] of Object.entries(stats)) {
      if (statType === 'number') {
        const stat = statKey as NumberStat;
        result[stat] = {
          stat: stat as NumberStat,
          combineWith: 'OR',
          filters: [],
        };
      } else if (statType === 'text') {
        const stat = statKey as TextStat;
        result[stat] = {
          stat: stat as TextStat,
          combineWith: 'AND',
          filters: [],
        };
      } else if (statType === 'list') {
        const stat = statKey as ListStat;
        result[stat] = {
          stat: stat as ListStat,
          combineWith: 'OR',
          filters: [],
        };
      }
    }

    return result;
  }

  const searchTerm = ref('');
  const filterGroups = ref<FilterGroupByStat>(
    createEmptyFilterGroups()
  )

  const uniqueCards = computed(() => {
    const map = new Map<string, CardData>();

    for (const card of cards.value) {
      const name = card.fullName.toLowerCase();

      if (!map.has(name)) {
        map.set(name, card);
      }

      if (card.isPrimaryVersion) {
        map.set(name, card);
      }
    }

    return Array.from(map.values());
  })

  const filteredCards = computed(() => {
    const term = searchTerm.value.toLowerCase();

    return uniqueCards.value
      .filter(card => {
        if (term && !card.fullName.toLowerCase().includes(term)) {
          return false;
        }

        if (inkFilter.value.inks.length > 0) {
          switch (inkFilter.value.operator) {
            case '<=':
              if (card.inks.some(ink => !inkFilter.value.inks.includes(ink))) {
                return false;
              }
              break;
            case '>=':
              if (!inkFilter.value.inks.every(ink => card.inks.includes(ink))) {
                return false;
              }
              break;
            case '=':
              if (!card.inks.every(ink => inkFilter.value.inks.includes(ink)) || card.inks.length !== inkFilter.value.inks.length) {
                return false
              }
              break;
          }
        }

        if (rarityFilter.value.rarities.length > 0 &&
          !rarityFilter.value.rarities.includes(card.rarity)
        ) {
          return false;
        }

        for (const filterGroup of Object.values(filterGroups.value)) {
          if (filterGroup.filters.length === 0) {
            continue;
          }

          const statValue = card[filterGroup.stat];

          const results = filterGroup.filters.map(filter => {
            switch (filter.filterType) {
              case 'number': {
                const value = statValue as number;
                const target = filter.number;
                switch (filter.operator) {
                  case '<': return value < target;
                  case '=': return value === target;
                  case '>': return value > target;
                }
              }

              case 'text': {
                const value = (statValue as string ?? "").toLowerCase();
                const text = filter.text.toLowerCase();
                return filter.operator === 'include'
                  ? value.includes(text)
                  : !value.includes(text);
              }

              case 'list': {
                let values = ((Array.isArray(statValue) ? statValue : [statValue]) ?? []) as Array<string>;
                values = values.filter(value => value !== undefined).map(value => value.toLowerCase());
                return filter.operator === 'include'
                  ? values.includes(filter.value.toLowerCase())
                  : !values.includes(filter.value.toLowerCase());
              }
            }
          });

          const groupPassed = filterGroup.combineWith === 'AND'
            ? results.every(Boolean)
            : results.some(Boolean);

          if (!groupPassed) return false;
        }

        return true;
      }
      )
      .sort((a, b) => a.fullName.localeCompare(b.fullName));
  });

  const isSearching = computed(() => {
    if (searchTerm.value) {
      return true;
    }
    return Object.values(filterGroups.value).reduce((acc, cur) => {
      return acc + cur.filters.length;
    }, 0) > 0;
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
      currentDeck.value.updated_at = new Date().toISOString();
      currentDeck.value.updated_by_client_id = CLIENT_ID;
      debouncedSaveDecks();
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
      currentDeck.value.updated_at = new Date().toISOString();
      currentDeck.value.updated_by_client_id = CLIENT_ID;
      debouncedSaveDecks();
    }
  }

  function addDeck(name: string): string {
    const deckData: DeckData = {
      id: v4(),
      name,
      cards: [],
      updated_at: new Date().toISOString(),
      updated_by_client_id: CLIENT_ID
    }
    decksData.value.push(deckData);
    debouncedSaveDecks();
    return deckData.id;
  }

  function renameDeck(id: string, name: string) {
    const index = decksWithCards.value.findIndex(deck => deck.id === id);
    if (index >= 0 && decksData.value[index]) {
      decksData.value[index].name = name
      decksData.value[index].updated_at = new Date().toISOString();
      debouncedSaveDecks();
    }
  }

  function deleteDeck(id: string) {
    const index = decksWithCards.value.findIndex(deck => deck.id === id);
    if (index >= 0 && decksData.value[index]) {
      decksData.value[index].updated_at = new Date().toISOString();
      decksData.value[index].deleted_at = new Date().toISOString();
      debouncedSaveDecks();
    }
  }

  function getDeckQuantity(cardId: string) {
    return currentDeck.value?.cards.find(card => card.id === cardId)?.quantity ?? 0;
  }

  function setFilterGroups(newGroups: FilterGroupByStat) {
    filterGroups.value = { ...newGroups };
  }

  function clearFilters() {
    searchTerm.value = '';
    inkFilter.value.inks = [];
    inkFilter.value.operator = "<=";
    rarityFilter.value.rarities = [];
    filterGroups.value = createEmptyFilterGroups();
  }

  return {
    loadData,
    decksWithCards,
    addDeck,
    deleteDeck,
    renameDeck,
    currentDeck,
    currentDeckWithCards,
    searchTerm,
    isSearching,
    filteredCards,
    inks,
    rarities,
    classifications,
    stories,
    setCurrentDeck,
    addCardToCurrentDeck,
    removeCardFromCurrentDeck,
    getDeckQuantity,
    filterGroups,
    setFilterGroups,
    clearFilters,
    inkFilter,
    rarityFilter
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
      lore: apiCardData.lore,
      strength: apiCardData.strength,
      willpower: apiCardData.willpower,
      moveCost: apiCardData.moveCost,
      inkwell: apiCardData.inkwell,
      types: [apiCardData.type],
      rarity: apiCardData.rarity,
      classifications: apiCardData.subtypes,
      story: apiCardData.story,
      gameplayText: apiCardData.fullText,
      flavorText: apiCardData.flavorText,
      images: {
        full: apiCardData.images.full,
        small: apiCardData.images.thumbnail
      },
      isPrimaryVersion: apiCardData.baseId == undefined && apiCardData.reprintOfId == undefined
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

