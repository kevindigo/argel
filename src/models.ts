import {
    ActionType,
    CardId,
    CardState,
    DeckId,
    HandIndex,
    LineGap,
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
    canAttack: boolean;
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

export interface TurnState {
    activePlayerIndex: number;
    handIndexBeingPlayed?: HandIndex;
    queuedAdditionalPlay?: TopOrBottom;
    queuedAttackLineIndex?: LineIndex;
    // ToDo: Add turn flags
}

export interface GameState {
    sides: Side[];
    turnState: TurnState;
}

export interface Action {
    type: ActionType;
    handIndex?: HandIndex;
    relicsIndex?: RelicsIndex;
    lineGap?: LineGap;
    lineIndex?: LineIndex;
    attackers?: LineIndex[];
    defenders?: LineIndex[];
}
