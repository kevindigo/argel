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

export enum ActionType {
    PLAY = 'Play',
    FIGHT = 'Fight',
    HARVEST = 'Harvest',
}

export enum SideFlagKey {
    CAN_PLAY_ACTIONS = 'CanPlayActions',
    CAN_ATTACK = 'CanAttack',
    // NOTE: Even playing an Action sets NEXT_CARD_ACTIVE back to false
    // NOTE: NEXT_CARD_ACTIVE (from Jump Start) persists across turn boundaries
    NEXT_CARD_ACTIVE = 'NextCardActive',
}

export enum TurnFlagKey {
    CAN_DISCARD = 'CanDiscard',
}

export type HandIndex = number;
export type LineIndex = number;
export type LineGap = number;
export type RelicsIndex = number;
export type ScoredIndex = number;
export type DeckId = string;
export type CardId = string;
export type CardNumber = string;
export type SetId = string;
