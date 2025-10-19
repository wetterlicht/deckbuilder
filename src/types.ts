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
    movement?: number,
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

export interface ArrayFilter {
    filterType: 'array';
    stat: 'inks' | 'types' | 'rarity' | 'classifications' | 'story'
    operator: 'AND' | 'OR';
    values: string[];
}

export interface NumberFilter {
    filterType: 'number';
    stat: 'cost' | 'strength' | 'willpower' | 'lore' | 'movement'
    operator: '<' | '=' | '>';
    number: number
}

export interface TextFilter {
    filterType: 'text';
    stat: 'gameplayText' | 'flavorText',
    text: string
}

export type Filter = ArrayFilter | NumberFilter | TextFilter;