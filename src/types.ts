export enum CardType {
    ACTION = 'Action',
    CREATURE = 'Creature',
    RELIC = 'Relic',
}

export enum Facing {
    DORMANT = 'Dormant',
    READY = 'Ready',
    MATURE = 'Mature',
    // FACE_DOWN = 'FaceDown',
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
    // TEAMUP = 'Teamup',
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

export enum Zone {
    MY_TOP = 'MT',
    MY_BOTTOM = 'MB',
    MY_HAND = 'MH',
    MY_DISCARDS = 'MD',
    MY_SCORED = 'MS',
    MY_LINE = 'ML',
    MY_ARSENAL = 'MA',
    ENEMY_TOP = 'ET',
    ENEMY_BOTTOM = 'EB',
    ENEMY_HAND = 'EH',
    ENEMY_DISCARDS = 'ED',
    ENEMY_SCORED = 'ES',
    ENEMY_LINE = 'EL',
    ENEMY_ARSENAL = 'EA',
}

export type ScoredIndex = number;
export type DeckId = string;
export type CardId = string;
export type CardNumber = string;
export type SetId = string;
