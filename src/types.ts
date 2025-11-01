export interface AppData {
    cards: Array<CardData>
    sets: Array<SetData>
}

export interface CardData {
    id: string,
    name: string,
    version?: string,
    fullName: string,
    inks: Array<string>
    cost: number,
    lore?: number,
    strength?: number,
    willpower?: number,
    moveCost?: number,
    inkwell: boolean,
    types: Array<string>
    rarity: string,
    classifications: Array<string>
    story: string,
    gameplayText: string,
    flavorText: string,
    images: {
        full: string,
        small: string
    }
    isPrimaryVersion: boolean,
}

export interface SetData { }

export interface DeckData {
    id: string,
    name: string,
    cards: Array<{
        id: string,
        quantity: number,
    }>
    updated_at: string,
    updated_by_client_id: string,
}

export interface DeckDataWithCards {
    id: string,
    name: string,
    cards: Array<{
        id: string,
        quantity: number,
        data: CardData
    }>,
    inks: Array<string>
}

export const stats = {
    gameplayText: 'text',
    flavorText: 'text',
    cost: 'number',
    lore: 'number',
    strength: 'number',
    willpower: 'number',
    moveCost: 'number',
    classifications: 'list',
    story: 'list'
} as const;

export type NumberStat = {
    [K in keyof typeof stats]: typeof stats[K] extends 'number' ? K : never
}[keyof typeof stats];

export type TextStat = {
    [K in keyof typeof stats]: typeof stats[K] extends 'text' ? K : never
}[keyof typeof stats];

export type ListStat = {
    [K in keyof typeof stats]: typeof stats[K] extends 'list' ? K : never
}[keyof typeof stats];

export type Stat = keyof typeof stats;

export type NumberOperator = '<' | '=' | '>';

export interface NumberFilter {
    filterType: 'number';
    operator: NumberOperator;
    number: number
}

export type TextOperator = 'include' | 'exclude';

export interface TextFilter {
    filterType: 'text';
    operator: TextOperator,
    text: string
}

export type ListOperator = 'include' | 'exclude';

export interface ListFilter {
    filterType: 'list';
    operator: ListOperator;
    value: string;
}

export type Filter = NumberFilter | TextFilter | ListFilter;
export type FilterGroupCombineMode = 'AND' | 'OR';

export interface NumberFilterGroup {
    stat: NumberStat,
    combineWith: FilterGroupCombineMode,
    filters: NumberFilter[],
}

export interface TextFilterGroup {
    stat: TextStat,
    combineWith: FilterGroupCombineMode,
    filters: TextFilter[],
}

export interface ListFilterGroup {
    stat: ListStat,
    combineWith: FilterGroupCombineMode,
    filters: ListFilter[],
}

export type FilterGroup = NumberFilterGroup | TextFilterGroup | ListFilterGroup;

export type FilterGroupByStat = {
    -readonly [K in keyof typeof stats]: typeof stats[K] extends 'number'
    ? NumberFilterGroup
    : typeof stats[K] extends 'text'
    ? TextFilterGroup
    : typeof stats[K] extends 'list'
    ? ListFilterGroup
    : never;
};