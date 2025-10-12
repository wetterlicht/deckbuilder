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
    inkwell: boolean,
    types: Array<string>
    images: {
        full: string,
        small: string
    }
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