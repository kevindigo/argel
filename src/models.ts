import {
    DeedType,
    CardId,
    CardState,
    DeckId,
    HandIndex,
    LineIndex,
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
    Pile: Zone;
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
    handIndexBeingPlayed?: HandIndex;
    queuedAdditionalPlay?: TopOrBottom;
    queuedFightLineIndex?: LineIndex;
    turnFlags: TurnFlags;
}

export interface Deed {
    type: DeedType;
    // Maybe simplify this to
    // from: Slot[] (singluar for play/use/discard)
    // to: Slot[] (only used for fight)
    handIndex: HandIndex | null;
    lineIndex: LineIndex | null;
    attackers?: LineIndex[];
    defenders?: LineIndex[];
    // A list of available deeds would include when/choose/from/filter
    // Selecting a deed would require you to also populate your choice
    choice?: Slot[];
}

export interface State {
    sides: Side[];
    turnState: TurnState;
    options?: Deed[];
}
