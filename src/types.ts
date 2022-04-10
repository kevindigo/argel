export enum CardType {
    ACTION = 'Action',
    CREATURE = 'Creature',
    RELIC = 'Relic',
}

export enum CardState {
    DORMANT = 'Dormant',
    READY = 'Ready',
    MATURE = 'Mature',
}

export enum TopOrBottom {
    TOP = 'Top',
    BOTTOM = 'Bottom',
}

export enum DeedType {
    PLAY = 'Play',
    FIGHT = 'Fight',
    HARVEST = 'Harvest',
    DISCARD = 'Discard',
}

export enum SideFlagKey {
    CAN_PLAY_ACTIONS = 'CanPlayActions',
    CAN_FIGHT = 'CanFight',
    // NOTE: Even playing an Action sets NEXT_CARD_ACTIVE back to false
    // NOTE: NEXT_CARD_ACTIVE (from Jump Start) persists across turn boundaries
    NEXT_CARD_ACTIVE = 'NextCardActive',
}

export enum TurnFlagKey {
    CAN_DISCARD = 'CanDiscard',
}

export enum LineEnd {
    LEFT = 0,
    RIGHT = -1,
}

export type HandIndex = number;
export type LineIndex = LineEnd;
export type ScoredIndex = number;
export type DeckId = string;
export type CardId = string;
export type CardNumber = string;
export type SetId = string;
