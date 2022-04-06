import {
    ActionType,
    CardId,
    CardState,
    DeckId,
    FlagKey,
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
    id: CardId;
}

export interface CardWithState {
    card: Card;
    state: CardState;
}

export interface Side {
    player: Player;
    drawDeck: Card[];
    discards: Card[];
    hand: Card[];
    scored: Card[];
    line: CardWithState[];
    relics: CardWithState[];
}

export interface TurnState {
    activePlayerIndex: number;
    handIndexBeingPlayed: HandIndex;
    queuedAdditionalPlay: TopOrBottom;
    queuedAttackLineIndex: LineIndex;
    flags: Map<FlagKey, boolean>;
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
