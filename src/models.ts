import { CardId, Facing, DeckId, Zone } from './types';

export interface Player {
    name: string;
    deckId: DeckId;
}

export interface Card {
    deckId: DeckId;
    cardId: CardId;
    facing: Facing;
}

export interface SideFlags {
    canDiscard: boolean;
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
    line: Card[];
    arsenal: Card[];
    flags: SideFlags;
}

export interface Decision {
    label: string;
    availableSlots: Slot[];
    // minSelectionCount: number;
    // maxSelectionCount: number;
    selectedSlots: Slot[];
}

export interface State {
    activeSideIndex: number;
    sides: Side[];
    currentDeed: Decision[];
    // queuedAdditionalPlay?: TopOrBottom; // or Slot?
    // queuedFightWith?: Slot;
}
