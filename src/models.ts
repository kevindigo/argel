import {
    DeedType,
    CardId,
    CardState,
    DeckId,
    TopOrBottom,
    Zone,
} from './types';

export interface Player {
    name: string;
    deckId: DeckId;
}

export interface Card {
    deckId: DeckId;
    cardId: CardId;
}

export interface CardWithState {
    card: Card;
    state: CardState;
}

export interface SideFlags {
    canFight: boolean;
    canPlayActions: boolean;
    isNextCardActive: boolean;
}

export interface Slot {
    zone: Zone;
    index: number;
}

export interface Side {
    player: Player;
    drawPile: Card[];
    discards: Card[];
    hand: Card[];
    scored: Card[];
    line: CardWithState[];
    arsenal: CardWithState[];
    flags: SideFlags;
}

export interface TurnFlags {
    canDiscard: boolean;
}

export interface TurnState {
    myIndex: number;
    queuedAdditionalPlay?: TopOrBottom;
    turnFlags: TurnFlags;
}

export interface Deed {
    type: DeedType;
    from: Slot[];
    to: Slot[];
    choices?: Slot[][];
}

export interface Decision {
    label: string;
    availableSlots: Slot[];
    // minSelectionCount: number;
    // maxSelectionCount: number;
    selectedSlots: Slot[];
}

export interface State {
    sides: Side[];
    turnState: TurnState;
    availableDeeds: Deed[];
    currentDeed: Decision[];
}
