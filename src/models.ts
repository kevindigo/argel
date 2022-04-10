import {
    DeedType,
    CardId,
    CardState,
    DeckId,
    HandIndex,
    LineIndex,
    RelicsIndex,
    TopOrBottom,
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

export interface Side {
    player: Player;
    drawPile: Card[];
    discards: Card[];
    hand: Card[];
    scored: Card[];
    line: CardWithState[];
    relics: CardWithState[];
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
    handIndex: HandIndex | null;
    relicsIndex: RelicsIndex | null;
    lineIndex: LineIndex | null;
    attackers?: LineIndex[];
    defenders?: LineIndex[];
}

export interface GameState {
    sides: Side[];
    turnState: TurnState;
    options?: Deed[];
}
