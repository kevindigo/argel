import {
    ActionType,
    CardId,
    CardState,
    DeckId,
    HandIndex,
    LineGap,
    LineIndex,
    RelicsIndex,
    SideFlagKey,
    TopOrBottom,
    TurnFlagKey,
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

export interface Side {
    player: Player;
    drawPile: Card[];
    discards: Card[];
    hand: Card[];
    scored: Card[];
    line: CardWithState[];
    relics: CardWithState[];
    flags: Map<SideFlagKey, boolean>;
}

export interface TurnState {
    activePlayerIndex: number;
    handIndexBeingPlayed?: HandIndex;
    queuedAdditionalPlay?: TopOrBottom;
    queuedAttackLineIndex?: LineIndex;
    flags: Map<TurnFlagKey, boolean>;
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
